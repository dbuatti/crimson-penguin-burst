import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { Trash2, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSession } from '@/components/SessionContextProvider';

const ArchivedHabits: React.FC = () => {
  const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();

  const fetchArchivedHabits = useCallback(async () => {
    if (session) {
      const allHabits = await getHabits(session);
      setArchivedHabits(allHabits.filter(h => h.archived));
    } else {
      setArchivedHabits([]);
    }
  }, [session]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchArchivedHabits();
    }
  }, [fetchArchivedHabits, sessionLoading]);

  const handleHabitUpdate = () => {
    fetchArchivedHabits();
  };

  const handleUnarchiveHabit = async (id: string) => {
    const habitToUnarchive = archivedHabits.find(h => h.id === id);
    if (habitToUnarchive) {
      const updatedHabit = { ...habitToUnarchive, archived: false };
      const result = await updateHabit(updatedHabit, session);
      if (result) {
        showSuccess('Habit unarchived successfully!');
        fetchArchivedHabits();
      } else {
        showError('Failed to unarchive habit.');
      }
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this habit? This action cannot be undone.")) {
      const success = await deleteHabit(id, session);
      if (success) {
        showSuccess('Habit deleted permanently!');
        fetchArchivedHabits();
      } else {
        showError('Failed to delete habit.');
      }
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading archived habits...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <PageHeader title="Archived Habits" backLink="/" />

      <div className="w-full max-w-4xl space-y-4 mb-8"> {/* Changed max-w-2xl to max-w-4xl */}
        {archivedHabits.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 p-6 bg-card border border-border rounded-xl shadow-md flex flex-col items-center justify-center">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <p className="text-lg mb-4">No archived habits.</p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg">
              Back to Dashboard
            </Button>
          </div>
        ) : (
          archivedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onHabitUpdate={handleHabitUpdate}
              onArchiveHabit={handleUnarchiveHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivedHabits;
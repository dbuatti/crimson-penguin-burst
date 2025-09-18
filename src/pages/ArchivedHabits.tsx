import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast'; // Changed import
import { ArchiveRestore, ArrowLeft, Check, Trash2, X } from 'lucide-react';
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
    fetchArchivedHabits(); // Re-fetch habits after any update (e.g., unarchive)
  };

  const handleUnarchiveHabit = async (id: string) => {
    const habitToUnarchive = archivedHabits.find(h => h.id === id);
    if (habitToUnarchive) {
      const updatedHabit = { ...habitToUnarchive, archived: false };
      const result = await updateHabit(updatedHabit, session);
      if (result) {
        showSuccess('Habit unarchived successfully!', {
          icon: <Check className="h-4 w-4" />,
        });
        fetchArchivedHabits();
      } else {
        showError('Failed to unarchive habit.', {
          icon: <X className="h-4 w-4" />,
        });
      }
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this habit? This action cannot be undone.")) {
      const success = await deleteHabit(id, session);
      if (success) {
        showSuccess('Habit deleted permanently!', {
          icon: <Trash2 className="h-4 w-4" />,
        });
        fetchArchivedHabits();
      } else {
        showError('Failed to delete habit.', {
          icon: <X className="h-4 w-4" />,
        });
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
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Archived Habits</h1>
        <div className="w-5" /> {/* Placeholder for alignment */}
      </header>

      <div className="w-full max-w-md space-y-4 mb-8">
        {archivedHabits.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 p-6 bg-card border border-border rounded-xl shadow-md">
            <p className="text-lg mb-4">No archived habits.</p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
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
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArchiveRestore, ArrowLeft, Check, Trash2 } from 'lucide-react';

const ArchivedHabits: React.FC = () => {
  const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);
  const navigate = useNavigate();

  const fetchArchivedHabits = useCallback(() => {
    const allHabits = getHabits();
    setArchivedHabits(allHabits.filter(h => h.archived));
  }, []);

  useEffect(() => {
    fetchArchivedHabits();
  }, [fetchArchivedHabits]);

  const handleHabitUpdate = () => {
    fetchArchivedHabits(); // Re-fetch habits after any update (e.g., unarchive)
  };

  const handleUnarchiveHabit = (id: string) => {
    const habitToUnarchive = archivedHabits.find(h => h.id === id);
    if (habitToUnarchive) {
      const updatedHabit = { ...habitToUnarchive, archived: false };
      updateHabit(updatedHabit);
      toast.success('Habit unarchived successfully!', {
        icon: <Check className="h-4 w-4" />,
      });
      fetchArchivedHabits();
    }
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this habit? This action cannot be undone.")) {
      deleteHabit(id);
      toast.success('Habit deleted permanently!', {
        icon: <Trash2 className="h-4 w-4" />,
      });
      fetchArchivedHabits();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Archived Habits</h1>
        <div className="w-6" /> {/* Placeholder for alignment */}
      </header>

      <div className="w-full max-w-md space-y-4 mb-8">
        {archivedHabits.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10 p-4 bg-card border border-border rounded-lg shadow-md">
            <p className="text-lg mb-4">No archived habits.</p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
        ) : (
          archivedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onHabitUpdate={handleHabitUpdate}
              onArchiveHabit={handleUnarchiveHabit} // Pass unarchive function
              onDeleteHabit={handleDeleteHabit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivedHabits;
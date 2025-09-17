import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Plus, Settings, Archive, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const fetchHabits = useCallback(() => {
    const allHabits = getHabits();
    setHabits(allHabits.filter(h => !h.archived)); // Only show non-archived habits on dashboard
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleHabitUpdate = () => {
    fetchHabits(); // Re-fetch habits after any update (e.g., completion toggle)
  };

  const handleArchiveHabit = (id: string) => {
    const habitToArchive = habits.find(h => h.id === id);
    if (habitToArchive) {
      const updatedHabit = { ...habitToArchive, archived: !habitToArchive.archived };
      updateHabit(updatedHabit);
      toast.success(`Habit ${updatedHabit.archived ? 'archived' : 'unarchived'}!`, {
        icon: <Check className="h-4 w-4" />,
      });
      fetchHabits();
    }
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
      deleteHabit(id);
      toast.success('Habit deleted successfully!', {
        icon: <Check className="h-4 w-4" />,
      });
      fetchHabits();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Settings className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">HabitKit</h1>
        <Link to="/create-habit">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <div className="space-y-4 mb-8">
        {habits.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg mb-4">No habits yet. Start by creating one!</p>
            <Link to="/create-habit">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create First Habit
              </Button>
            </Link>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onHabitUpdate={handleHabitUpdate}
              onArchiveHabit={handleArchiveHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          ))
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/archived-habits"> {/* Placeholder for archived habits page */}
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <Archive className="mr-2 h-4 w-4" /> View Archived Habits
          </Button>
        </Link>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;
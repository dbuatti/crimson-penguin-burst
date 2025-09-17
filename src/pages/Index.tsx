import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Plus, Settings, Archive, Check, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportHabits, importHabits } from '@/lib/data-management'; // Import data management functions

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

  const handleExport = () => {
    exportHabits();
    toast.success('Habits exported successfully!', {
      icon: <Download className="h-4 w-4" />,
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importHabits(file);
        toast.success('Habits imported successfully! Refreshing...', {
          icon: <Upload className="h-4 w-4" />,
        });
        fetchHabits(); // Re-fetch to show imported habits
      } catch (error) {
        console.error('Failed to import habits:', error);
        toast.error('Failed to import habits. Please check the file format.', {
          icon: <X className="h-4 w-4" />,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem asChild>
              <Link to="/archived-habits" className="flex items-center">
                <Archive className="mr-2 h-4 w-4" /> View Archived Habits
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport} className="flex items-center">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center relative">
              <Upload className="mr-2 h-4 w-4" /> Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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

      {/* The "View Archived Habits" button is now in the settings dropdown */}
      <MadeWithDyad />
    </div>
  );
};

export default Index;
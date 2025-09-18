import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Plus, Settings, Archive, Check, Upload, Download, X, LogOut } from 'lucide-react'; // Import LogOut icon
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportHabits, importHabits } from '@/lib/data-management';
import { useSession } from '@/components/SessionContextProvider'; // Import useSession

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { supabase, session } = useSession(); // Use the session context

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out.', {
        icon: <X className="h-4 w-4" />,
      });
      console.error('Logout error:', error);
    } else {
      toast.success('Logged out successfully!', {
        icon: <Check className="h-4 w-4" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <header className="flex justify-between items-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Settings className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover border-border text-foreground shadow-lg">
              <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Link to="/archived-habits" className="flex items-center">
                  <Archive className="mr-2 h-4 w-4" /> View Archived Habits
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Download className="mr-2 h-4 w-4" /> Export Data
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center relative hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Upload className="mr-2 h-4 w-4" /> Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </DropdownMenuItem>
              {session && (
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-150">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <h1 className="text-3xl font-bold text-foreground">HabitKit</h1>
          <Link to="/create-habit">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </header>

        <div className="space-y-4 mb-8">
          {habits.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10 p-4 bg-card border border-border rounded-lg shadow-md">
              <p className="text-lg mb-4">No habits yet. Start by creating one!</p>
              <Link to="/create-habit">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200">
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

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
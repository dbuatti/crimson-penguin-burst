import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Plus, Settings, Archive, Upload, Download, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportHabits, importHabits } from '@/lib/data-management';
import { useSession } from '@/components/SessionContextProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { supabase, session, loading: sessionLoading } = useSession();
  const navigate = useNavigate();

  const fetchHabits = useCallback(async () => {
    if (session) {
      const allHabits = await getHabits(session);
      setHabits(allHabits.filter(h => !h.archived));
    } else {
      setHabits([]);
    }
  }, [session]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchHabits();
    }
  }, [fetchHabits, sessionLoading]);

  const handleHabitUpdate = () => {
    fetchHabits();
  };

  const handleArchiveHabit = async (id: string) => {
    const habitToArchive = habits.find(h => h.id === id);
    if (habitToArchive) {
      const updatedHabit = { ...habitToArchive, archived: !habitToArchive.archived };
      const result = await updateHabit(updatedHabit, session);
      if (result) {
        showSuccess(`Habit ${updatedHabit.archived ? 'archived' : 'unarchived'}!`);
        fetchHabits();
      } else {
        showError('Failed to archive/unarchive habit.');
      }
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
      const success = await deleteHabit(id, session);
      if (success) {
        showSuccess('Habit deleted successfully!');
        fetchHabits();
      } else {
        showError('Failed to delete habit.');
      }
    }
  };

  const handleExport = async () => {
    await exportHabits(session);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importHabits(file, session);
        fetchHabits();
      } catch (error) {
        console.error('Failed to import habits:', error);
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error details:', error);
      showError('Logout attempted, but an error occurred. Redirecting...');
    } else {
      showSuccess('Logged out successfully!');
    }
    localStorage.removeItem('sb-gdmjttmjjhadltaihpgr-auth-token');
    navigate('/login');
    window.location.reload();
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl"> {/* Increased max-w for wider grid */}
        <header className="flex justify-between items-center mb-8 py-2 px-4 bg-card border border-border rounded-xl shadow-lg">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border-border text-foreground shadow-lg rounded-lg p-1">
                <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                  <Link to="/archived-habits" className="flex items-center">
                    <Archive className="mr-2 h-4 w-4" /> View Archived Habits
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center relative hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                  <Upload className="mr-2 h-4 w-4" /> Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </DropdownMenuItem>
                {session && (
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">HabitKit</h1>
          <Link to="/create-habit">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </header>

        <div className="space-y-4 mb-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
          {habits.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground mt-12 p-8 bg-card border border-border rounded-xl shadow-lg flex flex-col items-center justify-center">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <p className="text-xl font-semibold mb-4">No habits yet. Let's build some good routines!</p>
              <Link to="/create-habit">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg px-6 py-3 text-base">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Habit
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
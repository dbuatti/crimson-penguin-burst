import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit, toggleHabitCompletion } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
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
import HabitListItem from '@/components/HabitListItem';
import { cn } from '@/lib/utils';

// Custom Circular Progress component
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  startColor: string;
  endColor: string;
  backgroundColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 128,
  strokeWidth = 12,
  gradientId,
  startColor,
  endColor,
  backgroundColor = 'hsl(var(--muted))',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <circle
        stroke={backgroundColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={`url(#${gradientId})`}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 0.35s' }}
      />
    </svg>
  );
};


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

  const todayHabits = habits.filter(h => h.goalType === 'daily');
  const weeklyMonthlyHabits = habits.filter(h => h.goalType === 'weekly' || h.goalType === 'monthly');

  const totalDailyHabits = todayHabits.length;
  const completedDailyHabits = todayHabits.filter(h => h.isCompletedToday).length;
  const overallDailyProgress = totalDailyHabits > 0 ? Math.round((completedDailyHabits / totalDailyHabits) * 100) : 0;

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <header className="flex justify-between items-center mb-8 py-2 px-4">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Today</h1>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border text-foreground shadow-lg rounded-lg p-1">
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
            <Link to="/create-habit">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>

        {habits.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 p-8 bg-card border border-border rounded-xl shadow-lg flex flex-col items-center justify-center">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <p className="text-xl font-semibold mb-4">No habits yet. Let's build some good routines!</p>
            <Link to="/create-habit">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg px-6 py-3 text-base">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Habit
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Overall Daily Progress Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative flex items-center justify-center">
                <CircularProgress
                  percentage={overallDailyProgress}
                  size={128}
                  strokeWidth={12}
                  gradientId="dailyProgressGradient"
                  startColor="#8338EC" // Purple
                  endColor="#3A86FF"   // Blue
                />
                <span className="absolute text-3xl font-bold text-foreground">
                  {overallDailyProgress}%
                </span>
              </div>
            </div>

            {/* Today's Habits */}
            <div className="space-y-3 mb-8">
              {todayHabits.map((habit) => (
                <HabitListItem
                  key={habit.id}
                  habit={habit}
                  onHabitUpdate={handleHabitUpdate}
                  onArchiveHabit={handleArchiveHabit}
                  onDeleteHabit={handleDeleteHabit}
                  onToggleCompletion={(habitId, dateString) => toggleHabitCompletion(habitId, dateString, session)}
                />
              ))}
            </div>

            {/* Weekly/Monthly Goals */}
            {weeklyMonthlyHabits.length > 0 && (
              <>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-6 mt-10">Weekly goals</h2>
                <div className="space-y-3 mb-8">
                  {weeklyMonthlyHabits.map((habit) => (
                    <HabitListItem
                      key={habit.id}
                      habit={habit}
                      onHabitUpdate={handleHabitUpdate}
                      onArchiveHabit={handleArchiveHabit}
                      onDeleteHabit={handleDeleteHabit}
                      onToggleCompletion={(habitId, dateString) => toggleHabitCompletion(habitId, dateString, session)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
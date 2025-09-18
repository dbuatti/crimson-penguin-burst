import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHabits, updateHabit, deleteHabit, toggleHabitCompletion, incrementHabitCompletion, decrementHabitCompletion } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { Plus, Sparkles } from 'lucide-react'; // Removed Edit icon import
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { useSession } from '@/components/SessionContextProvider';
import HabitListItem from '@/components/HabitListItem';
import CircularProgress from '@/components/CircularProgress';

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { session, loading: sessionLoading } = useSession();

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

  const handleToggleCompletion = async (habitId: string, dateString: string) => {
    const success = await toggleHabitCompletion(habitId, dateString, session);
    if (success) {
      showSuccess('Habit completion toggled!');
      fetchHabits();
    } else {
      showError('Failed to toggle habit completion.');
    }
    return success;
  };

  const handleIncrementCompletion = async (habitId: string, dateString: string) => {
    const success = await incrementHabitCompletion(habitId, dateString, session);
    if (success) {
      showSuccess('Habit progress incremented!');
      fetchHabits();
    } else {
      showError('Failed to increment habit progress.');
    }
    return success;
  };

  const handleDecrementCompletion = async (habitId: string, dateString: string) => {
    const success = await decrementHabitCompletion(habitId, dateString, session);
    if (success) {
      showSuccess('Habit progress decremented!');
      fetchHabits();
    } else {
      showError('Failed to decrement habit progress.');
    }
    return success;
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
    <>
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
          <div className="w-full flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Today</h1>
            <div className="flex space-x-2">
              {/* Removed the Edit button */}
              <Link to="/create-habit">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
                  <Plus className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

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
              >
                <span className="text-3xl font-bold text-foreground">
                  {overallDailyProgress}%
                </span>
              </CircularProgress>
            </div>
          </div>

          {/* Today's Habits */}
          <div className="space-y-3 mb-8 w-full">
            {todayHabits.map((habit) => (
              <HabitListItem
                key={habit.id}
                habit={habit}
                onHabitUpdate={handleHabitUpdate}
                onArchiveHabit={handleArchiveHabit}
                onDeleteHabit={handleDeleteHabit}
                onToggleCompletion={handleToggleCompletion}
                onIncrementCompletion={handleIncrementCompletion}
                onDecrementCompletion={handleDecrementCompletion}
              />
            ))}
          </div>

          {/* Weekly/Monthly Goals */}
          {weeklyMonthlyHabits.length > 0 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-6 mt-10">Weekly goals</h2>
              <div className="space-y-3 mb-8 w-full">
                {weeklyMonthlyHabits.map((habit) => (
                  <HabitListItem
                    key={habit.id}
                    habit={habit}
                    onHabitUpdate={handleHabitUpdate}
                    onArchiveHabit={handleArchiveHabit}
                    onDeleteHabit={handleDeleteHabit}
                    onToggleCompletion={handleToggleCompletion}
                    onIncrementCompletion={handleIncrementCompletion}
                    onDecrementCompletion={handleDecrementCompletion}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Index;
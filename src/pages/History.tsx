import React, { useEffect, useState, useCallback } from 'react';
import { getHabits, getHabitCompletionLogs } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { useSession } from '@/components/SessionContextProvider';
import PageHeader from '@/components/PageHeader';
import HistoryHabitCard from '@/components/HistoryHabitCard';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HabitHistory {
  habit: Habit;
  completionDates: string[];
}

const History: React.FC = () => {
  const [habitsHistory, setHabitsHistory] = useState<HabitHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading: sessionLoading } = useSession();

  const fetchHabitsAndHistory = useCallback(async () => {
    if (session) {
      const allHabits = await getHabits(session);
      // Filter for active daily habits to match the "Daily goals" context
      const activeDailyHabits = allHabits.filter(h => !h.archived && h.goalType === 'daily');

      const historyPromises = activeDailyHabits.map(async (habit) => {
        const completionDates = await getHabitCompletionLogs(habit.id, session);
        return { habit, completionDates };
      });

      const results = await Promise.all(historyPromises);
      setHabitsHistory(results);
    } else {
      setHabitsHistory([]);
    }
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchHabitsAndHistory();
    }
  }, [fetchHabitsAndHistory, sessionLoading]);

  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading habit history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <PageHeader title="Daily goals" backLink="/" /> {/* Updated title */}

      <div className="w-full max-w-md space-y-6 mb-8">
        {habitsHistory.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 p-8 bg-card border border-border rounded-xl shadow-lg flex flex-col items-center justify-center">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <p className="text-xl font-semibold mb-4">No active daily habits to show history for.</p>
            <Link to="/create-habit">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg px-6 py-3 text-base">
                Create Your First Habit
              </Button>
            </Link>
          </div>
        ) : (
          habitsHistory.map(({ habit, completionDates }) => (
            <HistoryHabitCard key={habit.id} habit={habit} completionDates={completionDates} />
          ))
        )}
      </div>
    </div>
  );
};

export default History;
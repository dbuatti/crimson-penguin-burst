import React, { useEffect, useState, useCallback } from 'react';
import { getHabits, getHabitCompletionLogs } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { useSession } from '@/components/SessionContextProvider';
import CompactHabitCard from '@/components/CompactHabitCard';
import { Sparkles, BarChart3, Archive, TrendingUp, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HabitHistory {
  habit: Habit;
  completionDates: string[];
}

const History: React.FC = () => {
  const [habitsHistory, setHabitsHistory] = useState<HabitHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'habits' | 'statistics' | 'archived'>('habits');
  const { session, loading: sessionLoading } = useSession();

  const fetchHabitsAndHistory = useCallback(async () => {
    if (session) {
      const allHabits = await getHabits(session);
      const activeHabits = allHabits.filter(h => !h.archived);

      const historyPromises = activeHabits.map(async (habit) => {
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

  const tabs = [
    { id: 'habits' as const, label: 'Habits', icon: Calendar },
    { id: 'statistics' as const, label: 'Statistics', icon: BarChart3 },
    { id: 'archived' as const, label: 'Archived', icon: Archive }
  ];

  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading habit history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      {/* Segmented Navigation */}
      <div className="flex items-center justify-center p-1 bg-secondary rounded-full shadow-inner border border-border mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Habits Tab Content */}
      {activeTab === 'habits' && (
        <div className="w-full max-w-md space-y-3">
          {habitsHistory.length === 0 ? (
            <div className="text-center text-muted-foreground p-8 bg-card border border-border rounded-xl shadow-lg flex flex-col items-center justify-center">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <p className="text-xl font-semibold mb-4">No active habits to show history for.</p>
              <Link to="/create-habit">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg px-6 py-3 text-base">
                  Create Your First Habit
                </Button>
              </Link>
            </div>
          ) : (
            habitsHistory.map(({ habit, completionDates }) => (
              <CompactHabitCard key={habit.id} habit={habit} completionDates={completionDates} />
            ))
          )}
        </div>
      )}

      {/* Statistics Tab Content */}
      {activeTab === 'statistics' && (
        <div className="w-full max-w-md space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Habit Statistics Overview
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{habitsHistory.length}</div>
                <div className="text-sm text-muted-foreground">Active Habits</div>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {habitsHistory.reduce((total, { completionDates }) => total + completionDates.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Completions</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Completion Rates
              </h3>
              {habitsHistory.map(({ habit, completionDates }) => (
                <div key={habit.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{habit.name}</span>
                  <span className="text-sm font-medium text-primary">
                    {completionDates.length} completions
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Weekly Progress</h3>
            <div className="text-muted-foreground text-sm">
              Detailed weekly progress charts and analytics will be available here soon.
            </div>
          </div>
        </div>
      )}

      {/* Archived Tab Content */}
      {activeTab === 'archived' && (
        <div className="w-full max-w-md space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Archived Habits
            </h2>
            
            <div className="text-center text-muted-foreground py-8">
              <Archive className="h-12 w-12 text-primary mb-4 mx-auto" />
              <p className="text-lg mb-4">No archived habits yet.</p>
              <p className="text-sm text-muted-foreground">
                Archived habits will appear here for historical reference.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Archive Management</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Manage your archived habits and view their historical data.
              </p>
              <Button variant="outline" className="w-full" disabled>
                View All Archived Habits
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
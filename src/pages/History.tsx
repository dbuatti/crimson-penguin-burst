import React, { useEffect, useState, useCallback } from 'react';
import { getHabits, getHabitCompletionLogs, getAllHabitLogs, getDailyHabitCompletionSummary, getWeeklyHabitCompletionSummary, getMonthlyHabitCompletionSummary } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { useSession } from '@/components/SessionContextProvider';
import CompactHabitCard from '@/components/CompactHabitCard';
import { Sparkles, BarChart3, Archive, Calendar, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn, calculateOverallStreaks } from '@/lib/utils';
import OverallStatsCards from '@/components/OverallStatsCards';
import HabitCompletionChart from '@/components/HabitCompletionChart';
import { format, subDays, addDays, subWeeks, addWeeks, subMonths, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

interface HabitHistory {
  habit: Habit;
  completionDates: string[];
}

interface ChartDataPoint {
  date: string;
  value: number;
}

const tabs = [
  { id: 'habits', label: 'Habits', icon: ListTodo },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'archived', label: 'Archived', icon: Archive },
] as const;

const History: React.FC = () => {
  const [habitsHistory, setHabitsHistory] = useState<HabitHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('habits');
  const { session, loading: sessionLoading } = useSession();

  // Overall Stats
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [longestStreakEver, setLongestStreakEver] = useState(0);
  const [currentLongestStreak, setCurrentLongestStreak] = useState(0);

  // Daily Chart State
  const [dailyChartData, setDailyChartData] = useState<ChartDataPoint[]>([]);
  const [dailyAvgPercentage, setDailyAvgPercentage] = useState(0);
  const [dailyTimeRange, setDailyTimeRange] = useState('31D');
  const [dailyDateOffset, setDailyDateOffset] = useState(0);

  // Weekly Chart State
  const [weeklyChartData, setWeeklyChartData] = useState<ChartDataPoint[]>([]);
  const [weeklyAvgPercentage, setWeeklyAvgPercentage] = useState(0);
  const [weeklyTimeRange, setWeeklyTimeRange] = useState('16W');
  const [weeklyDateOffset, setWeeklyDateOffset] = useState(0);

  // Monthly Chart State
  const [monthlyChartData, setMonthlyChartData] = useState<ChartDataPoint[]>([]);
  const [monthlyAvgPercentage, setMonthlyAvgPercentage] = useState(0);
  const [monthlyTimeRange, setMonthlyTimeRange] = useState('12M');
  const [monthlyDateOffset, setMonthlyDateOffset] = useState(0);

  const fetchHabitsAndHistory = useCallback(async () => {
    if (session) {
      const allHabits = await getHabits(session);
      const activeHabits = allHabits.filter(h => !h.archived);
      const archivedHabits = allHabits.filter(h => h.archived);

      const historyPromises = activeHabits.map(async (habit) => {
        const completionDates = await getHabitCompletionLogs(habit.id, session);
        return { habit, completionDates };
      });

      const results = await Promise.all(historyPromises);
      setHabitsHistory(results);

      const allLogs = await getAllHabitLogs(session);
      const total = allLogs.length;
      setTotalCompletions(total);

      const { longestStreakEver: overallLongest, currentLongestStreak: overallCurrent } = calculateOverallStreaks(allLogs, allHabits);
      setLongestStreakEver(overallLongest);
      setCurrentLongestStreak(overallCurrent);

    } else {
      setHabitsHistory([]);
      setTotalCompletions(0);
      setLongestStreakEver(0);
      setCurrentLongestStreak(0);
    }
    setIsLoading(false);
  }, [session]);

  const fetchDailyChartData = useCallback(async () => {
    if (!session) return;

    let daysToFetch = 30;
    if (dailyTimeRange === '7D') {
      daysToFetch = 7;
    } else if (dailyTimeRange === '31D') {
      daysToFetch = 30;
    } else if (dailyTimeRange === '26W') {
      daysToFetch = 26 * 7;
    } else if (dailyTimeRange === '12M') {
      daysToFetch = 365;
    }

    const currentViewEndDate = subDays(startOfDay(new Date()), daysToFetch * dailyDateOffset);

    const data = await getDailyHabitCompletionSummary(session, daysToFetch, currentViewEndDate);
    setDailyChartData(data.map(d => ({ date: d.completion_date, value: d.completion_percentage })));
    const avg = data.length > 0 ? data.reduce((sum, d) => sum + d.completion_percentage, 0) / data.length : 0;
    setDailyAvgPercentage(Math.round(avg));
  }, [session, dailyTimeRange, dailyDateOffset]);

  const fetchWeeklyChartData = useCallback(async () => {
    if (!session) return;

    let weeksToFetch = 16;
    if (weeklyTimeRange === '5W') {
      weeksToFetch = 5;
    } else if (weeklyTimeRange === '16W') {
      weeksToFetch = 16;
    } else if (weeklyTimeRange === '26W') {
      weeksToFetch = 26;
    } else if (weeklyTimeRange === '12M') {
      weeksToFetch = 52;
    }

    const currentViewEndDate = subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weeksToFetch * weeklyDateOffset);

    const data = await getWeeklyHabitCompletionSummary(session, weeksToFetch, currentViewEndDate);
    setWeeklyChartData(data.map(d => ({ date: d.week_start_date, value: d.completion_percentage })));
    const avg = data.length > 0 ? data.reduce((sum, d) => sum + d.completion_percentage, 0) / data.length : 0;
    setWeeklyAvgPercentage(Math.round(avg));
  }, [session, weeklyTimeRange, weeklyDateOffset]);

  const fetchMonthlyChartData = useCallback(async () => {
    if (!session) return;

    let monthsToFetch = 12;
    if (monthlyTimeRange === '6M') {
      monthsToFetch = 6;
    } else if (monthlyTimeRange === '12M') {
      monthsToFetch = 12;
    } else if (monthlyTimeRange === '2Y') {
      monthsToFetch = 24;
    }

    const currentViewEndDate = subMonths(startOfMonth(new Date()), monthsToFetch * monthlyDateOffset);

    const data = await getMonthlyHabitCompletionSummary(session, monthsToFetch, currentViewEndDate);
    setMonthlyChartData(data.map(d => ({ date: d.month_start_date, value: d.completion_percentage })));
    const avg = data.length > 0 ? data.reduce((sum, d) => sum + d.completion_percentage, 0) / data.length : 0;
    setMonthlyAvgPercentage(Math.round(avg));
  }, [session, monthlyTimeRange, monthlyDateOffset]);


  useEffect(() => {
    if (!sessionLoading) {
      fetchHabitsAndHistory();
      fetchDailyChartData();
      fetchWeeklyChartData();
      fetchMonthlyChartData();
    }
  }, [fetchHabitsAndHistory, fetchDailyChartData, fetchWeeklyChartData, fetchMonthlyChartData, sessionLoading]);

  const dailyTimeRangeOptions = [
    { label: '7D', value: '7D' },
    { label: '31D', value: '31D' },
    { label: '26W', value: '26W' },
    { label: '12M', value: '12M' },
  ];

  const weeklyTimeRangeOptions = [
    { label: '5W', value: '5W' },
    { label: '16W', value: '16W' },
    { label: '26W', value: '26W' },
    { label: '12M', value: '12M' },
  ];

  const monthlyTimeRangeOptions = [
    { label: '6M', value: '6M' },
    { label: '12M', value: '12M' },
    { label: '2Y', value: '2Y' },
  ];

  const getDailyDateRangeLabel = () => {
    if (dailyChartData.length === 0) return '';
    const firstDate = new Date(dailyChartData[0].date);
    const lastDate = new Date(dailyChartData[dailyChartData.length - 1].date);
    return `${format(firstDate, 'MMM d, yyyy')} - ${format(lastDate, 'MMM d, yyyy')}`;
  };

  const getWeeklyDateRangeLabel = () => {
    if (weeklyChartData.length === 0) return '';
    const firstDate = new Date(weeklyChartData[0].date);
    const lastDate = new Date(weeklyChartData[weeklyChartData.length - 1].date);
    return `${format(firstDate, 'MMM d, yyyy')} - ${format(lastDate, 'MMM d, yyyy')}`;
  };

  const getMonthlyDateRangeLabel = () => {
    if (monthlyChartData.length === 0) return '';
    const firstDate = new Date(monthlyChartData[0].date);
    const lastDate = new Date(monthlyChartData[monthlyChartData.length - 1].date);
    return `${format(firstDate, 'MMM yyyy')} - ${format(lastDate, 'MMM yyyy')}`;
  };

  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading habit history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center w-full max-w-4xl"> {/* Added max-w-4xl here */}
      <div className="flex items-center justify-center p-1 bg-secondary rounded-full shadow-inner border border-border mb-6 w-full">
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

      {activeTab === 'habits' && (
        <div className="w-full space-y-3">
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

      {activeTab === 'statistics' && (
        <div className="w-full space-y-6">
          <OverallStatsCards
            totalCompletions={totalCompletions}
            longestStreakEver={longestStreakEver}
            currentLongestStreak={currentLongestStreak}
          />

          <HabitCompletionChart
            title="Daily goals"
            data={dailyChartData}
            averagePercentage={dailyAvgPercentage}
            timeRangeOptions={dailyTimeRangeOptions}
            selectedTimeRange={dailyTimeRange}
            onTimeRangeChange={setDailyTimeRange}
            onNavigateDates={(direction) => setDailyDateOffset(prev => direction === 'prev' ? prev + 1 : Math.max(0, prev - 1))}
            dateRangeLabel={getDailyDateRangeLabel()}
            chartType="daily"
          />

          <HabitCompletionChart
            title="Weekly goals"
            data={weeklyChartData}
            averagePercentage={weeklyAvgPercentage}
            timeRangeOptions={weeklyTimeRangeOptions}
            selectedTimeRange={weeklyTimeRange}
            onTimeRangeChange={setWeeklyTimeRange}
            onNavigateDates={(direction) => setWeeklyDateOffset(prev => direction === 'prev' ? prev + 1 : Math.max(0, prev - 1))}
            dateRangeLabel={getWeeklyDateRangeLabel()}
            chartType="weekly"
          />

          <HabitCompletionChart
            title="Monthly goals"
            data={monthlyChartData}
            averagePercentage={monthlyAvgPercentage}
            timeRangeOptions={monthlyTimeRangeOptions}
            selectedTimeRange={monthlyTimeRange}
            onTimeRangeChange={setMonthlyTimeRange}
            onNavigateDates={(direction) => setMonthlyDateOffset(prev => direction === 'prev' ? prev + 1 : Math.max(0, prev - 1))}
            dateRangeLabel={getMonthlyDateRangeLabel()}
            chartType="daily"
          />
        </div>
      )}

      {activeTab === 'archived' && (
        <div className="w-full space-y-6">
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
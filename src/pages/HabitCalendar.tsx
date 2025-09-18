import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHabitById, toggleHabitCompletion } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { format, parseISO } from 'date-fns';
import { useSession } from '@/components/SessionContextProvider';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/integrations/supabase/client';

const HabitCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState<Date>(new Date());
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const { session, loading: sessionLoading } = useSession();

  const fetchHabitAndLogs = useCallback(async () => {
    if (id && session) {
      const fetchedHabit = await getHabitById(id, session);
      if (fetchedHabit) {
        setHabit(fetchedHabit);

        // Fetch all completion logs for this habit
        const { data: logsData, error: logsError } = await supabase
          .from('habit_logs')
          .select('log_date')
          .eq('habit_id', fetchedHabit.id)
          .eq('user_id', session.user.id)
          .eq('is_completed', true); // Only count actual completions

        if (logsError) {
          console.error("Failed to fetch habit logs for calendar:", logsError);
          setCompletedDates([]);
        } else {
          // For calendar display, we just need unique dates where it was completed at least once
          const uniqueCompletedDates = Array.from(new Set((logsData || []).map(log => log.log_date)));
          setCompletedDates(uniqueCompletedDates.map(dateString => parseISO(dateString)));
        }
      } else {
        showError('Habit not found.');
        navigate('/');
      }
    }
    setIsLoading(false);
  }, [id, navigate, session]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchHabitAndLogs();
    }
  }, [fetchHabitAndLogs, sessionLoading]);

  const handleDateClick = async (date: Date | undefined) => {
    if (!date || !habit || !session) return;

    const dateString = format(date, 'yyyy-MM-dd');
    const success = await toggleHabitCompletion(habit.id, dateString, session);
    if (success) {
      fetchHabitAndLogs(); // Re-fetch habit and logs to update calendar display
      showSuccess(`Habit completion for ${dateString} toggled!`);
    } else {
      showError('Failed to toggle habit completion.');
    }
  };

  const modifiers = {
    completed: completedDates,
  };

  const modifiersStyles = {
    completed: {
      backgroundColor: habit?.color || 'var(--primary)',
      color: 'white',
      borderRadius: '0.5rem',
    },
  };

  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading calendar...
      </div>
    );
  }

  if (!habit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <PageHeader title={`Calendar: ${habit.name}`} backLink="/" />
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-4">
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={null}
          onSelect={handleDateClick}
          className="rounded-xl border-none bg-card text-foreground"
          classNames={{
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-base font-semibold text-foreground",
            nav: "space-x-1 flex items-center",
            nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity duration-200 rounded-lg",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-medium text-[0.85rem]",
            row: "flex w-full mt-2",
            cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-range-start)]:rounded-l-lg [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 rounded-lg",
            day_selected: "rounded-lg bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground border border-primary/50 rounded-lg",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </div>
    </div>
  );
};

export default HabitCalendar;
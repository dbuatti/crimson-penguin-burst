import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHabitById, toggleHabitCompletion } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { format, isSameDay, parseISO } from 'date-fns';

const HabitCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState<Date>(new Date()); // State for the current month in the calendar

  const fetchHabit = useCallback(() => {
    if (id) {
      const fetchedHabit = getHabitById(id);
      if (fetchedHabit) {
        setHabit(fetchedHabit);
      } else {
        toast.error('Habit not found.', {
          icon: <X className="h-4 w-4" />,
        });
        navigate('/');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    fetchHabit();
  }, [fetchHabit]);

  const handleDateClick = (date: Date | undefined) => {
    if (!date || !habit) return;

    const dateString = format(date, 'yyyy-MM-dd');
    toggleHabitCompletion(habit.id, dateString);
    fetchHabit(); // Re-fetch habit to update calendar display
    toast.success(`Habit completion for ${dateString} toggled!`, {
      icon: <Check className="h-4 w-4" />,
    });
  };

  const modifiers = {
    completed: habit?.completionDates.map(dateString => parseISO(dateString)) || [],
  };

  const modifiersStyles = {
    completed: {
      backgroundColor: habit?.color || 'var(--primary)', // Use habit color for completed days
      color: 'white',
      borderRadius: '0.25rem', // Tailwind's rounded-md
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        Loading calendar...
      </div>
    );
  }

  if (!habit) {
    return null; // Should redirect by now if habit not found
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Calendar: {habit.name}</h1>
        <div className="w-6" /> {/* Placeholder for alignment */}
      </div>
      <div className="w-full max-w-md bg-gray-800/50 dark:bg-gray-900/50 rounded-lg shadow-lg p-4">
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={null} // No single date selected by default, we handle clicks
          onSelect={handleDateClick}
          className="rounded-md border bg-gray-800/50 dark:bg-gray-900/50 text-white"
          classNames={{
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-white",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-400 hover:text-white",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-gray-700",
            day_selected: "rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            // Removed ...modifiersStyles from here
          }}
          modifiers={modifiers}
          styles={modifiersStyles} {/* Correctly passing modifiersStyles to the styles prop */}
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
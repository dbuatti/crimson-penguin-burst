import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay } from 'date-fns';

interface HabitGridProps {
  completionDates: string[];
  habitColor: string;
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const NUM_WEEKS_TO_SHOW = 7; // Display the last 7 weeks

const HabitGrid: React.FC<HabitGridProps> = ({
  completionDates,
  habitColor,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day

  // Calculate the start date for the grid to show NUM_WEEKS_TO_SHOW weeks ending on the current day's week.
  // We want the grid to start on a Monday and end on a Sunday, covering NUM_WEEKS_TO_SHOW weeks.
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday is the start of the week (0 for Sunday, 1 for Monday)
  const gridStartDate = subWeeks(startOfCurrentWeek, NUM_WEEKS_TO_SHOW - 1);

  const dates: Date[] = [];
  for (let i = 0; i < NUM_WEEKS_TO_SHOW * 7; i++) {
    dates.push(addDays(gridStartDate, i));
  }

  const isCompleted = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return completionDates.includes(dateString);
  };

  return (
    <div className="p-2 rounded-md bg-gray-800/50 dark:bg-gray-900/50 overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Habit completion grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "w-5 h-5 rounded-sm", // Slightly larger squares for better visibility
              "bg-gray-700", // Default background for incomplete/future days
              {
                "opacity-50": date > today, // Dim future dates
                "border border-white": isSameDay(date, today), // Highlight today with a white border
              }
            )}
            style={{ backgroundColor: isCompleted(date) ? habitColor : undefined }}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitGrid;
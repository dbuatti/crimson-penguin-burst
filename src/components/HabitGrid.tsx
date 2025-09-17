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
  const todayFormatted = format(today, 'yyyy-MM-dd'); // String representation of today for consistent comparison

  // Calculate the start date for the grid to show NUM_WEEKS_TO_SHOW weeks ending on the current day's week.
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday is the start of the week
  const gridStartDate = subWeeks(startOfCurrentWeek, NUM_WEEKS_TO_SHOW - 1);

  const dates: Date[] = [];
  for (let i = 0; i < NUM_WEEKS_TO_SHOW * 7; i++) {
    dates.push(addDays(gridStartDate, i));
  }

  return (
    <div className="p-3 rounded-md bg-secondary border border-border overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Habit completion grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const dateFormatted = format(date, 'yyyy-MM-dd');
          const isCurrentDay = dateFormatted === todayFormatted; // Check if this grid cell represents today
          const isCompleted = completionDates.includes(dateFormatted);

          return (
            <div
              key={index}
              className={cn(
                "w-5 h-5 rounded-sm transition-all duration-200",
                "bg-accent", // Default background for incomplete/future days
                {
                  "opacity-50": date > today, // Dim future dates (using Date object comparison)
                  "border border-primary/50": isCurrentDay, // Highlight today with a subtle border
                }
              )}
              style={{ backgroundColor: isCompleted ? habitColor : undefined }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HabitGrid;
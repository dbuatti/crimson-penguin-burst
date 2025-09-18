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

  // Determine the Monday of the week that is NUM_WEEKS_TO_SHOW - 1 weeks ago from today's week.
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday of the current week
  const firstMondayToDisplay = subWeeks(startOfThisWeek, NUM_WEEKS_TO_SHOW - 1);

  const dates: Date[] = [];
  for (let i = 0; i < NUM_WEEKS_TO_SHOW * 7; i++) {
    dates.push(addDays(firstMondayToDisplay, i));
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
          const isCompleted = completionDates.includes(dateFormatted);
          const isPast = date < today;
          const isFuture = date > today;
          const isCurrentDay = isSameDay(date, today);

          return (
            <div
              key={index}
              className={cn(
                "w-5 h-5 rounded-sm transition-all duration-200",
                {
                  "bg-accent": !isCompleted && !isPast, // Default for incomplete future/current days
                  "bg-muted": isPast && !isCompleted, // Distinct background for past incomplete days
                  "border border-primary/50": isCurrentDay && !isCompleted, // Highlight today with a subtle border if incomplete
                  "opacity-50": isFuture, // Dim future dates
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
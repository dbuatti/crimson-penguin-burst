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
          const dayOfMonth = format(date, 'd');

          return (
            <div
              key={index}
              className="relative w-5 h-5 flex items-center justify-center" // Added relative positioning
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-sm transition-all duration-200 z-10", // Square on top
                  {
                    "bg-accent": !isCompleted && !isPast,
                    "bg-muted": isPast && !isCompleted,
                    "border border-primary/50": isCurrentDay && !isCompleted,
                    "opacity-50": isFuture,
                  }
                )}
                style={{ backgroundColor: isCompleted ? habitColor : undefined }}
              />
              <span className="absolute text-[8px] font-bold text-foreground opacity-20 z-0"> {/* Number behind */}
                {dayOfMonth}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitGrid;
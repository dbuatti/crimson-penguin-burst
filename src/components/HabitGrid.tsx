import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay } from 'date-fns';

interface HabitGridProps {
  completionDates: string[];
  habitColor: string;
}

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
    <div className="px-3 pb-3 pt-6 rounded-md bg-secondary border border-border overflow-hidden"> {/* Adjusted padding-top here */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const dateFormatted = format(date, 'yyyy-MM-dd');
          const isCompleted = completionDates.includes(dateFormatted);
          const isPast = date < today;
          const isFuture = date > today;
          const isCurrentDay = isSameDay(date, today);
          const dayOfMonth = format(date, 'd');
          const isFirstDayOfMonth = date.getDate() === 1;

          return (
            <div
              key={index}
              className="relative w-5 h-5" // Fixed size for the grid cell
            >
              {isFirstDayOfMonth && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase text-muted-foreground whitespace-nowrap z-10"> {/* Adjusted positioning */}
                  {format(date, 'MMM')}
                </div>
              )}
              <div
                className={cn(
                  "w-full h-full rounded-sm flex items-center justify-center transition-all duration-200", // Fill the parent div
                  {
                    "bg-accent": !isCompleted && !isPast, // Default for incomplete future/current days
                    "bg-muted": isPast && !isCompleted, // Distinct background for past incomplete days
                    "border border-primary/50": isCurrentDay && !isCompleted, // Highlight today with a subtle border if incomplete
                    "opacity-50": isFuture, // Dim future dates
                  }
                )}
                style={{ backgroundColor: isCompleted ? habitColor : undefined }}
              >
                <span className="text-[8px] font-bold text-foreground opacity-20">
                  {dayOfMonth}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitGrid;
import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay, isFirstDayOfMonth } from 'date-fns';

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

  // Generate month labels for the header
  const monthLabels: (string | null)[] = Array(7).fill(null);
  for (let i = 0; i < 7; i++) {
    const date = dates[i]; // Check the first 7 days (first week)
    if (isFirstDayOfMonth(date)) {
      monthLabels[i] = format(date, 'MMM');
    }
  }

  return (
    <div className="px-3 pb-3 pt-6 rounded-md bg-secondary border border-border overflow-hidden">
      {/* Month Header */}
      <div className="grid grid-cols-7 gap-1 mb-2 py-1"> {/* Added py-1 for vertical spacing */}
        {monthLabels.map((month, index) => (
          <div key={`month-${index}`} className="w-5 h-5 flex items-center justify-center">
            {month && (
              <span className="text-[8px] font-bold uppercase text-muted-foreground">
                {month}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Habit Completion Grid */}
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
              className="relative w-5 h-5" // Fixed size for the grid cell
            >
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
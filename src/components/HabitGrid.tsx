import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay, isFirstDayOfMonth, isSameMonth } from 'date-fns';

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

  // Generate month labels for the header - show month at the first occurrence of each month
  const monthLabels: (string | null)[] = Array(7).fill(null);
  const monthStarts: Set<string> = new Set();
  
  for (let i = 0; i < 7; i++) {
    const date = dates[i]; // Check the first 7 days (first week)
    if (isFirstDayOfMonth(date)) {
      monthLabels[i] = format(date, 'MMM');
      monthStarts.add(format(date, 'yyyy-MM'));
    }
  }

  // For subsequent months, show the month label at the first day of the month
  for (let i = 7; i < dates.length; i++) {
    const date = dates[i];
    const monthKey = format(date, 'yyyy-MM');
    if (isFirstDayOfMonth(date) && !monthStarts.has(monthKey)) {
      monthLabels[i] = format(date, 'MMM');
      monthStarts.add(monthKey);
    }
  }

  // Alternative approach: Show abbreviated month names spanning multiple columns
  const monthSpans: {month: string, startIndex: number, endIndex: number}[] = [];
  let currentMonth = format(dates[0], 'MMM');
  let startIndex = 0;
  
  for (let i = 1; i < dates.length; i++) {
    const month = format(dates[i], 'MMM');
    if (month !== currentMonth) {
      monthSpans.push({
        month: currentMonth,
        startIndex,
        endIndex: i - 1
      });
      currentMonth = month;
      startIndex = i;
    }
  }
  monthSpans.push({
    month: currentMonth,
    startIndex,
    endIndex: dates.length - 1
  });

  return (
    <div className="px-3 pb-3 pt-6 rounded-md bg-secondary border border-border overflow-hidden">
      {/* Month Header - Spanning approach */}
      <div className="grid grid-cols-7 gap-1 mb-2 py-1 relative">
        {monthSpans.map((span, index) => {
          const spanLength = span.endIndex - span.startIndex + 1;
          const colSpan = Math.min(spanLength, 7); // Maximum span is 7 columns
          
          return (
            <div
              key={index}
              className="absolute top-0 h-5 flex items-center justify-center"
              style={{
                left: `${(span.startIndex / dates.length) * 100}%`,
                width: `${(spanLength / dates.length) * 100}%`,
                minWidth: '20px' // Minimum width for very short spans
              }}
            >
              <span className="text-[8px] font-bold uppercase text-muted-foreground bg-background/80 px-1 rounded">
                {span.month}
              </span>
            </div>
          );
        })}
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
          const isMonthStart = isFirstDayOfMonth(date);

          return (
            <div
              key={index}
              className="relative w-5 h-5 group" // Fixed size for the grid cell
            >
              <div
                className={cn(
                  "w-full h-full rounded-sm flex items-center justify-center transition-all duration-200", // Fill the parent div
                  {
                    "bg-accent": !isCompleted && !isPast, // Default for incomplete future/current days
                    "bg-muted": isPast && !isCompleted, // Distinct background for past incomplete days
                    "border border-primary/50": isCurrentDay && !isCompleted, // Highlight today with a subtle border if incomplete
                    "opacity-50": isFuture, // Dim future dates
                    "ring-1 ring-foreground/20": isMonthStart, // Highlight first day of month
                  }
                )}
                style={{ backgroundColor: isCompleted ? habitColor : undefined }}
              >
                <span className="text-[8px] font-bold text-foreground opacity-20">
                  {dayOfMonth}
                </span>
              </div>
              
              {/* Hover tooltip showing full date */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                {format(date, 'MMM d, yyyy')}
                {isCompleted && ' ✓'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitGrid;
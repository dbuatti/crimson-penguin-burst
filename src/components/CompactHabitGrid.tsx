import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameMonth } from 'date-fns';

interface CompactHabitGridProps {
  completionDates: string[];
  habitColor: string;
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const NUM_WEEKS_TO_SHOW = 8;

const CompactHabitGrid: React.FC<CompactHabitGridProps> = ({
  completionDates,
  habitColor,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const gridStartDate = subWeeks(startOfCurrentWeek, NUM_WEEKS_TO_SHOW - 1);

  const dates: Date[] = [];
  for (let i = 0; i < NUM_WEEKS_TO_SHOW * 7; i++) {
    dates.push(addDays(gridStartDate, i));
  }

  return (
    <div className="p-2 rounded-lg bg-secondary border border-border overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((day, index) => (
          <div key={index} className="flex items-center justify-center text-[10px] font-medium text-muted-foreground w-4 h-4">
            {day}
          </div>
        ))}
      </div>

      {/* Habit completion grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const dateFormatted = format(date, 'yyyy-MM-dd');
          const isCompleted = completionDates.includes(dateFormatted);
          const isFuture = date > today;

          return (
            <div
              key={index}
              className={cn(
                "w-4 h-4 rounded-sm flex items-center justify-center text-[8px] transition-colors duration-150",
                {
                  "bg-muted": !isCompleted && !isFuture,
                  "opacity-40": isFuture,
                  "text-white": isCompleted,
                }
              )}
              style={{ backgroundColor: isCompleted ? habitColor : undefined }}
              aria-label={`${isCompleted ? 'Completed' : 'Not completed'} ${format(date, 'EEEE, MMMM d, yyyy')}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompactHabitGrid;
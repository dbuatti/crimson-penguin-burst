import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay } from 'date-fns';

interface HabitGridProps {
  completionDates: string[];
  habitColor: string;
  onToggleCompletion: (dateString: string) => void; // Re-introducing this prop
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const NUM_WEEKS_TO_SHOW = 7; // Display the last 7 weeks

const HabitGrid: React.FC<HabitGridProps> = ({
  completionDates,
  habitColor,
  onToggleCompletion,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const todayFormatted = format(today, 'yyyy-MM-dd');

  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday of the current week
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
          <div key={day} className="flex items-center justify-center text-xs font-medium text-muted-foreground">
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
              className="relative w-6 h-6" // Slightly larger cells for better touch target and readability
            >
              <button
                type="button"
                onClick={() => onToggleCompletion(dateFormatted)}
                className={cn(
                  "w-full h-full rounded-sm flex items-center justify-center text-[10px] font-semibold transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                  {
                    "bg-muted text-muted-foreground hover:brightness-110": isPast && !isCompleted, // Past incomplete
                    "bg-accent text-accent-foreground hover:brightness-110": !isPast && !isFuture && !isCompleted, // Current incomplete (not today)
                    "bg-accent text-accent-foreground border border-primary/50 hover:brightness-110": isCurrentDay && !isCompleted, // Today incomplete
                    "opacity-50 cursor-not-allowed": isFuture, // Dim future dates and disable clicks
                    "text-white": isCompleted, // Text color for completed days
                  }
                )}
                style={{ backgroundColor: isCompleted ? habitColor : undefined }}
                disabled={isFuture} // Disable clicking on future dates
              >
                {dayOfMonth}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitGrid;
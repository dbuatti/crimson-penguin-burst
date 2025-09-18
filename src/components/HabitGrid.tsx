import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay, isSameMonth } from 'date-fns';

interface HabitGridProps {
  completionDates: string[];
  habitColor: string;
  onToggleCompletion: (dateString: string) => void;
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

  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday of the current week
  const gridStartDate = subWeeks(startOfCurrentWeek, NUM_WEEKS_TO_SHOW - 1);

  const dates: Date[] = [];
  for (let i = 0; i < NUM_WEEKS_TO_SHOW * 7; i++) {
    dates.push(addDays(gridStartDate, i));
  }

  let lastRenderedMonth: string | null = null;

  return (
    <div className="p-4 rounded-xl bg-secondary border border-border overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center text-xs font-medium text-muted-foreground w-7 h-7">
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
          const currentMonthAbbr = format(date, 'MMM').toUpperCase();

          const showMonthDelineator = (index === 0 || !isSameMonth(date, addDays(date, -1))) && currentMonthAbbr !== lastRenderedMonth;
          if (showMonthDelineator) {
            lastRenderedMonth = currentMonthAbbr;
          }

          return (
            <React.Fragment key={index}>
              {showMonthDelineator && (
                <div className="col-span-7 text-left text-xs font-bold text-foreground mt-3 mb-1 pl-1">
                  {currentMonthAbbr}
                </div>
              )}
              <div
                className="relative w-7 h-7"
              >
                <button
                  type="button"
                  onClick={() => onToggleCompletion(dateFormatted)}
                  disabled={isFuture}
                  className={cn(
                    "w-full h-full rounded-md flex items-center justify-center text-[10px] font-semibold transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                    {
                      "bg-muted text-muted-foreground hover:brightness-110": isPast && !isCompleted,
                      "bg-accent text-accent-foreground hover:brightness-110": !isPast && !isFuture && !isCompleted,
                      "bg-accent text-accent-foreground border border-primary/50 hover:brightness-110": isCurrentDay && !isCompleted,
                      "opacity-50 cursor-not-allowed": isFuture,
                      "text-white": isCompleted,
                    }
                  )}
                  style={{ backgroundColor: isCompleted ? habitColor : undefined }}
                  aria-label={`${isCompleted ? 'Completed' : 'Not completed'} ${format(date, 'EEEE, MMMM d, yyyy')}`}
                >
                  {dayOfMonth}
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default HabitGrid;
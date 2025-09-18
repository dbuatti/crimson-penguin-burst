import React from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isToday } from 'date-fns';

interface HistoryHabitGridProps {
  completionDates: string[]; // Array of 'yyyy-MM-dd' strings
  habitColor: string;
}

const NUM_WEEKS_TO_SHOW = 52; // Display the last 52 weeks (approx. one year)

const HistoryHabitGrid: React.FC<HistoryHabitGridProps> = ({
  completionDates,
  habitColor,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day

  // Start the grid from the Monday of the week 51 weeks ago
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday of the current week
  const gridStartDate = subWeeks(startOfCurrentWeek, NUM_WEEKS_TO_SHOW - 1);

  const dates: Date[] = [];
  for (let i = 0; i < NUM_WEEKS_TO_SHOW * 7; i++) {
    dates.push(addDays(gridStartDate, i));
  }

  return (
    <div className="p-2 rounded-xl bg-secondary border border-border overflow-hidden">
      {/* Habit completion grid - 7 columns for days of the week */}
      <div className="grid grid-cols-7 gap-0.5">
        {dates.map((date, index) => {
          const dateFormatted = format(date, 'yyyy-MM-dd');
          const isCompleted = completionDates.includes(dateFormatted);
          const isFuture = date > today;

          return (
            <div
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full", // Small dot size
                {
                  "bg-muted": !isCompleted && !isFuture, // Muted for uncompleted past/present
                  "opacity-30 cursor-not-allowed": isFuture, // Faded for future dates
                  "bg-green-500": isCompleted, // Default green for completed, will be overridden by habitColor
                }
              )}
              style={{ backgroundColor: isCompleted ? habitColor : undefined }}
              title={`${format(date, 'EEEE, MMMM d, yyyy')} - ${isCompleted ? 'Completed' : 'Not completed'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HistoryHabitGrid;
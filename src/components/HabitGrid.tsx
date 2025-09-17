import React from 'react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

interface HabitGridProps {
  completionDates: string[];
  habitColor: string;
  startDate?: Date; // Optional start date for the grid
  numDays?: number; // Number of days to display in the grid
}

const HabitGrid: React.FC<HabitGridProps> = ({
  completionDates,
  habitColor,
  startDate: propStartDate,
  numDays: propNumDays,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Default to showing the last 4 weeks (28 days)
  const defaultNumDays = 28;
  const defaultStartDate = subDays(today, defaultNumDays - 1); // Start 27 days ago to include today

  const numDays = propNumDays ?? defaultNumDays;
  const startDate = propStartDate ?? defaultStartDate;

  const dates = Array.from({ length: numDays }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const isCompleted = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return completionDates.includes(dateString);
  };

  return (
    <div className="grid grid-cols-7 gap-px p-2 rounded-md bg-gray-800/50 dark:bg-gray-900/50 overflow-hidden">
      {dates.map((date, index) => (
        <div
          key={index}
          className={cn(
            "w-3 h-3 rounded-sm",
            {
              "bg-gray-700 dark:bg-gray-800": !isCompleted(date), // Only apply gray if not completed
              "opacity-50": date > today, // Dim future dates
            }
          )}
          style={{ backgroundColor: isCompleted(date) ? habitColor : undefined }}
        />
      ))}
    </div>
  );
};

export default HabitGrid;
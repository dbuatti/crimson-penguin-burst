import React from 'react';
import { cn } from '@/lib/utils';

interface HabitGridProps {
  completionDates: string[];
  habitColor: string;
  startDate?: Date; // Optional start date for the grid
  numDays?: number; // Number of days to display in the grid
}

const HabitGrid: React.FC<HabitGridProps> = ({
  completionDates,
  habitColor,
  startDate = new Date(new Date().setDate(new Date().getDate() - 90)), // Default to 90 days ago
  numDays = 91, // Default to 91 days (approx 13 weeks)
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Array.from({ length: numDays }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const isCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completionDates.includes(dateString);
  };

  return (
    <div className="grid grid-cols-13 gap-1 p-2 rounded-md bg-gray-800/50 dark:bg-gray-900/50 overflow-hidden">
      {dates.map((date, index) => (
        <div
          key={index}
          className={cn(
            "w-3 h-3 rounded-sm",
            isCompleted(date) ? `bg-[${habitColor}]` : "bg-gray-700 dark:bg-gray-800",
            {
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
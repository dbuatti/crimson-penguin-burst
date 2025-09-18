import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks } from 'date-fns';

interface CompactHabitGridProps {
  completionDates: string[];
  habitColor: string;
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Function to determine the number of weeks based on screen width
const calculateWeeksToShow = (width: number): number => {
  if (width < 640) { // Small screens (e.g., mobile portrait)
    return 4;
  } else if (width < 768) { // Medium screens (e.g., mobile landscape, small tablets)
    return 6;
  } else if (width < 1024) { // Large screens (e.g., tablets, small laptops)
    return 8;
  } else if (width < 1280) { // Larger screens
    return 10;
  } else { // Extra large screens
    return 12;
  }
};

const CompactHabitGrid: React.FC<CompactHabitGridProps> = ({
  completionDates,
  habitColor,
}) => {
  const [numWeeksToShow, setNumWeeksToShow] = useState(calculateWeeksToShow(window.innerWidth));

  const handleResize = useCallback(() => {
    setNumWeeksToShow(calculateWeeksToShow(window.innerWidth));
  }, []);

  useEffect(() => {
    // Set initial value on mount
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day

  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday of the current week
  // Calculate grid start date based on dynamic numWeeksToShow
  const gridStartDate = subWeeks(startOfCurrentWeek, numWeeksToShow - 1);

  const dates: Date[] = [];
  for (let i = 0; i < numWeeksToShow * 7; i++) {
    dates.push(addDays(gridStartDate, i));
  }

  return (
    <div className="p-2 rounded-lg bg-secondary border border-border overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-3 mb-2"> {/* Changed gap-2 to gap-3 and mb-1 to mb-2 */}
        {WEEK_DAYS.map((day, index) => (
          <div key={index} className="flex items-center justify-center text-xs font-medium text-muted-foreground w-5 h-5">
            {day}
          </div>
        ))}
      </div>

      {/* Habit completion grid */}
      <div className="grid grid-cols-7 gap-3"> {/* Changed gap-2 to gap-3 */}
        {dates.map((date, index) => {
          const dateFormatted = format(date, 'yyyy-MM-dd');
          const isCompleted = completionDates.includes(dateFormatted);
          const isFuture = date > today;

          return (
            <div
              key={index}
              className={cn(
                "w-5 h-5 rounded-sm flex items-center justify-center text-[10px] transition-colors duration-150",
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
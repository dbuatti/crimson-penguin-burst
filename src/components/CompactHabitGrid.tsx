import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { format, addDays, subDays } from 'date-fns';

interface CompactHabitGridProps {
  completionDates: string[];
  habitColor: string;
}

const WEEK_DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Short labels for days
const DOT_SIZE_PX = 16; // Each dot is 16px wide/high
const OUTER_PADDING_PX = 8; // p-2 on the parent div means 8px padding on each side

// Fixed number of rows for the dot grid to fill vertical space
const NUM_DOT_ROWS = 10; 

const CompactHabitGrid: React.FC<CompactHabitGridProps> = ({
  completionDates,
  habitColor,
}) => {
  const [numDotColumns, setNumDotColumns] = useState(0); // Number of columns for the dot grid
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container div

  const calculateGridDimensions = useCallback(() => {
    if (containerRef.current) {
      const currentContainerWidth = containerRef.current.clientWidth;
      
      // Calculate how many dots can fit horizontally
      // Subtract the outer padding from the effective width
      const effectiveWidthForDots = currentContainerWidth - (2 * OUTER_PADDING_PX);
      const calculatedColumns = Math.floor(effectiveWidthForDots / DOT_SIZE_PX);
      setNumDotColumns(Math.max(1, calculatedColumns)); // Ensure at least 1 column
    }
  }, []);

  useEffect(() => {
    calculateGridDimensions(); // Set initial value
    window.addEventListener('resize', calculateGridDimensions);
    return () => {
      window.removeEventListener('resize', calculateGridDimensions);
    };
  }, [calculateGridDimensions]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day

  const dates: Date[] = [];
  const totalDots = numDotColumns * NUM_DOT_ROWS;

  // Generate dates starting from the earliest date needed to fill the grid, up to today.
  // The last dot in the grid should be today.
  // So, the first dot is `today - (totalDots - 1) days`.
  const startDate = subDays(today, totalDots - 1);

  for (let i = 0; i < totalDots; i++) {
    dates.push(addDays(startDate, i));
  }

  // Generate repeating day labels based on the number of columns
  const repeatingDayLabels = Array.from({ length: numDotColumns }).map((_, colIndex) => 
    WEEK_DAYS_SHORT[colIndex % 7]
  );

  return (
    <div ref={containerRef} className="p-2 rounded-lg bg-secondary border border-border overflow-hidden">
      {/* Day labels - dynamic columns to match the dot grid */}
      <div
        className="grid mb-1"
        style={{
          gridTemplateColumns: `repeat(${numDotColumns}, 1rem)`,
          gridAutoRows: '1rem', // Each row height is 1rem
        }}
      >
        {repeatingDayLabels.map((day, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center text-xs font-medium text-muted-foreground" 
            style={{ width: `${DOT_SIZE_PX}px`, height: `${DOT_SIZE_PX}px` }} // Explicitly set size
          >
            {day}
          </div>
        ))}
      </div>

      {/* Habit completion grid - dynamic columns to fill width */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${numDotColumns}, 1rem)`,
          gridAutoRows: '1rem', // Each row height is 1rem
        }}
      >
        {dates.map((date, index) => {
          const dateFormatted = format(date, 'yyyy-MM-dd');
          const isCompleted = completionDates.includes(dateFormatted);
          const isFuture = date > today;

          return (
            <div
              key={index}
              className={cn(
                "w-4 h-4 rounded-sm flex items-center justify-center text-[10px] transition-colors duration-150",
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
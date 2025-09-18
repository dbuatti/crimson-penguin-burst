import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Circle } from 'lucide-react';
import CompactHabitGrid from './CompactHabitGrid';
import { format, subDays, isSameDay } from 'date-fns';

interface CompactHabitCardProps {
  habit: Habit;
  completionDates: string[];
}

const CompactHabitCard: React.FC<CompactHabitCardProps> = ({ habit, completionDates }) => {
  const IconComponent = React.useMemo(() => {
    const RequestedIcon = (LucideIcons as any)[habit.icon];
    if (RequestedIcon) {
      return RequestedIcon;
    }
    return Circle;
  }, [habit.icon]);

  // Calculate longest and current streaks
  const calculateStreaks = (dates: string[]): { longestStreak: number; currentStreak: number } => {
    if (dates.length === 0) return { longestStreak: 0, currentStreak: 0 };
    
    // Sort dates chronologically
    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let longestStreak = 0;
    let tempCurrentStreakForLongest = 0; // Renamed for clarity and to fix undeclared variable

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    // Convert sortedDates to Date objects for easier comparison and use a Set for quick lookup
    const dateObjects = sortedDates.map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    });
    const formattedDatesSet = new Set(dates); // For efficient lookup of completion dates

    // Calculate longest streak
    if (dateObjects.length > 0) {
      tempCurrentStreakForLongest = 1;
      longestStreak = 1;
    }
    
    for (let i = 1; i < dateObjects.length; i++) {
      const currentDate = dateObjects[i];
      const prevDate = dateObjects[i - 1];

      if (isNaN(currentDate.getTime()) || isNaN(prevDate.getTime())) {
        console.warn(`Invalid date found in completionDates for habit ${habit.name}: ${sortedDates[i-1]}, ${sortedDates[i]}`);
        tempCurrentStreakForLongest = 0;
        continue;
      }

      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) { // Consecutive day
        tempCurrentStreakForLongest++;
        longestStreak = Math.max(longestStreak, tempCurrentStreakForLongest);
      } else if (diffDays > 1) { // Gap, reset streak
        tempCurrentStreakForLongest = 1;
      }
      // If diffDays is 0, it's a duplicate entry for the same day, which doesn't break or extend a streak.
    }

    // Calculate current streak (from today backwards)
    let currentStreak = 0; // Ensure this is 'let'
    let checkDateForCurrentStreak = today; // Use a distinct variable name for clarity

    // Check if today is completed
    if (formattedDatesSet.has(format(today, 'yyyy-MM-dd'))) {
      currentStreak = 1;
      checkDateForCurrentStreak = subDays(today, 1);
    } else if (formattedDatesSet.has(format(subDays(today, 1), 'yyyy-MM-dd'))) {
      // If today is not completed, but yesterday was, the streak starts from yesterday
      currentStreak = 1;
      checkDateForCurrentStreak = subDays(today, 2);
    } else {
      // If neither today nor yesterday was completed, current streak is 0
      return { longestStreak, currentStreak: 0 };
    }

    while (true) {
      const formattedCheckDate = format(checkDateForCurrentStreak, 'yyyy-MM-dd');
      if (formattedDatesSet.has(formattedCheckDate)) {
        currentStreak++;
        checkDateForCurrentStreak = subDays(checkDateForCurrentStreak, 1);
      } else {
        break;
      }
    }

    return { longestStreak, currentStreak };
  };

  const { longestStreak, currentStreak } = calculateStreaks(completionDates);
  const totalCompletions = completionDates.length;

  // Debugging logs
  console.log(`--- Habit: ${habit.name} ---`);
  console.log(`  Raw Completion Dates:`, completionDates);
  console.log(`  Calculated Longest Streak:`, longestStreak);
  console.log(`  Calculated Current Streak:`, currentStreak);
  console.log(`  Total Completions:`, totalCompletions);
  console.log(`--------------------------`);

  return (
    <Card className="w-full bg-card text-foreground border border-border rounded-xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: habit.color }}>
              {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{habit.name}</h3>
              {habit.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{habit.description}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Streaks display */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Current:</span> {currentStreak} <span className="text-muted-foreground">(current streak)</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Longest:</span> {longestStreak} <span className="text-muted-foreground">(longest held streak)</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Completed:</span> {totalCompletions} <span className="text-muted-foreground">(tally)</span>
            </div>
          </div>
        </div>
        
        <CompactHabitGrid completionDates={completionDates} habitColor={habit.color} />
      </CardContent>
    </Card>
  );
};

export default CompactHabitCard;
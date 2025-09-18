import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Circle } from 'lucide-react';
import CompactHabitGrid from './CompactHabitGrid';
import { addDays, isSameDay, subDays, format } from 'date-fns';

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
    let currentStreak = 0;
    let tempCurrentStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Convert sortedDates to Date objects for easier comparison
    const dateObjects = sortedDates.map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Calculate longest streak
    if (dateObjects.length > 0) {
      longestStreak = 1;
      tempCurrentStreak = 1; // Use tempCurrentStreak for longest streak calculation
    }
    
    for (let i = 1; i < dateObjects.length; i++) {
      const currentDate = dateObjects[i];
      const prevDate = dateObjects[i - 1];

      if (isNaN(currentDate.getTime()) || isNaN(prevDate.getTime())) {
        console.warn(`Invalid date found in completionDates for habit ${habit.name}: ${sortedDates[i-1]}, ${sortedDates[i]}`);
        tempCurrentStreak = 0;
        continue;
      }

      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempCurrentStreak++;
        longestStreak = Math.max(longestStreak, tempCurrentStreak);
      } else if (diffDays > 1) {
        tempCurrentStreak = 1;
      }
    }

    // Calculate current streak
    // Start from today and go backwards
    let checkDate = today;
    let consecutiveDays = 0;
    let foundTodayOrYesterday = false;

    // Check if today is completed
    if (dates.includes(format(today, 'yyyy-MM-dd'))) {
      consecutiveDays = 1;
      checkDate = subDays(today, 1);
      foundTodayOrYesterday = true;
    } else if (dates.includes(format(subDays(today, 1), 'yyyy-MM-dd'))) {
      // If today is not completed, check if yesterday was
      consecutiveDays = 1;
      checkDate = subDays(today, 2);
      foundTodayOrYesterday = true;
    } else {
      // If neither today nor yesterday was completed, current streak is 0
      currentStreak = 0;
    }

    if (foundTodayOrYesterday) {
      while (true) {
        const formattedCheckDate = format(checkDate, 'yyyy-MM-dd');
        if (dates.includes(formattedCheckDate)) {
          consecutiveDays++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
      currentStreak = consecutiveDays;
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
              <span className="font-medium text-foreground">Streaks:</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Longest:</span> {longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Current:</span> {currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Completed:</span> {totalCompletions}
            </div>
          </div>
        </div>
        
        <CompactHabitGrid completionDates={completionDates} habitColor={habit.color} />
      </CardContent>
    </Card>
  );
};

export default CompactHabitCard;
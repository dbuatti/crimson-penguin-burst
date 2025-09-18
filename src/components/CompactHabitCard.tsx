import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react'; // Corrected import statement
import { Circle } from 'lucide-react';
import CompactHabitGrid from './CompactHabitGrid';

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

  // Calculate longest streak
  const calculateLongestStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    // Sort dates chronologically to correctly identify streaks
    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Round to handle potential floating point issues

      if (diffDays === 1) { // Check for exactly one day difference for a consecutive streak
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffDays > 1) { // If there's a gap, reset the current streak
        currentStreak = 1;
      }
      // If diffDays is 0, it's a duplicate entry for the same day, which doesn't break or extend a streak.
    }
    
    return longestStreak;
  };

  const longestStreak = calculateLongestStreak(completionDates);
  const totalCompletions = completionDates.length;

  // Debugging logs
  console.log(`Habit: ${habit.name}`);
  console.log(`  Completion Dates:`, completionDates);
  console.log(`  Calculated Longest Streak:`, longestStreak);

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
          <div className="text-xs text-muted-foreground">
            {completionDates.length} completions
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
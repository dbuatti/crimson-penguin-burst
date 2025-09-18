import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Circle } from 'lucide-react';
import HistoryHabitGrid from './HistoryHabitGrid';
import { isSameDay, parseISO, subDays, isBefore, format, addDays } from 'date-fns'; // Added format and addDays

interface HistoryHabitCardProps {
  habit: Habit;
  completionDates: string[]; // Array of 'yyyy-MM-dd' strings for this habit
}

const calculateStreaks = (completionDates: string[]) => {
  const sortedDates = completionDates.map(dateStr => parseISO(dateStr)).sort((a, b) => a.getTime() - b.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Filter out future dates for streak calculation
  const relevantDates = sortedDates.filter(date => !isBefore(today, date));

  if (relevantDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompleted: 0 };
  }

  const uniqueDates = Array.from(new Set(relevantDates.map(d => format(d, 'yyyy-MM-dd')))).map(d => parseISO(d)).sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    if (i === 0) {
      tempStreak = 1;
    } else {
      const previousDate = uniqueDates[i - 1];
      if (isSameDay(currentDate, addDays(previousDate, 1))) {
        tempStreak++;
      } else if (!isSameDay(currentDate, previousDate)) { // Only reset if not the same day (handle duplicates)
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Calculate current streak
  // Start from today and go backwards
  let checkDate = today;
  let foundToday = false;
  if (uniqueDates.some(d => isSameDay(d, today))) {
    foundToday = true;
    currentStreak = 1;
    checkDate = subDays(today, 1);
  } else {
    // If today is not completed, current streak is 0 unless yesterday was completed
    checkDate = subDays(today, 1);
  }

  while (uniqueDates.some(d => isSameDay(d, checkDate))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  // If today was not completed, and yesterday was, the current streak should be 0
  if (!foundToday && currentStreak > 0) {
    currentStreak = 0;
  }


  return {
    currentStreak,
    longestStreak,
    totalCompleted: completionDates.length,
  };
};


const HistoryHabitCard: React.FC<HistoryHabitCardProps> = ({ habit, completionDates }) => {
  const IconComponent = React.useMemo(() => {
    const RequestedIcon = (LucideIcons as any)[habit.icon];
    if (RequestedIcon) {
      return RequestedIcon;
    }
    console.warn(`Icon "${habit.icon}" not found, using default.`);
    return Circle; // Fallback icon
  }, [habit.icon]);

  const { currentStreak, longestStreak, totalCompleted } = calculateStreaks(completionDates);

  return (
    <Card className="w-full bg-card text-foreground border border-border rounded-xl shadow-md">
      <CardHeader className="flex flex-col p-5 pb-3">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-2 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: habit.color }}>
            {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{habit.name}</CardTitle>
            {habit.description && <p className="text-sm text-muted-foreground mt-0.5">{habit.description}</p>}
          </div>
        </div>
        <div className="flex text-sm text-muted-foreground space-x-4">
          <span>Streak: <span className="font-medium text-foreground">{currentStreak}</span></span>
          <span>Longest: <span className="font-medium text-foreground">{longestStreak}</span></span>
          <span>Completed: <span className="font-medium text-foreground">{totalCompleted}</span></span>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <HistoryHabitGrid completionDates={completionDates} habitColor={habit.color} />
      </CardContent>
    </Card>
  );
};

export default HistoryHabitCard;
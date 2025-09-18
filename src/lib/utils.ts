import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Habit, HabitLog } from '@/types/habit';
import { format, subDays, startOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateOverallStreaks = (allHabitLogs: HabitLog[], allHabits: Habit[]) => {
  let overallLongestStreak = 0;
  let overallCurrentLongestStreak = 0;
  let longestStreakHabitIcon: string | undefined = undefined;
  let longestStreakHabitColor: string | undefined = undefined;
  let currentLongestStreakHabitIcon: string | undefined = undefined;
  let currentLongestStreakHabitColor: string | undefined = undefined;

  const today = startOfDay(new Date());

  const activeHabitMap = new Map(allHabits.filter(h => !h.archived).map(h => [h.id, h]));

  // Group logs by habit
  const logsByHabit = allHabitLogs.reduce((acc, log) => {
    if (activeHabitMap.has(log.habit_id)) { // Only consider active habits
      if (!acc[log.habit_id]) {
        acc[log.habit_id] = [];
      }
      acc[log.habit_id].push(log.log_date);
    }
    return acc;
  }, {} as Record<string, string[]>);

  for (const habitId in logsByHabit) {
    const dates = logsByHabit[habitId];
    const habit = activeHabitMap.get(habitId);
    if (!habit || dates.length === 0) continue;

    // Ensure dates are unique and sorted
    const sortedDates = [...new Set(dates)].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const dateObjects = sortedDates.map(d => startOfDay(new Date(d)));

    // Calculate longest streak for this habit
    let currentHabitLongestStreak = 0;
    let tempStreak = 0;
    if (dateObjects.length > 0) {
      tempStreak = 1;
      currentHabitLongestStreak = 1;
    }
    for (let i = 1; i < dateObjects.length; i++) {
      const currentDate = dateObjects[i];
      const prevDate = dateObjects[i - 1];
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
      if (tempStreak > currentHabitLongestStreak) {
        currentHabitLongestStreak = tempStreak;
      }
    }
    if (currentHabitLongestStreak > overallLongestStreak) {
      overallLongestStreak = currentHabitLongestStreak;
      longestStreakHabitIcon = habit.icon;
      longestStreakHabitColor = habit.color;
    }


    // Calculate current streak for this habit
    let currentHabitCurrentStreak = 0;
    let checkDate = today;
    let consecutiveDays = 0;
    let foundTodayOrYesterday = false;

    const formattedToday = format(today, 'yyyy-MM-dd');
    const formattedYesterday = format(subDays(today, 1), 'yyyy-MM-dd');

    if (sortedDates.includes(formattedToday)) {
      consecutiveDays = 1;
      checkDate = subDays(today, 1);
      foundTodayOrYesterday = true;
    } else if (sortedDates.includes(formattedYesterday)) {
      consecutiveDays = 1;
      checkDate = subDays(today, 2);
      foundTodayOrYesterday = true;
    }

    if (foundTodayOrYesterday) {
      while (true) {
        const formattedCheckDate = format(checkDate, 'yyyy-MM-dd');
        if (sortedDates.includes(formattedCheckDate)) {
          consecutiveDays++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
      currentHabitCurrentStreak = consecutiveDays;
    }
    if (currentHabitCurrentStreak > overallCurrentLongestStreak) {
      overallCurrentLongestStreak = currentHabitCurrentStreak;
      currentLongestStreakHabitIcon = habit.icon;
      currentLongestStreakHabitColor = habit.color;
    }
  }

  return {
    longestStreakEver: overallLongestStreak,
    currentLongestStreak: overallCurrentLongestStreak,
    longestStreakHabitIcon,
    longestStreakHabitColor,
    currentLongestStreakHabitIcon,
    currentLongestStreakHabitColor,
  };
};
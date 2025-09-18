import { Habit, HabitId, HabitFormData, HabitLog } from "@/types/habit";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { format } from 'date-fns';

// Helper to get the current user's ID
const getUserId = (session: Session | null): string | null => {
  return session?.user?.id || null;
};

// Helper to map Supabase snake_case data to Habit camelCase interface
const mapSupabaseHabitToAppHabit = (data: any): Habit => ({
  id: data.id,
  user_id: data.user_id,
  name: data.name,
  description: data.description,
  icon: data.icon,
  color: data.color,
  goalType: data.goal_type,
  goalValue: data.goal_value,
  reminders: data.reminders,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  archived: data.archived,
});

export const getHabits = async (session: Session | null): Promise<Habit[]> => {
  const userId = getUserId(session);
  if (!userId) return [];

  try {
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (habitsError) {
      console.error("Failed to load habits from Supabase:", habitsError);
      return [];
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const habitsWithCompletion: Habit[] = [];

    for (const habitData of (habitsData || [])) {
      const mappedHabit = mapSupabaseHabitToAppHabit(habitData);

      // Fetch today's completion count from habit_logs
      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('id, is_completed, value_recorded')
        .eq('habit_id', mappedHabit.id)
        .eq('user_id', userId)
        .eq('log_date', today);

      if (logsError) {
        console.error(`Failed to load habit logs for habit ${mappedHabit.id}:`, logsError);
        // Continue without completion data if there's an error
        habitsWithCompletion.push(mappedHabit);
        continue;
      }

      let currentCompletionCount = 0;
      let isCompletedToday = false;

      if (mappedHabit.goalType === 'daily' && mappedHabit.goalValue === 1) {
        // For simple daily habits, check if any log exists for today
        isCompletedToday = (logsData || []).some(log => log.is_completed);
        currentCompletionCount = isCompletedToday ? 1 : 0;
      } else {
        // For goal-based habits, sum up value_recorded
        currentCompletionCount = (logsData || []).reduce((sum, log) => sum + (log.value_recorded || 0), 0);
        isCompletedToday = currentCompletionCount >= mappedHabit.goalValue;
      }

      habitsWithCompletion.push({
        ...mappedHabit,
        currentCompletionCount,
        isCompletedToday,
      });
    }

    return habitsWithCompletion;
  } catch (error) {
    console.error("Failed to load habits from Supabase:", error);
    return [];
  }
};

export const getAllHabitLogs = async (session: Session | null): Promise<HabitLog[]> => {
  const userId = getUserId(session);
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', true) // Only fetch completed logs for streak calculation
      .order('log_date', { ascending: true });

    if (error) {
      console.error("Failed to fetch all habit logs:", error);
      return [];
    }

    return (data || []).map(log => ({
      id: log.id,
      habit_id: log.habit_id,
      log_date: log.log_date,
      is_completed: log.is_completed,
      value_recorded: log.value_recorded,
      created_at: log.created_at,
    }));
  } catch (error) {
    console.error("Failed to fetch all habit logs:", error);
    return [];
  }
};

export const getHabitCompletionLogs = async (habitId: HabitId, session: Session | null): Promise<string[]> => {
  const userId = getUserId(session);
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('log_date')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (error) {
      console.error(`Failed to fetch completion logs for habit ${habitId}:`, error);
      return [];
    }

    // Return unique formatted dates
    return Array.from(new Set((data || []).map(log => log.log_date)));
  } catch (error) {
    console.error(`Failed to fetch completion logs for habit ${habitId}:`, error);
    return [];
  }
};

export const getDailyHabitCompletionSummary = async (session: Session | null, days: number = 30, endDate: Date = new Date()): Promise<{ completion_date: string; completion_percentage: number }[]> => {
  const userId = getUserId(session);
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .rpc('get_daily_habit_completion_summary', { p_user_id: userId, p_days: days, p_end_date: format(endDate, 'yyyy-MM-dd') });

    if (error) {
      console.error("Failed to fetch daily habit completion summary:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Failed to fetch daily habit completion summary:", error);
    return [];
  }
};

export const getWeeklyHabitCompletionSummary = async (session: Session | null, weeks: number = 16, endDate: Date = new Date()): Promise<{ week_start_date: string; completion_percentage: number }[]> => {
  const userId = getUserId(session);
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .rpc('get_weekly_habit_completion_summary', { p_user_id: userId, p_weeks: weeks, p_end_date: format(endDate, 'yyyy-MM-dd') });

    if (error) {
      console.error("Failed to fetch weekly habit completion summary:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Failed to fetch weekly habit completion summary:", error);
    return [];
  }
};


export const addHabit = async (newHabitData: HabitFormData, session: Session | null): Promise<Habit | null> => {
  const userId = getUserId(session);
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: userId,
        name: newHabitData.name,
        description: newHabitData.description,
        icon: newHabitData.icon,
        color: newHabitData.color,
        goal_type: newHabitData.goalType,
        goal_value: newHabitData.goalValue,
        reminders: newHabitData.reminders,
        archived: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add habit to Supabase:", error);
      return null;
    }
    return mapSupabaseHabitToAppHabit(data);
  } catch (error) {
    console.error("Failed to add habit to Supabase:", error);
    return null;
  }
};

export const updateHabit = async (updatedHabit: Habit, session: Session | null): Promise<Habit | null> => {
  const userId = getUserId(session);
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('habits')
      .update({
        name: updatedHabit.name,
        description: updatedHabit.description,
        icon: updatedHabit.icon,
        color: updatedHabit.color,
        goal_type: updatedHabit.goalType,
        goal_value: updatedHabit.goalValue,
        reminders: updatedHabit.reminders,
        archived: updatedHabit.archived,
      })
      .eq('id', updatedHabit.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update habit in Supabase:", error);
      return null;
    }
    return mapSupabaseHabitToAppHabit(data);
  } catch (error) {
    console.error("Failed to update habit in Supabase:", error);
    return null;
  }
};

export const deleteHabit = async (id: HabitId, session: Session | null): Promise<boolean> => {
  const userId = getUserId(session);
  if (!userId) return false;

  try {
    // Delete associated habit logs first
    const { error: deleteLogsError } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', id)
      .eq('user_id', userId);

    if (deleteLogsError) {
      console.error("Failed to delete habit logs from Supabase:", deleteLogsError);
      return false;
    }

    // Then delete the habit itself
    const { error: deleteHabitError } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteHabitError) {
      console.error("Failed to delete habit from Supabase:", deleteHabitError);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to delete habit from Supabase:", error);
    return false;
  }
};

export const getHabitById = async (id: HabitId, session: Session | null): Promise<Habit | undefined> => {
  const userId = getUserId(session);
  if (!userId) return undefined;

  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Failed to get habit by ID from Supabase:", error);
      return undefined;
    }
    return data ? mapSupabaseHabitToAppHabit(data) : undefined;
  } catch (error) {
    console.error("Failed to get habit by ID from Supabase:", error);
    return undefined;
  }
};

export const toggleHabitCompletion = async (habitId: HabitId, dateString: string, session: Session | null): Promise<boolean> => {
  const userId = getUserId(session);
  if (!userId) return false;

  try {
    // For simple daily habits (goalValue = 1), we toggle a single log entry
    const { data: existingLogs, error: fetchError } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('log_date', dateString)
      .eq('is_completed', true); // Only consider 'completed' logs for toggling

    if (fetchError) {
      console.error("Failed to fetch existing habit logs:", fetchError);
      return false;
    }

    if (existingLogs && existingLogs.length > 0) {
      // If a log exists, delete it (unmark as completed)
      const { error: deleteError } = await supabase
        .from('habit_logs')
        .delete()
        .eq('id', existingLogs[0].id); // Delete the first found log for that day

      if (deleteError) {
        console.error("Failed to delete habit log:", deleteError);
        return false;
      }
    } else {
      // If no log exists, insert one (mark as completed)
      const { error: insertError } = await supabase
        .from('habit_logs')
        .insert({
          user_id: userId,
          habit_id: habitId,
          log_date: dateString,
          is_completed: true,
          value_recorded: 1, // Default to 1 for simple toggle
        });

      if (insertError) {
        console.error("Failed to insert habit log:", insertError);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Failed to toggle habit completion:", error);
    return false;
  }
};

export const incrementHabitCompletion = async (habitId: HabitId, dateString: string, session: Session | null): Promise<boolean> => {
  const userId = getUserId(session);
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('habit_logs')
      .insert({
        user_id: userId,
        habit_id: habitId,
        log_date: dateString,
        is_completed: true, // Always true for incremented completions
        value_recorded: 1, // Increment by 1
      });

    if (error) {
      console.error("Failed to increment habit completion:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to increment habit completion:", error);
    return false;
  }
};

export const decrementHabitCompletion = async (habitId: HabitId, dateString: string, session: Session | null): Promise<boolean> => {
  const userId = getUserId(session);
  if (!userId) return false;

  try {
    // Find the most recent log entry for this habit on this date to delete
    const { data: existingLogs, error: fetchError } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('log_date', dateString)
      .order('created_at', { ascending: false }) // Get the most recent one
      .limit(1);

    if (fetchError) {
      console.error("Failed to fetch existing habit logs for decrement:", fetchError);
      return false;
    }

    if (existingLogs && existingLogs.length > 0) {
      const { error: deleteError } = await supabase
        .from('habit_logs')
        .delete()
        .eq('id', existingLogs[0].id);

      if (deleteError) {
        console.error("Failed to decrement habit completion:", deleteError);
        return false;
      }
      return true;
    } else {
      // No logs to decrement
      return false;
    }
  } catch (error) {
    console.error("Failed to decrement habit completion:", error);
    return false;
  }
};


// The local storage functions are no longer needed for core habit management
// but export/import will still use them for local file operations.
// For now, I'll keep the local storage functions for export/import,
// but they won't be used for the main app logic.
const HABITS_STORAGE_KEY = "habitkit_habits";

export const getLocalHabits = (): Habit[] => {
  try {
    const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    return storedHabits ? JSON.parse(storedHabits) : [];
  } catch (error) {
    console.error("Failed to load habits from local storage:", error);
    return [];
  }
};

export const saveLocalHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Failed to save habits to local storage:", error);
  }
};
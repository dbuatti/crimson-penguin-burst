import { Habit, HabitId } from "@/types/habit";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Helper to get the current user's ID
const getUserId = (session: Session | null): string | null => {
  return session?.user?.id || null;
};

export const getHabits = async (session: Session | null): Promise<Habit[]> => {
  const userId = getUserId(session);
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Failed to load habits from Supabase:", error);
      return [];
    }
    return data as Habit[];
  } catch (error) {
    console.error("Failed to load habits from Supabase:", error);
    return [];
  }
};

export const addHabit = async (newHabit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completionDates' | 'archived'>, session: Session | null): Promise<Habit | null> => {
  const userId = getUserId(session);
  if (!userId) return null;

  try {
    const habitToInsert = {
      ...newHabit,
      user_id: userId,
      completion_dates: [], // Ensure completion_dates is an array
      archived: false,
    };

    const { data, error } = await supabase
      .from('habits')
      .insert(habitToInsert)
      .select()
      .single();

    if (error) {
      console.error("Failed to add habit to Supabase:", error);
      return null;
    }
    return data as Habit;
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
        completion_dates: updatedHabit.completionDates,
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
    return data as Habit;
  } catch (error) {
    console.error("Failed to update habit in Supabase:", error);
    return null;
  }
};

export const deleteHabit = async (id: HabitId, session: Session | null): Promise<boolean> => {
  const userId = getUserId(session);
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error("Failed to delete habit from Supabase:", error);
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
    return data as Habit;
  } catch (error) {
    console.error("Failed to get habit by ID from Supabase:", error);
    return undefined;
  }
};

export const toggleHabitCompletion = async (habitId: HabitId, date: string, session: Session | null): Promise<boolean> => {
  const userId = getUserId(session);
  if (!userId) return false;

  try {
    const { data: currentHabit, error: fetchError } = await supabase
      .from('habits')
      .select('completion_dates')
      .eq('id', habitId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentHabit) {
      console.error("Failed to fetch habit for toggling completion:", fetchError);
      return false;
    }

    const currentCompletionDates: string[] = currentHabit.completion_dates || [];
    const dateIndex = currentCompletionDates.indexOf(date);
    let newCompletionDates: string[];

    if (dateIndex !== -1) {
      newCompletionDates = currentCompletionDates.filter((d) => d !== date); // Remove if already present
    } else {
      newCompletionDates = [...currentCompletionDates, date]; // Add if not present
    }

    const { error: updateError } = await supabase
      .from('habits')
      .update({ completion_dates: newCompletionDates })
      .eq('id', habitId)
      .eq('user_id', userId);

    if (updateError) {
      console.error("Failed to toggle habit completion in Supabase:", updateError);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to toggle habit completion in Supabase:", error);
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
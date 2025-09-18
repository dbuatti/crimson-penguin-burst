import React from 'react'; // Required for JSX in toast options
import { Check, X, Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { showError, showSuccess } from '@/utils/toast'; // Import from project's utility
import { Habit, HabitId, HabitFormData } from "@/types/habit";
import { format } from 'date-fns'; // Import format from date-fns

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
  completionDates: data.completion_dates,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  archived: data.archived,
});

// Helper function to create Lucide icons with consistent styling
const createLucideIcon = (IconComponent: React.ElementType) => {
  return <IconComponent className="h-4 w-4" />;
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
    return (data || []).map(mapSupabaseHabitToAppHabit);
  } catch (error) {
    console.error("Failed to load habits from Supabase:", error);
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
        completion_dates: [],
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
    return data ? mapSupabaseHabitToAppHabit(data) : undefined;
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

export const exportHabits = async (session: Session | null) => {
  const userId = getUserId(session);
  if (!userId) {
    showError('You must be logged in to export habits.', { icon: createLucideIcon(X) });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching habits for export:", error);
      showError('Failed to export habits.', { icon: createLucideIcon(X) });
      return;
    }

    const habitsToExport = (data || []).map(mapSupabaseHabitToAppHabit);
    const jsonString = JSON.stringify(habitsToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitkit_habits_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Habits exported successfully!', { icon: createLucideIcon(Check) });
  } catch (error) {
    console.error("Error during habit export:", error);
    showError('Failed to export habits.', { icon: createLucideIcon(X) });
  }
};

export const importHabits = async (file: File, session: Session | null) => {
  const userId = getUserId(session);
  if (!userId) {
    showError('You must be logged in to import habits.', { icon: createLucideIcon(X) });
    return;
  }

  try {
    const fileContent = await file.text();
    const importedHabits: Habit[] = JSON.parse(fileContent);

    if (!Array.isArray(importedHabits)) {
      throw new Error("Invalid file format: Expected an array of habits.");
    }

    let successCount = 0;
    let failCount = 0;

    for (const habit of importedHabits) {
      // Ensure imported habits are associated with the current user
      const habitToInsert = {
        ...habit,
        user_id: userId,
        id: undefined, // Let Supabase generate a new ID
        created_at: undefined, // Let Supabase set creation timestamp
        updated_at: undefined, // Let Supabase set update timestamp
      };

      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: habitToInsert.user_id,
          name: habitToInsert.name,
          description: habitToInsert.description,
          icon: habitToInsert.icon,
          color: habitToInsert.color,
          goal_type: habitToInsert.goalType,
          goal_value: habitToInsert.goalValue,
          reminders: habitToInsert.reminders,
          completion_dates: habitToInsert.completionDates,
          archived: habitToInsert.archived,
        });

      if (error) {
        console.error(`Failed to import habit "${habit.name}":`, error);
        failCount++;
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      showSuccess(`Successfully imported ${successCount} habit(s)!`, { icon: createLucideIcon(Check) });
    }
    if (failCount > 0) {
      showError(`Failed to import ${failCount} habit(s). Check console for details.`, { icon: createLucideIcon(X) });
    }
    if (successCount === 0 && failCount === 0) {
      showError('No habits found in the imported file.', { icon: createLucideIcon(X) });
    }
  } catch (error: any) {
    console.error("Error during habit import:", error);
    showError(`Failed to import habits: ${error.message || 'Invalid file format.'}`, { icon: createLucideIcon(X) });
  }
};
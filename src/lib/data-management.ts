import { getHabits, addHabit, updateHabit, getHabitById } from './habit-storage'; // Use Supabase functions for data operations
import { Habit } from '@/types/habit';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export const exportHabits = async (session: Session | null): Promise<void> => {
  if (!session) {
    toast.error('You must be logged in to export habits.', { icon: <X className="h-4 w-4" /> });
    return;
  }
  const habits = await getHabits(session); // Fetch from Supabase for export
  const dataStr = JSON.stringify(habits, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habitkit_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importHabits = async (file: File, session: Session | null): Promise<void> => {
  if (!session) {
    toast.error('You must be logged in to import habits.', { icon: <X className="h-4 w-4" /> });
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const importedData: Habit[] = JSON.parse(result);

          // Basic validation to ensure it looks like habit data
          if (!Array.isArray(importedData) || !importedData.every(item => 'id' in item && 'name' in item && 'color' in item)) {
            throw new Error('Invalid habit data format.');
          }

          // For each imported habit, try to add or update it in Supabase
          for (const importedHabit of importedData) {
            // Check if a habit with the same ID already exists for the user
            const existingHabit = await getHabitById(importedHabit.id, session);
            if (existingHabit) {
              // Update existing habit
              await updateHabit({ ...importedHabit, user_id: session.user.id }, session);
            } else {
              // Add new habit
              await addHabit({
                name: importedHabit.name,
                description: importedHabit.description || '',
                icon: importedHabit.icon,
                color: importedHabit.color,
                goalType: importedHabit.goalType,
                goalValue: importedHabit.goalValue,
                reminders: importedHabit.reminders,
              }, session);
            }
          }
          resolve();
        } else {
          throw new Error('File read failed.');
        }
      } catch (error) {
        console.error('Error importing habits:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
    reader.readAsText(file);
  });
};
import { getHabits, saveHabits, Habit } from './habit-storage';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export const exportHabits = (): void => {
  const habits = getHabits();
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

export const importHabits = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const importedData: Habit[] = JSON.parse(result);

          // Basic validation to ensure it looks like habit data
          if (!Array.isArray(importedData) || !importedData.every(item => 'id' in item && 'name' in item && 'color' in item)) {
            throw new Error('Invalid habit data format.');
          }

          saveHabits(importedData);
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
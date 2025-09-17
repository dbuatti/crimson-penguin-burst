export type HabitId = string;

export interface Habit {
  id: HabitId;
  name: string;
  description?: string;
  icon: string; // Storing icon name (e.g., 'dumbbell', 'code')
  color: string; // Storing hex color string
  goalType: 'daily' | 'weekly' | 'monthly';
  goalValue: number; // e.g., 1 for daily, 3 for 3 times a week
  reminders: string[]; // Array of time strings (e.g., '09:00', '18:30')
  completionDates: string[]; // Array of 'YYYY-MM-DD' strings
  createdAt: string; // ISO date string
  archived: boolean;
}

export interface HabitFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  goalType: 'daily' | 'weekly' | 'monthly';
  goalValue: number;
  reminders: string[];
}
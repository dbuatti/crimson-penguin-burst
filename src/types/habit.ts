export type HabitId = string;

export interface Habit {
  id: HabitId;
  user_id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  goalType: 'daily' | 'weekly' | 'monthly';
  goalValue: number;
  reminders: string[];
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  // New fields for UI display, derived from habit_logs
  currentCompletionCount?: number;
  isCompletedToday?: boolean;
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
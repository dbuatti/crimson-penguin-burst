import { Habit, HabitId } from "@/types/habit";

const HABITS_STORAGE_KEY = "habitkit_habits";

export const getHabits = (): Habit[] => {
  try {
    const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    return storedHabits ? JSON.parse(storedHabits) : [];
  } catch (error) {
    console.error("Failed to load habits from local storage:", error);
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Failed to save habits to local storage:", error);
  }
};

export const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'completionDates' | 'archived'>): Habit => {
  const habits = getHabits();
  const habitWithDefaults: Habit = {
    id: crypto.randomUUID(), // Generate a unique ID
    createdAt: new Date().toISOString(),
    completionDates: [],
    archived: false,
    ...newHabit,
  };
  habits.push(habitWithDefaults);
  saveHabits(habits);
  return habitWithDefaults;
};

export const updateHabit = (updatedHabit: Habit): void => {
  const habits = getHabits();
  const index = habits.findIndex((h) => h.id === updatedHabit.id);
  if (index !== -1) {
    habits[index] = updatedHabit;
    saveHabits(habits);
  }
};

export const deleteHabit = (id: HabitId): void => {
  const habits = getHabits();
  const filteredHabits = habits.filter((h) => h.id !== id);
  saveHabits(filteredHabits);
};

export const getHabitById = (id: HabitId): Habit | undefined => {
  const habits = getHabits();
  return habits.find((h) => h.id === id);
};

export const toggleHabitCompletion = (habitId: HabitId, date: string): void => {
  const habits = getHabits();
  const habit = habits.find((h) => h.id === habitId);

  if (habit) {
    const dateIndex = habit.completionDates.indexOf(date);
    if (dateIndex !== -1) {
      habit.completionDates.splice(dateIndex, 1); // Remove if already present
    } else {
      habit.completionDates.push(date); // Add if not present
    }
    saveHabits(habits);
  }
};
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHabitById, updateHabit } from '@/lib/habit-storage';
import { HabitFormData, Habit } from '@/types/habit';
import HabitForm from '@/components/HabitForm';
import { showSuccess, showError } from '@/utils/toast';
import PageHeader from '@/components/PageHeader'; // Import the new PageHeader
import { useSession } from '@/components/SessionContextProvider';

const EditHabit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<HabitFormData | undefined>(undefined);
  const [habit, setHabit] = useState<Habit | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading: sessionLoading } = useSession();

  const fetchHabit = useCallback(async () => {
    if (id && session) {
      const fetchedHabit = await getHabitById(id, session);
      if (fetchedHabit) {
        setHabit(fetchedHabit);
        setInitialData({
          name: fetchedHabit.name,
          description: fetchedHabit.description || '',
          icon: fetchedHabit.icon,
          color: fetchedHabit.color,
          goalType: fetchedHabit.goalType,
          goalValue: fetchedHabit.goalValue,
          reminders: fetchedHabit.reminders,
        });
      } else {
        showError('Habit not found.');
        navigate('/');
      }
    }
    setIsLoading(false);
  }, [id, navigate, session]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchHabit();
    }
  }, [fetchHabit, sessionLoading]);

  const handleSubmit = async (data: HabitFormData) => {
    if (!habit) return;

    setIsSubmitting(true);
    try {
      const updatedHabit: Habit = {
        ...habit,
        ...data,
      };
      const result = await updateHabit(updatedHabit, session);
      if (result) {
        showSuccess('Habit updated successfully!');
        navigate('/');
      } else {
        showError('Failed to update habit.');
      }
    } catch (error) {
      console.error('Failed to update habit:', error);
      showError('Failed to update habit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        Loading habit...
      </div>
    );
  }

  if (!initialData) {
    return null; // Should redirect by now if habit not found
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <PageHeader title="Edit Habit" backLink="/" /> {/* Use PageHeader */}
      <div className="w-full max-w-md">
        <HabitForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default EditHabit;
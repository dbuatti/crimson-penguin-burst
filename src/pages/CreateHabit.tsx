import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addHabit } from '@/lib/habit-storage';
import { HabitFormData } from '@/types/habit';
import HabitForm from '@/components/HabitForm';
import { showSuccess, showError } from '@/utils/toast';
import PageHeader from '@/components/PageHeader';
import { useSession } from '@/components/SessionContextProvider';

const CreateHabit: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();

  const handleSubmit = async (data: HabitFormData) => {
    setIsSubmitting(true);
    try {
      const result = await addHabit(data, session);
      if (result) {
        showSuccess('Habit created successfully!');
        navigate('/');
      } else {
        showError('Failed to create habit.');
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
      showError('Failed to create habit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <PageHeader title="Create New Habit" backLink="/" />
      <div className="w-full max-w-4xl"> {/* Changed max-w-2xl to max-w-4xl */}
        <HabitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateHabit;
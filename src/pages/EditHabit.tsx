import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHabitById, updateHabit } from '@/lib/habit-storage';
import { HabitFormData, Habit } from '@/types/habit';
import HabitForm from '@/components/HabitForm';
import { toast } from 'sonner';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditHabit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<HabitFormData | undefined>(undefined);
  const [habit, setHabit] = useState<Habit | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedHabit = getHabitById(id);
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
        toast.error('Habit not found.', {
          icon: <X className="h-4 w-4" />,
        });
        navigate('/');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);

  const handleSubmit = (data: HabitFormData) => {
    if (!habit) return;

    setIsSubmitting(true);
    try {
      const updatedHabit: Habit = {
        ...habit,
        ...data,
      };
      updateHabit(updatedHabit);
      toast.success('Habit updated successfully!', {
        icon: <Check className="h-4 w-4" />,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to update habit:', error);
      toast.error('Failed to update habit.', {
        icon: <X className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        Loading habit...
      </div>
    );
  }

  if (!initialData) {
    return null; // Should redirect by now if habit not found
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Habit</h1>
        <div className="w-6" /> {/* Placeholder for alignment */}
      </div>
      <div className="w-full max-w-md">
        <HabitForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default EditHabit;
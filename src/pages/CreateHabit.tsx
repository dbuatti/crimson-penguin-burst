import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addHabit } from '@/lib/habit-storage';
import { HabitFormData } from '@/types/habit';
import HabitForm from '@/components/HabitForm';
import { toast } from 'sonner';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateHabit: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: HabitFormData) => {
    setIsSubmitting(true);
    try {
      addHabit(data);
      toast.success('Habit created successfully!', {
        icon: <Check className="h-4 w-4" />,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create habit:', error);
      toast.error('Failed to create habit.', {
        icon: <X className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Habit</h1>
        <div className="w-6" /> {/* Placeholder for alignment */}
      </div>
      <div className="w-full max-w-md">
        <HabitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateHabit;
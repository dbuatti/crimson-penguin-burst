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
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
          <X className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Create New Habit</h1>
        <div className="w-5" /> {/* Placeholder for alignment */}
      </div>
      <div className="w-full max-w-md">
        <HabitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateHabit;
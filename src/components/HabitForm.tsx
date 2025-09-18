import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import *s z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import { HabitFormData } from '@/types/habit';
import { PlusCircle, MinusCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Habit name is required.' }),
  description: z.string().optional(),
  icon: z.string().min(1, { message: 'Icon is required.' }),
  color: z.string().min(1, { message: 'Color is required.' }),
  goalType: z.enum(['daily', 'weekly', 'monthly']),
  goalValue: z.coerce.number().min(1, { message: 'Goal value must be at least 1.' }),
  reminders: z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")).optional(),
});

interface HabitFormProps {
  initialData?: HabitFormData;
  onSubmit: (data: HabitFormData) => void;
  isSubmitting: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      icon: 'Dumbbell',
      color: '#FF6B6B',
      goalType: 'daily',
      goalValue: 1,
      reminders: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const reminders = form.watch('reminders') || [];

  const addReminder = () => {
    form.setValue('reminders', [...reminders, ''], { shouldValidate: true });
  };

  const updateReminder = (index: number, value: string) => {
    const newReminders = [...reminders];
    newReminders[index] = value;
    form.setValue('reminders', newReminders, { shouldValidate: true });
  };

  const removeReminder = (index: number) => {
    const newReminders = reminders.filter((_, i) => i !== index);
    form.setValue('reminders', newReminders, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-card border border-border rounded-xl shadow-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Drink Water" {...field} className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-colors duration-200 rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Drink 8 glasses of water daily" {...field} className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-colors duration-200 rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Icon</FormLabel>
              <FormControl>
                <IconPicker selectedIcon={field.value} onSelectIcon={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Color</FormLabel>
              <FormControl>
                <ColorPicker selectedColor={field.value} onSelectColor={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="goalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Goal Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground focus:ring-ring transition-colors duration-200 rounded-lg">
                      <SelectValue placeholder="Select goal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-foreground shadow-lg rounded-lg">
                    <SelectItem value="daily" className="hover:bg-accent hover:text-accent-foreground rounded-md">Daily</SelectItem>
                    <SelectItem value="weekly" className="hover:bg-accent hover:text-accent-foreground rounded-md">Weekly</SelectItem>
                    <SelectItem value="monthly" className="hover:bg-accent hover:text-accent-foreground rounded-md">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goalValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Goal Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-input border-border text-foreground focus-visible:ring-ring transition-colors duration-200 rounded-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel className="text-foreground">Reminders</FormLabel>
          <div className="space-y-3">
            {reminders.map((reminderTime, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => updateReminder(index, e.target.value)}
                  className="bg-input border-border text-foreground focus-visible:ring-ring transition-colors duration-200 rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeReminder(index)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 rounded-lg"
                >
                  <MinusCircle className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addReminder} className="w-full bg-secondary border-border text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200 rounded-lg">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Reminder
            </Button>
          </div>
          <FormMessage>{form.formState.errors.reminders?.message}</FormMessage>
        </FormItem>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-lg">
          {isSubmitting ? 'Saving...' : 'Save Habit'}
        </Button>
      </form>
    </Form>
  );
};

export default HabitForm;
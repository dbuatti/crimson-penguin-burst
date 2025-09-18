import React from 'react';
import { Habit } from '@/types/habit';
import { Check, Minus, Plus, Circle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Using shadcn Progress for the circle effect
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, CalendarDays, Archive, Share2, Trash2 } from 'lucide-react';

interface HabitListItemProps {
  habit: Habit;
  onHabitUpdate: () => void;
  onArchiveHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onToggleCompletion: (habitId: string, dateString: string) => Promise<boolean>;
  onIncrementCompletion: (habitId: string, dateString: string) => Promise<boolean>;
  onDecrementCompletion: (habitId: string, dateString: string) => Promise<boolean>;
}

const HabitListItem: React.FC<HabitListItemProps> = ({
  habit,
  onHabitUpdate,
  onArchiveHabit,
  onDeleteHabit,
  onToggleCompletion,
  onIncrementCompletion,
  onDecrementCompletion,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const IconComponent = React.useMemo(() => {
    const RequestedIcon = (LucideIcons as any)[habit.icon];
    if (RequestedIcon) {
      return RequestedIcon;
    }
    return Circle; // Fallback icon
  }, [habit.icon]);

  const handleToggle = async () => {
    const success = await onToggleCompletion(habit.id, today);
    if (success) onHabitUpdate();
  };

  const handleIncrement = async () => {
    const success = await onIncrementCompletion(habit.id, today);
    if (success) onHabitUpdate();
  };

  const handleDecrement = async () => {
    const success = await onDecrementCompletion(habit.id, today);
    if (success) onHabitUpdate();
  };

  const isSimpleDailyHabit = habit.goalType === 'daily' && habit.goalValue === 1;
  const currentCompletion = habit.currentCompletionCount || 0;
  const goal = habit.goalValue;
  const progressPercentage = goal > 0 ? Math.min(100, (currentCompletion / goal) * 100) : 0;

  const getGoalText = () => {
    if (habit.description) return habit.description;
    if (habit.goalType === 'daily' && habit.goalValue === 1) return 'Goal: 1';
    if (habit.goalType === 'daily') return `Goal: ${habit.goalValue}`;
    if (habit.goalType === 'weekly') return `Weekly Goal: ${habit.goalValue}`;
    if (habit.goalType === 'monthly') return `Monthly Goal: ${habit.goalValue}`;
    return '';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: habit.color }}>
          {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">{habit.name}</h3>
          <p className="text-sm text-muted-foreground">{getGoalText()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isSimpleDailyHabit ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className={cn(
              "h-9 w-9 rounded-full border-2 transition-colors duration-200",
              habit.isCompletedToday
                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                : "bg-secondary border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-label={habit.isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {habit.isCompletedToday && <Check className="h-5 w-5" />}
          </Button>
        ) : (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              disabled={currentCompletion <= 0}
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              aria-label="Decrement completion"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="relative h-9 w-9 flex items-center justify-center">
              <Progress
                value={progressPercentage}
                className="absolute h-full w-full rounded-full"
                indicatorClassName="rounded-full"
                style={{
                  '--progress-background': habit.color,
                  '--progress-indicator-color': habit.color,
                } as React.CSSProperties}
              />
              <span className="relative z-10 text-sm font-semibold text-foreground">
                {currentCompletion}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              aria-label="Increment completion"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border text-foreground shadow-lg rounded-lg p-1">
            <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
              <Link to={`/edit-habit/${habit.id}`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
              <Link to={`/habit-calendar/${habit.id}`} className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" /> Calendar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchiveHabit(habit.id)} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
              <Archive className="mr-2 h-4 w-4" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteHabit(habit.id)} className="flex items-center text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HabitListItem;
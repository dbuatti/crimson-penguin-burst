import React from 'react';
import { Habit } from '@/types/habit';
import { Check, Circle } from 'lucide-react'; // Only Check and Circle are needed for indicators
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  // Removed onIncrementCompletion and onDecrementCompletion as per design
}

const HabitListItem: React.FC<HabitListItemProps> = ({
  habit,
  onHabitUpdate,
  onArchiveHabit,
  onDeleteHabit,
  onToggleCompletion,
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

  const isSimpleDailyHabit = habit.goalType === 'daily' && habit.goalValue === 1;
  const currentCompletion = habit.currentCompletionCount || 0;
  const goal = habit.goalValue;

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
                ? "bg-[#22C55E] border-[#22C55E] text-white hover:bg-[#1EAD55] hover:border-[#1EAD55]" // Specific green for completed
                : "bg-secondary border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-label={habit.isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {habit.isCompletedToday && <Check className="h-5 w-5" />}
          </Button>
        ) : (
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
            style={{ backgroundColor: habit.color }}
          >
            {currentCompletion}
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
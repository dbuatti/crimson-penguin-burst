import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Edit, CalendarDays, Archive, Share2, Trash2, MoreVertical, Circle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import HabitGrid from './HabitGrid';
import { toggleHabitCompletion } from '@/lib/habit-storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HabitCardProps {
  habit: Habit;
  onHabitUpdate: () => void;
  onArchiveHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onHabitUpdate, onArchiveHabit, onDeleteHabit }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completionDates.includes(today);

  const handleToggleCompletion = (dateString: string) => {
    toggleHabitCompletion(habit.id, dateString);
    onHabitUpdate(); // Notify parent to re-fetch habits
  };

  const IconComponent = React.useMemo(() => {
    const RequestedIcon = (LucideIcons as any)[habit.icon];
    if (RequestedIcon) {
      return RequestedIcon;
    }
    console.warn(`Icon "${habit.icon}" not found, using default.`);
    return Circle; // Fallback icon
  }, [habit.icon]);

  return (
    <Card className="w-full bg-card text-foreground border-border rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full flex items-center justify-center" style={{ backgroundColor: habit.color }}>
            {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{habit.name}</CardTitle>
            {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`habit-${habit.id}`}
            checked={isCompletedToday}
            onCheckedChange={() => handleToggleCompletion(today)} // Correctly pass today's date
            className="h-6 w-6 rounded-full border-2 transition-colors duration-200
                       data-[state=unchecked]:bg-secondary data-[state=unchecked]:border-border 
                       data-[state=checked]:text-primary-foreground"
            style={{ 
              backgroundColor: isCompletedToday ? habit.color : undefined, 
              borderColor: isCompletedToday ? habit.color : undefined 
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border text-foreground shadow-lg">
              <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Link to={`/edit-habit/${habit.id}`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Link to={`/habit-calendar/${habit.id}`} className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" /> Calendar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchiveHabit(habit.id)} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Archive className="mr-2 h-4 w-4" /> {habit.archived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteHabit(habit.id)} className="flex items-center text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-150">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <HabitGrid 
          completionDates={habit.completionDates} 
          habitColor={habit.color} 
          onToggleCompletion={handleToggleCompletion} // Pass the handler to HabitGrid
        />
      </CardContent>
    </Card>
  );
};

export default HabitCard;
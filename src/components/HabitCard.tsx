import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Edit, CalendarDays, Archive, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HabitGrid from './HabitGrid';
import { toggleHabitCompletion } from '@/lib/habit-storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onHabitUpdate: () => void;
  onArchiveHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onHabitUpdate, onArchiveHabit, onDeleteHabit }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completionDates.includes(today);

  const handleToggleCompletion = () => {
    toggleHabitCompletion(habit.id, today);
    onHabitUpdate(); // Notify parent to re-fetch habits
  };

  const IconComponent = React.useMemo(() => {
    try {
      // Dynamically import icon from lucide-react
      const { [habit.icon]: LucideIcon } = require('lucide-react');
      return LucideIcon;
    } catch (e) {
      console.warn(`Icon "${habit.icon}" not found, using default.`);
      const { Circle } = require('lucide-react'); // Fallback icon
      return Circle;
    }
  }, [habit.icon]);

  return (
    <Card className="w-full bg-gray-800/50 dark:bg-gray-900/50 text-white border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: habit.color }}>
            {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
            {habit.description && <p className="text-sm text-gray-400">{habit.description}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`habit-${habit.id}`}
            checked={isCompletedToday}
            onCheckedChange={handleToggleCompletion}
            className="h-6 w-6 rounded-full border-2 border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            style={{ backgroundColor: isCompletedToday ? habit.color : undefined, borderColor: isCompletedToday ? habit.color : undefined }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem asChild>
                <Link to={`/edit-habit/${habit.id}`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild> {/* Added asChild for Link */}
                <Link to={`/habit-calendar/${habit.id}`} className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" /> Calendar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchiveHabit(habit.id)} className="flex items-center">
                <Archive className="mr-2 h-4 w-4" /> {habit.archived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteHabit(habit.id)} className="flex items-center text-red-400 hover:text-red-300">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <HabitGrid completionDates={habit.completionDates} habitColor={habit.color} />
      </CardContent>
    </Card>
  );
};

export default HabitCard;
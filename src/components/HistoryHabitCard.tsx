import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Circle } from 'lucide-react';
import HistoryHabitGrid from './HistoryHabitGrid';

interface HistoryHabitCardProps {
  habit: Habit;
  completionDates: string[]; // Array of 'yyyy-MM-dd' strings for this habit
}

const HistoryHabitCard: React.FC<HistoryHabitCardProps> = ({ habit, completionDates }) => {
  const IconComponent = React.useMemo(() => {
    const RequestedIcon = (LucideIcons as any)[habit.icon];
    if (RequestedIcon) {
      return RequestedIcon;
    }
    console.warn(`Icon "${habit.icon}" not found, using default.`);
    return Circle; // Fallback icon
  }, [habit.icon]);

  return (
    <Card className="w-full bg-card text-foreground border border-border rounded-xl shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-5 pb-3">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: habit.color }}>
            {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{habit.name}</CardTitle>
            {habit.description && <p className="text-sm text-muted-foreground mt-0.5">{habit.description}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <HistoryHabitGrid completionDates={completionDates} habitColor={habit.color} />
      </CardContent>
    </Card>
  );
};

export default HistoryHabitCard;
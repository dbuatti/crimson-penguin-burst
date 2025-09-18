import React from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Circle } from 'lucide-react';
import CompactHabitGrid from './CompactHabitGrid';

interface CompactHabitCardProps {
  habit: Habit;
  completionDates: string[];
}

const CompactHabitCard: React.FC<CompactHabitCardProps> = ({ habit, completionDates }) => {
  const IconComponent = React.useMemo(() => {
    const RequestedIcon = (LucideIcons as any)[habit.icon];
    if (RequestedIcon) {
      return RequestedIcon;
    }
    return Circle;
  }, [habit.icon]);

  return (
    <Card className="w-full bg-card text-foreground border border-border rounded-xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: habit.color }}>
              {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{habit.name}</h3>
              {habit.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{habit.description}</p>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {completionDates.length} completions
          </div>
        </div>
        <CompactHabitGrid completionDates={completionDates} habitColor={habit.color} />
      </CardContent>
    </Card>
  );
};

export default CompactHabitCard;
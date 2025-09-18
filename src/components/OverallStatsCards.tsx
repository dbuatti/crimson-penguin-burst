import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, TrendingUp, Carrot } from 'lucide-react'; // Using Carrot for current streak as in image
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

interface OverallStatsCardsProps {
  totalCompletions: number;
  longestStreakEver: number;
  currentLongestStreak: number;
  longestStreakIcon?: string;
  longestStreakColor?: string;
  currentLongestStreakIcon?: string;
  currentLongestStreakColor?: string;
}

const OverallStatsCards: React.FC<OverallStatsCardsProps> = ({
  totalCompletions,
  longestStreakEver,
  currentLongestStreak,
  longestStreakIcon,
  longestStreakColor,
  currentLongestStreakIcon,
  currentLongestStreakColor,
}) => {
  const LongestStreakIconComponent = longestStreakIcon ? (LucideIcons as any)[longestStreakIcon] : TrendingUp;
  const CurrentLongestStreakIconComponent = currentLongestStreakIcon ? (LucideIcons as any)[currentLongestStreakIcon] : Carrot;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
        <CheckCircle className="h-6 w-6 text-primary mb-2" />
        <div className="text-xl font-bold text-foreground">{totalCompletions}</div>
        <div className="text-xs text-muted-foreground">Completed in total</div>
      </Card>
      <Card className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
        <LongestStreakIconComponent
          className="h-6 w-6 mb-2"
          style={{ color: longestStreakColor || 'hsl(var(--primary))' }}
        />
        <div className="text-xl font-bold text-foreground">{longestStreakEver}</div>
        <div className="text-xs text-muted-foreground">Longest streak ever</div>
      </Card>
      <Card className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
        <CurrentLongestStreakIconComponent
          className="h-6 w-6 mb-2"
          style={{ color: currentLongestStreakColor || 'hsl(var(--primary))' }}
        />
        <div className="text-xl font-bold text-foreground">{currentLongestStreak}</div>
        <div className="text-xs text-muted-foreground">Current longest streak</div>
      </Card>
    </div>
  );
};

export default OverallStatsCards;
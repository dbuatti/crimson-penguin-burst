import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, TrendingUp, Carrot } from 'lucide-react'; // Using Carrot for current streak as in image

interface OverallStatsCardsProps {
  totalCompletions: number;
  longestStreakEver: number;
  currentLongestStreak: number;
}

const OverallStatsCards: React.FC<OverallStatsCardsProps> = ({
  totalCompletions,
  longestStreakEver,
  currentLongestStreak,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
        <CheckCircle className="h-6 w-6 text-primary mb-2" />
        <div className="text-xl font-bold text-foreground">{totalCompletions}</div>
        <div className="text-xs text-muted-foreground">Completed in total</div>
      </Card>
      <Card className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
        <TrendingUp className="h-6 w-6 text-primary mb-2" />
        <div className="text-xl font-bold text-foreground">{longestStreakEver}</div>
        <div className="text-xs text-muted-foreground">Longest streak ever</div>
      </Card>
      <Card className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-4 text-center">
        <Carrot className="h-6 w-6 text-primary mb-2" />
        <div className="text-xl font-bold text-foreground">{currentLongestStreak}</div>
        <div className="text-xs text-muted-foreground">Current longest streak</div>
      </Card>
    </div>
  );
};

export default OverallStatsCards;
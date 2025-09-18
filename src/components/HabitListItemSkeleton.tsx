import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HabitListItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
};

export default HabitListItemSkeleton;
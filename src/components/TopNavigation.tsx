"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Corrected syntax
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  segments: { label: string; path: string; }[];
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ segments }) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center p-1 bg-secondary rounded-full shadow-inner border border-border">
      {segments.map((segment) => (
        <Link
          key={segment.path}
          to={segment.path}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
            location.pathname === segment.path
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {segment.label}
        </Link>
      ))}
    </div>
  );
};

const TopNavigation: React.FC = () => {
  const segments = [
    { label: 'Home', path: '/' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <header className="w-full max-w-4xl flex flex-col items-center py-2 px-4">
      <SegmentedControl segments={segments} />
    </header>
  );
};

export default TopNavigation;
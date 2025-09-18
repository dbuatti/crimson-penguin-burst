"use client";

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Archive, Upload, Download, History as HistoryIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from '@/components/SessionContextProvider';
import { exportHabits, importHabits } from '@/lib/data-management';
import { showError, showSuccess } from '@/utils/toast';

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
  const navigate = useNavigate();
  const { supabase, session } = useSession();

  const segments = [
    { label: 'Home', path: '/' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

  const handleExport = async () => {
    await exportHabits(session);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importHabits(file, session);
        // No need to fetch habits here, the Index page will re-fetch on mount
      } catch (error) {
        console.error('Failed to import habits:', error);
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error details:', error);
      showError('Logout attempted, but an error occurred. Redirecting...');
    } else {
      showSuccess('Logged out successfully!');
    }
    localStorage.removeItem('sb-gdmjttmjjhadltaihpgr-auth-token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="w-full max-w-md flex flex-col items-center gap-4 mb-8 py-2 px-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Link to="/create-habit">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">HabitKit</h1>
        <div className="flex items-center space-x-2">
          {/* This dropdown is now for data management and logout, not general settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
                <HistoryIcon className="h-5 w-5" /> {/* Using HistoryIcon for data actions */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border text-foreground shadow-lg rounded-lg p-1">
              <DropdownMenuItem onClick={handleExport} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                <Download className="mr-2 h-4 w-4" /> Export Data
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center relative hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                <Upload className="mr-2 h-4 w-4" /> Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </DropdownMenuItem>
              {session && (
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-150 cursor-pointer rounded-md px-2 py-1.5">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SegmentedControl segments={segments} />
    </header>
  );
};

export default TopNavigation;
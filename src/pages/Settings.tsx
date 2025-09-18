import React from 'react';
// Removed PageHeader import
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Archive, Upload, Download } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle'; // Import ThemeToggle
import { useSession } from '@/components/SessionContextProvider'; // Import useSession
import { exportHabits, importHabits } from '@/lib/data-management'; // Import data management functions
import { showError, showSuccess } from '@/utils/toast'; // Import toast notifications

const Settings: React.FC = () => {
  const { session } = useSession();

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

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-4 p-6 bg-card border border-border rounded-xl shadow-lg">
        {/* Removed the "General Settings" h2 header */}
        
        <div className="flex items-center justify-between">
          <span className="text-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <Link to="/archived-habits">
          <Button variant="outline" className="w-full justify-start bg-secondary border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
            <Archive className="mr-2 h-4 w-4" /> View Archived Habits
          </Button>
        </Link>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Data Management</h2>
        <Button onClick={handleExport} variant="outline" className="w-full justify-start bg-secondary border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
        <Button variant="outline" className="w-full justify-start bg-secondary border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg relative">
          <Upload className="mr-2 h-4 w-4" /> Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>

        <p className="text-muted-foreground text-sm mt-4">
          More settings will be available here soon.
        </p>
      </div>
    </div>
  );
};

export default Settings;
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Archive, Upload, Download } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSession } from '@/components/SessionContextProvider';
import { exportHabits, importHabits } from '@/lib/data-management';
import { showError, showSuccess } from '@/utils/toast';

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
      } catch (error) {
        console.error('Failed to import habits:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center w-full max-w-4xl"> {/* Added max-w-4xl here */}
      <div className="w-full space-y-3 p-4 bg-card border border-border rounded-xl shadow-lg mt-4">
        
        <div className="flex items-center justify-between py-2">
          <span className="text-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <Link to="/archived-habits">
          <Button variant="outline" className="w-full justify-start bg-secondary border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
            <Archive className="mr-2 h-4 w-4" /> View Archived Habits
          </Button>
        </Link>

        <h2 className="text-xl font-semibold text-foreground mt-6 mb-2">Data Management</h2>
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

        <p className="text-muted-foreground text-sm pt-2">
          More settings will be available here soon.
        </p>
      </div>
    </div>
  );
};

export default Settings;
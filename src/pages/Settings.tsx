import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <PageHeader title="Settings" backLink="/" />
      <div className="w-full max-w-md space-y-4 p-6 bg-card border border-border rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">General Settings</h2>
        
        <Link to="/archived-habits">
          <Button variant="outline" className="w-full justify-start bg-secondary border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
            <Archive className="mr-2 h-4 w-4" /> View Archived Habits
          </Button>
        </Link>

        {/* Add more settings options here as needed */}
        <p className="text-muted-foreground text-sm mt-4">
          More settings will be available here soon.
        </p>
      </div>
    </div>
  );
};

export default Settings;
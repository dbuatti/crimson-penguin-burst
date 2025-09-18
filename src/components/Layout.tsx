import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import TopNavigation from './TopNavigation';
import { MadeWithDyad } from './made-with-dyad';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl"> {/* Changed max-w-2xl to max-w-4xl */}
        <TopNavigation />
        <main className="flex flex-col items-center w-full">
          <Outlet />
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;
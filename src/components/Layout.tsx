import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import TopNavigation from './TopNavigation';
import { MadeWithDyad } from './made-with-dyad';

const Layout: React.FC = () => { // Removed LayoutProps and children prop
  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <TopNavigation />
        <main className="flex flex-col items-center w-full">
          <Outlet /> {/* Use Outlet to render nested routes */}
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;
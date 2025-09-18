import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  backLink?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, backLink = '/', children }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-4xl flex justify-between items-center mb-8 py-2 px-4 bg-card border border-border rounded-xl shadow-lg"> {/* Changed max-w-2xl to max-w-4xl */}
      <Button variant="ghost" size="icon" onClick={() => navigate(backLink)} className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <div className="w-5 flex justify-end">
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
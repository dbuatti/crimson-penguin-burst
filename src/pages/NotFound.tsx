import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-6 bg-card border border-border rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-200">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
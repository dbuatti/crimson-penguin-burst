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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="text-center p-8 bg-card border border-border rounded-xl shadow-lg">
        <h1 className="text-6xl font-extrabold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-200">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
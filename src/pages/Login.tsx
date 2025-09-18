import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">Welcome to HabitKit</h1>
        <Auth
          supabaseClient={supabase}
          providers={['google']} // Enable Google authentication
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  inputText: 'hsl(var(--foreground))',
                  defaultButtonBackground: 'hsl(var(--secondary))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--secondary-foreground))',
                  defaultButtonBackgroundHover: 'hsl(var(--secondary-foreground))',
                  defaultButtonTextHover: 'hsl(var(--secondary))',
                },
              },
            },
          }}
          theme="dark" // Using dark theme for Auth UI to match app's dark mode
          redirectTo={window.location.origin + '/'} // Redirect to home after successful login
        />
      </div>
    </div>
  );
};

export default Login;
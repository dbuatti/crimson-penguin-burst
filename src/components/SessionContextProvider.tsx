import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

interface SessionContextType {
  session: Session | null;
  supabase: SupabaseClient;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('SessionContextProvider: useEffect started');
    setLoading(true); // Ensure loading is true at the start of effect

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('SessionContextProvider: onAuthStateChange event:', _event, 'currentSession:', currentSession);
      setSession(currentSession);
      setLoading(false); // Set loading to false once the session state is determined

      if (currentSession && location.pathname === '/login') {
        console.log('SessionContextProvider: Redirecting from /login to /');
        navigate('/'); // Redirect authenticated users from login page to home
      } else if (!currentSession && location.pathname !== '/login') {
        console.log('SessionContextProvider: Redirecting to /login');
        navigate('/login'); // Redirect unauthenticated users to login page
      }
    });

    // The onAuthStateChange listener handles the initial session state,
    // so a separate getSession() call here is not needed.

    return () => {
      console.log('SessionContextProvider: useEffect cleanup, unsubscribing');
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  console.log('SessionContextProvider: Render, loading:', loading, 'session:', session);

  return (
    <SessionContext.Provider value={{ session, supabase, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};
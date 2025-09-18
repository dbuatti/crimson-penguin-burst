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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('SessionContextProvider: onAuthStateChange event:', _event, 'currentSession:', currentSession);
      // Always re-fetch the session to ensure we have the latest state from Supabase
      const { data: { session: latestSession }, error: getSessionError } = await supabase.auth.getSession();
      if (getSessionError) {
        console.error('SessionContextProvider: Error re-fetching session in onAuthStateChange:', getSessionError);
      }
      console.log('SessionContextProvider: onAuthStateChange latestSession:', latestSession);
      setSession(latestSession);
      setLoading(false);

      if (latestSession && location.pathname === '/login') {
        console.log('SessionContextProvider: Redirecting from /login to /');
        navigate('/'); // Redirect authenticated users from login page to home
      } else if (!latestSession && location.pathname !== '/login') {
        console.log('SessionContextProvider: Redirecting to /login');
        navigate('/login'); // Redirect unauthenticated users to login page
      }
    });

    // Initial session check
    console.log('SessionContextProvider: Initial getSession() call');
    supabase.auth.getSession().then(({ data: { session: initialSession }, error: initialGetSessionError }) => {
      if (initialGetSessionError) {
        console.error('SessionContextProvider: Error initial getSession:', initialGetSessionError);
      }
      console.log('SessionContextProvider: Initial session:', initialSession);
      setSession(initialSession);
      setLoading(false);
      if (initialSession && location.pathname === '/login') {
        console.log('SessionContextProvider: Initial redirect from /login to /');
        navigate('/');
      } else if (!initialSession && location.pathname !== '/login') {
        console.log('SessionContextProvider: Initial redirect to /login');
        navigate('/login');
      }
    }).catch(error => {
      console.error('SessionContextProvider: Catch block for initial getSession:', error);
      setLoading(false); // Ensure loading is set to false even on error
    });

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
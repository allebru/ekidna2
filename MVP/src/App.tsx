import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { getSupabaseClient } from './utils/supabase/client';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setCheckingSession(false);
    }
  };

  const handleLogin = (token: string) => {
    setAccessToken(token);
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setAccessToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!accessToken) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard accessToken={accessToken} onLogout={handleLogout} />;
}

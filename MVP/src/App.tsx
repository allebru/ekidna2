import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { getToken, removeToken } from './config/api';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) setAccessToken(token);
    setCheckingSession(false);
  }, []);

  const handleLogin = (token: string) => {
    setAccessToken(token);
  };

  const handleLogout = () => {
    removeToken();
    setAccessToken(null);
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

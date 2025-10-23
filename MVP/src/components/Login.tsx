import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getSupabaseClient } from '../utils/supabase/client';

interface LoginProps {
  onLogin: (accessToken: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session?.access_token) {
        onLogin(data.session.access_token);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cd70e814/signup`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // After signup, automatically login
      const supabase = getSupabaseClient();

      const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Account created! Please login.');
        setIsSignup(false);
        setLoading(false);
        return;
      }

      if (loginData.session?.access_token) {
        onLogin(loginData.session.access_token);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-3xl text-black">E</span>
            </div>
          </div>
          <CardTitle className="text-primary">ekidna APS</CardTitle>
          <CardDescription className="text-muted-foreground">
            Gestione Iscritti APS Italiana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Mario Rossi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-input-background border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-input-background border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                isSignup ? 'Creazione account...' : 'Accesso in corso...'
              ) : (
                <>
                  {isSignup ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crea Account
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Accedi
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignup ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

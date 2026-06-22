import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogIn } from 'lucide-react';
import { authAPI } from '../config/api';

interface LoginProps {
  onLogin: (accessToken: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@ekidna.org');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login(email, password);
      onLogin(data.token);
    } catch (err: any) {
      setError(err.message || 'Login fallito. Riprova.');
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ekidna.org"
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
              {loading ? 'Accesso in corso...' : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Accedi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

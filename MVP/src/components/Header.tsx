import { Button } from './ui/button';
import { LogOut, Users } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b-2 border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xl text-black">E</span>
          </div>
          <div>
            <h1 className="text-primary">ekidna APS</h1>
            <p className="text-xs text-muted-foreground">Gestione Iscritti</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-black"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Esci</span>
        </Button>
      </div>
    </header>
  );
}

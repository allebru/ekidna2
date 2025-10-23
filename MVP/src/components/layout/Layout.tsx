import { ReactNode } from 'react';
import { Header } from '../Header';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export function Layout({ children, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        {children}
      </main>
    </div>
  );
}

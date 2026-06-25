import { ReactNode } from 'react';
import { Header } from '../Header';
import { Users, FileText } from 'lucide-react';

export type DashboardSection = 'iscritti' | 'contenuti';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
  section: DashboardSection;
  onSectionChange: (s: DashboardSection) => void;
}

const NAV: { key: DashboardSection; label: string; icon: typeof Users }[] = [
  { key: 'iscritti',  label: 'Iscritti',       icon: Users },
  { key: 'contenuti', label: 'Contenuti Sito',  icon: FileText },
];

export function Layout({ children, onLogout, section, onSectionChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />

      {/* mobile: nav orizzontale sopra + contenuto sotto · desktop: sidebar a sinistra */}
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-[180px] md:flex-shrink-0 md:min-h-[calc(100vh-4rem)] bg-card/30 border-b border-primary/20 md:border-b-0 md:border-r md:pt-6">
          <nav className="flex flex-row md:flex-col gap-1 px-2 md:px-3 py-2 md:py-0">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onSectionChange(key)}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 md:border-b-0 md:border-l-2 ${
                  section === key
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-transparent text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon size={16} />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 w-full max-w-5xl p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

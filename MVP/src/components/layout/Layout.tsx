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
    <div style={{ minHeight: '100vh' }} className="bg-background">
      <Header onLogout={onLogout} />

      <div style={{ display: 'flex' }}>
        {/* Sidebar — always visible */}
        <aside style={{ width: '180px', flexShrink: 0, minHeight: 'calc(100vh - 4rem)', borderRight: '1px solid rgba(212,160,23,0.2)', paddingTop: '1.5rem' }} className="bg-card/30">
          <nav style={{ padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onSectionChange(key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderLeft: `2px solid ${section === key ? 'var(--color-primary, #d4a017)' : 'transparent'}`,
                  color: section === key ? 'var(--color-primary, #d4a017)' : undefined,
                  background: section === key ? 'rgba(212,160,23,0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                }}
                className={section === key ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '1.5rem 1rem', maxWidth: '64rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

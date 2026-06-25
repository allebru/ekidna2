import { useState } from 'react';
import { Layout, type DashboardSection } from './layout/Layout';
import { SubscribersPage } from '../pages/SubscribersPage';

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function Dashboard({ accessToken, onLogout }: DashboardProps) {
  const [section, setSection] = useState<DashboardSection>('iscritti');

  return (
    <Layout onLogout={onLogout} section={section} onSectionChange={setSection}>
      {section === 'iscritti' && <SubscribersPage accessToken={accessToken} />}
    </Layout>
  );
}

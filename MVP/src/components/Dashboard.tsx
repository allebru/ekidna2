import { Layout } from './layout/Layout';
import { SubscribersPage } from '../pages/SubscribersPage';

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function Dashboard({ accessToken, onLogout }: DashboardProps) {
  // In the future, you can add routing here to switch between different pages
  // For now, we just show the SubscribersPage
  
  return (
    <Layout onLogout={onLogout}>
      <SubscribersPage accessToken={accessToken} />
    </Layout>
  );
}

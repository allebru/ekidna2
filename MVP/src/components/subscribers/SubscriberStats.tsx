import { Card, CardContent } from '../ui/card';
import { Users } from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: string;
}

interface SubscriberStatsProps {
  subscribers: Subscriber[];
}

export function SubscriberStats({ subscribers }: SubscriberStatsProps) {
  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const currentYearCount = subscribers.filter(
    s => s.subscription_year === new Date().getFullYear() && s.status === 'active'
  ).length;
  const deletedCount = subscribers.filter(s => s.status === 'deleted').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-2 border-primary/30 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Totale Iscritti</p>
              <p className="text-2xl text-primary">{activeCount}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-primary/30 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anno Corrente</p>
              <p className="text-2xl text-primary">{currentYearCount}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-primary/30 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Eliminati</p>
              <p className="text-2xl text-primary">{deletedCount}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

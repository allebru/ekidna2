import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: string;
}

interface SubscribersTableProps {
  subscribers: Subscriber[];
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: string) => void;
}

export function SubscribersTable({ subscribers, onEdit, onDelete }: SubscribersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-primary/20 hover:bg-transparent">
            <TableHead className="text-primary">Nome</TableHead>
            <TableHead className="text-primary hidden sm:table-cell">Email</TableHead>
            <TableHead className="text-primary hidden md:table-cell">Telefono</TableHead>
            <TableHead className="text-primary hidden lg:table-cell">Indirizzo</TableHead>
            <TableHead className="text-primary text-center">Anno</TableHead>
            <TableHead className="text-primary text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber.id} className="border-primary/20 hover:bg-primary/5">
              <TableCell className="text-foreground">
                <div>
                  <div>{subscriber.name}</div>
                  <div className="sm:hidden text-xs text-muted-foreground mt-1">
                    {subscriber.email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground hidden sm:table-cell text-sm">
                {subscriber.email || '-'}
              </TableCell>
              <TableCell className="text-foreground hidden md:table-cell text-sm">
                {subscriber.phone || '-'}
              </TableCell>
              <TableCell className="text-foreground hidden lg:table-cell text-sm max-w-xs truncate">
                {subscriber.address || '-'}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {subscriber.subscription_year}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(subscriber)}
                    className="h-8 w-8 p-0 text-primary hover:bg-primary/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(subscriber.id)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

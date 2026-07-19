import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';
import { AddSubscriberDialog } from './AddSubscriberDialog';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: string;
}

interface SubscribersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  yearFilter: string;
  onYearFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  availableYears: number[];
  onAdd: (subscriber: Omit<Subscriber, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function SubscribersFilters({
  searchTerm,
  onSearchChange,
  yearFilter,
  onYearFilterChange,
  statusFilter,
  onStatusFilterChange,
  availableYears,
  onAdd,
}: SubscribersFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label className="text-primary">Cerca</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            placeholder="Nome, email, telefono..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-input-background border-primary/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-primary">Anno</Label>
        <Select value={yearFilter} onValueChange={onYearFilterChange}>
          <SelectTrigger className="bg-input-background border-primary/30 text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary">
            <SelectItem value="all">Tutti gli anni</SelectItem>
            {availableYears.map(year => (
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-primary">Stato</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="bg-input-background border-primary/30 text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary">
            <SelectItem value="all">Tutti</SelectItem>
            <SelectItem value="active">Attivi</SelectItem>
            <SelectItem value="deleted">Eliminati</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <AddSubscriberDialog onAdd={onAdd} />
      </div>
    </div>
  );
}

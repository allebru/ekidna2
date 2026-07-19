import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, Database, Users, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { subscribersAPI } from '../config/api';
import { SubscriberStats } from '../components/subscribers/SubscriberStats';
import { SubscribersFilters } from '../components/subscribers/SubscribersFilters';
import { SubscribersTable } from '../components/subscribers/SubscribersTable';
import { EditSubscriberDialog } from '../components/subscribers/EditSubscriberDialog';
import { DeleteConfirmDialog } from '../components/subscribers/DeleteConfirmDialog';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SubscribersPageProps {
  accessToken: string;
}

export function SubscribersPage({ accessToken }: SubscribersPageProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
    setCurrentPage(1);
  }, [subscribers, searchTerm, yearFilter, statusFilter]);

  const fetchSubscribers = async () => {
    try {
      const data = await subscribersAPI.getAll({ status: 'all', limit: 500 });
      setSubscribers(data.data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubscribers = () => {
    let filtered = [...subscribers];

    if (statusFilter === 'active') {
      filtered = filtered.filter(s => s.status === 'active');
    } else if (statusFilter === 'deleted') {
      filtered = filtered.filter(s => s.status === 'deleted');
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(s => s.subscription_year === Number(yearFilter));
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search) ||
        s.phone?.includes(search) ||
        s.address?.toLowerCase().includes(search)
      );
    }

    setFilteredSubscribers(filtered);
  };

  const handleAddSubscriber = async (newSubscriber: Omit<Subscriber, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    const data = await subscribersAPI.create(newSubscriber);
    setSubscribers(prev => [...prev, data.subscriber || data]);
  };

  const handleUpdateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    const data = await subscribersAPI.update(id, updates);
    setSubscribers(prev => prev.map(s => s.id === id ? (data.subscriber || data) : s));
  };

  const handleDeleteSubscriber = async () => {
    if (!deletingId) return;
    const data = await subscribersAPI.delete(deletingId);
    setSubscribers(prev => prev.map(s => s.id === deletingId ? (data.subscriber || { ...s, status: 'deleted' }) : s));
    setDeletingId(null);
  };

  const availableYears = Array.from(
    new Set(subscribers.map(s => s.subscription_year))
  ).sort((a, b) => b - a);

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {subscribers.length === 0 && !loading && (
        <Card className="border-2 border-primary/30 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary mb-1">Nessun dato presente</p>
                <p className="text-sm text-muted-foreground">Aggiungi il primo iscritto con il pulsante "Aggiungi"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <SubscriberStats subscribers={subscribers} />

      <Card className="border-2 border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtri e Ricerca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubscribersFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            availableYears={availableYears}
            onAdd={handleAddSubscriber}
          />
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/30 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-primary flex items-center justify-between">
            <span>Iscritti ({filteredSubscribers.length})</span>
            {totalPages > 1 && (
              <span className="text-sm text-muted-foreground">
                Pagina {currentPage} di {totalPages}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-foreground">Nessun iscritto trovato</p>
              <p className="text-sm text-muted-foreground mt-2">
                Modifica i filtri o aggiungi un nuovo iscritto
              </p>
            </div>
          ) : (
            <>
              <SubscribersTable
                subscribers={paginatedSubscribers}
                onEdit={setEditingSubscriber}
                onDelete={setDeletingId}
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-primary/20">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, filteredSubscribers.length)} di {filteredSubscribers.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-primary text-primary hover:bg-primary hover:text-black disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-foreground">{currentPage} / {totalPages}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-primary text-primary hover:bg-primary hover:text-black disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <EditSubscriberDialog
        subscriber={editingSubscriber}
        open={!!editingSubscriber}
        onOpenChange={(open) => !open && setEditingSubscriber(null)}
        onSave={handleUpdateSubscriber}
      />

      <DeleteConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDeleteSubscriber}
      />
    </div>
  );
}

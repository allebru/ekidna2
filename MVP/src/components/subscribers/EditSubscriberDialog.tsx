import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: string;
}

interface EditSubscriberDialogProps {
  subscriber: Subscriber | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Subscriber>) => Promise<void>;
}

export function EditSubscriberDialog({ subscriber, open, onOpenChange, onSave }: EditSubscriberDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (subscriber) {
      setName(subscriber.name);
      setEmail(subscriber.email);
      setPhone(subscriber.phone);
      setAddress(subscriber.address);
      setYear(subscriber.subscription_year);
    }
  }, [subscriber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriber) return;

    setSubmitting(true);
    try {
      await onSave(subscriber.id, {
        name,
        email,
        phone,
        address,
        subscription_year: year,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating subscriber:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!subscriber) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Modifica Iscritto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifica i dati dell'iscritto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-primary">Nome *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-input-background border-primary/30 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-primary">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input-background border-primary/30 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-primary">Telefono</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-input-background border-primary/30 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-primary">Indirizzo</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-input-background border-primary/30 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-primary">Anno Iscrizione *</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              min="2020"
              max="2030"
              className="bg-input-background border-primary/30 text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-black"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-black hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Salva Modifiche'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Loader2 } from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: string;
}

interface AddSubscriberDialogProps {
  onAdd: (subscriber: Omit<Subscriber, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function AddSubscriberDialog({ onAdd }: AddSubscriberDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onAdd({
        name,
        email,
        phone,
        address,
        subscription_year: year,
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setYear(new Date().getFullYear());
      setOpen(false);
    } catch (error) {
      console.error('Error adding subscriber:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary text-black hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-2 border-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Nuovo Iscritto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Aggiungi un nuovo iscritto all'APS
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
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-black hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              'Salva Iscritto'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

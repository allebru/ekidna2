import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Save, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import apiClient from '../config/api';
import { ImageUploadField } from '../components/ImageUploadField';

// Tutte le pagine editoriali del sito. Privacy Policy e le voci di
// menu/footer restano gestite da codice (testo legale / struttura di
// navigazione, non pensati per l'editing frequente da parte dello staff).
const PAGES: { key: string; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'chi_siamo', label: 'Chi Siamo' },
  { key: 'eventi', label: 'Eventi' },
  { key: 'galleria', label: 'Galleria' },
  { key: 'dove_siamo', label: 'Dove Siamo' },
  { key: 'contatti', label: 'Contatti' },
];

type FieldMeta = { content_type: string; label: string; value: string; sort_order: number };
type PageMeta = Record<string, FieldMeta>;
type AllMeta = Record<string, PageMeta>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Evento editor ────────────────────────────────────────────────
type EventoRecord = {
  id: number;
  slug: string;
  title: string;
  date: string;
  endDate: string;
  dateLabel: string;
  genre: string;
  image: string;
  description: string;
  lineup: string[];
  info: string[];
  link: string;
};

function emptyEvento(): EventoRecord {
  return {
    id: Date.now(),
    slug: '',
    title: '',
    date: '',
    endDate: '',
    dateLabel: '',
    genre: '',
    image: '',
    description: '',
    lineup: [],
    info: [],
    link: '',
  };
}

function RepeatableTextList({ items, onChange, addLabel }: { items: string[]; onChange: (v: string[]) => void; addLabel: string }) {
  return (
    <div className="space-y-2">
      {items.map((line, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={line}
            onChange={(e) => {
              const copy = [...items]; copy[i] = e.target.value; onChange(copy);
            }}
            className="bg-zinc-800 border-zinc-700 text-white text-sm flex-1"
          />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-400 flex-shrink-0">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <Button onClick={() => onChange([...items, ''])} variant="outline" size="sm" className="border-[#d4a017]/50 text-[#d4a017] hover:bg-[#d4a017]/10">
        <Plus size={14} className="mr-1" /> {addLabel}
      </Button>
    </div>
  );
}

function EventiEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [events, setEvents] = useState<EventoRecord[]>(() => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((e) => ({ ...emptyEvento(), ...e })) : [];
    } catch {
      return [];
    }
  });

  const update = (list: EventoRecord[]) => { setEvents(list); onChange(JSON.stringify(list)); };
  const add = () => update([...events, emptyEvento()]);
  const remove = (i: number) => update(events.filter((_, idx) => idx !== i));
  const set = (i: number, field: keyof EventoRecord, v: string | string[]) => {
    const copy = [...events]; copy[i] = { ...copy[i], [field]: v } as EventoRecord; update(copy);
  };

  return (
    <div className="space-y-4">
      {events.map((ev, i) => (
        <div key={ev.id} className="border border-[#d4a017]/30 p-4 bg-zinc-900 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-wider">Evento {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400">Titolo</Label>
              <Input
                value={ev.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const copy = [...events];
                  copy[i] = { ...copy[i], title, slug: copy[i].slug || slugify(title) };
                  update(copy);
                }}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400">Slug URL (/eventi/...)</Label>
              <Input value={ev.slug} onChange={(e) => set(i, 'slug', slugify(e.target.value))} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-400">Genere</Label>
              <Input value={ev.genre} onChange={(e) => set(i, 'genre', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-400">Data testo (mostrata sul sito)</Label>
              <Input value={ev.dateLabel} onChange={(e) => set(i, 'dateLabel', e.target.value)} placeholder="25 – 28 Giugno 2026" className="bg-zinc-800 border-zinc-700 text-white mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-400">Data inizio</Label>
              <Input type="date" value={ev.date} onChange={(e) => set(i, 'date', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-400">Data fine (se più giorni)</Label>
              <Input type="date" value={ev.endDate} onChange={(e) => set(i, 'endDate', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400">Locandina</Label>
            <div className="mt-1">
              <ImageUploadField value={ev.image} onChange={(v) => set(i, 'image', v)} />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400">Descrizione</Label>
            <Textarea value={ev.description} onChange={(e) => set(i, 'description', e.target.value)} rows={2} className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" />
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Line-up (una riga per giorno/fascia)</Label>
            <RepeatableTextList items={ev.lineup} onChange={(v) => set(i, 'lineup', v)} addLabel="Aggiungi riga line-up" />
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Info (biglietti, orari, note)</Label>
            <RepeatableTextList items={ev.info} onChange={(v) => set(i, 'info', v)} addLabel="Aggiungi riga info" />
          </div>

          <div>
            <Label className="text-xs text-gray-400">Link esterno (biglietti / evento Facebook)</Label>
            <Input value={ev.link} onChange={(e) => set(i, 'link', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
          </div>
        </div>
      ))}
      <Button onClick={add} variant="outline" size="sm" className="border-[#d4a017]/50 text-[#d4a017] hover:bg-[#d4a017]/10">
        <Plus size={14} className="mr-1" /> Aggiungi evento
      </Button>
    </div>
  );
}

// ── Galleria editor ──────────────────────────────────────────────
function GalleriaEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<any[]>(() => { try { return JSON.parse(value) || []; } catch { return []; } });

  const update = (list: any[]) => { setItems(list); onChange(JSON.stringify(list)); };
  const add = () => update([...items, { id: Date.now(), url: '', alt: '' }]);
  const remove = (i: number) => update(items.filter((_, idx) => idx !== i));
  const set = (i: number, field: string, v: string) => {
    const copy = [...items]; copy[i] = { ...copy[i], [field]: v }; update(copy);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="border border-[#d4a017]/20 p-3 bg-zinc-900 space-y-2">
          <ImageUploadField value={item.url} onChange={(v) => set(i, 'url', v)} />
          <div className="flex gap-2">
            <Input value={item.alt} onChange={(e) => set(i, 'alt', e.target.value)} placeholder="Descrizione immagine" className="bg-zinc-800 border-zinc-700 text-white text-sm flex-1" />
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-400 flex-shrink-0"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
      <Button onClick={add} variant="outline" size="sm" className="border-[#d4a017]/50 text-[#d4a017] hover:bg-[#d4a017]/10">
        <Plus size={14} className="mr-1" /> Aggiungi immagine
      </Button>
    </div>
  );
}

// ── Field renderer ───────────────────────────────────────────────
function FieldEditor({ fieldKey, meta, onChange }: { fieldKey: string; meta: FieldMeta; onChange: (v: string) => void }) {
  if (fieldKey === 'lista_eventi') return <EventiEditor value={meta.value ?? ''} onChange={onChange} />;
  if (fieldKey === 'gallery_items') return <GalleriaEditor value={meta.value ?? ''} onChange={onChange} />;
  if (meta.content_type === 'image') return <ImageUploadField value={meta.value ?? ''} onChange={onChange} />;
  if (meta.content_type === 'textarea') {
    return <Textarea defaultValue={meta.value ?? ''} onBlur={e => onChange(e.target.value)} rows={4} className="bg-zinc-800 border-zinc-700 text-white resize-none" />;
  }
  return <Input type={meta.content_type === 'email' ? 'email' : meta.content_type === 'url' ? 'url' : 'text'} defaultValue={meta.value ?? ''} onBlur={e => onChange(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />;
}

// ── Main page ────────────────────────────────────────────────────
export function ContentPage() {
  const [meta, setMeta] = useState<AllMeta>({});
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({});
  const [activePage, setActivePage] = useState('home');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('/content/meta')
      .then(res => { setMeta(res.data ?? res); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (page: string, key: string, value: string) => {
    setEdits(prev => ({ ...prev, [page]: { ...prev[page], [key]: value } }));
  };

  const handleSave = async () => {
    const pageEdits = edits[activePage];
    if (!pageEdits || Object.keys(pageEdits).length === 0) return;
    setSaving(true); setStatus('idle');
    try {
      await apiClient(`/content/${activePage}`, { method: 'PUT', body: JSON.stringify(pageEdits) });
      // Apply saved values back into meta
      setMeta(prev => {
        const updated = { ...prev };
        for (const [k, v] of Object.entries(pageEdits)) {
          if (updated[activePage]?.[k]) updated[activePage][k] = { ...updated[activePage][k], value: v };
        }
        return updated;
      });
      setEdits(prev => { const copy = { ...prev }; delete copy[activePage]; return copy; });
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const pageMeta = meta[activePage] ?? {};
  const pageHasEdits = !!(edits[activePage] && Object.keys(edits[activePage]).length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary uppercase tracking-widest">Contenuti Sito</h1>
          <p className="text-muted-foreground text-sm mt-1">Modifica i testi e i contenuti del sito pubblico</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !pageHasEdits}
          className="bg-primary text-black hover:bg-primary/90 disabled:opacity-40"
        >
          {saving ? 'Salvataggio...' : <><Save size={16} className="mr-2" />Salva modifiche</>}
        </Button>
      </div>

      {status === 'ok' && (
        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/30 px-4 py-2 rounded">
          <CheckCircle size={16} /> Contenuto aggiornato con successo — visibile subito sul sito
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-2 rounded">
          <AlertCircle size={16} /> Errore durante il salvataggio
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {PAGES.map(p => (
          <button
            key={p.key}
            onClick={() => setActivePage(p.key)}
            className={`px-4 py-2 text-sm uppercase tracking-wider border transition-all ${
              activePage === p.key
                ? 'bg-primary text-black border-primary'
                : 'border-primary/30 text-primary hover:border-primary'
            }`}
          >
            {p.label}
            {edits[p.key] && Object.keys(edits[p.key]).length > 0 && (
              <span className="ml-2 w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Caricamento contenuti...</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(pageMeta)
            .sort(([, a], [, b]) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map(([key, field]) => (
              <Card key={key} className="bg-card border-primary/20">
                <CardHeader className="pb-3 pt-4 px-5">
                  <CardTitle className="text-sm text-primary uppercase tracking-wider">{field.label}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <FieldEditor
                    fieldKey={key}
                    meta={{
                      ...field,
                      value: edits[activePage]?.[key] ?? field.value,
                    }}
                    onChange={v => handleChange(activePage, key, v)}
                  />
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

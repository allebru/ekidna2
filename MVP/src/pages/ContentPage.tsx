import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Save, CheckCircle, AlertCircle, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import apiClient, { getToken } from '../config/api';

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

// ── Evento editor ────────────────────────────────────────────────
function EventiEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [events, setEvents] = useState<any[]>(() => { try { return JSON.parse(value) || []; } catch { return []; } });

  const update = (list: any[]) => { setEvents(list); onChange(JSON.stringify(list)); };
  const add = () => update([...events, { id: Date.now(), title: '', date: '', time: '', genre: '', description: '' }]);
  const remove = (i: number) => update(events.filter((_, idx) => idx !== i));
  const set = (i: number, field: string, v: string) => {
    const copy = [...events]; copy[i] = { ...copy[i], [field]: v }; update(copy);
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
            <div><Label className="text-xs text-gray-400">Titolo</Label><Input value={ev.title} onChange={e => set(i, 'title', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
            <div><Label className="text-xs text-gray-400">Genere</Label><Input value={ev.genre} onChange={e => set(i, 'genre', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
            <div><Label className="text-xs text-gray-400">Data</Label><Input type="date" value={ev.date} onChange={e => set(i, 'date', e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
            <div><Label className="text-xs text-gray-400">Ora</Label><Input value={ev.time} onChange={e => set(i, 'time', e.target.value)} placeholder="21:00" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
          </div>
          <div><Label className="text-xs text-gray-400">Descrizione</Label><Textarea value={ev.description} onChange={e => set(i, 'description', e.target.value)} rows={2} className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" /></div>
        </div>
      ))}
      <Button onClick={add} variant="outline" size="sm" className="border-[#d4a017]/50 text-[#d4a017] hover:bg-[#d4a017]/10">
        <Plus size={14} className="mr-1" /> Aggiungi evento
      </Button>
    </div>
  );
}

// ── Galleria editor ──────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function GalleriaEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<any[]>(() => { try { return JSON.parse(value) || []; } catch { return []; } });
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (list: any[]) => { setItems(list); onChange(JSON.stringify(list)); };
  const add = () => update([...items, { id: Date.now(), url: '', alt: '' }]);
  const remove = (i: number) => update(items.filter((_, idx) => idx !== i));
  const set = (i: number, field: string, v: string) => {
    const copy = [...items]; copy[i] = { ...copy[i], [field]: v }; update(copy);
  };

  const handleUpload = async (i: number, file: File) => {
    setUploading(i);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) set(i, 'url', data.url);
      else alert(data.error || 'Errore upload');
    } catch {
      alert('Errore durante il caricamento');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="border border-[#d4a017]/20 p-3 bg-zinc-900 space-y-2">
          <div className="flex gap-2 items-center">
            {/* Anteprima */}
            {item.url && (
              <img src={item.url} alt={item.alt} className="w-16 h-16 object-cover rounded border border-zinc-700 flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={item.url}
                  onChange={e => set(i, 'url', e.target.value)}
                  placeholder="URL immagine (https://...)"
                  className="bg-zinc-800 border-zinc-700 text-white text-sm flex-1"
                />
                {/* Upload button */}
                <button
                  title="Carica dal computer"
                  onClick={() => fileRefs.current[i]?.click()}
                  disabled={uploading === i}
                  className="px-3 py-2 border border-[#d4a017]/50 text-[#d4a017] hover:bg-[#d4a017]/10 disabled:opacity-50 flex-shrink-0"
                >
                  {uploading === i ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                </button>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  ref={el => { fileRefs.current[i] = el; }}
                  onChange={e => e.target.files?.[0] && handleUpload(i, e.target.files[0])}
                />
              </div>
              <Input value={item.alt} onChange={e => set(i, 'alt', e.target.value)} placeholder="Descrizione immagine" className="bg-zinc-800 border-zinc-700 text-white text-sm" />
            </div>
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
      <div className="flex items-center justify-between">
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
          <CheckCircle size={16} /> Contenuto aggiornato con successo
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

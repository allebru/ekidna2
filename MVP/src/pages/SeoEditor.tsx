import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Save, CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import apiClient from '../config/api';
import { ImageUploadField } from '../components/ImageUploadField';

const PAGES: { key: string; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'chi_siamo', label: 'Chi Siamo' },
  { key: 'eventi', label: 'Eventi' },
  { key: 'galleria', label: 'Galleria' },
  { key: 'dove_siamo', label: 'Dove Siamo' },
  { key: 'contatti', label: 'Contatti' },
  { key: 'iscriviti', label: 'Tesseramento' },
  { key: 'privacy', label: 'Privacy Policy' },
];

type SeoEntry = { meta_title: string; meta_description: string; og_image: string | null };

// ── Punteggio SEO ────────────────────────────────────────────────
// Pensato per chi non è tecnico: pochi criteri, spiegati in modo diretto,
// con un consiglio pratico per ogni criterio non ancora a posto.
type CheckStatus = 'good' | 'warning' | 'bad';
type SeoCheck = { status: CheckStatus; message: string };

function evaluateSeo(entry: SeoEntry, siblingTitles: string[]): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = [];
  let score = 0;

  const titleLen = entry.meta_title.trim().length;
  if (titleLen === 0) {
    checks.push({ status: 'bad', message: 'Il titolo è vuoto: Google mostrerà un testo generico invece di uno scelto da voi.' });
  } else if (titleLen < 30) {
    checks.push({ status: 'warning', message: `Titolo un po' corto (${titleLen} caratteri): c'è spazio per una parola chiave o un dettaglio in più.` });
    score += 15;
  } else if (titleLen <= 60) {
    checks.push({ status: 'good', message: `Lunghezza del titolo ottimale (${titleLen} caratteri).` });
    score += 30;
  } else if (titleLen <= 70) {
    checks.push({ status: 'warning', message: `Titolo lungo (${titleLen} caratteri): rischia di essere tagliato con "..." nei risultati Google.` });
    score += 15;
  } else {
    checks.push({ status: 'bad', message: `Titolo troppo lungo (${titleLen} caratteri): quasi certamente verrà troncato. Portalo sotto i 60.` });
  }

  const descLen = entry.meta_description.trim().length;
  if (descLen === 0) {
    checks.push({ status: 'bad', message: 'La descrizione è vuota: Google userà un pezzo di testo a caso dalla pagina, spesso poco invitante.' });
  } else if (descLen < 70) {
    checks.push({ status: 'warning', message: `Descrizione breve (${descLen} caratteri): c'è spazio per spiegare meglio cosa trova chi clicca.` });
    score += 15;
  } else if (descLen <= 160) {
    checks.push({ status: 'good', message: `Lunghezza della descrizione ottimale (${descLen} caratteri).` });
    score += 30;
  } else {
    checks.push({ status: 'bad', message: `Descrizione troppo lunga (${descLen} caratteri): verrà tagliata con "..." nei risultati Google.` });
  }

  if (titleLen > 0) {
    const isDuplicate = siblingTitles.filter((t) => t.trim() === entry.meta_title.trim()).length > 1;
    if (isDuplicate) {
      checks.push({ status: 'bad', message: "Questo titolo è identico a quello di un'altra pagina: rendilo unico, altrimenti Google fatica a capire quale mostrare." });
    } else {
      checks.push({ status: 'good', message: 'Titolo unico rispetto alle altre pagine.' });
      score += 20;
    }
  }

  if (!entry.og_image) {
    checks.push({ status: 'warning', message: 'Nessuna immagine di condivisione: verrà usato il logo generico. Per eventi o pagine con foto, una immagine dedicata rende molto meglio su WhatsApp/Facebook.' });
  } else {
    checks.push({ status: 'good', message: 'Immagine di condivisione impostata.' });
    score += 20;
  }

  return { score, checks };
}

function scoreStyle(score: number): { label: string; text: string; border: string; bg: string } {
  if (score >= 80) return { label: 'Ottimo', text: 'text-green-400', border: 'border-green-400', bg: 'bg-green-400' };
  if (score >= 50) return { label: 'Da migliorare', text: 'text-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-400' };
  return { label: 'Insufficiente', text: 'text-red-400', border: 'border-red-400', bg: 'bg-red-400' };
}

function CheckIcon({ status }: { status: CheckStatus }) {
  if (status === 'good') return <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />;
  if (status === 'warning') return <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />;
  return <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />;
}

function ScoreBadge({ score }: { score: number }) {
  const s = scoreStyle(score);
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-black ${s.bg}`}>
      {score}
    </span>
  );
}

// ── Componenti di supporto esistenti ─────────────────────────────
function CharCounter({ value, ideal, max }: { value: string; ideal: number; max: number }) {
  const len = value.length;
  const color = len > max ? 'text-red-400' : len > ideal ? 'text-yellow-400' : 'text-gray-500';
  return <span className={`text-xs ${color}`}>{len}/{max} caratteri (ideale: fino a {ideal})</span>;
}

function GooglePreview({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-zinc-700 bg-white rounded p-4 max-w-full overflow-hidden">
      <p className="text-[#1a0dab] text-lg truncate">{title || 'Titolo pagina'}</p>
      <p className="text-[#006621] text-sm">ekidnacarpi.it</p>
      <p className="text-[#545454] text-sm line-clamp-2">{description || 'Descrizione della pagina...'}</p>
    </div>
  );
}

// ── Pagina principale ────────────────────────────────────────────
export function SeoEditor() {
  const [data, setData] = useState<Record<string, SeoEntry>>({});
  const [activePage, setActivePage] = useState('home');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('/seo')
      .then((res) => { setData(res.data ?? {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const current: SeoEntry = data[activePage] ?? { meta_title: '', meta_description: '', og_image: null };
  const allTitles = PAGES.map((p) => (data[p.key]?.meta_title ?? ''));
  const { score, checks } = evaluateSeo(current, allTitles);
  const scoreUi = scoreStyle(score);

  const setField = (field: keyof SeoEntry, value: string) => {
    setData((prev) => ({ ...prev, [activePage]: { ...current, [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true); setStatus('idle');
    try {
      await apiClient(`/seo/${activePage}`, {
        method: 'PUT',
        body: JSON.stringify({
          meta_title: current.meta_title,
          meta_description: current.meta_description,
          og_image: current.og_image,
        }),
      });
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary uppercase tracking-widest">SEO per pagina</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Titolo e descrizione che compaiono su Google e quando la pagina viene condivisa sui social
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-black hover:bg-primary/90 disabled:opacity-40">
          {saving ? 'Salvataggio...' : <><Save size={16} className="mr-2" />Salva modifiche</>}
        </Button>
      </div>

      {status === 'ok' && (
        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/30 px-4 py-2 rounded">
          <CheckCircle size={16} /> SEO aggiornata con successo
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-2 rounded">
          <AlertCircle size={16} /> Errore durante il salvataggio
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {PAGES.map((p) => {
          const entry = data[p.key] ?? { meta_title: '', meta_description: '', og_image: null };
          const pageScore = loading ? null : evaluateSeo(entry, allTitles).score;
          return (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-wider border transition-all ${
                activePage === p.key ? 'bg-primary text-black border-primary' : 'border-primary/30 text-primary hover:border-primary'
              }`}
            >
              {p.label}
              {pageScore !== null && <ScoreBadge score={pageScore} />}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Caricamento...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className={`bg-card border-2 ${scoreUi.border} lg:col-span-2`}>
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-3">
                <span className={scoreUi.text}>Punteggio SEO: {score}/100 — {scoreUi.label}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ul className="space-y-2">
                {checks.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckIcon status={c.status} />
                    <span>{c.message}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm text-primary uppercase tracking-wider">Titolo (SEO title)</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              <Input
                value={current.meta_title}
                onChange={(e) => setField('meta_title', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <CharCounter value={current.meta_title} ideal={60} max={70} />
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm text-primary uppercase tracking-wider">Descrizione</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              <Textarea
                value={current.meta_description}
                onChange={(e) => setField('meta_description', e.target.value)}
                rows={3}
                className="bg-zinc-800 border-zinc-700 text-white resize-none"
              />
              <CharCounter value={current.meta_description} ideal={160} max={160} />
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm text-primary uppercase tracking-wider">Immagine di condivisione (social)</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ImageUploadField value={current.og_image ?? ''} onChange={(v) => setField('og_image', v)} />
              <Label className="text-xs text-gray-500 mt-2 block">Se vuota, viene usato il logo Ekidna di default.</Label>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm text-primary uppercase tracking-wider">Anteprima su Google</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <GooglePreview title={current.meta_title} description={current.meta_description} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

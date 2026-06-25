import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Link } from 'react-router-dom';
import { submitSubscription } from '../config/api';

const MESI = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

const ANNO_CORRENTE = new Date().getFullYear();
const ANNI = Array.from({ length: ANNO_CORRENTE - 1920 + 1 }, (_, i) => ANNO_CORRENTE - i);
const GIORNI = Array.from({ length: 31 }, (_, i) => i + 1);

const initialData = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  giorno: '',
  mese: '',
  anno: '',
  indirizzo: '',
  citta: '',
  cap: '',
  provincia: '',
  motivazione: '',
  accettaTermini: false,
  accettaPrivacy: false,
  website: '', // honeypot anti-bot (nascosto)
};

type FormData = typeof initialData;
type Errors = Partial<Record<keyof FormData | 'dataNascita', string>>;

// Una data reale (non 31/02) e non nel futuro
function dataValida(y: number, m: number, d: number) {
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m - 1 &&
    dt.getDate() === d &&
    dt <= new Date()
  );
}

const RE_NOME = /^[A-Za-zÀ-ÿ'’\- ]{2,50}$/;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_TEL = /^[+]?[0-9\s().\-]{6,20}$/;

export function Iscriviti() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = (): Errors => {
    const e: Errors = {};
    const nome = formData.nome.trim();
    const cognome = formData.cognome.trim();
    const email = formData.email.trim();
    const telefono = formData.telefono.trim();
    const indirizzo = formData.indirizzo.trim();
    const citta = formData.citta.trim();
    const cap = formData.cap.trim();
    const provincia = formData.provincia.trim();

    if (!nome) e.nome = 'Inserisci il nome';
    else if (!RE_NOME.test(nome)) e.nome = 'Nome non valido (solo lettere, 2-50 caratteri)';

    if (!cognome) e.cognome = 'Inserisci il cognome';
    else if (!RE_NOME.test(cognome)) e.cognome = 'Cognome non valido (solo lettere, 2-50 caratteri)';

    if (!email) e.email = 'Inserisci l\'email';
    else if (!RE_EMAIL.test(email)) e.email = 'Email non valida';

    if (!telefono) e.telefono = 'Inserisci il telefono';
    else if (!RE_TEL.test(telefono)) e.telefono = 'Telefono non valido';

    if (!formData.giorno || !formData.mese || !formData.anno) {
      e.dataNascita = 'Seleziona la data di nascita completa';
    } else if (!dataValida(Number(formData.anno), Number(formData.mese), Number(formData.giorno))) {
      e.dataNascita = 'Data di nascita non valida';
    }

    if (!indirizzo) e.indirizzo = 'Inserisci l\'indirizzo';
    else if (indirizzo.length < 3) e.indirizzo = 'Indirizzo troppo corto';

    if (!citta) e.citta = 'Inserisci la città';
    if (!cap) e.cap = 'Inserisci il CAP';
    else if (!/^\d{5}$/.test(cap)) e.cap = 'Il CAP deve avere 5 cifre';

    if (!provincia) e.provincia = 'Inserisci la provincia';
    else if (!/^[A-Za-z]{2}$/.test(provincia)) e.provincia = 'Sigla provincia: 2 lettere (es. MO)';

    if (formData.motivazione.length > 1000) e.motivazione = 'Massimo 1000 caratteri';

    if (!formData.accettaTermini) e.accettaTermini = 'Devi accettare lo statuto';
    if (!formData.accettaPrivacy) e.accettaPrivacy = 'Devi accettare la privacy policy';

    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitStatus('idle');

    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const gg = String(formData.giorno).padStart(2, '0');
      const mm = String(formData.mese).padStart(2, '0');
      const birthDateISO = `${formData.anno}-${mm}-${gg}`; // YYYY-MM-DD per colonna DATE

      const subscriptionData = {
        name: `${formData.nome.trim()} ${formData.cognome.trim()}`.trim(), // compatibilità
        first_name: formData.nome.trim(),
        last_name: formData.cognome.trim(),
        email: formData.email.trim(),
        phone: formData.telefono.trim(),
        birth_date: birthDateISO,
        address: formData.indirizzo.trim(),
        city: formData.citta.trim(),
        province: formData.provincia.trim().toUpperCase(),
        postal_code: formData.cap.trim(),
        subscription_year: ANNO_CORRENTE,
        notes: formData.motivazione.trim(),
        website: formData.website, // honeypot
      };

      const response = await submitSubscription(subscriptionData);
      if (response.success) {
        setSubmitStatus('success');
        setFormData(initialData);
        setErrors({});
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const labelCls = 'text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block';
  const fieldCls = (field: keyof Errors) =>
    `bg-black border ${errors[field] ? 'border-red-500' : 'border-[#e6332a]/30'} text-gray-300 focus:border-[#e6332a]`;
  const selectCls = (hasErr: boolean) =>
    `w-full bg-black border ${hasErr ? 'border-red-500' : 'border-[#e6332a]/30'} text-gray-300 focus:border-[#e6332a] focus:outline-none px-3 py-2 rounded-md`;
  const ErrMsg = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 border-2 border-[#e6332a] p-6 sm:p-8 md:p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <img
            src="/logo/ekidna-icon.svg"
            alt=""
            aria-hidden="true"
            style={{ height: 'clamp(3.5rem, 8vw, 5rem)' }}
            className="mx-auto mb-8"
          />
          <h1 className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-[0.15em] text-[#e6332a] mb-6">
            Diventa socio/a/ə di Ekidna
          </h1>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La tessera associativa è completamente gratuita
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="border border-[#e6332a]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-2xl text-[#e6332a] mb-6 uppercase tracking-[0.15em]">
              Diventa socio/a/ə di Associazione Ekidna
            </h2>
            <div className="h-px w-24 bg-[#e6332a] mb-8"></div>
            <p className="text-gray-400 leading-relaxed mb-6">
              L'Associazione Ekidna è uno spazio autogestito, culturale e indipendente. Per partecipare alle nostre attività, ai concerti, ai nostri eventi e frequentare i nostri spazi è necessario tesserarsi.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              La tessera associativa è <span className="text-[#e6332a]">completamente gratuita</span>, ha validità per l'anno in corso e l'adesione comporta l'accettazione dello Statuto dell'Associazione.
            </p>
            <p className="text-gray-500 text-sm">
              Compila il modulo qui sotto per richiedere la tua tessera associativa gratuita.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="border border-[#e6332a]/30 p-8 md:p-12 bg-zinc-950/50 shadow-xl">
            <div className="space-y-6">
              {/* Honeypot anti-bot: nascosto agli utenti reali */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="website">Non compilare questo campo</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* Nome / Cognome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome" className={labelCls}>Nome *</Label>
                  <Input id="nome" name="nome" type="text" maxLength={50} autoComplete="given-name"
                    value={formData.nome} onChange={handleChange} className={fieldCls('nome')} />
                  <ErrMsg msg={errors.nome} />
                </div>
                <div>
                  <Label htmlFor="cognome" className={labelCls}>Cognome *</Label>
                  <Input id="cognome" name="cognome" type="text" maxLength={50} autoComplete="family-name"
                    value={formData.cognome} onChange={handleChange} className={fieldCls('cognome')} />
                  <ErrMsg msg={errors.cognome} />
                </div>
              </div>

              {/* Email / Telefono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className={labelCls}>Email *</Label>
                  <Input id="email" name="email" type="email" inputMode="email" maxLength={255} autoComplete="email"
                    value={formData.email} onChange={handleChange} className={fieldCls('email')} />
                  <ErrMsg msg={errors.email} />
                </div>
                <div>
                  <Label htmlFor="telefono" className={labelCls}>Telefono *</Label>
                  <Input id="telefono" name="telefono" type="tel" inputMode="tel" maxLength={20} autoComplete="tel"
                    value={formData.telefono} onChange={handleChange} className={fieldCls('telefono')} />
                  <ErrMsg msg={errors.telefono} />
                </div>
              </div>

              {/* Data di nascita: 3 menu (giorno / mese / anno) — comodo da telefono */}
              <div>
                <Label className={labelCls}>Data di Nascita *</Label>
                <div className="grid grid-cols-3 gap-3">
                  <select name="giorno" aria-label="Giorno" value={formData.giorno}
                    onChange={handleChange} className={selectCls(!!errors.dataNascita)}>
                    <option value="">Giorno</option>
                    {GIORNI.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select name="mese" aria-label="Mese" value={formData.mese}
                    onChange={handleChange} className={selectCls(!!errors.dataNascita)}>
                    <option value="">Mese</option>
                    {MESI.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                  <select name="anno" aria-label="Anno" value={formData.anno}
                    onChange={handleChange} className={selectCls(!!errors.dataNascita)}>
                    <option value="">Anno</option>
                    {ANNI.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <ErrMsg msg={errors.dataNascita} />
              </div>

              {/* Indirizzo */}
              <div>
                <Label htmlFor="indirizzo" className={labelCls}>Indirizzo *</Label>
                <Input id="indirizzo" name="indirizzo" type="text" maxLength={100} autoComplete="street-address"
                  value={formData.indirizzo} onChange={handleChange} className={fieldCls('indirizzo')} />
                <ErrMsg msg={errors.indirizzo} />
              </div>

              {/* Città / CAP / Provincia */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="citta" className={labelCls}>Città *</Label>
                  <Input id="citta" name="citta" type="text" maxLength={50} autoComplete="address-level2"
                    value={formData.citta} onChange={handleChange} className={fieldCls('citta')} />
                  <ErrMsg msg={errors.citta} />
                </div>
                <div>
                  <Label htmlFor="cap" className={labelCls}>CAP *</Label>
                  <Input id="cap" name="cap" type="text" inputMode="numeric" maxLength={5} autoComplete="postal-code"
                    value={formData.cap} onChange={handleChange} className={fieldCls('cap')} placeholder="41012" />
                  <ErrMsg msg={errors.cap} />
                </div>
                <div>
                  <Label htmlFor="provincia" className={labelCls}>Provincia *</Label>
                  <Input id="provincia" name="provincia" type="text" maxLength={2}
                    value={formData.provincia} onChange={handleChange} className={fieldCls('provincia')} placeholder="MO" />
                  <ErrMsg msg={errors.provincia} />
                </div>
              </div>

              {/* Motivazione */}
              <div>
                <Label htmlFor="motivazione" className={labelCls}>Perché vuoi far parte di Ekidna?</Label>
                <Textarea id="motivazione" name="motivazione" rows={5} maxLength={1000}
                  value={formData.motivazione} onChange={handleChange}
                  className={`${fieldCls('motivazione')} resize-none`} placeholder="Raccontaci..." />
                <ErrMsg msg={errors.motivazione} />
              </div>

              {/* Consensi */}
              <div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="accettaTermini" checked={formData.accettaTermini}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({ ...prev, accettaTermini: checked as boolean }));
                      if (errors.accettaTermini) setErrors((prev) => ({ ...prev, accettaTermini: undefined }));
                    }}
                    className="border border-[#e6332a]/30 data-[state=checked]:bg-[#e6332a] data-[state=checked]:border-[#e6332a]" />
                  <Label htmlFor="accettaTermini" className="text-gray-400 text-sm leading-relaxed cursor-pointer">
                    Dichiaro di condividere i valori di Ekidna APS (antifascismo, transfemminismo, ecologia, DIY) e accetto lo statuto dell'associazione *
                  </Label>
                </div>
                <ErrMsg msg={errors.accettaTermini} />
              </div>

              <div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="accettaPrivacy" checked={formData.accettaPrivacy}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({ ...prev, accettaPrivacy: checked as boolean }));
                      if (errors.accettaPrivacy) setErrors((prev) => ({ ...prev, accettaPrivacy: undefined }));
                    }}
                    className="border border-[#e6332a]/30 data-[state=checked]:bg-[#e6332a] data-[state=checked]:border-[#e6332a]" />
                  <Label htmlFor="accettaPrivacy" className="text-gray-400 text-sm leading-relaxed cursor-pointer">
                    Ho letto e accetto la{' '}
                    <Link to="/privacy" target="_blank" className="text-[#e6332a] hover:underline">Privacy Policy</Link>{' '}
                    e acconsento al trattamento dei miei dati personali per la gestione dell'iscrizione *
                  </Label>
                </div>
                <ErrMsg msg={errors.accettaPrivacy} />
              </div>

              {/* Messaggi di stato */}
              {submitStatus === 'success' && (
                <div className="bg-black border border-green-600 p-4 text-green-500 text-sm uppercase tracking-wider">
                  Grazie! La tua richiesta è stata inviata. Ti contatteremo presto.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-black border border-red-600 p-4 text-red-500 text-sm uppercase tracking-wider">
                  Errore nell'invio. Riprova più tardi o contattaci via email.
                </div>
              )}
              {Object.keys(errors).length > 0 && (
                <div className="bg-black border border-red-600/60 p-4 text-red-400 text-sm uppercase tracking-wider">
                  Controlla i campi evidenziati in rosso.
                </div>
              )}

              {/* Invio */}
              <Button type="submit" disabled={isSubmitting}
                className="w-full bg-[#e6332a] hover:bg-[#c41e17] text-black py-6 uppercase tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed border border-[#e6332a] shadow-lg">
                {isSubmitting ? 'Invio...' : 'Invia richiesta'}
              </Button>

              <p className="text-gray-600 text-xs text-center uppercase tracking-wider">
                * Campi obbligatori
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

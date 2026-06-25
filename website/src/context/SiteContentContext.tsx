import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { checkAPIHealth } from '../config/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Default fallback content (shown if API is unreachable)
const DEFAULTS = {
  home: {
    hero_sottotitolo: 'Spazio autogestito, culturale e indipendente dal 1998',
    cta_titolo: 'Diventa sociə di Ekidna',
    cta_testo: "L'Associazione Ekidna è uno spazio autogestito, culturale e indipendente. Per partecipare alle nostre attività, ai concerti, ai nostri eventi e frequentare i nostri spazi è necessario tesserarsi. La tessera associativa è completamente gratuita, ha validità per l'anno in corso e l'adesione comporta l'accettazione dello Statuto dell'Associazione.",
  },
  chi_siamo: {
    storia_testo: 'Ekidna nasce nel 1998 da alcune persone che, volendo accomunare i loro interessi per la musica e i valori della cultura underground, hanno creato un\'associazione non a scopo di lucro dove chi vuole può incontrarsi liberamente per condividere gli ideali di antifascismo, transfemminismo, ecologia, DIY e promozione dell\'arte a livello locale.',
    sede_testo: 'Dapprima in maniera errante spostandosi nella bassa modenese, Ekidna si stabilisce nell\'ex scuola elementare di San Martino sulla Secchia, concessa in comodato d\'uso gratuito dal Comune di Carpi.',
  },
  eventi: {
    lista_eventi: JSON.stringify([
      { id: 1, title: 'Metal Night', date: '2025-10-25', time: '21:00', genre: 'Metal', description: 'Una serata dedicata al metal con band locali e internazionali' },
      { id: 2, title: 'Punk & Hardcore Fest', date: '2025-11-08', time: '20:00', genre: 'Punk', description: 'Festival punk con diverse band dalla scena underground italiana' },
      { id: 3, title: 'Tekno Sound System', date: '2025-11-22', time: '22:00', genre: 'Tekno', description: 'Notte di musica tekno con sound system e DJ set' },
    ]),
  },
  galleria: {
    gallery_items: JSON.stringify([
      { id: 1, url: 'https://images.unsplash.com/photo-1540039155733-5bb30b4201de?w=800', alt: 'Concert crowd' },
      { id: 2, url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', alt: 'Metal concert' },
      { id: 3, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', alt: 'Underground concert' },
    ]),
  },
  dove_siamo: {
    indirizzo: 'Ex scuola elementare di San Martino sulla Secchia, Carpi (MO)',
    maps_url: '',
    come_arrivare: 'San Martino sulla Secchia si trova a circa 10km da Carpi. Provenendo da Carpi, prendere la SP413 in direzione Mirandola.',
  },
  contatti: {
    intro_testo: 'Ekidna è uno spazio aperto ad ogni proposta. Scrivici per collaborare o proporre un evento!',
    email: 'ekidnacarpi@gmail.com',
    telefono: '+39 371 630 7881',
    facebook_url: 'https://www.facebook.com/associazioneekidna',
    instagram_url: 'https://www.instagram.com/associazione_ekidna/',
  },
};

type SiteContent = typeof DEFAULTS;

const SiteContentContext = createContext<SiteContent>(DEFAULTS);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULTS);

  useEffect(() => {
    fetch(`${API_BASE}/content`)
      .then(r => r.json())
      .then(({ data }) => {
        if (data) {
          // Merge API data over defaults so missing keys still have fallbacks
          const merged: any = { ...DEFAULTS };
          for (const page of Object.keys(DEFAULTS)) {
            merged[page] = { ...(DEFAULTS as any)[page], ...(data[page] || {}) };
          }
          setContent(merged);
        }
      })
      .catch(() => { /* stay with defaults */ });
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export const useSiteContent = <K extends keyof SiteContent>(page: K): SiteContent[K] => {
  return useContext(SiteContentContext)[page];
};

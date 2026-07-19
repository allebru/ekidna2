import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SiteContentData = Record<string, Record<string, string>>;

// Usato solo quando la pagina non arriva da SSR (es. `vite dev` puro, senza backend):
// permette di lavorare sulla grafica senza dover avere DB/API attivi.
// In produzione i dati arrivano sempre da window.__INITIAL_DATA__ (SSR) e questo
// fallback non viene mai mostrato.
const FALLBACK: SiteContentData = {
  home: {
    hero_sottotitolo: 'Spazio autogestito, culturale e indipendente dal 1998',
    cta_titolo: 'Diventa sociə di Ekidna',
    cta_testo: "L'Associazione Ekidna è uno spazio autogestito, culturale e indipendente. Per partecipare alle nostre attività, ai concerti, ai nostri eventi e frequentare i nostri spazi è necessario tesserarsi. La tessera associativa è completamente gratuita, ha validità per l'anno in corso e l'adesione comporta l'accettazione dello Statuto dell'Associazione.",
    hero_immagine: '/img/home-hero.jpg',
    cta_immagine: '/img/tesseramento-bg.jpg',
  },
  chi_siamo: {
    storia_testo: 'Ekidna nasce nel 1998 da alcune persone che, volendo accomunare i loro interessi per la musica e i valori della cultura underground, hanno creato un\'associazione non a scopo di lucro dove chi vuole può incontrarsi liberamente per condividere gli ideali di antifascismo, transfemminismo, ecologia, DIY e promozione dell\'arte a livello locale.',
    sede_testo: 'Dapprima in maniera errante spostandosi nella bassa modenese, Ekidna si stabilisce nell\'ex scuola elementare di San Martino sulla Secchia, concessa in comodato d\'uso gratuito dal Comune di Carpi.',
    sede_immagine: '/img/ekidna-luogo.jpg',
  },
  eventi: {
    lista_eventi: JSON.stringify([
      {
        id: 1,
        slug: 'rottura-del-silenzio-27',
        title: 'Rottura del Silenzio — Ed. 27',
        date: '2026-06-25',
        endDate: '2026-06-28',
        dateLabel: '25 – 28 Giugno 2026',
        genre: 'Festival',
        image: '/img/eventi/rottura-del-silenzio-27.jpg',
        description: "27 anni di rumore, indipendenza e voglia di stare insieme. Rottura del Silenzio torna nel giardino di Associazione Ekidna: quattro giorni di concerti, zone distro, proiezioni e installazioni.",
        lineup: [
          'GIO 25/06 (free entry) — Warm Up: docufilm “Uzeda – Do It Yourself” di Maria Arena',
          'VEN 26/06 — Sick Tamburo · Tense-Up · Adriana',
          'SAB 27/06 — Kaos & Egreen · Cigno · Browbeat · Give Vent · H-Strychnine · Nube · 4Tracks',
          'DOM 28/06 — Uzeda · Three Second Kiss · The Jackson Pollock · Bruuno · Fosca · To Die On Ice · Requiem for Paola P.',
        ],
        info: [
          'Dove: Via Livorno 9, Carpi (MO) — Associazione Ekidna',
          'Ingresso: 15€ al giorno (giovedì gratuito)',
          'Biglietti disponibili solo in cassa (no prevendite online)',
          'Cena, food & drinks, stage esterno e zona distro per tutta la durata del festival',
        ],
        link: 'https://www.facebook.com/events/1001945245623495',
      },
      {
        id: 2,
        slug: 'the-end-of-impact-fest',
        title: 'The End of Impact Fest',
        date: '2026-07-10',
        endDate: '2026-07-12',
        dateLabel: '10 – 12 Luglio 2026',
        genre: 'Festival',
        image: '/img/eventi/end-of-impact-fest.jpg',
        description: "L'ultima edizione di Impact Fest. Tre giorni, due palchi, distro & zine area, talk & market, free camping, vegan food, zones of silence, awareness team e workshop. See you at Associazione Ekidna.",
        lineup: [
          'VEN 10/07 — Emma Goldman · L’Idylle · Put Pùrana · Older Friends · Ineptitude · Uragano · Casamatta · Ghostboycoma',
          'SAB 11/07 — Ostraca · Kokeshi · Powerplant · Vibora · Shizune · Oakhands · Calathea · Shooting Daggers · Cady · Emes · Plastic Bags For Helmets · Dagerman · Kadreka · Foscø · Laurie Bird · Nubifragio · Ghostboycoma',
          'DOM 12/07 — Moshimoshi · Nivra · Verogna · Falesia · Hatsu No Hado · Marcovaldo · Nirano · Legni Vecchi · Vote For Pedro · Flâneur · Yarostan · Lumière',
        ],
        info: [
          'Dove: Via Livorno 9, Carpi (MO) — Associazione Ekidna',
          '2 live stages / distro & zine area / talk & market / free camping / vegan food',
          'Full pass ticket disponibile online',
        ],
        link: 'https://www.facebook.com/events/1346447074184921',
      },
    ]),
  },
  galleria: {
    gallery_items: JSON.stringify([
      { id: 1, url: '/img/ekidna-luogo.jpg', alt: 'La sede di Associazione Ekidna a San Martino sulla Secchia (Carpi)' },
      { id: 2, url: '/img/gallery/g1.jpg', alt: 'Associazione Ekidna — evento' },
      { id: 3, url: '/img/gallery/g2.jpg', alt: 'Associazione Ekidna — concerto' },
      { id: 4, url: '/img/gallery/g3.jpg', alt: 'Associazione Ekidna — serata underground' },
      { id: 5, url: '/img/gallery/g4.jpg', alt: 'Associazione Ekidna — live' },
      { id: 6, url: '/img/gallery/g5.jpg', alt: 'Associazione Ekidna — pubblico' },
      { id: 7, url: '/img/gallery/g6.jpg', alt: 'Associazione Ekidna — festival' },
      { id: 8, url: '/img/gallery/g7.jpg', alt: 'Associazione Ekidna — spazio e attività' },
      { id: 9, url: '/img/gallery/g8.jpg', alt: 'Associazione Ekidna — momenti dal circolo' },
      { id: 10, url: '/img/gallery/g9.jpg', alt: 'Associazione Ekidna — il palco' },
    ]),
  },
  dove_siamo: {
    indirizzo: 'Via Livorno 9, 41012 Carpi (MO)',
    maps_url: '',
    come_arrivare: "L'associazione Ekidna è un bel posto e lo abbiamo già detto nella recensione. Tuttavia, può non essere scontato come raggiungerla, specie quando c'è la nebbia o quando si vive in Costa d'Avorio: ecco dunque che Sessuolo.org offre una specie di guida Lonely Planet con i dieci migliori metodi per arrivare all'Ekidna di Carpi, diligentemente scelti per Voi dalla Redazione! Vai col televoto.",
    sede_immagine: '/img/ekidna-luogo.jpg',
  },
  contatti: {
    intro_testo: 'Ekidna è uno spazio aperto ad ogni proposta. Scrivici per collaborare o proporre un evento!',
    email: 'ekidnacarpi@gmail.com',
    telefono: '+39 371 630 7881',
    facebook_url: 'https://www.facebook.com/associazioneekidna',
    instagram_url: 'https://www.instagram.com/associazione_ekidna/',
  },
};

const SiteContentContext = createContext<SiteContentData>(FALLBACK);

export function SiteContentProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: SiteContentData;
}) {
  const [data, setData] = useState<SiteContentData>(initialData ?? FALLBACK);

  useEffect(() => {
    // Se i dati arrivano già da SSR/hydration non serve rifetchare.
    if (initialData) return;
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => {
        if (res?.data) setData((prev) => ({ ...prev, ...res.data }));
      })
      .catch(() => {
        /* resta il fallback statico */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SiteContentContext.Provider value={data}>{children}</SiteContentContext.Provider>;
}

export const useSiteContent = (page: string): Record<string, string> => {
  return useContext(SiteContentContext)[page] ?? {};
};

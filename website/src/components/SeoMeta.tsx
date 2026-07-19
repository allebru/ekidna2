import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'Ekidna APS';
const BASE_URL = 'https://ekidnacarpi.it';

type Meta = { title: string; description: string };

const META: Record<string, Meta> = {
  '/': {
    title: 'Ekidna APS — Spazio autogestito, culturale e indipendente | Carpi',
    description:
      'Associazione Ekidna (Carpi, MO): spazio autogestito e indipendente dal 1998. Concerti, eventi e cultura underground. Tesseramento gratuito.',
  },
  '/chi-siamo': {
    title: 'Chi Siamo — Ekidna APS',
    description:
      'La storia di Ekidna dal 1998: spazio underground a San Martino sulla Secchia (Carpi), tra antifascismo, transfemminismo, ecologia e DIY.',
  },
  '/eventi': {
    title: 'Eventi e Concerti — Ekidna APS',
    description:
      'Prossimi concerti e festival underground all\'Associazione Ekidna di Carpi: punk, hardcore, metal e molto altro.',
  },
  '/galleria': {
    title: 'Galleria — Ekidna APS',
    description: 'Foto dei concerti, eventi e festival dell\'Associazione Ekidna di Carpi.',
  },
  '/dove-siamo': {
    title: 'Dove Siamo — Ekidna APS',
    description: 'Come raggiungere Ekidna: Via Livorno 9, 41012 Carpi (MO), ex scuola di San Martino sulla Secchia.',
  },
  '/contatti': {
    title: 'Contatti — Ekidna APS',
    description: 'Contatta Ekidna APS per collaborazioni, proposte di eventi o per partecipare alle riunioni.',
  },
  '/iscriviti': {
    title: 'Tesseramento gratuito — Diventa socio/a di Ekidna APS',
    description:
      'Tesserati gratuitamente ad Ekidna APS: compila il modulo e diventa socio/a per partecipare a eventi, concerti e attività.',
  },
  '/privacy': {
    title: 'Privacy & Cookie Policy — Ekidna APS',
    description: 'Informativa sulla privacy e sui cookie del sito di Ekidna APS.',
  },
};

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SeoMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = META[pathname] ?? META['/'];
    const url = `${BASE_URL}${pathname === '/' ? '' : pathname}`;

    document.title = m.title;
    setMeta('description', m.description);
    setLink('canonical', url);

    // Open Graph / social
    setMeta('og:site_name', SITE, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:title', m.title, 'property');
    setMeta('og:description', m.description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', `${BASE_URL}/logo/ekidna-logo-v.svg`, 'property');
    setMeta('twitter:card', 'summary_large_image');
  }, [pathname]);

  return null;
}

import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { parseEvents } from './Eventi';

const SITE = 'Ekidna APS';
const BASE_URL = 'https://ekidnacarpi.it';
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo/ekidna-logo-v.svg`;

type SeoEntry = { meta_title: string; meta_description: string; og_image?: string | null };

function pageKeyFor(pathname: string): string {
  if (pathname === '/') return 'home';
  return pathname.replace(/^\//, '').split('/')[0].replace(/-/g, '_');
}

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

// L'HTML iniziale ha già i meta corretti (assemblati server-side in
// backend/src/services/ssr.js a partire da page_seo + eventi). Questo
// componente serve solo a mantenerli corretti quando si naviga TRA le pagine
// della SPA senza un nuovo giro dal server (comportamento normale di una SPA
// dopo l'hydration).
export function SeoMeta() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const eventiContent = useSiteContent('eventi');
  const [seo, setSeo] = useState<Record<string, SeoEntry>>({});

  useEffect(() => {
    fetch('/api/seo')
      .then((r) => r.json())
      .then((res) => res?.data && setSeo(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const key = pageKeyFor(pathname);
    let title = seo[key]?.meta_title;
    let description = seo[key]?.meta_description ?? '';
    let ogImage = seo[key]?.og_image || DEFAULT_OG_IMAGE;

    if (key === 'eventi' && slug) {
      const events = parseEvents(eventiContent.lista_eventi);
      const event = events.find((e) => e.slug === slug);
      if (event) {
        title = `${event.title} — ${SITE}`;
        description = event.description;
        ogImage = event.image?.startsWith('http') ? event.image : `${BASE_URL}${event.image}`;
      }
    }

    // Dati SEO non ancora arrivati dal fetch: lascia quelli già scritti da SSR.
    if (!title) return;

    const url = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    document.title = title;
    setMeta('description', description);
    setLink('canonical', url);
    setMeta('og:site_name', SITE, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('twitter:card', 'summary_large_image');

    if (pathname === '/iscrizione-confermata') {
      setMeta('robots', 'noindex, nofollow');
    }
  }, [pathname, slug, seo, eventiContent.lista_eventi]);

  return null;
}

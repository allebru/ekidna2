const path = require('path');
const fs = require('fs');
const SiteContent = require('../models/SiteContent');
const PageSeo = require('../models/PageSeo');
const ssrCache = require('./ssrCache');

const BASE_URL = process.env.SITE_URL || 'https://ekidnacarpi.it';
const SITE_NAME = 'Ekidna APS';
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo/ekidna-logo-v.svg`;

// Rotte statiche note → chiave pagina in site_content/page_seo. Riusata anche
// per la sitemap e per decidere se una richiesta va servita o è un vero 404.
const STATIC_PAGE_KEYS = {
  '/': 'home',
  '/chi-siamo': 'chi_siamo',
  '/eventi': 'eventi',
  '/galleria': 'galleria',
  '/dove-siamo': 'dove_siamo',
  '/contatti': 'contatti',
  '/iscriviti': 'iscriviti',
  '/iscrizione-confermata': 'iscrizione_confermata',
  '/privacy': 'privacy',
};

const TEMPLATE_PATH = path.join(__dirname, '../../public/site/index.html');
let templateHtml = null;
function getTemplate() {
  if (!templateHtml) {
    templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  }
  return templateHtml;
}

const SSR_BUNDLE_PATH = path.join(__dirname, '../ssr/entry-server.mjs');
let renderFn = null;
async function getRenderFn() {
  if (!renderFn) {
    const mod = await import(SSR_BUNDLE_PATH);
    renderFn = mod.render;
  }
  return renderFn;
}

function parseEvents(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function loadInitialData() {
  const pages = ['home', 'chi_siamo', 'eventi', 'galleria', 'dove_siamo', 'contatti'];
  const data = {};
  for (const page of pages) {
    data[page] = await SiteContent.getPage(page);
  }
  return data;
}

// Determina come trattare una richiesta: pagina statica nota, pagina-evento
// dinamica, o nessuna corrispondenza (→ 404 reale, niente soft-404).
function resolveRoute(pathname, initialData) {
  if (Object.prototype.hasOwnProperty.call(STATIC_PAGE_KEYS, pathname)) {
    return { type: 'static', pageKey: STATIC_PAGE_KEYS[pathname] };
  }
  const match = pathname.match(/^\/eventi\/([^/]+)\/?$/);
  if (match) {
    const events = parseEvents(initialData.eventi && initialData.eventi.lista_eventi);
    const event = events.find((e) => e.slug === match[1]);
    if (event) return { type: 'event', pageKey: 'eventi', event };
  }
  return { type: 'notfound' };
}

function escapeAttr(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function organizationJsonLd(initialData) {
  const contatti = initialData.contatti || {};
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo/ekidna-logo-v.svg`,
    email: contatti.email || undefined,
    telephone: contatti.telefono || undefined,
    sameAs: [contatti.facebook_url, contatti.instagram_url].filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Livorno 9',
      addressLocality: 'Carpi',
      addressRegion: 'MO',
      postalCode: '41012',
      addressCountry: 'IT',
    },
  };
}

function absoluteImage(image) {
  if (!image) return DEFAULT_OG_IMAGE;
  return image.startsWith('http') ? image : `${BASE_URL}${image}`;
}

function eventJsonLd(event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    image: absoluteImage(event.image),
    startDate: event.date || undefined,
    endDate: event.endDate || event.date || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Associazione Ekidna',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Via Livorno 9',
        addressLocality: 'Carpi',
        addressRegion: 'MO',
        postalCode: '41012',
        addressCountry: 'IT',
      },
    },
    url: event.slug ? `${BASE_URL}/eventi/${event.slug}` : undefined,
  };
}

function buildHead({ pathname, title, description, ogImage, jsonLd, noindex }) {
  const url = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="it_IT" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (noindex) tags.push('<meta name="robots" content="noindex, nofollow" />');
  for (const entry of jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(entry).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}

// Renderizza (con cache) l'HTML completo per un pathname pubblico.
// Ritorna { status, html }. status è 404 se la rotta non esiste davvero.
async function renderPage(pathname) {
  const cached = ssrCache.get(pathname);
  if (cached) return cached;

  const initialData = await loadInitialData();
  const route = resolveRoute(pathname, initialData);

  let result;
  if (route.type === 'notfound') {
    const render = await getRenderFn();
    const bodyHtml = render(pathname, initialData);
    const head = buildHead({
      pathname,
      title: `Pagina non trovata — ${SITE_NAME}`,
      description: 'La pagina richiesta non esiste.',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: [],
      noindex: true,
    });
    result = { status: 404, html: assemble(head, bodyHtml, initialData) };
  } else {
    const seo = await PageSeo.getPage(route.pageKey);
    const render = await getRenderFn();
    const bodyHtml = render(pathname, initialData);

    // "iscrizione_confermata" non ha una riga in page_seo (pagina di
    // ringraziamento, noindex): un fallback dedicato invece di un titolo
    // generico se in futuro nessuno lo imposta da CMS.
    const fallbackTitle = route.pageKey === 'iscrizione_confermata'
      ? `Iscrizione confermata — ${SITE_NAME}`
      : SITE_NAME;
    const fallbackDescription = route.pageKey === 'iscrizione_confermata'
      ? 'La tua richiesta di tesseramento è stata inviata con successo.'
      : '';

    let title = seo ? seo.meta_title : fallbackTitle;
    let description = seo ? seo.meta_description : fallbackDescription;
    let ogImage = seo && seo.og_image ? absoluteImage(seo.og_image) : DEFAULT_OG_IMAGE;
    const jsonLd = [organizationJsonLd(initialData)];
    let noindex = route.pageKey === 'iscrizione_confermata';

    if (route.type === 'event') {
      title = `${route.event.title} — ${SITE_NAME}`;
      description = route.event.description;
      ogImage = absoluteImage(route.event.image);
      jsonLd.push(eventJsonLd(route.event));
    } else if (route.pageKey === 'eventi') {
      const events = parseEvents(initialData.eventi && initialData.eventi.lista_eventi);
      for (const ev of events) jsonLd.push(eventJsonLd(ev));
    }

    const head = buildHead({ pathname, title, description, ogImage, jsonLd, noindex });
    result = { status: 200, html: assemble(head, bodyHtml, initialData) };
  }

  ssrCache.set(pathname, result);
  return result;
}

function assemble(headTags, bodyHtml, initialData) {
  // type="application/json" (non "application/javascript"): il browser non lo
  // esegue come script, quindi non è soggetto alla CSP script-src 'self' —
  // niente nonce da gestire. entry-client.tsx lo legge e fa JSON.parse().
  const dataScript = `<script type="application/json" id="__INITIAL_DATA__">${JSON.stringify(initialData).replace(/</g, '\\u003c')}</script>`;
  return getTemplate()
    // Rimuove i meta statici di fallback (title/description/canonical/OG) usati
    // solo quando la build viene aperta senza passare da Express: qui li
    // sostituiamo sempre con quelli reali, per pagina.
    .replace(/<!--default-head-start-->[\s\S]*?<!--default-head-end-->/, '')
    .replace('<!--app-head-->', headTags)
    .replace('<!--app-html-->', bodyHtml)
    .replace('<!--app-data-->', dataScript);
}

// Elenco di rotte pubbliche note, usato dalla sitemap dinamica.
async function listKnownRoutes() {
  const initialData = await loadInitialData();
  const events = parseEvents(initialData.eventi && initialData.eventi.lista_eventi);
  const staticRoutes = Object.keys(STATIC_PAGE_KEYS).filter((p) => p !== '/iscrizione-confermata');
  const eventRoutes = events.filter((e) => e.slug).map((e) => `/eventi/${e.slug}`);
  return [...staticRoutes, ...eventRoutes];
}

module.exports = { renderPage, listKnownRoutes, resolveRoute, loadInitialData, STATIC_PAGE_KEYS };

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SiteContentProvider, SiteContentData } from './context/SiteContentContext';
import './styles/globals.css';

function readInitialData(): SiteContentData | undefined {
  // Letto da un tag <script type="application/json">, non da window.__X__:
  // un tag application/json non è eseguito dal browser, quindi non è soggetto
  // alla CSP script-src (niente nonce da gestire lato server).
  const el = document.getElementById('__INITIAL_DATA__');
  if (!el?.textContent) return undefined;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return undefined;
  }
}

const container = document.getElementById('root')!;
const initialData = readInitialData();

const app = (
  <SiteContentProvider initialData={initialData}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SiteContentProvider>
);

// Pagina arrivata da SSR (ha già markup) → hydrate. Altrimenti (es. `vite dev`
// puro, senza backend Express davanti) → render client puro.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

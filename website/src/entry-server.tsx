import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { SiteContentProvider, SiteContentData } from './context/SiteContentContext';

// Consumato dal backend (Express) via import dinamico: dato un pathname e i
// dati correnti del CMS, produce l'HTML del corpo pagina (senza <head>: quello
// viene assemblato dal backend con i meta letti dal DB — vedi backend/src/services/ssr.js).
export function render(url: string, initialData: SiteContentData): string {
  return renderToString(
    <SiteContentProvider initialData={initialData}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </SiteContentProvider>
  );
}

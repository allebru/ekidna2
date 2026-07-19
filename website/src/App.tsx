import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { PageBackground } from './components/PageBackground';
import { ScrollToTop } from './components/ScrollToTop';
import { SeoMeta } from './components/SeoMeta';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ChiSiamo } from './components/ChiSiamo';
import { Eventi } from './components/Eventi';
import { EventDetail } from './components/EventDetail';
import { Galleria } from './components/Galleria';
import { DoveSiamo } from './components/DoveSiamo';
import { Contatti } from './components/Contatti';
import { Iscriviti } from './components/Iscriviti';
import { IscrizioneConfermata } from './components/IscrizioneConfermata';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { NotFound } from './components/NotFound';
import { CookieBanner } from './components/CookieBanner';

// Nessun Router/Provider qui: sono forniti dagli entry point (entry-client per
// il browser, entry-server per l'SSR) così questo stesso albero funziona
// identico in entrambi i contesti.
export default function App() {
  return (
    <>
      <ScrollToTop />
      <SeoMeta />
      <div className="relative min-h-screen text-white">
        <PageBackground />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/eventi" element={<Eventi />} />
            <Route path="/eventi/:slug" element={<EventDetail />} />
            <Route path="/galleria" element={<Galleria />} />
            <Route path="/dove-siamo" element={<DoveSiamo />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/iscriviti" element={<Iscriviti />} />
            <Route path="/iscrizione-confermata" element={<IscrizioneConfermata />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}

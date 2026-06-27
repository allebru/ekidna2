import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { PageBackground } from './components/PageBackground';
import { ScrollToTop } from './components/ScrollToTop';
import { SeoMeta } from './components/SeoMeta';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ChiSiamo } from './components/ChiSiamo';
import { Eventi } from './components/Eventi';
import { Galleria } from './components/Galleria';
import { DoveSiamo } from './components/DoveSiamo';
import { Contatti } from './components/Contatti';
import { Iscriviti } from './components/Iscriviti';
import { IscrizioneConfermata } from './components/IscrizioneConfermata';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CookieBanner } from './components/CookieBanner';
import { SiteContentProvider } from './context/SiteContentContext';

export default function App() {
  return (
    <SiteContentProvider>
    <Router>
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
            <Route path="/galleria" element={<Galleria />} />
            <Route path="/dove-siamo" element={<DoveSiamo />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/iscriviti" element={<Iscriviti />} />
            <Route path="/iscrizione-confermata" element={<IscrizioneConfermata />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
    </SiteContentProvider>
  );
}

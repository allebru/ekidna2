import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ChiSiamo } from './components/ChiSiamo';
import { Eventi } from './components/Eventi';
import { Galleria } from './components/Galleria';
import { DoveSiamo } from './components/DoveSiamo';
import { Contatti } from './components/Contatti';
import { Iscriviti } from './components/Iscriviti';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

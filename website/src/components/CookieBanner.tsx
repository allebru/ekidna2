import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'ekidna_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}
      className="bg-zinc-950 border-t-2 border-[#e6332a] shadow-2xl"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Questo sito utilizza esclusivamente <strong className="text-gray-300">cookie tecnici</strong> necessari al funzionamento. Nessun cookie di profilazione o tracciamento.{' '}
          <Link to="/privacy" className="text-[#e6332a] hover:underline">
            Leggi la Privacy Policy
          </Link>
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 bg-[#e6332a] hover:bg-[#c41e17] text-black px-6 py-2 uppercase tracking-[0.15em] text-sm font-medium transition-colors"
        >
          Ho capito
        </button>
      </div>
    </div>
  );
}

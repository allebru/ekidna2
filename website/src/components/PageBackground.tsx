import { useLocation } from 'react-router-dom';

// Foto di sfondo del grafico (versioni gia' scurite "OVERLAY"), una per pagina.
const BG: Record<string, string> = {
  '/': '/img/bg/foto-0.jpg',
  '/chi-siamo': '/img/bg/foto-1.jpg',
  '/eventi': '/img/bg/foto-2.jpg',
  '/galleria': '/img/bg/foto-3.jpg',
  '/dove-siamo': '/img/bg/foto-4.jpg',
  '/contatti': '/img/bg/foto-5.jpg',
  '/iscriviti': '/img/bg/foto-0.jpg',
  '/privacy': '/img/bg/foto-1.jpg',
};

export function PageBackground() {
  const { pathname } = useLocation();
  const src = BG[pathname] ?? '/img/bg/foto-0.jpg';
  return (
    <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true">
      <img
        key={src}
        src={src}
        alt=""
        className="w-full h-full object-cover"
      />
      {/* overlay scuro extra per leggibilita' del testo nelle aree libere */}
      <div className="absolute inset-0 bg-black/55"></div>
    </div>
  );
}

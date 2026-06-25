import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Ad ogni cambio pagina riporta lo scroll in cima (HashRouter non lo fa da solo).
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

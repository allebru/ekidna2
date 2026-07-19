import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Eventi', path: '/eventi' },
    { name: 'Galleria', path: '/galleria' },
    { name: 'Tesseramento', path: '/iscriviti' },
    { name: 'Dove Siamo', path: '/dove-siamo' },
    { name: 'Contatti', path: '/contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b-2 border-[#e6332a] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo/ekidna-logo-h.svg"
              alt="Ekidna APS"
              style={{ height: 'clamp(3.25rem, 6vw, 4.25rem)' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 transition-all uppercase tracking-[0.1em] text-sm ${
                  isActive(link.path)
                    ? 'text-black bg-[#e6332a]'
                    : 'text-gray-400 hover:text-[#e6332a]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden text-[#e6332a] uppercase tracking-[0.15em] border border-[#e6332a] px-4 py-2 hover:bg-[#e6332a] hover:text-black transition-colors text-sm">
              Menu
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-l-2 border-[#e6332a] w-[80vw] sm:w-[400px]" hideDefaultClose>
              <div className="flex flex-col space-y-0 mt-8">
                <SheetClose asChild>
                  <button className="px-6 py-4 border-b border-[#e6332a]/40 text-[#e6332a] uppercase tracking-[0.15em] text-sm text-left hover:bg-[#e6332a]/10 transition-colors">
                    ← Chiudi
                  </button>
                </SheetClose>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-6 py-4 transition-all border-b border-[#e6332a]/20 uppercase tracking-[0.1em] text-sm ${
                      isActive(link.path)
                        ? 'text-black bg-[#e6332a]'
                        : 'text-gray-400 hover:text-[#e6332a]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

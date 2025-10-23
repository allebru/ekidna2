import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Eventi', path: '/eventi' },
    { name: 'Galleria', path: '/galleria' },
    { name: 'Dove Siamo', path: '/dove-siamo' },
    { name: 'Contatti', path: '/contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b-2 border-[#d4a017] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="relative">
              <span className="text-2xl md:text-3xl uppercase tracking-[0.25em] text-[#d4a017]">
                EKIDNA
              </span>
              <span className="ml-3 text-xs text-gray-600 uppercase tracking-[0.2em]">
                APS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 transition-all uppercase tracking-[0.1em] text-sm ${
                  isActive(link.path)
                    ? 'text-black bg-[#d4a017]'
                    : 'text-gray-400 hover:text-[#d4a017]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden text-[#d4a017] uppercase tracking-[0.15em] border border-[#d4a017] px-4 py-2 hover:bg-[#d4a017] hover:text-black transition-colors text-sm">
              Menu
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-l-2 border-[#d4a017] w-[80vw] sm:w-[400px]">
              <div className="flex flex-col space-y-0 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-6 py-4 transition-all border-b border-[#d4a017]/20 uppercase tracking-[0.1em] text-sm ${
                      isActive(link.path)
                        ? 'text-black bg-[#d4a017]'
                        : 'text-gray-400 hover:text-[#d4a017]'
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

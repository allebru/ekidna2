import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export function Home() {
  const c = useSiteContent('home');
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img/home-hero.jpg"
            alt="Concerto underground all'Associazione Ekidna"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="border-2 border-[#e6332a] p-8 md:p-16 bg-black/60 backdrop-blur-sm shadow-2xl">
            <img
              src="/logo/ekidna-logo-v.svg"
              alt="Ekidna"
              style={{ height: 'clamp(7rem, 18vw, 12rem)' }}
              className="mx-auto mb-8"
            />
            <div className="h-px bg-gradient-to-r from-transparent via-[#e6332a] to-transparent w-full mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 tracking-[0.15em] uppercase">
              {c.hero_sottotitolo}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/eventi">
                <Button className="bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
                  Eventi
                </Button>
              </Link>
              <Link to="/chi-siamo">
                <Button variant="outline" className="border border-[#e6332a] text-[#e6332a] hover:bg-[#e6332a] hover:text-black px-10 py-6 uppercase tracking-[0.15em]">
                  Scopri di più
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tesseramento CTA */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img/tesseramento-bg.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center border-2 border-[#e6332a] p-12 md:p-20 bg-black/60 backdrop-blur-sm shadow-2xl">
            <img
              src="/logo/ekidna-icon.svg"
              alt=""
              aria-hidden="true"
              style={{ height: 'clamp(3.5rem, 8vw, 5rem)' }}
              className="mx-auto mb-8"
            />
            <h2 className="text-3xl md:text-5xl uppercase tracking-[0.15em] text-[#e6332a] mb-6">
              {c.cta_titolo}
            </h2>
            <div className="h-px w-32 bg-[#e6332a] mx-auto mb-8"></div>
            <p className="text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              {c.cta_testo}
            </p>
            <Link to="/iscriviti" className="block sm:inline-block">
              <Button className="w-full sm:w-auto bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] px-6 sm:px-12 py-5 sm:py-7 uppercase tracking-[0.1em] sm:tracking-[0.15em] shadow-lg text-base sm:text-lg whitespace-normal h-auto leading-snug">
                Diventa sociə di Ekidna
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

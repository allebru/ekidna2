import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759137538239-60e0b1e796fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMGNvbmNlcnQlMjBwdW5rfGVufDF8fHx8MTc2MDY5MDcyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Underground Concert"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="border-2 border-[#d4a017] p-8 md:p-16 bg-black/60 backdrop-blur-sm shadow-2xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl uppercase tracking-[0.2em] mb-8">
              <span className="text-[#d4a017]">EKIDNA</span>
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-[#d4a017] to-transparent w-full mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 tracking-[0.15em] uppercase">
              Underground dal 1998
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/eventi">
                <Button className="bg-[#d4a017] hover:bg-[#b8860b] text-black border border-[#d4a017] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
                  Eventi
                </Button>
              </Link>
              <Link to="/chi-siamo">
                <Button variant="outline" className="border border-[#d4a017] text-[#d4a017] hover:bg-[#d4a017] hover:text-black px-10 py-6 uppercase tracking-[0.15em]">
                  Scopri di più
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-20 md:py-32 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center border-2 border-[#d4a017] p-12 md:p-20 bg-black/60 backdrop-blur-sm shadow-2xl">
            <h2 className="text-4xl md:text-6xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
              Unisciti a Noi
            </h2>
            <div className="h-px w-32 bg-[#d4a017] mx-auto mb-8"></div>
            <p className="text-gray-400 mb-4 leading-relaxed text-lg md:text-xl">
              Diventa parte della scena underground
            </p>
            <p className="text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
              Chiunque condivide i nostri ideali di antifascismo, transfemminismo, ecologia e DIY può diventare socio tesserato gratuitamente e partecipare attivamente a Ekidna APS.
            </p>
            <Link to="/iscriviti">
              <Button className="bg-[#d4a017] hover:bg-[#b8860b] text-black border border-[#d4a017] px-12 py-7 uppercase tracking-[0.15em] shadow-lg text-lg">
                Iscriviti Gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

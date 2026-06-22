import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black border-t-2 border-[#d4a017]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* About */}
          <div className="border border-[#d4a017]/30 p-6 bg-zinc-950/50 shadow-lg">
            <h3 className="text-[#d4a017] mb-4 uppercase tracking-[0.15em]">Ekidna APS</h3>
            <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Dal 1998, uno spazio libero per la cultura underground, l'arte e i valori di antifascismo, transfemminismo ed ecologia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="border border-[#d4a017]/30 p-6 bg-zinc-950/50 shadow-lg">
            <h3 className="text-[#d4a017] mb-4 uppercase tracking-[0.15em]">Link</h3>
            <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors uppercase">
                Home
              </Link>
              <Link to="/chi-siamo" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors uppercase">
                Chi Siamo
              </Link>
              <Link to="/eventi" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors uppercase">
                Eventi
              </Link>
              <Link to="/galleria" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors uppercase">
                Galleria
              </Link>
              <Link to="/dove-siamo" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors uppercase">
                Dove Siamo
              </Link>
              <Link to="/contatti" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors uppercase">
                Contatti
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="border border-[#d4a017]/30 p-6 bg-zinc-950/50 shadow-lg">
            <h3 className="text-[#d4a017] mb-4 uppercase tracking-[0.15em]">Contatti</h3>
            <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
            <div className="flex flex-col space-y-3">
              <a href="mailto:ekidnacarpi@gmail.com" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors break-all">
                ekidnacarpi@gmail.com
              </a>
              <a href="tel:+393716307881" className="text-gray-500 hover:text-[#d4a017] text-sm transition-colors">
                +39 371 630 7881
              </a>
              <div className="flex space-x-6 pt-2">
                <a href="#" className="text-gray-500 hover:text-[#d4a017] transition-colors text-sm uppercase tracking-wider">
                  FB
                </a>
                <a href="#" className="text-gray-500 hover:text-[#d4a017] transition-colors text-sm uppercase tracking-wider">
                  IG
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d4a017]/30 pt-8 text-center space-y-3">
          <div className="flex justify-center gap-6">
            <Link to="/privacy" className="text-gray-600 hover:text-[#d4a017] text-xs uppercase tracking-wider transition-colors">
              Privacy Policy
            </Link>
            <Link to="/privacy#cookie" className="text-gray-600 hover:text-[#d4a017] text-xs uppercase tracking-wider transition-colors">
              Cookie Policy
            </Link>
          </div>
          <p className="text-gray-600 text-sm uppercase tracking-wider">
            © {new Date().getFullYear()} Ekidna APS - Via Livorno 9, 41012 Carpi (MO)
          </p>
        </div>
      </div>
    </footer>
  );
}

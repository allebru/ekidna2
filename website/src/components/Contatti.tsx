import { Button } from './ui/button';

export function Contatti() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 border-2 border-[#d4a017] p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-5xl md:text-7xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
            Contatti
          </h1>
          <div className="h-px w-32 bg-[#d4a017] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Scrivici per collaborare o proporre un evento
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Collabora con Ekidna */}
          <div className="border border-[#d4a017]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-3xl md:text-4xl text-[#d4a017] mb-6 uppercase tracking-[0.15em]">
              Collabora con Ekidna
            </h2>
            <div className="h-px w-24 bg-[#d4a017] mb-8"></div>
            <p className="text-gray-400 leading-relaxed">
              Ekidna è uno spazio aperto ad ogni proposta, se hai una band e ti piacerebbe suonare da noi, se sei un'agenzia e vuoi proporci il tuo rooster, se hai un'idea che vorresti realizzare in Ekidna, scrivici! Cerchiamo di rispondere a tutt3 e di dare spazio a tutt3.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Email */}
            <a
              href="mailto:ekidnacarpi@gmail.com"
              className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group"
            >
              <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">Email</h3>
              <div className="h-px w-12 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 break-all">ekidnacarpi@gmail.com</p>
            </a>

            {/* WhatsApp / SMS */}
            <a
              href="https://wa.me/393716307881"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group"
            >
              <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">WhatsApp / SMS</h3>
              <div className="h-px w-12 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400">+39 371 630 7881</p>
            </a>

            {/* Phone */}
            <a
              href="tel:+393716307881"
              className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group"
            >
              <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">Telefono</h3>
              <div className="h-px w-12 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400">+39 371 630 7881</p>
            </a>

            {/* Social */}
            <div className="bg-zinc-950 border border-[#d4a017]/30 p-8">
              <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">Social Media</h3>
              <div className="h-px w-12 bg-[#d4a017] mb-4"></div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-[#d4a017] transition-colors uppercase tracking-wider text-sm">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-[#d4a017] transition-colors uppercase tracking-wider text-sm">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Riunioni */}
          <div className="border border-[#d4a017]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-2xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">
              Partecipa alle Riunioni
            </h2>
            <div className="h-px w-24 bg-[#d4a017] mb-8"></div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Se sei della zona puoi partecipare alle nostre riunioni settimanali, di solito il mercoledì.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Scrivici via mail o social e ti sapremo dire quando avrà luogo la prossima riunione!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-[#d4a017] hover:bg-[#b8860b] text-black border border-[#d4a017] uppercase tracking-[0.15em] shadow-lg"
              >
                <a href="mailto:ekidnacarpi@gmail.com">
                  Scrivici
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border border-[#d4a017] text-[#d4a017] hover:bg-[#d4a017] hover:text-black uppercase tracking-[0.15em]"
              >
                <a href="https://wa.me/393716307881" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Location Info */}
          <div className="border border-[#d4a017]/30 p-8 text-center bg-zinc-950/50 shadow-xl">
            <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">La nostra sede</h3>
            <div className="h-px w-16 bg-[#d4a017] mx-auto mb-4"></div>
            <p className="text-gray-400">Via Livorno 9, 41012 Carpi (MO)</p>
            <p className="text-gray-500 text-sm mt-2">
              Ex scuola elementare di San Martino sulla Secchia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

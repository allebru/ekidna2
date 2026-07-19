import { Button } from './ui/button';
import { useSiteContent } from '../context/SiteContentContext';

export function Contatti() {
  const c = useSiteContent('contatti');
  const tel = c.telefono?.replace(/\s/g, '') ?? '';
  const telWa = tel.replace('+', '');
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 border-2 border-[#e6332a] p-6 sm:p-8 md:p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-7xl uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#e6332a] mb-6">
            Contatti
          </h1>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Scrivici per collaborare o proporre un evento
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Collabora con Ekidna */}
          <div className="border border-[#e6332a]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#e6332a] mb-6 uppercase tracking-[0.15em]">
              Collabora con Ekidna
            </h2>
            <div className="h-px w-24 bg-[#e6332a] mb-8"></div>
            <p className="text-gray-400 leading-relaxed">{c.intro_testo}</p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Email */}
            <a href={`mailto:${c.email}`} className="bg-zinc-950 border border-[#e6332a]/30 hover:border-[#e6332a] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-lg text-[#e6332a] mb-3 uppercase tracking-[0.15em]">Email</h3>
              <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
              <p className="text-gray-400 break-all">{c.email}</p>
            </a>

            <a href={`https://wa.me/${telWa}`} target="_blank" rel="noopener noreferrer" className="bg-zinc-950 border border-[#e6332a]/30 hover:border-[#e6332a] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-lg text-[#e6332a] mb-3 uppercase tracking-[0.15em]">WhatsApp / SMS</h3>
              <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
              <p className="text-gray-400">{c.telefono}</p>
            </a>

            <a href={`tel:${tel}`} className="bg-zinc-950 border border-[#e6332a]/30 hover:border-[#e6332a] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-lg text-[#e6332a] mb-3 uppercase tracking-[0.15em]">Telefono</h3>
              <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
              <p className="text-gray-400">{c.telefono}</p>
            </a>

            <div className="bg-zinc-950 border border-[#e6332a]/30 p-8">
              <h3 className="text-lg text-[#e6332a] mb-3 uppercase tracking-[0.15em]">Social Media</h3>
              <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
              <div className="flex space-x-6">
                {c.facebook_url && <a href={c.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e6332a] transition-colors uppercase tracking-wider text-sm">Facebook</a>}
                {c.instagram_url && <a href={c.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e6332a] transition-colors uppercase tracking-wider text-sm">Instagram</a>}
              </div>
            </div>
          </div>

          {/* Riunioni */}
          <div className="border border-[#e6332a]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-2xl text-[#e6332a] mb-4 uppercase tracking-[0.15em]">
              Partecipa alle Riunioni
            </h2>
            <div className="h-px w-24 bg-[#e6332a] mb-8"></div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Se sei della zona puoi partecipare alle nostre riunioni settimanali, di solito il mercoledì.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Scrivici via mail o social e ti sapremo dire quando avrà luogo la prossima riunione!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] uppercase tracking-[0.15em] shadow-lg"
              >
                <a href={`mailto:${c.email}`}>
                  Scrivici
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border border-[#e6332a] text-[#e6332a] hover:bg-[#e6332a] hover:text-black uppercase tracking-[0.15em]"
              >
                <a href={`https://wa.me/${telWa}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Location Info */}
          <div className="border border-[#e6332a]/30 p-8 text-center bg-zinc-950/50 shadow-xl">
            <h3 className="text-lg text-[#e6332a] mb-3 uppercase tracking-[0.15em]">La nostra sede</h3>
            <div className="h-px w-16 bg-[#e6332a] mx-auto mb-4"></div>
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

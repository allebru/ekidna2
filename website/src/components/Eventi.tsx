import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSiteContent } from '../context/SiteContentContext';

export type EventItem = {
  id: number;
  slug: string;
  title: string;
  date?: string;
  endDate?: string;
  dateLabel: string;
  genre: string;
  image: string;
  description: string;
  lineup?: string[];
  info?: string[];
  link?: string;
};

export function parseEvents(raw: string | undefined): EventItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function Eventi() {
  const c = useSiteContent('eventi');
  const events = parseEvents(c.lista_eventi);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 border-2 border-[#e6332a] p-6 sm:p-8 md:p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-7xl uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#e6332a] mb-6">
            Eventi
          </h1>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Prossimi concerti e festival underground all'Associazione Ekidna
          </p>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/eventi/${event.slug}`}
                className="block bg-zinc-950 border border-[#e6332a]/30 hover:border-[#e6332a] hover:shadow-xl transition-all overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={`Locandina ${event.title}`}
                  loading="lazy"
                  width={1080}
                  height={1350}
                  className="w-full h-auto"
                />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <span className="inline-block border border-[#e6332a]/50 text-[#e6332a] px-3 py-1 text-xs uppercase tracking-[0.15em]">
                      {event.genre}
                    </span>
                  </div>

                  <h3 className="text-2xl text-[#e6332a] mb-4 uppercase tracking-[0.15em]">
                    {event.title}
                  </h3>

                  <div className="mb-6 text-gray-500 text-sm uppercase tracking-wider">
                    {event.dateLabel}
                  </div>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <span className="text-[#e6332a] text-sm uppercase tracking-[0.15em] underline">
                    Dettagli evento →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-[#e6332a]/30 bg-zinc-950">
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Nessun evento in programma
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center border-2 border-[#e6332a] p-6 sm:p-8 md:p-16 max-w-3xl mx-auto bg-black/60 backdrop-blur-sm shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#e6332a] mb-6 uppercase tracking-[0.2em]">
            Proponi un Evento
          </h2>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-8"></div>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Hai una band o un'idea per un evento? Contattaci!
          </p>
          <Link to="/contatti">
            <Button className="bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
              Scrivici
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

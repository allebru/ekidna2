import { useParams, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSiteContent } from '../context/SiteContentContext';
import { parseEvents } from './Eventi';
import { NotFound } from './NotFound';

export function EventDetail() {
  const { slug } = useParams();
  const c = useSiteContent('eventi');
  const events = parseEvents(c.lista_eventi);
  const event = events.find((e) => e.slug === slug);

  if (!event) return <NotFound />;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/eventi"
            className="inline-block mb-8 text-[#e6332a] text-sm uppercase tracking-[0.15em] hover:underline"
          >
            ← Tutti gli eventi
          </Link>

          <div className="bg-zinc-950 border border-[#e6332a]/30 overflow-hidden shadow-2xl">
            <img
              src={event.image}
              alt={`Locandina ${event.title}`}
              width={1080}
              height={1350}
              className="w-full h-auto"
            />
            <div className="p-8 md:p-12">
              <span className="inline-block border border-[#e6332a]/50 text-[#e6332a] px-3 py-1 text-xs uppercase tracking-[0.15em] mb-6">
                {event.genre}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#e6332a] mb-4 uppercase tracking-[0.15em]">
                {event.title}
              </h1>

              <div className="mb-8 text-gray-500 uppercase tracking-wider">
                {event.dateLabel}
              </div>

              <div className="h-px w-24 bg-[#e6332a] mb-8"></div>

              <p className="text-gray-400 mb-8 leading-relaxed">
                {event.description}
              </p>

              {event.lineup && event.lineup.length > 0 && (
                <div className="mb-8 space-y-2 border-t border-[#e6332a]/20 pt-8">
                  <h2 className="text-[#e6332a] text-sm uppercase tracking-[0.15em] mb-4">Line-up</h2>
                  {event.lineup.map((line, i) => (
                    <p key={i} className="text-gray-400 text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {event.info && event.info.length > 0 && (
                <div className="mb-8 space-y-2 border-t border-[#e6332a]/20 pt-8">
                  <h2 className="text-[#e6332a] text-sm uppercase tracking-[0.15em] mb-4">Info</h2>
                  {event.info.map((line, i) => (
                    <p key={i} className="text-gray-500 text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {event.link && (
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
                    Info evento
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

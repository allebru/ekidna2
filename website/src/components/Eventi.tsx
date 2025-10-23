import { Button } from './ui/button';

export function Eventi() {
  // Mock events data - will be updated later
  const events = [
    {
      id: 1,
      title: 'Metal Night',
      date: '2025-10-25',
      time: '21:00',
      genre: 'Metal',
      description: 'Una serata dedicata al metal con band locali e internazionali',
    },
    {
      id: 2,
      title: 'Punk & Hardcore Fest',
      date: '2025-11-08',
      time: '20:00',
      genre: 'Punk',
      description: 'Festival punk con diverse band dalla scena underground italiana',
    },
    {
      id: 3,
      title: 'Tekno Sound System',
      date: '2025-11-22',
      time: '22:00',
      genre: 'Tekno',
      description: 'Notte di musica tekno con sound system e DJ set',
    },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 border-2 border-[#d4a017] p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-5xl md:text-7xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
            Eventi
          </h1>
          <div className="h-px w-32 bg-[#d4a017] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Prossimi concerti e eventi underground
          </p>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <span className="inline-block border border-[#d4a017]/50 text-[#d4a017] px-3 py-1 text-xs uppercase tracking-[0.15em]">
                      {event.genre}
                    </span>
                  </div>

                  <h3 className="text-2xl text-[#d4a017] mb-6 uppercase tracking-[0.15em]">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-6 text-gray-500 text-sm uppercase tracking-wider">
                    <div>
                      {new Date(event.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div>
                      Ore {event.time}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="h-px bg-[#d4a017] w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-[#d4a017]/30 bg-zinc-950">
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Nessun evento in programma
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center border-2 border-[#d4a017] p-12 md:p-16 max-w-3xl mx-auto bg-black/60 backdrop-blur-sm shadow-2xl">
          <h2 className="text-3xl md:text-4xl text-[#d4a017] mb-6 uppercase tracking-[0.2em]">
            Proponi un Evento
          </h2>
          <div className="h-px w-32 bg-[#d4a017] mx-auto mb-8"></div>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Hai una band o un'idea per un evento? Contattaci!
          </p>
          <Button className="bg-[#d4a017] hover:bg-[#b8860b] text-black border border-[#d4a017] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
            Scrivici
          </Button>
        </div>
      </div>
    </div>
  );
}

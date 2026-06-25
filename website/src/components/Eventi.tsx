import { Button } from './ui/button';

type EventItem = {
  id: number;
  title: string;
  dateLabel: string;
  genre: string;
  image: string;
  description: string;
  lineup?: string[];
  info?: string[];
  link?: string;
};

export function Eventi() {
  const events: EventItem[] = [
    {
      id: 1,
      title: 'Rottura del Silenzio — Ed. 27',
      dateLabel: '25 – 28 Giugno 2026',
      genre: 'Festival',
      image: '/img/eventi/rottura-del-silenzio-27.jpg',
      description:
        '27 anni di rumore, indipendenza e voglia di stare insieme. Rottura del Silenzio torna nel giardino di Associazione Ekidna: quattro giorni di concerti, zone distro, proiezioni e installazioni.',
      lineup: [
        'GIO 25/06 (free entry) — Warm Up: docufilm “Uzeda – Do It Yourself” di Maria Arena',
        'VEN 26/06 — Sick Tamburo · Tense-Up · Adriana',
        'SAB 27/06 — Kaos & Egreen · Cigno · Browbeat · Give Vent · H-Strychnine · Nube · 4Tracks',
        'DOM 28/06 — Uzeda · Three Second Kiss · The Jackson Pollock · Bruuno · Fosca · To Die On Ice · Requiem for Paola P.',
      ],
      info: [
        'Dove: Via Livorno 9, Carpi (MO) — Associazione Ekidna',
        'Ingresso: 15€ al giorno (giovedì gratuito)',
        'Biglietti disponibili solo in cassa (no prevendite online)',
        'Cena, food & drinks, stage esterno e zona distro per tutta la durata del festival',
      ],
      link: 'https://www.facebook.com/events/1001945245623495',
    },
    {
      id: 2,
      title: 'The End of Impact Fest',
      dateLabel: '10 – 12 Luglio 2026',
      genre: 'Festival',
      image: '/img/eventi/end-of-impact-fest.jpg',
      description:
        "L'ultima edizione di Impact Fest. Tre giorni, due palchi, distro & zine area, talk & market, free camping, vegan food, zones of silence, awareness team e workshop. See you at Associazione Ekidna.",
      lineup: [
        'VEN 10/07 — Emma Goldman · L’Idylle · Put Pùrana · Older Friends · Ineptitude · Uragano · Casamatta · Ghostboycoma',
        'SAB 11/07 — Ostraca · Kokeshi · Powerplant · Vibora · Shizune · Oakhands · Calathea · Shooting Daggers · Cady · Emes · Plastic Bags For Helmets · Dagerman · Kadreka · Foscø · Laurie Bird · Nubifragio · Ghostboycoma',
        'DOM 12/07 — Moshimoshi · Nivra · Verogna · Falesia · Hatsu No Hado · Marcovaldo · Nirano · Legni Vecchi · Vote For Pedro · Flâneur · Yarostan · Lumière',
      ],
      info: [
        'Dove: Via Livorno 9, Carpi (MO) — Associazione Ekidna',
        '2 live stages / distro & zine area / talk & market / free camping / vegan food',
        'Full pass ticket disponibile online',
      ],
      link: 'https://www.facebook.com/events/1346447074184921',
    },
  ];

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
              <div
                key={event.id}
                className="bg-zinc-950 border border-[#e6332a]/30 hover:border-[#e6332a] hover:shadow-xl transition-all overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={`Locandina ${event.title}`}
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

                  {event.lineup && (
                    <div className="mb-6 space-y-2">
                      {event.lineup.map((line, i) => (
                        <p key={i} className="text-gray-400 text-sm leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}

                  {event.info && (
                    <div className="mb-6 space-y-2 border-t border-[#e6332a]/20 pt-8">
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
          <a href="#/contatti">
            <Button className="bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
              Scrivici
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

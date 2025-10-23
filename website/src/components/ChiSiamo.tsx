import { ImageWithFallback } from './figma/ImageWithFallback';

export function ChiSiamo() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 border-2 border-[#d4a017] p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-5xl md:text-7xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
            Chi Siamo
          </h1>
          <div className="h-px w-32 bg-[#d4a017] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La nostra storia e i nostri valori
          </p>
        </div>

        {/* Storia */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="border border-[#d4a017]/30 p-8 md:p-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-4xl md:text-5xl uppercase tracking-[0.2em] text-[#d4a017] mb-8">
              La Nostra Storia
            </h2>
            <div className="h-px w-24 bg-[#d4a017] mb-8"></div>
            
            <p className="text-gray-400 leading-relaxed mb-6">
              Ekidna nasce nel 1998 da alcune persone che, volendo accomunare i loro interessi per la musica e i valori della cultura underground, hanno creato un'associazione non a scopo di lucro dove chi vuole può incontrarsi liberamente per condividere gli ideali di antifascismo, transfemminismo, ecologia, DIY e promozione dell'arte a livello locale (musica, teatro, arti figurative…).
            </p>
          </div>
        </div>

        {/* La Sede */}
        <section className="py-16 md:py-24 bg-transparent mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12 bg-zinc-950 border border-[#d4a017]/30 shadow-xl">
                <h2 className="text-4xl md:text-5xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
                  La Sede
                </h2>
                <div className="h-px w-24 bg-[#d4a017] mb-8"></div>
                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p>
                    Dapprima in maniera errante spostandosi nella bassa modenese, Ekidna si stabilisce nell'ex scuola elementare di San Martino sulla Secchia, concessa in comodato d'uso gratuito dal Comune di Carpi.
                  </p>
                  <p>
                    L'edificio diroccato viene quindi ristrutturato dall3 volontari3 e riconvertito in una struttura funzionante capace di ospitare eventi e laboratori (serigrafia e fotografia).
                  </p>
                  <p>
                    Il luogo è stato scelto per la sua struttura unica e affascinante nel bel mezzo della campagna, per dare la massima libertà di espressione alle iniziative e per poter godere del grande giardino che tutti gli anni ospita i nostri festival estivi.
                  </p>
                </div>
              </div>
              
              <div className="border border-[#d4a017]/30 overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1709138376162-793a9928a2fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBzY2hvb2wlMjBidWlsZGluZyUyMGNvdW50cnlzaWRlfGVufDF8fHx8MTc2MDY5MDcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="La nostra sede"
                  className="w-full h-full object-cover min-h-[400px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Gli Ideali */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl uppercase tracking-[0.2em] text-[#d4a017] mb-8 text-center">
              Gli Ideali
            </h2>
            <div className="h-px w-32 bg-[#d4a017] mx-auto mb-16"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-zinc-950 border border-[#d4a017]/30 p-8 text-center hover:border-[#d4a017] hover:bg-[#d4a017]/5 transition-all shadow-lg">
                <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">
                  Antifascismo
                </h3>
                <p className="text-gray-500 text-sm">
                  Lotta attiva contro ogni oppressione
                </p>
              </div>

              <div className="bg-zinc-950 border border-[#d4a017]/30 p-8 text-center hover:border-[#d4a017] hover:bg-[#d4a017]/5 transition-all shadow-lg">
                <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">
                  Transfemminismo
                </h3>
                <p className="text-gray-500 text-sm">
                  Inclusione e rispetto
                </p>
              </div>

              <div className="bg-zinc-950 border border-[#d4a017]/30 p-8 text-center hover:border-[#d4a017] hover:bg-[#d4a017]/5 transition-all shadow-lg">
                <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">
                  DIY
                </h3>
                <p className="text-gray-500 text-sm">
                  Autoproduzione
                </p>
              </div>

              <div className="bg-zinc-950 border border-[#d4a017]/30 p-8 text-center hover:border-[#d4a017] hover:bg-[#d4a017]/5 transition-all shadow-lg">
                <h3 className="text-lg text-[#d4a017] mb-3 uppercase tracking-[0.15em]">
                  Arte Locale
                </h3>
                <p className="text-gray-500 text-sm">
                  Promozione culturale
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6 text-gray-400 leading-relaxed border border-[#d4a017]/30 p-8 md:p-12 bg-zinc-950/50 shadow-xl">
              <p>
                Ekidna si propone attivamente come un luogo di aggregazione dove le idee di tutt3 coloro che ne vogliono far parte si incontrano e si confrontano, concretizzandosi sul lato pratico attraverso l'ideologia DIY che permette di valorizzare tramite le abilità personali i progetti in programma che sono: lavori per riqualificazione e il mantenimento della struttura e soprattutto proporre una stagione di eventi varia e mirata alla promozione dell'arte all'interno del territorio della bassa modenese.
              </p>
              <p>
                Ne risulta un progetto fluido dove la visione personale si fonde in una visione collettiva dove il lavoro di gruppo e la collaborazione anche con altre realtà associative diventa un valore aggiunto. Ekidna non vuole essere un locale, ma una piattaforma per musicist3 e artist3, un luogo dove tener viva la scena underground facendo sentire la loro voce.
              </p>
              <p>
                Alla base dell'associazione stanno i concetti di non violenza e tolleranza. Ci dissociamo da ogni ideologia politica, il che vuol dire che le nostre decisioni sono dettate unicamente dai membri del nostro direttivo e non da forze esterne e non riceviamo fondi dalle suddette; ci riteniamo un'associazione antifascista e transfemminista. Quindi la nostra esistenza è di fatto un atto politico che modifica gli equilibri locali.
              </p>
              <p>
                Per esigenze organizzative la trasparenza è dettata dal nostro statuto per una migliore tutela e regolamentazione dell3 soci3 e delle loro attività all'interno della struttura.
              </p>
              <p>
                La nostra associazione nasce in risposta ad un generico cinismo imperante secondo il quale ogni sforzo fatto per realizzare aspirazioni come le nostre sarebbe destinato a scontrarsi contro una realtà dura ed ostile con accettazione passiva, per questo noi lavoriamo affinché ci sia sempre uno spazio dove possa essere possibile il contrario, con un atteggiamento attivo di resistenza nei confronti dell'omologazione.
              </p>
            </div>
          </div>
        </section>

        {/* Le Persone */}
        <section className="py-16 bg-transparent">
          <div className="max-w-4xl mx-auto border border-[#d4a017]/30 p-8 md:p-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-3xl md:text-4xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
              Le Persone
            </h2>
            <div className="h-px w-24 bg-[#d4a017] mb-8"></div>
            <p className="text-gray-400 leading-relaxed">
              Chiunque condivide i nostri ideali ed è socio tesserato (gratuitamente) della nostra associazione può partecipare alle attività e le riunioni diventando membro attivo di Ekidna Aps.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

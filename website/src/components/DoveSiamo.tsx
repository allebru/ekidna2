export function DoveSiamo() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 border-2 border-[#d4a017] p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-5xl md:text-7xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
            Dove Siamo
          </h1>
          <div className="h-px w-32 bg-[#d4a017] mx-auto mb-6"></div>
          <div className="text-gray-400">
            <p className="uppercase tracking-wider">Via Livorno 9, 41012 Carpi (MO)</p>
          </div>
        </div>

        {/* Venue photo */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="border-2 border-[#d4a017] mb-8 overflow-hidden shadow-2xl">
            <img
              src="/img/ekidna-luogo.jpg"
              alt="La sede di Associazione Ekidna a San Martino sulla Secchia, Carpi"
              className="w-full h-auto"
            />
          </div>
          <div className="border border-[#d4a017]/30 p-12 md:p-16 text-center bg-zinc-950/50 shadow-xl">
            <p className="text-gray-400 mb-4 uppercase tracking-wider">
              Ex scuola elementare di San Martino sulla Secchia
            </p>
            <div className="h-px w-24 bg-[#d4a017] mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">
              Concessa in comodato d'uso gratuito dal Comune di Carpi
            </p>
          </div>
        </div>

        {/* Come raggiungere Ekidna */}
        <div className="max-w-4xl mx-auto">
          <div className="border border-[#d4a017]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-3xl md:text-4xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">
              Come raggiungere Ekidna
            </h2>
            <div className="h-px w-24 bg-[#d4a017] mb-6"></div>
            <p className="text-gray-500 text-sm italic mb-6">
              (da SESSUOLO.ORG)
            </p>
            <p className="text-gray-400 leading-relaxed">
              L'associazione Ekidna è un bel posto e lo abbiamo già detto nella recensione. Tuttavia, può non essere scontato come raggiungerla, specie quando c'è la nebbia o quando si vive in Costa d'Avorio: ecco dunque che Sessuolo.org offre una specie di guida Lonely Planet con i dieci migliori metodi per arrivare all'Ekidna di Carpi, diligentemente scelti per Voi dalla Redazione! Vai col televoto.
            </p>
          </div>

          {/* Methods List */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">1. Abitare là</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                Il proverbiale Uovo di Colombo. Abitando nel seminterrato dell'Ekidna sarete sempre pronti a festeggiare, senza corse in macchina nella nebbia, problemi alle gomme, posti di blocco! Una soluzione ecosostenibile.
              </p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">2. In nave</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                San Martino Secchia è un po' la Nantucket della provincia di Modena. Chi la conosce sa che c'è sempre un viavai di pescherecci, mercantili, golette, brigantini e baleniere: chi per farvi una breve sosta, chi di ritorno da un viaggio intorno al mondo, chi in partenza per una caccia alla balena franca. Ecco dunque il mezzo forse più classico per raggiungere l'Ekidna, il veliero: efficiente, dai bassi consumi e dalla chiglia robusta.
              </p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">3. In treno</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                Come tutti sanno, le Ferrovie dello Stato non coprono la stazione di San Martino Secchia. Quello che però le banche non vi dicono è che le Ferrovie di Toscana, Emilia-Romagna e Piemonte gestiscono congiuntamente la linea regionale Pistoia-Asti, via Abetone e Suzzara. (Fa ridere che Suzzara non sia né in Toscana, né in Emilia-Romagna, né in Piemonte, ma questa è un'altra storia.) Le fermate sono poche, cioè quattro (Pistoia, Abetone, Suzzara e Asti), tuttavia un treno al giorno, quello delle 17:15, si sovrappone al Frecciabianca Milano-Pescara che è sempre in ritardo, ed è quindi costretto a fermarsi cinque minuti PROPRIO A SAN MARTINO SECCHIA. L'avreste mai detto? Se dunque abitate nei pressi di Pistoia, Abetone, Suzzara o Asti, potrete prendere questo treno e scendere al volo durante la sosta non ufficiale a San Martino Secchia.
              </p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">4. In automobile</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                Il mezzo preferito della Redazione. Cosa c'è di meglio di salire sul vostro automobile e lanciarsi in mezzo alla nebbia ai centoquindici? Nulla, nemmeno la Nike di Samotracia. La redazione però consiglia di portare in automobile due pacchetti di cracker per le emergenze, e di non scalare mai al di sotto della quarta. L'esperienza sarà elettrizzante. Oltretutto, l'Ekidna è dotata di ampio parcheggio per i vostri automobili.
              </p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">5. In Nike di Samotracia</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                Se l'automobile non è il vostro mezzo, pazienza: potete usare la Nike di Samotracia, sicuramente meno bella, sicuramente meno veloce, ma con il fascino classico e intramontabile delle giacche di tweed. Scomoda per costi e consumi, ma valida per chi abita a Parigi. Oltretutto, l'Ekidna è dotata di ampio parcheggio per le vostre Vittorie di Samotracia.
              </p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">6. In corriera</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">No.</p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">7. Stare a casa</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                La soluzione degli ignavi: perché scegliere, quando puoi stare a casa a non fare un cazzo? Ecco perché.
              </p>
            </div>

            <div className="bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all p-8 group">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">8. Con i droni</h3>
              <div className="h-px w-16 bg-[#d4a017] mb-4"></div>
              <p className="text-gray-400 leading-relaxed">
                In realtà si parlava dei baracchini che volano senza pilota, però potete anche mettere in cuffia un disco degli Earth e arrivare a Carpi cavalcando le vibrazioni (non il gruppo pop).
              </p>
            </div>

            <div className="border-2 border-[#d4a017] p-8 text-center bg-black/60 backdrop-blur-sm shadow-2xl">
              <h3 className="text-xl text-[#d4a017] mb-4 uppercase tracking-[0.15em]">Fine</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Siccome ci siamo sbagliati e abbiamo messo il nostro mezzo preferito al punto 7, finiamo qua.
              </p>
              <div className="h-px w-24 bg-[#d4a017] mx-auto my-6"></div>
              <p className="text-[#d4a017] uppercase tracking-[0.15em]">
                Congratulazioni, ce l'hai fatta!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

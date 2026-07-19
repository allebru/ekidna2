import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 border-2 border-[#e6332a] p-8 bg-black/60 backdrop-blur-sm">
          <h1 className="text-2xl sm:text-3xl md:text-5xl uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#e6332a] mb-4">
            Privacy Policy
          </h1>
          <div className="h-px w-24 bg-[#e6332a] mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Ultimo aggiornamento: giugno 2026</p>
        </div>

        <div className="space-y-8 text-gray-400 leading-relaxed">

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">1. Titolare del Trattamento</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <p>
              <strong className="text-gray-300">Ekidna APS</strong><br />
              Via Livorno 9, 41012 Carpi (MO)<br />
              Email: <a href="mailto:ekidnacarpi@gmail.com" className="text-[#e6332a] hover:underline">ekidnacarpi@gmail.com</a><br />
              Tel: +39 371 630 7881
            </p>
          </section>

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">2. Dati Raccolti</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <p className="mb-3">Raccogliamo i seguenti dati personali esclusivamente attraverso il modulo di iscrizione:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Nome e cognome</li>
              <li>Data di nascita</li>
              <li>Indirizzo di residenza (via, città, CAP, provincia)</li>
              <li>Indirizzo email</li>
              <li>Numero di telefono</li>
              <li>Motivazione di interesse (facoltativo)</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              Il sito non utilizza cookie di profilazione né strumenti di tracciamento di terze parti (Google Analytics, Facebook Pixel, ecc.). Vengono utilizzati esclusivamente cookie tecnici necessari al funzionamento del sito, non soggetti a consenso ai sensi dell'art. 122 del D.Lgs. 196/2003.
            </p>
          </section>

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">3. Finalità e Base Giuridica</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-300 mb-1">Gestione associativa</p>
                <p className="text-sm text-gray-500">Registrazione soci, emissione tessera, comunicazioni relative all'associazione. Base giuridica: esecuzione di un contratto (statuto associativo) — art. 6(1)(b) GDPR.</p>
              </div>
              <div>
                <p className="text-gray-300 mb-1">Comunicazioni e newsletter</p>
                <p className="text-sm text-gray-500">Invio di aggiornamenti su eventi e attività. Base giuridica: consenso dell'interessato — art. 6(1)(a) GDPR.</p>
              </div>
              <div>
                <p className="text-gray-300 mb-1">Obblighi di legge</p>
                <p className="text-sm text-gray-500">Adempimento di obblighi fiscali e contabili previsti dalla normativa sulle APS. Base giuridica: obbligo legale — art. 6(1)(c) GDPR.</p>
              </div>
            </div>
          </section>

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">4. Conservazione dei Dati</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <p>I dati sono conservati per tutta la durata dell'iscrizione all'associazione. Dopo la cessazione del rapporto associativo, i dati necessari per adempimenti fiscali e contabili sono conservati per 10 anni ai sensi della normativa vigente. Gli altri dati sono cancellati entro 12 mesi dalla cessazione.</p>
          </section>

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">5. Destinatari</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <p>I dati non vengono ceduti a terzi per finalità commerciali. Possono essere comunicati esclusivamente a:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
              <li>Professionisti incaricati della gestione contabile e fiscale dell'associazione</li>
              <li>Autorità competenti in caso di obbligo di legge</li>
            </ul>
            <p className="mt-3 text-sm">Non vengono effettuati trasferimenti di dati verso paesi extra-UE.</p>
          </section>

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">6. I Tuoi Diritti</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <p className="mb-3">Ai sensi degli artt. 15-22 del GDPR hai diritto di:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li><strong className="text-gray-400">Accesso</strong> — ottenere conferma che siano trattati dati che ti riguardano e riceverne copia</li>
              <li><strong className="text-gray-400">Rettifica</strong> — correggere dati inesatti o incompleti</li>
              <li><strong className="text-gray-400">Cancellazione</strong> ("diritto all'oblio") — richiedere la cancellazione dei tuoi dati</li>
              <li><strong className="text-gray-400">Limitazione</strong> — limitare il trattamento in determinati casi</li>
              <li><strong className="text-gray-400">Portabilità</strong> — ricevere i tuoi dati in formato strutturato e leggibile da macchina</li>
              <li><strong className="text-gray-400">Opposizione</strong> — opporti al trattamento dei tuoi dati</li>
              <li><strong className="text-gray-400">Revoca del consenso</strong> — in qualsiasi momento, senza pregiudizio per il trattamento precedente</li>
            </ul>
            <p className="mt-4">
              Per esercitare i tuoi diritti scrivi a: <a href="mailto:ekidnacarpi@gmail.com" className="text-[#e6332a] hover:underline">ekidnacarpi@gmail.com</a>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-[#e6332a] hover:underline">www.garanteprivacy.it</a>).
            </p>
          </section>

          <section className="border border-[#e6332a]/20 p-6 bg-zinc-950/50">
            <h2 className="text-[#e6332a] uppercase tracking-[0.15em] mb-4 text-lg">7. Cookie Policy</h2>
            <div className="h-px w-12 bg-[#e6332a] mb-4"></div>
            <p className="mb-3">Questo sito utilizza esclusivamente <strong className="text-gray-300">cookie tecnici</strong>, necessari al corretto funzionamento delle pagine. Non vengono installati cookie di profilazione o di tracciamento.</p>
            <div className="mt-3 border border-[#e6332a]/10 p-4 bg-black/30">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Cookie utilizzati</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-zinc-800">
                      <th className="text-left py-1">Nome</th>
                      <th className="text-left py-1">Tipo</th>
                      <th className="text-left py-1">Durata</th>
                      <th className="text-left py-1">Scopo</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-zinc-900">
                      <td className="py-1">ekidna_cookie_consent</td>
                      <td className="py-1">Tecnico</td>
                      <td className="py-1">1 anno</td>
                      <td className="py-1">Memorizza la scelta sul banner cookie</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-[#e6332a] hover:underline uppercase tracking-wider text-sm">
            ← Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}

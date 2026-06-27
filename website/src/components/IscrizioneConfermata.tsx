import { Link } from 'react-router-dom';

export function IscrizioneConfermata() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 flex items-start justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-green-600 p-8 md:p-12 bg-black/60 backdrop-blur-sm shadow-2xl text-center">
            <div className="text-green-500 text-6xl mb-6">✓</div>
            <h1 className="text-2xl sm:text-3xl text-green-500 mb-4 uppercase tracking-[0.15em]">
              Registrazione andata a buon fine!
            </h1>
            <div className="h-px w-32 bg-green-600 mx-auto mb-8"></div>
            <p className="text-gray-300 leading-relaxed mb-4">
              A breve riceverete la mail di iscrizione con la nuova tessera!
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Fai lo screenshot di questa pagina da presentare all'ingresso in caso di ritardo di arrivo della tessera per mail.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#e6332a] hover:bg-[#c41e17] text-black px-8 py-4 uppercase tracking-[0.15em] text-sm font-semibold shadow-lg transition-colors"
            >
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

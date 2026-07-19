import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center border-2 border-[#e6332a] p-6 sm:p-8 md:p-16 max-w-2xl mx-auto bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-[0.15em] text-[#e6332a] mb-6">
            404
          </h1>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-6"></div>
          <p className="text-gray-400 mb-8">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
          <Link to="/">
            <Button className="bg-[#e6332a] hover:bg-[#c41e17] text-black border border-[#e6332a] px-10 py-6 uppercase tracking-[0.15em] shadow-lg">
              Torna alla home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

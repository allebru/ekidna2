import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

export function Galleria() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Foto reali: sede Ekidna (sempre presente) + scatti dai nostri eventi
  const galleryImages = [
    { id: 1, url: '/img/ekidna-luogo.jpg', alt: 'La sede di Associazione Ekidna a San Martino sulla Secchia (Carpi)' },
    { id: 2, url: '/img/gallery/g1.jpg', alt: 'Associazione Ekidna — evento' },
    { id: 3, url: '/img/gallery/g2.jpg', alt: 'Associazione Ekidna — concerto' },
    { id: 4, url: '/img/gallery/g3.jpg', alt: 'Associazione Ekidna — serata underground' },
    { id: 5, url: '/img/gallery/g4.jpg', alt: 'Associazione Ekidna — live' },
    { id: 6, url: '/img/gallery/g5.jpg', alt: 'Associazione Ekidna — pubblico' },
    { id: 7, url: '/img/gallery/g6.jpg', alt: 'Associazione Ekidna — festival' },
    { id: 8, url: '/img/gallery/g7.jpg', alt: 'Associazione Ekidna — spazio e attività' },
    { id: 9, url: '/img/gallery/g8.jpg', alt: 'Associazione Ekidna — momenti dal circolo' },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 border-2 border-[#e6332a] p-6 sm:p-8 md:p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-7xl uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#e6332a] mb-6">
            Galleria
          </h1>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Foto dei nostri eventi e concerti
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square cursor-pointer overflow-hidden bg-zinc-950 border border-[#e6332a]/30 hover:border-[#e6332a] hover:shadow-xl transition-all group"
              onClick={() => setSelectedImage(image.url)}
            >
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 bg-black border-2 border-[#e6332a]">
            <DialogTitle className="sr-only">Immagine Galleria</DialogTitle>
            <DialogDescription className="sr-only">
              Visualizza immagine ingrandita dalla galleria
            </DialogDescription>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 bg-[#e6332a] px-6 py-2 text-black hover:bg-[#c41e17] transition-colors uppercase tracking-[0.15em] text-sm shadow-lg"
            >
              Chiudi
            </button>
            {selectedImage && (
              <div className="w-full h-full flex items-center justify-center p-4">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Gallery image"
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Note */}
        <div className="mt-16 text-center text-gray-600 text-sm uppercase tracking-wider">
          <p>Altre foto verranno aggiunte dopo i prossimi eventi</p>
        </div>
      </div>
    </div>
  );
}

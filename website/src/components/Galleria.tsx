import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

export function Galleria() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock gallery images
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1648260029310-5f1da359af9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjA2MTk0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Concert crowd at festival',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1702733470477-26962cbd3f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMG11c2ljJTIwY29uY2VydHxlbnwxfHx8fDE3NjA2OTA3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Metal music concert',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1759137538239-60e0b1e796fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMGNvbmNlcnQlMjBwdW5rfGVufDF8fHx8MTc2MDY5MDcyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Underground punk concert',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1661697522391-699652d67ad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWtubyUyMHJhdmUlMjBwYXJ0eXxlbnwxfHx8fDE3NjA2OTA3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Tekno rave party',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1729701164067-61eeeb5fe892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXklMjBwdW5rJTIwYXJ0d29ya3xlbnwxfHx8fDE3NjA2OTA3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'DIY punk artwork',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1709138376162-793a9928a2fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBzY2hvb2wlMjBidWlsZGluZyUyMGNvdW50cnlzaWRlfGVufDF8fHx8MTc2MDY5MDcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Ekidna venue',
    },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 border-2 border-[#d4a017] p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <h1 className="text-5xl md:text-7xl uppercase tracking-[0.2em] text-[#d4a017] mb-6">
            Galleria
          </h1>
          <div className="h-px w-32 bg-[#d4a017] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Foto dei nostri eventi e concerti
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square cursor-pointer overflow-hidden bg-zinc-950 border border-[#d4a017]/30 hover:border-[#d4a017] hover:shadow-xl transition-all group"
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
          <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 bg-black border-2 border-[#d4a017]">
            <DialogTitle className="sr-only">Immagine Galleria</DialogTitle>
            <DialogDescription className="sr-only">
              Visualizza immagine ingrandita dalla galleria
            </DialogDescription>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 bg-[#d4a017] px-6 py-2 text-black hover:bg-[#b8860b] transition-colors uppercase tracking-[0.15em] text-sm shadow-lg"
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
          <p>Le foto verranno aggiunte dopo gli eventi</p>
        </div>
      </div>
    </div>
  );
}

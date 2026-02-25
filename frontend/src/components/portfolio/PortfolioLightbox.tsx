import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { PortfolioItem } from '../../backend';
import ImagePlaceholder from '../common/ImagePlaceholder';

interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
}

export default function PortfolioLightbox({ item, onClose }: PortfolioLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Use actual imageUrls; if empty, show a single placeholder slot
  const hasImages = item.imageUrls.length > 0;
  const images = item.imageUrls;
  const totalSlots = hasImages ? images.length : 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  const prev = () => setCurrentIndex((i) => (i - 1 + totalSlots) % totalSlots);
  const next = () => setCurrentIndex((i) => (i + 1) % totalSlots);

  const currentImageUrl = hasImages ? images[currentIndex] : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-serif font-semibold text-xl text-foreground">{item.title}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <MapPin size={13} className="text-terracotta" />
              <span>{item.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image / Placeholder */}
        <div className="relative flex-1 min-h-0 bg-black/5 flex items-center justify-center overflow-hidden">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={`${item.title} - photo ${currentIndex + 1}`}
              className="max-h-[50vh] w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full px-8 py-6">
              <ImagePlaceholder
                variant="field"
                aspectRatio="landscape"
                label="Field Photo Coming Soon"
                className="w-full max-h-[50vh]"
              />
            </div>
          )}

          {totalSlots > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Description */}
        <div className="p-5 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </div>

        {/* Dot indicators */}
        {totalSlots > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {Array.from({ length: totalSlots }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-terracotta' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

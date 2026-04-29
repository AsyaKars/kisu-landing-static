import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useApi } from '@/hooks/use-api';

type LookbookImageApi = {
  id: number;
  image_url: string;
  alt_text: string;
  order_index: number;
  is_active: boolean;
};

type LookbookImageUi = {
  mediaUrl: string;
  caption: string;
};

const fallbackLookbookImages: LookbookImageUi[] = [
  { mediaUrl: '/images/lookbook-1.jpg', caption: '' },
  { mediaUrl: '/images/lookbook-2.jpg', caption: '' },
  { mediaUrl: '/images/lookbook-4.jpg', caption: '' },
  { mediaUrl: '/images/lookbook-5.jpg', caption: '' },
  { mediaUrl: '/images/lookbook-6.jpg', caption: '' },
];

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: apiImages } = useApi<LookbookImageApi[]>('/content/index.php?action=lookbook');

  const lookbookImages = useMemo(() => {
    if (!apiImages || apiImages.length === 0) {
      return fallbackLookbookImages;
    }

    const normalized = apiImages
      .filter((image) => image.is_active ?? true)
      .sort((a, b) => a.order_index - b.order_index)
      .map((image) => ({
        mediaUrl: image.image_url,
        caption: image.alt_text || '',
      }));

    return normalized.length > 0 ? normalized : fallbackLookbookImages;
  }, [apiImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const total = lookbookImages.length;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total));
      if (e.key === 'ArrowLeft')  setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total));
      if (e.key === 'Escape')     setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  return (
    <section id="lookbook" ref={sectionRef} className="w-full py-20 lg:py-32 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-6">
            <span className="text-kisu-orange">Lookbook</span>
          </h2>
          <p className="text-kisu-text-gray text-lg">
            Вдохновляйтесь нашими коллекциями и образами для активных детей
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {lookbookImages.map((item, index) => (
            <div
              key={`${item.mediaUrl}-${index}`}
              className={`group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onClick={() => setSelectedIndex(index)}
            >
              {isVideoUrl(item.mediaUrl) ? (
                <video
                  src={item.mediaUrl}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.caption}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-kisu-text-dark" />
                  </div>
                </div>
              </div>
              {item.caption && (
                <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/75 to-transparent">
                  <p className="text-white text-sm leading-tight">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIndex !== null && (() => {
        const item = lookbookImages[selectedIndex];
        const total = lookbookImages.length;
        const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total)); };
        const goNext = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total)); };
        return (
          <div
            className="fixed inset-0 z-50 bg-kisu-orange flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 p-3 text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev arrow */}
            {total > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-200 hover:scale-110"
                onClick={goPrev}
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Media */}
            <div className="max-w-full max-h-[90vh] animate-scale-in flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              {isVideoUrl(item.mediaUrl) ? (
                <video
                  src={item.mediaUrl}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.caption}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl"
                />
              )}
              <p className="mt-3 text-center text-white/90">{item.caption}</p>
              {total > 1 && (
                <p className="mt-1 text-white/60 text-sm">{selectedIndex + 1} / {total}</p>
              )}
            </div>

            {/* Next arrow */}
            {total > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-200 hover:scale-110"
                onClick={goNext}
                aria-label="Следующее фото"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>
        );
      })()}
    </section>
  );
}

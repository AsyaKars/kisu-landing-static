import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

type ApiCertificate = {
  id: number;
  title: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
};

export default function Certificates() {
  const { data: apiCerts } = useApi<ApiCertificate[]>(API_ENDPOINTS.CERTIFICATES);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const total = certs.length;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total));
      if (e.key === 'ArrowLeft')  setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total));
      if (e.key === 'Escape')     setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const certs =
    apiCerts && apiCerts.length > 0
      ? apiCerts
          .filter((c) => c.is_active && c.image_url)
          .sort((a, b) => a.order_index - b.order_index)
      : [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onPartnerClick={() => {}} forceScrolled />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-32 lg:py-40">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-kisu-text-dark uppercase tracking-wide mb-10">
            Сертификаты
          </h1>

          {certs.length === 0 ? (
            <p className="text-kisu-text-gray text-lg">Сертификаты появятся здесь после добавления через панель администратора.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {certs.map((cert, index) => (
                <div
                  key={cert.id}
                  className="group relative cursor-pointer rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ aspectRatio: '210/297' }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-kisu-text-dark" />
                      </div>
                    </div>
                  </div>
                  {cert.title && (
                    <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs leading-tight">{cert.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Lightbox modal */}
      {selectedIndex !== null && (() => {
        const cert = certs[selectedIndex];
        const total = certs.length;
        const goPrev = (e: React.MouseEvent) => {
          e.stopPropagation();
          setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total));
        };
        const goNext = (e: React.MouseEvent) => {
          e.stopPropagation();
          setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total));
        };
        return (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              className="absolute top-4 right-4 p-3 text-white/80 hover:text-white transition-colors"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {total > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-110"
                onClick={goPrev}
                aria-label="Предыдущий"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            <div
              className="max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={cert.image_url}
                alt={cert.title}
                className="max-w-full max-h-[84vh] object-contain rounded-lg shadow-2xl"
              />
              {cert.title && (
                <p className="mt-3 text-center text-white/90 text-sm">{cert.title}</p>
              )}
              {total > 1 && (
                <p className="mt-1 text-white/50 text-xs">{selectedIndex + 1} / {total}</p>
              )}
            </div>

            {total > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-110"
                onClick={goNext}
                aria-label="Следующий"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Award, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS, ICON_MAP } from '@/config/api';

type SiteSetting = { id: number; setting_key: string; setting_value: string };

type ApiCertificate = {
  id: number;
  title: string;
  icon_name: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
};

const DEFAULT_CERTIFICATES = [
  { icon: 'Award', label: 'Диплом "Лучшая одежда и аксессуары"', image_url: '/images/cert-diploma.jpg' },
  { icon: 'ThumbsUp', label: 'Сертификат качества OEKO-TEX® STANDARD 100', image_url: '/images/cert-oeko-tex.jpg' },
  { icon: 'Shield', label: 'Shelter Kids®', image_url: '/images/cert-shelter-kids.jpg' },
];

export default function Quality() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const { data: apiCertificates } = useApi<ApiCertificate[]>(API_ENDPOINTS.CERTIFICATES);
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);

  const getSetting = (key: string, fallback: string) =>
    (settings ?? []).find((s) => s.setting_key === key)?.setting_value || fallback;

  const paragraph1 = getSetting(
    'quality_paragraph1',
    'Качество изделий, выпускаемых под брендом KISU, подтверждено сертификатами. Но главное подтверждение достоинств детской одежды бренда KISU – это быстро растущая популярность среди заботливых мам детей России.'
  );
  const paragraph2 = getSetting(
    'quality_paragraph2',
    'Мы гордимся тем, что наша одежда выбирается семьями по всей стране. Положительные отзывы, рекомендации и повторные покупки – лучшая награда за наш труд и стремление к совершенству.'
  );

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

  useEffect(() => {
    if (modalIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setModalIndex((i) => (i === null ? 0 : (i + 1) % certificates.length));
      if (e.key === 'ArrowLeft')  setModalIndex((i) => (i === null ? 0 : (i - 1 + certificates.length) % certificates.length));
      if (e.key === 'Escape')     setModalIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIndex]);

  const certificates =
    apiCertificates && apiCertificates.length > 0
      ? apiCertificates.filter((c) => c.is_active).map((c) => ({
          icon: c.icon_name,
          label: c.title,
          image_url: c.image_url || '/images/quality.jpg',
        }))
      : DEFAULT_CERTIFICATES;

  return (
    <section id="quality" ref={sectionRef} className="w-full py-20 lg:py-32 bg-kisu-bg-light">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={`order-1 lg:order-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-6">
              Подтверждённое <span className="text-kisu-orange">качество</span>
            </h2>
            <p className="text-kisu-text-gray text-lg leading-relaxed mb-8">{paragraph1}</p>
            <p className="text-kisu-text-gray leading-relaxed mb-10">{paragraph2}</p>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert, index) => {
                const IconComponent = ICON_MAP[cert.icon] ?? Award;
                const isActive = hoveredIndex === index;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onClick={() => setHoveredIndex(index)}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                      isActive
                        ? 'bg-kisu-orange shadow-kisu'
                        : 'bg-white shadow-sm hover:shadow-md'
                    } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-colors duration-300 ${
                      isActive ? 'bg-white/20' : 'bg-kisu-orange/10'
                    }`}>
                      <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-kisu-orange'
                      }`} />
                    </div>
                    <span className={`flex-1 min-w-0 break-words text-sm lg:text-base font-heading font-semibold transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-kisu-text-dark'
                    }`}>{cert.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate image with cross-fade */}
          <div
            className={`order-2 lg:order-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              <div
                className="group relative rounded-2xl overflow-hidden shadow-lg bg-kisu-bg-light cursor-zoom-in h-[460px]"
                onClick={() => setModalIndex(hoveredIndex)}
              >
                {certificates.map((cert, index) => (
                  <img
                    key={index}
                    src={cert.image_url}
                    alt={cert.label}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                      index === hoveredIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                  />
                ))}
                {/* Zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-kisu-text-dark" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalIndex !== null && (() => {
        const cert = certificates[modalIndex];
        const total = certificates.length;
        const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); setModalIndex((i) => (i === null ? 0 : (i - 1 + total) % total)); };
        const goNext = (e: React.MouseEvent) => { e.stopPropagation(); setModalIndex((i) => (i === null ? 0 : (i + 1) % total)); };
        return (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setModalIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 p-3 text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setModalIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev arrow */}
            {total > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
                onClick={goPrev}
                aria-label="Предыдущий сертификат"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Image */}
            <div className="max-w-3xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={cert.image_url}
                alt={cert.label}
                className="max-w-full max-h-[82vh] object-contain rounded-xl"
              />
              <p className="mt-4 text-center text-white/90 text-lg">{cert.label}</p>
              {total > 1 && (
                <p className="mt-1 text-white/50 text-sm">{modalIndex + 1} / {total}</p>
              )}
            </div>

            {/* Next arrow */}
            {total > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
                onClick={goNext}
                aria-label="Следующий сертификат"
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

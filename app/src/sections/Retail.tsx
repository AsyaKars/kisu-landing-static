import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

type ApiMarketplace = {
  id: number;
  name: string;
  description: string;
  url: string;
  logo_url: string | null;
  bg_color: string;
  text_color: string;
  order_index: number;
  is_active: boolean;
};

const DEFAULT_MARKETPLACES: ApiMarketplace[] = [
  {
    id: 1,
    name: 'Lamoda',
    description: 'Интернет-магазин модной одежды',
    url: 'https://www.lamoda.ru/b/28167/brand-kisu/',
    logo_url: null,
    bg_color: '#000000',
    text_color: '#ffffff',
    order_index: 1,
    is_active: true,
  },
  {
    id: 2,
    name: 'Wildberries',
    description: 'Крупнейший маркетплейс России',
    url: 'https://www.wildberries.ru/brands/kisu',
    logo_url: null,
    bg_color: '#CB11AB',
    text_color: '#ffffff',
    order_index: 2,
    is_active: true,
  },
  {
    id: 3,
    name: 'Ozon',
    description: 'Онлайн-мегамаркет',
    url: 'https://www.ozon.ru/brand/kisu-78559909/',
    logo_url: null,
    bg_color: '#005BFF',
    text_color: '#ffffff',
    order_index: 3,
    is_active: true,
  },
];

export default function Retail() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [offset, setOffset] = useState(0);
  const { data: apiData } = useApi<ApiMarketplace[]>(API_ENDPOINTS.MARKETPLACES);

  const items: ApiMarketplace[] =
    apiData && apiData.length > 0
      ? apiData.filter((m) => m.is_active)
      : DEFAULT_MARKETPLACES;

  // Carousel: show 3 on desktop, 1 on mobile
  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 3;
  const useCarousel = items.length > 3;
  const maxOffset = Math.max(0, items.length - visibleCount);

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  // Reset offset if items change
  useEffect(() => {
    setOffset(0);
  }, [items.length]);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="retail" ref={sectionRef} className="w-full pt-10 lg:pt-14 pb-20 lg:pb-28 bg-kisu-bg-light">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div
          className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-4">
            Купить <span className="text-kisu-orange">в розницу</span>
          </h2>
          <p className="text-kisu-text-gray text-lg">
            Одежда KISU доступна на популярных маркетплейсах
          </p>
        </div>

        {/* Carousel wrapper */}
        {useCarousel ? (
          <div className="relative">
            {/* Prev button */}
            <button
              onClick={prev}
              disabled={offset === 0}
              aria-label="Назад"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-kisu-text-dark" />
            </button>

            {/* Track */}
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-400"
                style={{ transform: `translateX(calc(-${offset} * (100% / 3 + 0.5rem)))` }}
              >
                {items.map((mp, index) => (
                  <MarketplaceCard
                    key={mp.id}
                    mp={mp}
                    index={index}
                    isVisible={isVisible}
                    className="flex-shrink-0 w-full sm:w-[calc(33.333%-1rem)]"
                  />
                ))}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              aria-label="Вперёд"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5 text-kisu-text-dark" />
            </button>

            {/* Dots */}
            {items.length > visibleCount && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: maxOffset + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOffset(i)}
                    aria-label={`Слайд ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === offset ? 'bg-kisu-orange w-5' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6">
            {items.map((mp, index) => (
              <MarketplaceCard
                key={mp.id}
                mp={mp}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MarketplaceCard({
  mp,
  index,
  isVisible,
  className = '',
}: {
  mp: ApiMarketplace;
  index: number;
  isVisible: boolean;
  className?: string;
}) {
  return (
    <a
      href={mp.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center justify-center p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{
        backgroundColor: mp.bg_color,
        transitionDelay: `${200 + index * 120}ms`,
      }}
    >
      <div className="mb-4 flex items-center justify-center h-12">
        {mp.logo_url ? (
          <img
            src={mp.logo_url}
            alt={mp.name}
            className="h-10 w-auto object-contain"
          />
        ) : (
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: mp.text_color }}
          >
            {mp.name}
          </span>
        )}
      </div>
      <p className="text-sm text-center" style={{ color: `${mp.text_color}99` }}>
        {mp.description}
      </p>
    </a>
  );
}

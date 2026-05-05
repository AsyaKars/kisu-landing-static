import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

type SiteSetting = { id: number; setting_key: string; setting_value: string };

type ApiCategory = {
  id: number;
  title: string;
  description?: string;
  icon_name: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
};

const DEFAULT_CATEGORIES = [
  { label: 'Зимние куртки', description: 'Тёплые и яркие куртки для девочек и мальчиков', image_url: '/images/assortment-jackets.jpg' },
  { label: 'Парки', description: 'Универсальные парки для весны и осени', image_url: '/images/assortment-parkas.jpg' },
  { label: 'Комбинезоны', description: 'Удобные комбинезоны для малышей от 1 года', image_url: '/images/assortment-coveralls.jpg' },
  { label: 'Пальто', description: 'Модные и стильные пальто для девочек', image_url: '/images/assortment-coats.jpg' },
  { label: 'Брюки и полукомбинезоны', description: 'Практичные брюки для любой погоды', image_url: '/images/assortment-pants.jpg' },
  { label: 'Аксессуары', description: 'Шапки и варежки', image_url: '/images/assortment-accessories.jpg' },
];

export default function Assortment() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const { data: apiCategories } = useApi<ApiCategory[]>(API_ENDPOINTS.CATEGORIES);
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);

  const getSetting = (key: string, fallback: string) =>
    (settings ?? []).find((s) => s.setting_key === key)?.setting_value || fallback;

  const paragraph1 = getSetting(
    'assortment_paragraph1',
    'В ассортимент продукции входят зимние и демисезонные куртки и парки, комплекты, пальто, брюки и полукомбинезоны, комбинезоны, жилеты – вся одежда готова к любым превратностям российского климата.'
  );
  const paragraph2 = getSetting(
    'assortment_paragraph2',
    'Мы предлагаем широкий размерный ряд от 86 до 164 см, что позволяет одеть детей от 1 года до подросткового возраста. Все изделия разработаны с учётом анатомических особенностей детей и обеспечивают максимальную свободу движений.'
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

  const categories =
    apiCategories && apiCategories.length > 0
      ? apiCategories
          .filter((c) => c.is_active)
          .map((c) => ({ label: c.title, description: c.description ?? '', image_url: c.image_url || '/images/assortment.jpg' }))
      : DEFAULT_CATEGORIES;

  return (
    <section
      id="assortment"
      ref={sectionRef}
      className="w-full pt-20 lg:pt-32 pb-10 lg:pb-14 bg-kisu-bg-light"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={`order-1 lg:order-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-6">
              Наш <span className="text-kisu-orange">ассортимент</span>
            </h2>
            <p className="text-kisu-text-gray text-lg leading-relaxed mb-8">{paragraph1}</p>
            <p className="text-kisu-text-gray leading-relaxed mb-10">{paragraph2}</p>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => {
                const isActive = hoveredIndex === index;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onClick={() => setHoveredIndex(index)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                      isActive
                        ? 'bg-kisu-orange shadow-kisu'
                        : 'bg-white shadow-sm hover:shadow-md'
                    } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${400 + index * 80}ms` }}
                  >
                    <h3 className={`font-heading font-semibold text-sm sm:text-base mb-1 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-kisu-text-dark'
                    }`}>
                      {category.label === 'Брюки и полукомбинезоны' ? (
                        <>
                          <span className="lg:hidden">Брюки</span>
                          <span className="hidden lg:inline">Брюки и полукомбинезоны</span>
                        </>
                      ) : (
                        category.label
                      )}
                    </h3>
                    {category.description && (
                      <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-white/80' : 'text-kisu-text-gray'
                      }`}>
                        {category.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image with cross-fade */}
          <div
            className={`order-2 lg:order-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                {categories.map((category, index) => (
                  <img
                    key={index}
                    src={category.image_url}
                    alt={category.label}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      index === hoveredIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

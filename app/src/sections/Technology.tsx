import { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS, ICON_MAP } from '@/config/api';

type SiteSetting = { id: number; setting_key: string; setting_value: string };

type ApiTechnology = {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  is_active: boolean;
};

const DEFAULT_FEATURES = [
  { icon: 'Thermometer', title: 'Современные утеплители', description: 'Используем инновационные материалы, сохраняющие тепло даже при -30°C' },
  { icon: 'Droplets', title: 'Водоотталкивающие ткани', description: 'Специальная пропитка защищает от дождя и снега' },
  { icon: 'Move', title: 'Эргономичный крой', description: 'Изделия не сковывают движения, позволяя играть активно' },
  { icon: 'Heart', title: 'Гипоаллергенные материалы', description: 'Безопасны для чувствительной детской кожи' },
];

export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: apiFeatures } = useApi<ApiTechnology[]>(API_ENDPOINTS.TECHNOLOGIES);
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);

  const getSetting = (key: string, fallback: string) =>
    (settings ?? []).find((s) => s.setting_key === key)?.setting_value || fallback;

  const technologyImage = getSetting('technology_image', '/images/technology.jpg');
  const paragraph1 = getSetting(
    'technology_paragraph1',
    'Бренд KISU проводит многочисленные примерки, постоянно улучшаем конструкции и лекала, регулярно совершенствуется в области новых технологий, эргономических и конструктивных характеристик.'
  );
  const paragraph2 = getSetting(
    'technology_paragraph2',
    'Образцы подвергаются обязательным испытаниям и тестированию на износостойкость и безопасность. Мы сотрудничаем с ведущими лабораториями и используем только сертифицированные материалы.'
  );
  const qualityText = getSetting(
    'technology_quality_text',
    'Все изделия проходят многоступенчатый контроль качества'
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

  const features =
    apiFeatures && apiFeatures.length > 0
      ? apiFeatures.filter((f) => f.is_active).map((f) => ({
          icon: f.icon_name,
          title: f.title,
          description: f.description,
        }))
      : DEFAULT_FEATURES;

  return (
    <section id="technology" ref={sectionRef} className="w-full py-20 lg:py-32 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={`order-2 lg:order-1 relative overflow-hidden rounded-2xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={technologyImage}
                alt="Технологии KISU"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-kisu-accent-blue rounded-full -z-10" />
          </div>

          {/* Content */}
          <div
            className={`order-1 lg:order-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-6">
              Технологии и <span className="text-kisu-orange">инновации</span>
            </h2>
            <p className="text-kisu-text-gray text-lg leading-relaxed mb-8">{paragraph1}</p>
            <p className="text-kisu-text-gray leading-relaxed mb-10">{paragraph2}</p>

            {/* Quality subtitle */}
            <p className="text-kisu-orange font-semibold text-lg mb-6">{qualityText}</p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = ICON_MAP[feature.icon] ?? Zap;
                return (
                  <div
                    key={index}
                    className={`group transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-kisu-orange/10 flex-shrink-0 group-hover:bg-kisu-orange transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-kisu-orange group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-kisu-text-dark mb-2">{feature.title}</h3>
                        <p className="text-sm text-kisu-text-gray leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

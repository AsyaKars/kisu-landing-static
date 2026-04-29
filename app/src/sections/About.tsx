import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

type SiteSetting = { id: number; setting_key: string; setting_value: string };

const DEFAULT_PARAGRAPH1 =
  'KISU – российская производственная компания, с 2017 года выпускающая под одноименной маркой одежду и аксессуары для детей и подростков. Мы гордимся тем, что создаём качественную, тёплую и стильную одежду, которая выдерживает испытания суровым российским климатом.';

const DEFAULT_PARAGRAPH2 =
  'Наша миссия – дарить детям тепло и комфорт, позволяя им наслаждаться активным отдыхом в любую погоду. Каждое изделие проходит строгий контроль качества и создаётся с заботой о маленьких покупателях.';

const DEFAULT_STATS = [
  { value: '7+', label: 'лет на рынке' },
  { value: '50000+', label: 'счастливых семей' },
  { value: '100%', label: 'российское производство' },
];

function getVal(settings: SiteSetting[] | null, key: string, fallback: string): string {
  if (!settings) return fallback;
  const found = settings.find((s) => s.setting_key === key);
  return found?.setting_value || fallback;
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);

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

  const paragraph1 = getVal(settings, 'about_paragraph1', DEFAULT_PARAGRAPH1);
  const paragraph2 = getVal(settings, 'about_paragraph2', DEFAULT_PARAGRAPH2);
  const aboutImage = getVal(settings, 'about_image', '/images/about.jpg');

  const stats = DEFAULT_STATS.map((def, i) => ({
    value: getVal(settings, `about_stat${i + 1}_value`, def.value),
    label: getVal(settings, `about_stat${i + 1}_label`, def.label),
  }));

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full py-20 lg:py-32 bg-white"
    >
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
                src={aboutImage}
                alt="Производство KISU"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-kisu-orange/10 rounded-full -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-kisu-accent-blue rounded-full -z-10" />
          </div>

          {/* Content */}
          <div
            className={`order-1 lg:order-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-6">
              О бренде <span className="text-kisu-orange">KISU</span>
            </h2>
            <p className="text-kisu-text-gray text-lg leading-relaxed mb-8">{paragraph1}</p>
            <p className="text-kisu-text-gray leading-relaxed mb-10">{paragraph2}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-kisu-orange mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-kisu-orange">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

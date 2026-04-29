import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS, type ContactType } from '@/config/api';

const OFFICE_COORDS: [number, number] = [37.637892, 55.800246];
const OFFICE_ADDRESS = 'Москва, Пр-кт Мира, д. 102 стр. 33';
const MAPS_ROUTE_URL = `https://yandex.ru/maps/?rtext=~${OFFICE_COORDS[1]},${OFFICE_COORDS[0]}&rtt=auto&text=${encodeURIComponent(OFFICE_ADDRESS)}`;

type ApiContactInfo = {
  id: number;
  info_type: ContactType;
  label: string;
  value: string;
  order_index: number;
  is_active: boolean;
};

// Fallback hardcoded contacts
const DEFAULT_CONTACTS: ApiContactInfo[] = [
  {
    id: 1,
    info_type: 'legal',
    label: 'Юридический адрес',
    value: 'ООО "ГРАНД ИНВЕСТ"\nИНН 7706771142\n129626, г. Москва, вн.тер.г. муниципальный округ Алексеевский,\nПр-кт Мира, д. 102 стр. 33',
    order_index: 1,
    is_active: true,
  },
  {
    id: 2,
    info_type: 'address',
    label: 'Шоу-рум',
    value: '129626, г. Москва, вн.тер.г. муниципальный округ Алексеевский,\nПр-кт Мира, д. 102 стр. 33',
    order_index: 2,
    is_active: true,
  },
  {
    id: 3,
    info_type: 'hours',
    label: 'Режим работы',
    value: 'Пн. – Пт.: с 09:00 до 18:00',
    order_index: 3,
    is_active: true,
  },
  {
    id: 4,
    info_type: 'phone',
    label: 'Телефон',
    value: '+7 (495) 640-19-83\n+7 (915) 190-32-46',
    order_index: 4,
    is_active: true,
  },
  {
    id: 5,
    info_type: 'email',
    label: 'E-mail',
    value: 'sales@kisu.ru - отдел продаж',
    order_index: 5,
    is_active: true,
  },
];


export default function Contacts() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: apiContacts } = useApi<ApiContactInfo[]>(API_ENDPOINTS.CONTACTS);

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
    const container = mapRef.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A27cd59f770aa5d3c1ebd38cb0b3756c075a3a5ecf82366f3a5e6e11837f599b0&width=100%25&height=490&lang=ru_RU&scroll=true';
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  const contacts =
    apiContacts && apiContacts.length > 0
      ? apiContacts.filter((c) => c.is_active)
      : DEFAULT_CONTACTS;


  return (
    <section id="contacts" ref={sectionRef} className="w-full bg-kisu-bg-light">
      {/* Top: header + contacts */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-20 lg:pt-32 pb-12 lg:pb-16">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark">
            Наши <span className="text-kisu-orange">контакты</span>
          </h2>
        </div>

        {/* Contact cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.filter((c) => c.info_type === 'legal' || c.info_type === 'address').map((info, index) => {
            const lines = info.value.split('\n');
            return (
              <div
                key={info.id}
                className={`bg-white rounded-2xl p-6 shadow-sm transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${200 + index * 80}ms` }}
              >
                <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-kisu-orange">
                  {info.label}
                </h3>
                <div className="space-y-1">
                  {lines.map((line, lineIndex) => (
                    <p key={lineIndex} className="text-kisu-text-gray text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Контакты и режим работы */}
          <div
            className={`bg-white rounded-2xl p-6 shadow-sm transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '360ms' }}
          >
            {/* Заголовок + телефоны + email */}
            <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-kisu-orange">
              Свяжитесь с нами
            </h3>
            <div className="space-y-1 mb-4">
              {contacts.filter((c) => c.info_type === 'phone').flatMap((info) =>
                info.value.split('\n').filter(Boolean).map((line, i) => {
                  const tel = line.replace(/[^\d+]/g, '');
                  return (
                    <a key={`phone-${info.id}-${i}`} href={`tel:${tel}`}
                      className="block text-kisu-text-gray text-sm leading-relaxed hover:text-kisu-orange transition-colors duration-200">
                      {line}
                    </a>
                  );
                })
              )}
              {contacts.filter((c) => c.info_type === 'email').flatMap((info) =>
                info.value.split('\n').filter(Boolean).map((line, i) => {
                  const emailAddr = line.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] ?? line;
                  return (
                    <a key={`email-${info.id}-${i}`} href={`mailto:${emailAddr}`}
                      className="block text-kisu-text-gray text-sm leading-relaxed hover:text-kisu-orange transition-colors duration-200">
                      {line}
                    </a>
                  );
                })
              )}
            </div>
            {/* Режим работы */}
            {contacts.filter((c) => c.info_type === 'hours').map((info) => (
              <div key={info.id}>
                <h3 className="font-heading font-semibold mb-2 text-sm uppercase tracking-wide text-kisu-orange">
                  {info.label}
                </h3>
                <div className="space-y-1">
                  {info.value.split('\n').map((line, i) => (
                    <p key={i} className="text-kisu-text-gray text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width map */}
      <div
        className={`w-full transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative w-full overflow-hidden" style={{ height: 450 }}>
          <div ref={mapRef} className="w-full h-full overflow-hidden" />
          {/* Custom orange tooltip overlaid at map center */}
          <a
            href={MAPS_ROUTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] no-underline"
          >
            <div
              className="relative min-w-[180px] rounded-[20px] bg-kisu-orange px-[18px] py-[10px] text-center text-white shadow-md transition-transform duration-150 group-hover:scale-105"
            >
              <div className="text-sm font-bold">KISU</div>
              <div className="mt-1 text-[13px] leading-snug opacity-95">
                Пр-кт Мира, д. 102 стр. 33
              </div>
              <div className="mt-[3px] text-xs font-medium opacity-85">
                Построить маршрут →
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: -7,
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '8px solid #FF6B35',
                }}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

/* ── Care rule icon paths ──────────────────────────────────── */

const CARE_RULE_ICONS = [
  '/images/care-01.png',
  '/images/care-02.png',
  '/images/care-03.png',
  '/images/care-04.png',
  '/images/care-05.png',
  '/images/care-06.png',
];

const DEFAULT_CARE_RULES = [
  'Стирать при температуре не выше 30°С в щадящем режиме и не применять усилия при отжиме',
  'Отбеливать запрещено! Не хлорировать и не использовать хлорсодержащих моющих средств и стиральных порошков с отбеливателем',
  'Нельзя сушить в барабане',
  'Сухая чистка запрещена',
  'Можно гладить при температуре не более 110°С',
  'Отпаривать категорически запрещено!',
];

const DEFAULT_RECOMMENDATIONS = [
  {
    title: 'Моющее средство',
    text: 'Изделия KISU® желательно стирать с использованием мягкого моющего средства (лучше для цветных тканей), которое не содержит отбеливателя. Мы советуем не применять средства в виде порошка — его можно заменить специализированным моющим средством для стирки верхней одежды.',
  },
  {
    title: 'Стирка в машине',
    text: 'Нашу одежду можно стирать в машине-автомате на программе с температурным режимом не более 30°С. Необходимо выбрать программу, у которой отжим составляет не более 600 оборотов в минуту — в большинстве случаев это «деликатный» режим стирки. Во избежание разводов можно выставить дополнительный режим полоскания.',
  },
  {
    title: 'Подготовка к стирке',
    text: 'Перед стиркой курток, брюк или комбинезонов необходимо вынуть из карманов всё лишнее и застегнуть все замки и кнопки, вывернув изделие наизнанку. Если на изделии присутствуют элементы из натурального меха (например воротник) — отстегните их и чистите соответственно. Во избежание деформации рекомендуется использовать мешок для стирки.',
  },
  {
    title: 'Сушка',
    text: 'Изделия KISU® нельзя сушить в сушильной машине. Предпочтительна обычная сушка на свежем воздухе либо в тёплом проветриваемом помещении на сушилке в горизонтальном положении. Периодически изделие нужно встряхивать, чтобы утеплитель лучше высыхал и расправлялся. Запрещается сушить изделия на обогревательных приборах.',
  },
];

const DEFAULT_INTRO = [
  'Одной из основных особенностей одежды KISU® является комфорт и удобство использования. Наша одежда отлично подходит для игр на воздухе, прогулок в холодную и слякотную погоду, но такие погодные условия способствуют быстрому её загрязнению.',
  'Для того, чтобы изделия KISU® оставались тёплыми и сохранили отличный внешний вид даже после множества стирок, их необходимо правильно стирать, чистить и сушить.',
  'Все используемые в производстве ткани обработаны грязеотталкивающей пропиткой DWR (Durable Water Repellent), не позволяющей влаге и грязи проходить через верхний слой ткани. При несильных загрязнениях рекомендуется щадящая чистка мягкой тканью, смоченной тёплой водой.',
];

const DEFAULT_FOOTER_NOTE =
  'При соблюдении этих простых правил одежда KISU® прослужит Вам многие сезоны, будет согревать своим теплом и радовать Вашего ребёнка.';

/* ── SiteSetting type ─────────────────────────────────────── */

type SiteSetting = {
  id: number;
  setting_key: string;
  setting_value: string;
};

/* ── Component ────────────────────────────────────────────── */

export default function Care() {
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);

  const getSetting = (key: string, fallback: string): string =>
    settings?.find((s) => s.setting_key === key)?.setting_value ?? fallback;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const intro = [
    getSetting('care_intro_1', DEFAULT_INTRO[0]),
    getSetting('care_intro_2', DEFAULT_INTRO[1]),
    getSetting('care_intro_3', DEFAULT_INTRO[2]),
  ];

  const careRules = DEFAULT_CARE_RULES.map((fallback, i) =>
    getSetting(`care_rule_${i + 1}`, fallback)
  );

  const recommendations = DEFAULT_RECOMMENDATIONS.map((rec, i) => ({
    title: getSetting(`care_rec_${i + 1}_title`, rec.title),
    text: getSetting(`care_rec_${i + 1}_text`, rec.text),
  }));

  const footerNote = getSetting('care_footer_note', DEFAULT_FOOTER_NOTE);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header forceScrolled />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto">

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-kisu-text-dark uppercase tracking-wide mb-6">
            Правила ухода за изделиями
          </h1>

          {/* Intro */}
          <div className="space-y-4 text-kisu-text-gray leading-relaxed mb-10">
            {intro.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>

          {/* Shelter Kids section */}
          <div className="bg-kisu-text-dark rounded-2xl p-5 sm:p-8 mb-10">
            <h2 className="text-white font-heading font-bold text-base sm:text-xl text-center mb-2">
              Правила ухода за изделиями KISU® с наполнителем{' '}
              <span className="text-kisu-orange">Shelter Kids®</span>
            </h2>
            <p className="text-white/60 text-xs sm:text-sm text-center mb-6 sm:mb-8">
              ! Проглаживание под паром не допускается. Допускается стирка при низкой температуре или щадящая химическая чистка.
            </p>

            {/* 6 symbols grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {careRules.map((text, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-3 sm:p-5 flex flex-col items-center text-center gap-2 sm:gap-4"
                >
                  <img src={CARE_RULE_ICONS[i]} alt="" className="w-10 h-10 sm:w-16 sm:h-16" />
                  <p className="text-kisu-text-gray text-[11px] leading-snug sm:text-xs sm:leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <h2 className="text-kisu-orange font-heading font-bold text-xl mb-6">
            Специальные рекомендации по уходу за изделиями KISU®
          </h2>

          <div className="space-y-5">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kisu-orange flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-kisu-text-dark mb-1">{rec.title}</p>
                  <p className="text-kisu-text-gray leading-relaxed text-sm">{rec.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 p-6 bg-kisu-orange/10 border-l-4 border-kisu-orange rounded-r-xl">
            <p className="text-kisu-text-dark leading-relaxed">{footerNote}</p>
          </div>

          <p className="text-sm text-kisu-text-gray mt-8">
            По всем вопросам обращайтесь по телефону{' '}
            <a href="tel:+74956401983" className="text-kisu-orange hover:underline">+7 (495) 640-19-83</a>{' '}
            или на email{' '}
            <a href="mailto:sales@kisu.ru" className="text-kisu-orange hover:underline">sales@kisu.ru</a>.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Gem, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS, ICON_MAP } from '@/config/api';

type ApiBenefit = {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  is_active: boolean;
};

type SiteSetting = { id: number; setting_key: string; setting_value: string };

const DEFAULT_BENEFITS = [
  { icon: 'Gem', title: 'Высокое качество', description: 'Высокое качество по доступным ценам' },
  { icon: 'Truck', title: 'Бесплатная доставка', description: 'Бесплатная доставка по г. Москве или самовывоз' },
  { icon: 'MapPin', title: 'Доставка в регионы', description: 'Организацию доставки в регионы России через выбранные Вами транспортные компании' },
  { icon: 'FileText', title: 'Документация', description: 'Полный пакет сопроводительных документов' },
  { icon: 'Award', title: 'Сертификаты', description: 'Предоставление всех сертификатов и нормативных документов' },
  { icon: 'CreditCard', title: 'Условия оплаты', description: 'Отгрузка на условиях 100% предоплаты' },
];

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface CooperationProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

export default function Cooperation({ isFormOpen, setIsFormOpen }: CooperationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    shopName: '',
    innKpp: '',
    phone: '',
    email: '',
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: apiBenefits } = useApi<ApiBenefit[]>(API_ENDPOINTS.BENEFITS);
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);

  const cooperationSubtitle =
    (settings ?? []).find((s) => s.setting_key === 'cooperation_subtitle')?.setting_value ||
    'Оптовым покупателям мы предлагаем выгодные условия сотрудничества и полную поддержку на всех этапах работы';

  const resetForm = () => {
    setIsSubmitted(false);
    setConsent(false);
    setFormData({ companyName: '', shopName: '', innKpp: '', phone: '', email: '' });
    setSubmitError('');
  };

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

  const benefits =
    apiBenefits && apiBenefits.length > 0
      ? apiBenefits.filter((b) => b.is_active).map((b) => ({
          icon: b.icon_name,
          title: b.title,
          description: b.description,
        }))
      : DEFAULT_BENEFITS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}${API_ENDPOINTS.PARTNER_FORM}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ошибка отправки заявки');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsFormOpen(false);
        resetForm();
      }, 7000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить заявку. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="cooperation"
      ref={sectionRef}
      className="w-full pt-20 lg:pt-32 pb-10 lg:pb-14 bg-white"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-kisu-text-dark mb-6">
            Сотрудничество с <span className="text-kisu-orange">KISU</span>
          </h2>
          <p className="text-kisu-text-gray text-lg">
            {cooperationSubtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = ICON_MAP[benefit.icon] ?? Gem;
            return (
              <div
                key={index}
                className={`group p-6 bg-kisu-bg-light rounded-2xl hover:bg-kisu-orange hover:shadow-kisu transition-all duration-300 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-kisu-orange/10 mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <IconComponent className="w-7 h-7 text-kisu-orange group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-semibold text-kisu-text-dark text-lg mb-2 group-hover:text-white transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-kisu-text-gray group-hover:text-white/90 transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Partner Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-lg">
          {isSubmitted ? (
            <div className="py-6 flex flex-col items-center text-center gap-4">
              {/* Логотип */}
              <img src="/images/logo.svg" alt="KISU" className="h-10 w-auto object-contain" />

              {/* Иконка успеха */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kisu-orange/10 border-2 border-kisu-orange/25">
                <CheckCircle2 className="w-10 h-10 text-kisu-orange" />
              </div>

              {/* Заголовок */}
              <h3 className="text-2xl font-heading font-bold text-kisu-text-dark">
                Спасибо за заявку!
              </h3>

              {/* Тёплый текст */}
              <p className="text-kisu-text-gray text-base leading-relaxed max-w-xs">
                Мы очень рады, что вы выбрали <span className="text-kisu-orange font-semibold">KISU</span>!
                Наш менеджер свяжется с вами в ближайшее рабочее время и с удовольствием ответит на все вопросы.
              </p>

              {/* Кнопка закрыть */}
              <Button
                type="button"
                onClick={() => { setIsFormOpen(false); resetForm(); }}
                className="mt-2 bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium px-10 py-2.5 rounded-full transition-all duration-300 hover:shadow-kisu"
              >
                Закрыть
              </Button>
            </div>
          ) : (
            <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-bold text-kisu-text-dark">
                Стать партнёром
              </DialogTitle>
              <DialogDescription className="text-kisu-text-gray">
                Заполните форму ниже, и мы свяжемся с вами в ближайшее время
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {submitError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{submitError}</div>
              )}
              <div>
                <Label htmlFor="companyName" className="text-kisu-text-dark">
                  Полное наименование компании
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="ООО Компания"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shopName" className="text-kisu-text-dark">
                  Название магазина
                </Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="Магазин детской одежды"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="innKpp" className="text-kisu-text-dark">
                  ИНН/КПП
                </Label>
                <Input
                  id="innKpp"
                  value={formData.innKpp}
                  onChange={(e) => setFormData({ ...formData, innKpp: e.target.value })}
                  placeholder="7701234567 / 770101001"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-kisu-text-dark">
                  Телефон <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-kisu-text-dark">
                  Электронная почта <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>
              {/* Согласие на обработку персональных данных */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 flex-shrink-0 accent-kisu-orange cursor-pointer"
                />
                <label htmlFor="consent" className="text-sm text-kisu-text-gray leading-snug cursor-pointer">
                  Я согласен(а) на{' '}
                  <a href="/personal-data" target="_blank" className="text-kisu-orange underline hover:no-underline">
                    обработку персональных данных
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting || !consent}
                className="w-full bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium py-3 rounded-full transition-all duration-300 hover:shadow-kisu disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

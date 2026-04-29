import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/use-api';

interface HeroProps {
  onPartnerClick: () => void;
}

type HeroSlideApi = {
  id: number;
  title: string;
  subtitle: string;
  cta_text: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
};

type HeroSlideUi = {
  mediaUrl: string;
  title: string;
  subtitle: string;
  cta: string;
  secondaryCta: string;
  secondaryCtaUrl: string;
};

const fallbackSlides: HeroSlideUi[] = [
  {
    mediaUrl: '/images/hero-1.jpg',
    title: 'ТЕПЛО, В КОТОРОМ ХОЧЕТСЯ ГУЛЯТЬ',
    subtitle: 'Детская зимняя одежда премиум-класса от российского производителя',
    cta: 'Стать партнёром',
    secondaryCta: 'О бренде',
    secondaryCtaUrl: '#about',
  },
  {
    mediaUrl: '/images/hero-2.jpg',
    title: 'СТИЛЬ И КОМФОРТ В ЛЮБУЮ ПОГОДУ',
    subtitle: 'Демисезонные коллекции для активных детей',
    cta: 'Смотреть коллекцию',
    secondaryCta: 'Ассортимент',
    secondaryCtaUrl: '#assortment',
  },
  {
    mediaUrl: '/images/hero-3.jpg',
    title: 'КАЧЕСТВО, КОТОРОМУ ДОВЕРЯЮТ',
    subtitle: 'Более 7 лет создаем теплую одежду для российских детей',
    cta: 'Узнать больше',
    secondaryCta: 'Сотрудничество',
    secondaryCtaUrl: '#cooperation',
  },
];

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function Hero({ onPartnerClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: apiSlides } = useApi<HeroSlideApi[]>('/content/index.php?action=hero-slides');

  const slides = useMemo(() => {
    if (!apiSlides || apiSlides.length === 0) {
      return fallbackSlides;
    }

    const normalized = apiSlides
      .filter((slide) => slide.is_active ?? true)
      .sort((a, b) => a.order_index - b.order_index)
      .map((slide) => ({
        mediaUrl: slide.image_url,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta_text,
        secondaryCta: slide.secondary_cta_text || '',
        secondaryCtaUrl: slide.secondary_cta_url || '',
      }));

    return normalized.length > 0 ? normalized : fallbackSlides;
  }, [apiSlides]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || slides.length === 0) {
        return;
      }

      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 2400);
    },
    [isAnimating, slides.length]
  );

  const nextSlide = useCallback(() => {
    if (slides.length === 0) {
      return;
    }

    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) {
      return;
    }

    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={`${slide.mediaUrl}-${index}`}
          className={`absolute inset-0 transition-opacity duration-2000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {isVideoUrl(slide.mediaUrl) ? (
            <video
              src={slide.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-8000"
              style={{
                backgroundImage: `url(${slide.mediaUrl})`,
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-end pb-28 lg:items-center lg:pb-0">
        <div className="w-full px-14 sm:px-20 lg:px-28 xl:px-36">
          <div className="max-w-3xl">
            {slides.map((slide, index) => (
              <div
                key={`${slide.title}-${index}`}
                className={`transition-all duration-600 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute'
                }`}
              >
                {index === currentSlide && (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight animate-slide-up">
                      {slide.title}
                    </h1>
                    <p
                      className="text-lg sm:text-xl text-white/90 mb-8 animate-slide-up"
                      style={{ animationDelay: '150ms' }}
                    >
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                      <Button
                        onClick={onPartnerClick}
                        className="border-2 border-transparent bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-kisu-lg hover:scale-105"
                      >
                        {slide.cta}
                      </Button>
                      {slide.secondaryCta && (
                        <Button
                          variant="outline"
                          onClick={() => scrollToSection(slide.secondaryCtaUrl)}
                          className="border-2 border-white text-white hover:bg-white hover:text-kisu-text-dark font-medium px-8 py-6 text-lg rounded-full transition-all duration-300 bg-transparent"
                        >
                          {slide.secondaryCta}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="hidden lg:block absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden lg:block absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-kisu-orange w-8' : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

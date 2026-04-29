import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  onPartnerClick: () => void;
  onSecondaryCta?: () => void;
}

export function HeroCarousel({ slides, onPartnerClick, onSecondaryCta }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 800 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = setInterval(() => {
      scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [scrollNext]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] relative min-h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
                  <div className="max-w-3xl">
                    <div className={`transition-all duration-600 ${
                      index === selectedIndex
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight animate-slide-up">
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <Button
                          onClick={onPartnerClick}
                          className="bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-kisu-lg hover:scale-105"
                        >
                          {slide.cta}
                        </Button>
                        {onSecondaryCta && (
                          <Button
                            variant="outline"
                            onClick={onSecondaryCta}
                            className="border-2 border-white text-white hover:bg-white hover:text-kisu-text-dark font-medium px-8 py-6 text-lg rounded-full transition-all duration-300 bg-transparent"
                          >
                            О бренде
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-kisu-orange w-8'
                : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

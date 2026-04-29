import { useState, type ImgHTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'landscape';
  objectFit?: 'cover' | 'contain' | 'fill';
}

const aspectRatioClasses = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
};

const objectFitClasses = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

export function LazyImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  objectFit = 'cover',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100',
        aspectRatioClasses[aspectRatio],
        className
      )}
      ref={containerRef}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full transition-opacity duration-500',
            objectFitClasses[objectFit],
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-kisu-orange border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

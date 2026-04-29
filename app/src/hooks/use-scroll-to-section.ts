import { useCallback } from 'react';

export function useScrollToSection() {
  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return scrollToSection;
}

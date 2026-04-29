import { useState, useEffect } from 'react';
import { Menu, X, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

type SiteSetting = { id: number; setting_key: string; setting_value: string };

interface HeaderProps {
  onPartnerClick: () => void;
  forceScrolled?: boolean;
}

const navItems = [
  { label: 'Главная', href: '#hero' },
  { label: 'О бренде', href: '#about' },
  { label: 'Ассортимент', href: '#assortment' },
  { label: 'Сотрудничество', href: '#cooperation' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Контакты', href: '#contacts' },
];

export default function Header({ onPartnerClick, forceScrolled = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);
  const logoUrl = (settings ?? []).find((s) => s.setting_key === 'logo_url')?.setting_value ?? '/images/logo.svg';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = isScrolled || forceScrolled || isMobileMenuOpen;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/' + href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="flex items-center gap-2 group"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="KISU"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <PawPrint
                  className={`w-8 h-8 transition-colors duration-300 ${
                    scrolled ? 'text-kisu-orange' : 'text-white'
                  } group-hover:text-kisu-orange`}
                />
                <span
                  className={`text-2xl font-heading font-bold transition-colors duration-300 ${
                    scrolled ? 'text-kisu-text-dark' : 'text-white'
                  }`}
                >
                  KISU
                </span>
              </>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className={`relative text-sm font-heading font-semibold transition-colors duration-300 hover:text-kisu-orange ${
                  scrolled ? 'text-kisu-text-dark' : 'text-white'
                } group`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kisu-orange transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Phone & CTA Button */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+74956401983"
              className={`flex items-center gap-2 font-medium transition-colors duration-300 hover:text-kisu-orange ${
                scrolled ? 'text-kisu-text-dark' : 'text-white'
              }`}
            >

              +7 (495) 640-19-83
            </a>
            <Button
              onClick={onPartnerClick}
              className="bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:shadow-kisu hover:scale-105"
            >
              Стать партнёром
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors duration-300 ${
              scrolled ? 'text-kisu-text-dark' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-16 inset-x-0 h-[calc(100vh-4rem)] bg-white shadow-lg overflow-y-auto transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.href);
              }}
              className="px-6 py-3 font-heading font-semibold text-kisu-text-dark hover:bg-kisu-bg-warm hover:text-kisu-orange transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <div className="px-6 py-4 border-t border-gray-100">
            <a
              href="tel:+74956401983"
              className="flex items-center justify-center gap-2 text-kisu-text-dark hover:text-kisu-orange font-medium py-3 mb-3 transition-colors duration-200"
            >

              +7 (495) 640-19-83
            </a>
            <Button
              onClick={onPartnerClick}
              className="w-full bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium py-3 rounded-full"
            >
              Стать партнёром
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

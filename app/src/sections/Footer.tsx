import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

type SiteSetting = { id: number; setting_key: string; setting_value: string };
type SocialLinkApi = {
  id: number;
  platform: string;
  url: string;
  icon_name: string;
  icon_url?: string;
  order_index: number;
  is_active: boolean;
};

const navLinks = [
  { label: 'Главная', href: '#hero' },
  { label: 'О бренде', href: '#about' },
  { label: 'Ассортимент', href: '#assortment' },
  { label: 'Сотрудничество', href: '#cooperation' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Контакты', href: '#contacts' },
];

const DEFAULT_SOCIAL: SocialLinkApi[] = [
  { id: 1, platform: 'vk', url: 'https://vk.com/kisuofficial', icon_name: 'vk', order_index: 1, is_active: true },
];

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'vk':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.788 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.491 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.72c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.491-.085.744-.576.744z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.623 4.823-4.351c.192-.192-.054-.3-.297-.108l-5.965 3.759-2.569-.802c-.56-.176-.572-.56.117-.828l10.037-3.869c.466-.174.874.108.714.827z" />
        </svg>
      );
    case 'rutube':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.93 4H5.07A3.07 3.07 0 0 0 2 7.07v9.86A3.07 3.07 0 0 0 5.07 20h13.86A3.07 3.07 0 0 0 22 16.93V7.07A3.07 3.07 0 0 0 18.93 4zm-4.2 8.5-5.5 3.18a.57.57 0 0 1-.86-.49V8.81a.57.57 0 0 1 .86-.49l5.5 3.18a.57.57 0 0 1 0 1z" />
        </svg>
      );
    case 'ok':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.55 4.8c2.191 0 3.97 1.779 3.97 3.97s-1.779 3.97-3.97 3.97-3.97-1.779-3.97-3.97 1.779-3.97 3.97-3.97zm6.14 9.62c-.68 1.33-1.87 2.33-3.24 2.85l2.56 2.56a.997.997 0 010 1.41 1.003 1.003 0 01-1.42 0l-2.58-2.58-2.58 2.58a1.003 1.003 0 01-1.42 0 .997.997 0 010-1.41l2.56-2.56c-1.37-.52-2.56-1.52-3.24-2.85a1 1 0 011.78-.9c.63 1.24 1.9 2.05 3.34 2.05s2.71-.81 3.34-2.05a1 1 0 011.78.9h-.04zm-6.14-2.07c1.087 0 1.97-.883 1.97-1.97S13.637 8.4 12.55 8.4s-1.97.883-1.97 1.97.883 1.97 1.97 1.97z" />
        </svg>
      );
    case 'max':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 16.5h-2l-3.5-4-3.5 4h-2l4.5-5.25L6.5 7h2l3.5 3.9 3.5-3.9h2l-4.5 4.25L17.5 16.5z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);
  const { data: apiSocial } = useApi<SocialLinkApi[]>(API_ENDPOINTS.SOCIAL);

  const getSetting = (key: string, fallback: string) =>
    (settings ?? []).find((s) => s.setting_key === key)?.setting_value || fallback;

  const logoUrl = getSetting('logo_url', '/images/logo.svg');
  const footerDescription = getSetting(
    'footer_description',
    'Российский производитель детской зимней одежды. Создаём тепло и комфорт для ваших детей с 2017 года.'
  );
  const companyName = getSetting('company_name', 'ООО «ГРАНД ИНВЕСТ»');
  const inn = getSetting('inn', '7706771142');
  const kpp = getSetting('kpp', '771701001');
  const ogrn = getSetting('ogrn', '1127746204145');

  const socialLinks =
    apiSocial && apiSocial.length > 0
      ? apiSocial.filter((s) => s.is_active).sort((a, b) => a.order_index - b.order_index)
      : DEFAULT_SOCIAL;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/' + href;
    }
  };

  return (
    <footer className="w-full bg-kisu-text-dark text-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#hero');
              }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4 group"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="KISU"
                  className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
                />
              ) : (
                <>
                  <PawPrint className="w-8 h-8 text-kisu-orange group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-2xl font-heading font-bold">KISU</span>
                </>
              )}
            </a>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {footerDescription}
            </p>
            <div className="flex gap-4 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url || '#'}
                  target={social.url && social.url !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kisu-orange transition-colors duration-300"
                  aria-label={social.platform}
                >
                  {social.icon_url
                    ? <img src={social.icon_url} alt={social.platform} className="w-5 h-5 object-contain" />
                    : <SocialIcon platform={social.platform} />
                  }
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <ul className="space-y-3 mt-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="relative inline-block text-white/70 hover:text-kisu-orange transition-colors duration-200 group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-kisu-orange transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sizes, Care & Certificates */}
          <div>
            <ul className="space-y-3 mt-1">
              <li>
                <Link
                  to="/sizes"
                  className="relative inline-block text-white/70 hover:text-kisu-orange transition-colors duration-200 group"
                >
                  Таблица размеров
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-kisu-orange transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link
                  to="/care"
                  className="relative inline-block text-white/70 hover:text-kisu-orange transition-colors duration-200 group"
                >
                  Правила ухода
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-kisu-orange transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link
                  to="/certificates"
                  className="relative inline-block text-white/70 hover:text-kisu-orange transition-colors duration-200 group"
                >
                  Сертификаты
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-kisu-orange transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Реквизиты + документы */}
          <div>
            <div className="space-y-1 text-sm text-white/70 mb-6">
              <p>{companyName}</p>
              <p>ИНН&nbsp;{inn}</p>
              <p>КПП&nbsp;{kpp}</p>
              <p>ОГРН&nbsp;{ogrn}</p>
            </div>
            <div className="space-y-2">
              <Link
                to="/privacy"
                className="block text-sm text-white/60 hover:text-kisu-orange transition-colors duration-200"
              >
                Политика конфиденциальности
              </Link>
              <Link
                to="/personal-data"
                className="block text-sm text-white/60 hover:text-kisu-orange transition-colors duration-200"
              >
                Соглашение об обработке персональных данных
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm text-center">
            © {new Date().getFullYear()} KISU. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}

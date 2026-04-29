import {
  Shirt,
  Wind,
  Baby,
  Layers,
  CircleDot,
  Sparkles,
  Thermometer,
  Droplets,
  Move,
  Heart,
  Award,
  Shield,
  ThumbsUp,
  FileCheck,
  Gem,
  Truck,
  MapPin,
  FileText,
  CreditCard,
  Building2,
  Clock,
  Phone,
  Mail,
  Star,
  Zap,
  CheckCircle2,
  Package,
  type LucideIcon,
} from 'lucide-react';

// API endpoints
export const API_ENDPOINTS = {
  HERO_SLIDES: '/content/index.php?action=hero-slides',
  CATEGORIES: '/content/index.php?action=categories',
  TECHNOLOGIES: '/content/index.php?action=technologies',
  CERTIFICATES: '/content/index.php?action=certificates',
  BENEFITS: '/content/index.php?action=benefits',
  LOOKBOOK: '/content/index.php?action=lookbook',
  CONTACTS: '/content/index.php?action=contacts',
  SETTINGS: '/content/index.php?action=settings',
  SOCIAL: '/content/index.php?action=social',
  MARKETPLACES: '/content/index.php?action=marketplaces',
  SEO: '/content/index.php?action=seo',
  SIZE_TABLES: '/content/index.php?action=size-tables',
  UPLOAD: '/upload.php',
  AUTH_LOGIN: '/auth/login.php',
  PARTNER_FORM: '/partner-form.php',
  PARTNER_REQUESTS: '/partner-requests.php',
} as const;

// Lucide icon map: DB icon_name → React component
export const ICON_MAP: Record<string, LucideIcon> = {
  // Assortment
  Shirt,
  Wind,
  Baby,
  Layers,
  CircleDot,
  Sparkles,
  Package,
  // Technology
  Thermometer,
  Droplets,
  Move,
  Heart,
  Zap,
  // Quality / Certificates
  Award,
  Shield,
  ThumbsUp,
  FileCheck,
  CheckCircle2,
  // Cooperation / Benefits
  Gem,
  Truck,
  MapPin,
  FileText,
  CreditCard,
  Star,
  // Contacts
  Building2,
  Clock,
  Phone,
  Mail,
};

// Available icon names for dropdowns in admin
export const ICON_LIST = Object.keys(ICON_MAP);

// Contact info types
export const CONTACT_TYPES = [
  { value: 'legal', label: 'Юридический адрес' },
  { value: 'address', label: 'Шоу-рум / Адрес' },
  { value: 'hours', label: 'Режим работы' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'E-mail' },
] as const;

export type ContactType = 'phone' | 'email' | 'address' | 'hours' | 'legal';

// Map contact info_type → Lucide icon
export const CONTACT_ICON_MAP: Record<ContactType, LucideIcon> = {
  legal: Building2,
  address: MapPin,
  hours: Clock,
  phone: Phone,
  email: Mail,
};

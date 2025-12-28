
import { Product, Order, AppSettings, DailyVisits } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'ساعة ذكية Ultra - إصدار 2024',
    price: 349,
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1544117518-30dd0f73de6e?auto=format&fit=crop&q=80&w=800',
    description: 'ساعة ذكية متطورة تدعم الاتصال، تتبع اللياقة البدنية، ومقاومة للماء. شاشة AMOLED واضحة جداً.'
  },
  {
    id: 'p2',
    name: 'سماعات AirPods Pro - جودة عالية',
    price: 280,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1588423770809-b6d3939a047e?auto=format&fit=crop&q=80&w=800',
    description: 'تجربة صوتية فريدة مع عزل الضوضاء النشط. بطارية تدوم طويلاً وتصميم مريح للأذن.'
  },
  {
    id: 'p3',
    name: 'شاحن سيارة سريع 60W - متقن الصنع',
    price: 150,
    category: 'cars',
    image: 'https://images.unsplash.com/photo-1622445272461-c6580cab8638?auto=format&fit=crop&q=80&w=800',
    description: 'اشحن هاتفك بسرعة هائلة داخل السيارة. يدعم كافة أنواع الهواتف الذكية مع حماية من الحرارة.'
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  fbPixelId: '',
  fbTestEventCode: '',
  googleAnalyticsId: '',
  tiktokPixelId: '',
  adminPasswordHash: 'aGFsYWwyMDI0', // Password: halal2024
  domainName: 'storebrima.com',
  // Initialize new fields with empty strings
  googleAdSenseId: '',
  nameServers: '',
  googleSheetsUrl: '',
  customScript: ''
};

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('brima_products');
  return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem('brima_orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredDeletedOrders = (): Order[] => {
  const stored = localStorage.getItem('brima_deleted_orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredSettings = (): AppSettings => {
  const stored = localStorage.getItem('brima_settings');
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const getStoredVisits = (): DailyVisits => {
  const stored = localStorage.getItem('brima_visits');
  return stored ? JSON.parse(stored) : {};
};

export const trackVisit = () => {
  const visits = getStoredVisits();
  const today = new Date().toISOString().split('T')[0];
  visits[today] = (visits[today] || 0) + 1;
  localStorage.setItem('brima_visits', JSON.stringify(visits));
};

export const saveProducts = (p: Product[]) => localStorage.setItem('brima_products', JSON.stringify(p));
export const saveOrders = (o: Order[]) => localStorage.setItem('brima_orders', JSON.stringify(o));
export const saveDeletedOrders = (o: Order[]) => localStorage.setItem('brima_deleted_orders', JSON.stringify(o));
export const saveSettings = (s: AppSettings) => localStorage.setItem('brima_settings', JSON.stringify(s));

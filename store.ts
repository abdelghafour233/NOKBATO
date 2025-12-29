
import { Product, Order, AppSettings, DailyVisits } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-pump-manual',
    name: 'مضخة يدوية محمولة للسوائل والزيوت (جودة عالية)',
    price: 119,
    category: 'home',
    image: 'https://img.kwcdn.com/product/open/6dc61c3fd58b412cba8b606fd1a3aa5f-goods.jpeg',
    description: 'مضخة يدوية احترافية لنقل السوائل (مياه، وقود، زيوت) بكل سهولة. تأتي مع خرطوم PVC مرن وطويل لضمان الوصول لأصعب الأماكن. مثالية للاستخدام المنزلي أو في حالات الطوارئ للسيارة.'
  },
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
  adminPasswordHash: 'aGFsYWwyMDI0', 
  domainName: 'storebrima.com',
  googleAdSenseId: '',
  nameServers: '',
  googleSheetsUrl: '',
  customScript: ''
};

// استخدام مفتاح v3 لضمان تحديث البيانات عند الزبائن القدامى
const STORAGE_KEY_PRODUCTS = 'brima_v3_products';
const STORAGE_KEY_ORDERS = 'brima_v3_orders';
const STORAGE_KEY_SETTINGS = 'brima_v3_settings';

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
  return stored ? JSON.parse(stored) : [];
};

export const getStoredDeletedOrders = (): Order[] => {
  const stored = localStorage.getItem('brima_v3_deleted_orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const getStoredVisits = (): DailyVisits => {
  const stored = localStorage.getItem('brima_v3_visits');
  return stored ? JSON.parse(stored) : {};
};

export const trackVisit = () => {
  const visits = getStoredVisits();
  const today = new Date().toISOString().split('T')[0];
  visits[today] = (visits[today] || 0) + 1;
  localStorage.setItem('brima_v3_visits', JSON.stringify(visits));
};

export const saveProducts = (p: Product[]) => localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(p));
export const saveOrders = (o: Order[]) => localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(o));
export const saveDeletedOrders = (o: Order[]) => localStorage.setItem('brima_v3_deleted_orders', JSON.stringify(o));
export const saveSettings = (s: AppSettings) => localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));

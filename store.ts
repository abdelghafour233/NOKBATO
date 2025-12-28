
import { Product, Order, AppSettings, DailyVisits } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'product-1',
    name: 'ساعة رجالية فاخرة - مقاومة للماء',
    price: 249,
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    description: 'ساعة يد عصرية تجمع بين الكلاسيكية والأناقة الحديثة. تصميم متين مقاوم للصدمات والماء، مثالية للاستخدام اليومي أو المناسبات الرسمية.'
  },
  {
    id: 'product-2',
    name: 'سماعات بلوتوث لاسلكية - عزل ضوضاء',
    price: 380,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    description: 'استمتع بنقاوة صوت استثنائية مع أحدث سماعات الرأس اللاسلكية. بطارية تدوم طويلاً وتقنية عزل الضوضاء المحيطة.'
  },
  {
    id: 'product-3',
    name: 'كاميرا مراقبة ذكية للسيارة 4K',
    price: 450,
    category: 'cars',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    description: 'كاميرا سيارة بدقة 4K لتسجيل كل التفاصيل على الطريق. تدعم الرؤية الليلية والاتصال بالهاتف عبر الواي فاي.'
  },
  {
    id: 'product-4',
    name: 'نظارات شمسية عصرية - حماية UV',
    price: 180,
    category: 'glasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    description: 'نظارات شمسية بتصميم عصري وخفيف الوزن. عدسات عالية الجودة توفر حماية كاملة من أشعة الشمس الضارة.'
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  fbPixelId: '',
  fbTestEventCode: '', 
  googleAnalyticsId: '',
  googleAdSenseId: '', 
  tiktokPixelId: '',
  googleSheetsUrl: '',
  domainName: 'storebrima.com',
  nameServers: '',
  adminPasswordHash: 'aGFsYWwyMDI0', 
  customScript: ''
};

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem('orders');
  return stored ? JSON.parse(stored) : [];
};

// Fix: Add missing export for getStoredDeletedOrders used in Dashboard.tsx
export const getStoredDeletedOrders = (): Order[] => {
  const stored = localStorage.getItem('deleted_orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredSettings = (): AppSettings => {
  const stored = localStorage.getItem('settings');
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const trackVisit = () => {
  const visits: DailyVisits = JSON.parse(localStorage.getItem('analytics_visits') || '{}');
  const today = new Date().toISOString().split('T')[0];
  visits[today] = (visits[today] || 0) + 1;
  localStorage.setItem('analytics_visits', JSON.stringify(visits));
};

// Fix: Add missing export for getStoredVisits used in Dashboard.tsx
export const getStoredVisits = (): DailyVisits => {
  const stored = localStorage.getItem('analytics_visits');
  return stored ? JSON.parse(stored) : {};
};

export const saveProducts = (p: Product[]) => localStorage.setItem('products', JSON.stringify(p));
export const saveOrders = (o: Order[]) => localStorage.setItem('orders', JSON.stringify(o));
export const saveSettings = (s: AppSettings) => localStorage.setItem('settings', JSON.stringify(s));

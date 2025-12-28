import { Product, Order, AppSettings, DailyVisits } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'manual-siphon-pump-pro',
    name: 'المضخة اليدوية الاحترافية لنقل السوائل (بنزين، زيت، ماء)',
    price: 119,
    category: 'cars',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', // ملاحظة: يمكنك تغيير هذه الصورة من لوحة التحكم بصورتك الخاصة
    description: 'مضخة يدوية أصلية وعالية الجودة مصممة لنقل السوائل بسرعة وأمان. تتميز بمضخة قوية (الكرة السوداء) وخرطوم شفاف متين، مع مفاتيح تثبيت (Clamps) صفراء لضمان إغلاق محكم ومنع أي تسريب. مثالية للاستخدام في السيارات، القوارب، والمنزل.'
  }
];

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem('orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredDeletedOrders = (): Order[] => {
  const stored = localStorage.getItem('deleted_orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredVisits = (): DailyVisits => {
  const stored = localStorage.getItem('analytics_visits');
  return stored ? JSON.parse(stored) : {};
};

export const trackVisit = () => {
  const visits = getStoredVisits();
  const today = new Date().toISOString().split('T')[0];
  visits[today] = (visits[today] || 0) + 1;
  localStorage.setItem('analytics_visits', JSON.stringify(visits));
};

export const getStoredSettings = (): AppSettings => {
  const stored = localStorage.getItem('settings');
  return stored ? JSON.parse(stored) : {
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
};

export const saveProducts = (products: Product[]) => localStorage.setItem('products', JSON.stringify(products));
export const saveOrders = (orders: Order[]) => localStorage.setItem('orders', JSON.stringify(orders));
export const saveDeletedOrders = (orders: Order[]) => localStorage.setItem('deleted_orders', JSON.stringify(orders));
export const saveSettings = (settings: AppSettings) => localStorage.setItem('settings', JSON.stringify(settings));

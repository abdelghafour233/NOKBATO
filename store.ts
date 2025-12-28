import { Product, Order, AppSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'هاتف ذكي الترا برو',
    price: 8500,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    description: 'أحدث هاتف ذكي بمواصفات عالمية وكاميرا احترافية.'
  },
  {
    id: '5',
    name: 'ساعة رولكس كلاسيك',
    price: 45000,
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
    description: 'فخامة لا مثيل لها مع تصميم كلاسيكي جذاب يناسب جميع المناسبات.'
  }
];

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (!stored) {
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

export const factoryReset = () => {
  if (confirm('هل أنت متأكد؟ سيتم حذف كل شيء نهائياً.')) {
    localStorage.clear();
    window.location.reload();
  }
};
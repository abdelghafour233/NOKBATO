
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
  },
  {
    id: '6',
    name: 'نظارات ريبان شمسية',
    price: 1800,
    category: 'glasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    description: 'حماية كاملة من الأشعة فوق البنفسجية مع تصميم عصري وأنيق.'
  },
  {
    id: '2',
    name: 'طقم جلوس مودرن',
    price: 12000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'طقم مريح وأنيق يضيف لمسة عصرية لمنزلك.'
  },
  {
    id: '7',
    name: 'ساعة يد رياضية ذكية',
    price: 2400,
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1508685096489-7a68cb395561?auto=format&fit=crop&q=80&w=800',
    description: 'تتبع نشاطك الرياضي وصحتك بدقة متناهية مع شاشة AMOLED.'
  },
  {
    id: '3',
    name: 'سيارة دفع رباعي فخمة',
    price: 450000,
    category: 'cars',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    description: 'قوة وفخامة في القيادة مع أحدث أنظمة الأمان.'
  }
];

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem('orders');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredSettings = (): AppSettings => {
  const stored = localStorage.getItem('settings');
  return stored ? JSON.parse(stored) : {
    fbPixelId: '',
    googleAnalyticsId: '',
    tiktokPixelId: '',
    googleSheetsUrl: '',
    domainName: 'storehalal.com',
    nameServers: '',
    adminPasswordHash: 'aGFsYWwyMDI0',
    customScript: '' // القيمة الافتراضية فارغة
  };
};

export const saveProducts = (products: Product[]) => localStorage.setItem('products', JSON.stringify(products));
export const saveOrders = (orders: Order[]) => localStorage.setItem('orders', JSON.stringify(orders));
export const saveSettings = (settings: AppSettings) => localStorage.setItem('settings', JSON.stringify(settings));

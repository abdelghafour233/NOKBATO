
import { Product, Order, AppSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'هاتف ذكي الترا برو',
    price: 8500,
    category: 'electronics',
    image: 'https://picsum.photos/seed/phone/400/400',
    description: 'أحدث هاتف ذكي بمواصفات عالمية وكاميرا احترافية.'
  },
  {
    id: '2',
    name: 'طقم جلوس مودرن',
    price: 12000,
    category: 'home',
    image: 'https://picsum.photos/seed/sofa/400/400',
    description: 'طقم مريح وأنيق يضيف لمسة عصرية لمنزلك.'
  },
  {
    id: '3',
    name: 'سيارة دفع رباعي فخمة',
    price: 450000,
    category: 'cars',
    image: 'https://picsum.photos/seed/car/400/400',
    description: 'قوة وفخامة في القيادة مع أحدث أنظمة الأمان.'
  },
  {
    id: '4',
    name: 'لابتوب جيمنج',
    price: 15000,
    category: 'electronics',
    image: 'https://picsum.photos/seed/laptop/400/400',
    description: 'معالج قوي وشاشة مذهلة للألعاب والعمل الشاق.'
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
    domainName: '',
    nameServers: ''
  };
};

export const saveProducts = (products: Product[]) => localStorage.setItem('products', JSON.stringify(products));
export const saveOrders = (orders: Order[]) => localStorage.setItem('orders', JSON.stringify(orders));
export const saveSettings = (settings: AppSettings) => localStorage.setItem('settings', JSON.stringify(settings));

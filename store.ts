import { Product, Order, AppSettings, DailyVisits } from './types';

export const INITIAL_PRODUCTS: Product[] = [];

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
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

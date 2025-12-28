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
    customScript: '',
    cloudSyncId: ''
  };
};

export const saveProducts = (products: Product[]) => localStorage.setItem('products', JSON.stringify(products));
export const saveOrders = (orders: Order[]) => localStorage.setItem('orders', JSON.stringify(orders));
export const saveDeletedOrders = (orders: Order[]) => localStorage.setItem('deleted_orders', JSON.stringify(orders));
export const saveSettings = (settings: AppSettings) => localStorage.setItem('settings', JSON.stringify(settings));

// خدمة السحابة البسيطة (تستخدم API عام للتخزين المؤقت)
const CLOUD_PROVIDER_URL = "https://api.restful-api.dev/objects";

export const pushToCloud = async (syncId: string) => {
  const data = {
    products: getStoredProducts(),
    orders: getStoredOrders(),
    settings: getStoredSettings(),
    deletedOrders: getStoredDeletedOrders()
  };

  try {
    const response = await fetch(CLOUD_PROVIDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `brima_sync_${syncId}`,
        data: data
      })
    });
    return response.ok;
  } catch (e) {
    console.error("Cloud Sync Error:", e);
    return false;
  }
};

export const fetchFromCloud = async (syncId: string) => {
  try {
    const response = await fetch(CLOUD_PROVIDER_URL);
    const allObjects = await response.json();
    const myData = allObjects.find((obj: any) => obj.name === `brima_sync_${syncId}`);
    
    if (myData && myData.data) {
      const payload = myData.data;
      saveProducts(payload.products);
      saveOrders(payload.orders);
      saveSettings(payload.settings);
      saveDeletedOrders(payload.deletedOrders || []);
      return true;
    }
    return false;
  } catch (e) {
    console.error("Cloud Fetch Error:", e);
    return false;
  }
};

export const factoryReset = () => {
  if (confirm('هل أنت متأكد؟ سيتم حذف كل شيء نهائياً.')) {
    localStorage.clear();
    window.location.reload();
  }
};
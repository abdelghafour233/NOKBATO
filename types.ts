
export type Category = 'electronics' | 'home' | 'cars' | 'watches' | 'glasses';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string; // الصورة الرئيسية (Thumbnail)
  images?: string[]; // معرض الصور الإضافية
  description: string;
}

export interface Order {
  id: string;
  fullName: string;
  city: string;
  phone: string;
  items: { productId: string; quantity: number }[];
  totalPrice: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface AppSettings {
  fbPixelId: string;
  googleAnalyticsId: string;
  tiktokPixelId: string;
  googleSheetsUrl: string;
  domainName: string;
  nameServers: string;
  adminPasswordHash: string;
  customScript: string; // الحقل الجديد لأكواد JS
}

export interface CartItem extends Product {
  quantity: number;
}

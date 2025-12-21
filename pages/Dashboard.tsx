
import React, { useState } from 'react';
import { Product, Order, AppSettings, Category } from '../types';
import { saveProducts, saveOrders, saveSettings } from '../store';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Lock
} from 'lucide-react';

interface DashboardPageProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

// Sub-component to manage orders
const OrdersManager: React.FC<{ orders: Order[], setOrders: (orders: Order[]) => void }> = ({ orders, setOrders }) => {
  const updateStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      saveOrders(updated);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">إدارة الطلبات ({orders.length})</h2>
      <div className="grid gap-6">
        {orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
          <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">#{order.id}</span>
                <span className="text-gray-400 text-xs font-bold">{new Date(order.date).toLocaleString('ar-MA')}</span>
              </div>
              <h3 className="text-xl font-black">{order.fullName}</h3>
              <p className="text-emerald-600 font-bold">{order.phone} | {order.city}</p>
              <div className="text-sm text-gray-500 font-medium">
                {order.items.length} منتجات | الإجمالي: <span className="font-black text-gray-900">{order.totalPrice.toLocaleString()} د.م.</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                className={`p-3 rounded-xl font-bold border-2 outline-none transition-all ${
                  order.status === 'delivered' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                  order.status === 'shipped' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                  'border-orange-500 bg-orange-50 text-orange-700'
                }`}
              >
                <option value="pending">قيد الانتظار</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
              </select>
              <button 
                onClick={() => deleteOrder(order.id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xl">
            لا توجد طلبات حالياً
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component to manage products
const ProductsManager: React.FC<{ products: Product[], setProducts: (products: Product[]) => void }> = ({ products, setProducts }) => {
  // Fixing "Cannot find name 'newProduct'" and "setNewProduct" errors by defining the state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'electronics',
    image: '',
    description: ''
  });

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('يرجى ملء الحقول الأساسية');
      return;
    }

    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category as Category,
      image: newProduct.image,
      description: newProduct.description || ''
    };

    const updated = [product, ...products];
    setProducts(updated);
    saveProducts(updated);
    setNewProduct({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-gray-900">إدارة المنتجات</h2>
      
      {/* Add Product Form */}
      <form onSubmit={addProduct} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <h3 className="col-span-full text-xl font-black mb-2 text-emerald-600">إضافة منتج جديد</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 mr-2">اسم المنتج</label>
          <input 
            required
            className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
            placeholder="اسم المنتج..."
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 mr-2">السعر (د.م.)</label>
          <input 
            required
            type="number"
            className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
            placeholder="السعر..."
            value={newProduct.price || ''}
            onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 mr-2">الفئة</label>
          <select className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
            value={newProduct.category}
            onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
            <option value="electronics">إلكترونيات</option>
            <option value="watches">ساعات</option>
            <option value="glasses">نظارات</option>
            <option value="home">منزل</option>
            <option value="cars">سيارات</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 mr-2">رابط الصورة</label>
          <input 
            required
            className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
            placeholder="رابط الصورة من Unsplash..."
            value={newProduct.image || ''}
            onChange={e => setNewProduct({...newProduct, image: e.target.value})}
          />
        </div>
        <div className="col-span-full space-y-2">
          <label className="text-sm font-bold text-gray-500 mr-2">وصف المنتج</label>
          <textarea 
            className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold h-32"
            placeholder="اكتب وصفاً جذاباً للمنتج..."
            value={newProduct.description || ''}
            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
          />
        </div>
        <button className="col-span-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100">
          <Plus size={24} /> إضافة المنتج للمخزن
        </button>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
            <img src={product.image} alt={product.name} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-black text-sm line-clamp-1">{product.name}</h4>
                <div className="text-emerald-600 font-bold text-xs">{product.price.toLocaleString()} د.م.</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">{product.category}</div>
              </div>
              <button 
                onClick={() => deleteProduct(product.id)}
                className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold mt-2 transition-colors"
              >
                <Trash2 size={14} /> حذف المنتج
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component to manage settings
const SettingsManager: React.FC<{ settings: AppSettings, setSettings: (settings: AppSettings) => void }> = ({ settings, setSettings }) => {
  const [form, setForm] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(form);
    saveSettings(form);
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-gray-900">إعدادات المتجر</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">Facebook Pixel ID</label>
            <input 
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={form.fbPixelId}
              onChange={e => setForm({...form, fbPixelId: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">TikTok Pixel ID</label>
            <input 
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={form.tiktokPixelId}
              onChange={e => setForm({...form, tiktokPixelId: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">Google Analytics ID</label>
            <input 
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={form.googleAnalyticsId}
              onChange={e => setForm({...form, googleAnalyticsId: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">رابط Google Sheets</label>
            <input 
              className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={form.googleSheetsUrl}
              onChange={e => setForm({...form, googleSheetsUrl: e.target.value})}
            />
          </div>
        </div>
        
        <div className="pt-6 border-t space-y-6">
          <h3 className="text-xl font-black">إعدادات النطاق (Domain)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 mr-2">اسم النطاق</label>
              <input 
                placeholder="example.com"
                className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                value={form.domainName}
                onChange={e => setForm({...form, domainName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 mr-2">خوادم الأسماء (Name Servers)</label>
              <input 
                placeholder="ns1.hover.com, ns2.hover.com"
                className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                value={form.nameServers}
                onChange={e => setForm({...form, nameServers: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl">
          <Save size={24} /> حفظ جميع الإعدادات
        </button>
      </form>
    </div>
  );
};

// Main DashboardPage component with authentication
const DashboardPage: React.FC<DashboardPageProps> = ({ 
  products, orders, settings, setProducts, setOrders, setSettings 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the stored hash from settings
    if (btoa(password) === settings.adminPasswordHash) {
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-black mb-2 text-gray-900">إدارة متجر بريمة</h2>
          <p className="text-gray-400 font-bold text-sm">يرجى إدخال كلمة المرور للمتابعة</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="كلمة المرور"
               className="w-full p-5 rounded-2xl border-2 border-gray-100 outline-none focus:border-emerald-500 font-bold bg-gray-50 focus:bg-white transition-all text-center text-2xl tracking-widest"
             />
          </div>
          <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl">
            تسجيل الدخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-80 bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 space-y-3 sticky top-24">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-5 rounded-3xl font-black transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-4">
              <ShoppingBag size={24} /> الطلبات
            </div>
            {orders.filter(o => o.status === 'pending').length > 0 && activeTab !== 'orders' && (
               <span className="bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full animate-pulse">
                 {orders.filter(o => o.status === 'pending').length}
               </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${activeTab === 'products' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Package size={24} /> المنتجات
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Settings size={24} /> الإعدادات
          </button>

          <div className="pt-6 mt-6 border-t">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-4 p-5 rounded-3xl font-black text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={24} /> خروج آمن
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          <div className="bg-gray-50/50 p-4 md:p-8 rounded-[50px] min-h-[600px]">
            {activeTab === 'orders' && <OrdersManager orders={orders} setOrders={setOrders} />}
            {activeTab === 'products' && <ProductsManager products={products} setProducts={setProducts} />}
            {activeTab === 'settings' && <SettingsManager settings={settings} setSettings={setSettings} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fixing "Module ... has no default export" error in App.tsx
export default DashboardPage;


import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Product, Order, AppSettings } from '../types';
import { saveProducts, saveOrders, saveSettings } from '../store';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings as SettingsIcon, 
  ExternalLink, 
  Plus, 
  Search, 
  Globe, 
  Database, 
  BarChart as Analytics,
  ArrowRightLeft,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  setProducts: (p: Product[]) => void;
  setOrders: (o: Order[]) => void;
  setSettings: (s: AppSettings) => void;
}

const DashboardPage: React.FC<DashboardProps> = ({ products, orders, settings, setProducts, setOrders, setSettings }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Side Nav */}
      <aside className="w-full md:w-64 bg-white border-l shadow-sm p-6 space-y-2">
        <h2 className="text-xl font-black text-gray-400 mb-8 px-4">لوحة التحكم</h2>
        <Link to="/dashboard" className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
          <BarChart3 size={20} /> نظرة عامة
        </Link>
        <Link to="/dashboard/orders" className="flex items-center gap-3 p-4 rounded-2xl text-gray-500 hover:bg-gray-50 font-bold transition-colors">
          <ShoppingCart size={20} /> الطلبات
        </Link>
        <Link to="/dashboard/products" className="flex items-center gap-3 p-4 rounded-2xl text-gray-500 hover:bg-gray-50 font-bold transition-colors">
          <Package size={20} /> المنتجات
        </Link>
        <Link to="/dashboard/settings" className="flex items-center gap-3 p-4 rounded-2xl text-gray-500 hover:bg-gray-50 font-bold transition-colors">
          <SettingsIcon size={20} /> الإعدادات
        </Link>
        <div className="pt-8 mt-8 border-t">
          <Link to="/" className="flex items-center gap-3 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 font-bold transition-colors">
            <ExternalLink size={20} /> معاينة المتجر
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-4 md:p-12">
        <Routes>
          <Route path="/" element={<StatsOverview orders={orders} products={products} />} />
          <Route path="/orders" element={<OrdersList orders={orders} setOrders={setOrders} />} />
          <Route path="/products" element={<ProductsManager products={products} setProducts={setProducts} />} />
          <Route path="/settings" element={<SettingsManager settings={settings} setSettings={setSettings} />} />
        </Routes>
      </main>
    </div>
  );
};

// Sub-components for Dashboard
const StatsOverview = ({ orders, products }: { orders: Order[], products: Product[] }) => {
  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">نظرة عامة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-gray-400 font-bold mb-2">إجمالي المبيعات</div>
          <div className="text-4xl font-black text-emerald-600">{revenue.toLocaleString()} د.م.</div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-gray-400 font-bold mb-2">عدد الطلبات</div>
          <div className="text-4xl font-black text-blue-600">{orders.length}</div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-gray-400 font-bold mb-2">إجمالي المنتجات</div>
          <div className="text-4xl font-black text-orange-600">{products.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-black mb-6">أحدث الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b text-gray-400 font-bold">
                <th className="pb-4">العميل</th>
                <th className="pb-4">المدينة</th>
                <th className="pb-4">التاريخ</th>
                <th className="pb-4">المبلغ</th>
                <th className="pb-4">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(-5).reverse().map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold">{order.fullName}</td>
                  <td className="py-4 text-gray-500">{order.city}</td>
                  <td className="py-4 text-gray-400">{new Date(order.date).toLocaleDateString('ar-MA')}</td>
                  <td className="py-4 font-black text-emerald-600">{order.totalPrice.toLocaleString()} د.م.</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">قيد الانتظار</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrdersList = ({ orders, setOrders }: { orders: Order[], setOrders: (o: Order[]) => void }) => {
  const handleDelete = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    saveOrders(updated);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">إدارة الطلبات</h1>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b text-gray-400 font-bold">
                <th className="pb-4">المعرف</th>
                <th className="pb-4">العميل</th>
                <th className="pb-4">الهاتف</th>
                <th className="pb-4">المدينة</th>
                <th className="pb-4">المبلغ</th>
                <th className="pb-4">الحالة</th>
                <th className="pb-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-4 font-mono text-xs">{order.id}</td>
                  <td className="py-4 font-bold">{order.fullName}</td>
                  <td className="py-4 font-mono">{order.phone}</td>
                  <td className="py-4">{order.city}</td>
                  <td className="py-4 font-black">{order.totalPrice.toLocaleString()} د.م.</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">معلق</span>
                  </td>
                  <td className="py-4">
                    <button onClick={() => handleDelete(order.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductsManager = ({ products, setProducts }: { products: Product[], setProducts: (p: Product[]) => void }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'electronics' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name || 'منتج جديد',
      price: Number(newProduct.price) || 0,
      category: (newProduct.category as any) || 'electronics',
      image: newProduct.image || 'https://picsum.photos/400/400',
      description: newProduct.description || ''
    };
    const updated = [...products, productToAdd];
    setProducts(updated);
    saveProducts(updated);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">إدارة المنتجات</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700"
        >
          <Plus size={20} /> إضافة منتج
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-emerald-100">
           <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                required
                placeholder="اسم المنتج" 
                className="p-4 rounded-xl border font-bold"
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
              <input 
                required
                type="number"
                placeholder="السعر (د.م.)" 
                className="p-4 rounded-xl border font-bold"
                onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
              />
              <select 
                className="p-4 rounded-xl border font-bold"
                onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
              >
                <option value="electronics">إلكترونيات</option>
                <option value="home">منزل</option>
                <option value="cars">سيارات</option>
              </select>
              <input 
                placeholder="رابط الصورة" 
                className="p-4 rounded-xl border font-bold"
                onChange={e => setNewProduct({...newProduct, image: e.target.value})}
              />
              <textarea 
                placeholder="وصف المنتج" 
                className="p-4 rounded-xl border font-bold md:col-span-2"
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
              <div className="flex gap-4">
                <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">حفظ</button>
                <button type="button" onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-500 px-8 py-3 rounded-xl font-bold">إلغاء</button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-3xl border flex items-center gap-4 relative group">
            <img src={p.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
            <div className="flex-grow overflow-hidden">
              <h4 className="font-bold truncate">{p.name}</h4>
              <p className="text-emerald-600 font-black">{p.price.toLocaleString()} د.م.</p>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">{p.category}</span>
            </div>
            <button 
              onClick={() => handleDelete(p.id)}
              className="p-2 text-red-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsManager = ({ settings, setSettings }: { settings: AppSettings, setSettings: (s: AppSettings) => void }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    saveSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">الإعدادات الفنية</h1>

      {/* Analytics & Pixels */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-8">
        <div className="flex items-center gap-4 text-emerald-600">
           <Analytics size={32} />
           <h2 className="text-2xl font-black">أكواد التتبع والبيكسل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Facebook Pixel ID</label>
            <input 
              className="w-full p-4 rounded-2xl border font-mono text-sm"
              value={localSettings.fbPixelId}
              onChange={e => setLocalSettings({...localSettings, fbPixelId: e.target.value})}
              placeholder="مثال: 123456789"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Google Analytics ID</label>
            <input 
              className="w-full p-4 rounded-2xl border font-mono text-sm"
              value={localSettings.googleAnalyticsId}
              onChange={e => setLocalSettings({...localSettings, googleAnalyticsId: e.target.value})}
              placeholder="مثال: G-XXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">TikTok Pixel ID</label>
            <input 
              className="w-full p-4 rounded-2xl border font-mono text-sm"
              value={localSettings.tiktokPixelId}
              onChange={e => setLocalSettings({...localSettings, tiktokPixelId: e.target.value})}
              placeholder="مثال: C-XXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Integrations & Domain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-6">
          <div className="flex items-center gap-4 text-blue-600">
             <Database size={28} />
             <h2 className="text-xl font-black">الربط مع Google Sheets</h2>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">رابط الـ Webhook الخاص بـ Sheets</label>
            <input 
              className="w-full p-4 rounded-2xl border font-mono text-sm"
              value={localSettings.googleSheetsUrl}
              onChange={e => setLocalSettings({...localSettings, googleSheetsUrl: e.target.value})}
              placeholder="https://script.google.com/macros/s/..."
            />
            <p className="text-xs text-gray-400">سيتم إرسال الطلبات تلقائياً لهذا الرابط عند كل عملية شراء.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-6">
          <div className="flex items-center gap-4 text-orange-600">
             <Globe size={28} />
             <h2 className="text-xl font-black">إعدادات الدومين والـ NS</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">اسم النطاق (Domain)</label>
              <input 
                className="w-full p-4 rounded-2xl border font-mono text-sm"
                value={localSettings.domainName}
                onChange={e => setLocalSettings({...localSettings, domainName: e.target.value})}
                placeholder="www.yourstore.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Name Servers</label>
              <textarea 
                className="w-full p-4 rounded-2xl border font-mono text-sm h-24"
                value={localSettings.nameServers}
                onChange={e => setLocalSettings({...localSettings, nameServers: e.target.value})}
                placeholder="ns1.provider.com&#10;ns2.provider.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={handleSave}
          className={`px-12 py-5 rounded-3xl font-black text-xl shadow-xl transition-all ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'}`}
        >
          {saved ? <span className="flex items-center gap-2"><CheckCircle /> تم الحفظ</span> : 'حفظ جميع الإعدادات'}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

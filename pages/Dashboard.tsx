import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings } from '../types';
import { 
  saveProducts, 
  saveOrders, 
  saveSettings, 
  getStoredOrders, 
  getStoredDeletedOrders,
  factoryReset 
} from '../store';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  Trash2, 
  Save, 
  Lock,
  Edit2,
  Phone, 
  MapPin, 
  BarChart,
  Radio,
  X,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Eye,
  EyeOff,
  ChevronLeft
} from 'lucide-react';

const compressImage = (base64Str: string, maxWidth = 600, maxHeight = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
      } else {
        if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } else resolve(base64Str);
    };
    img.onerror = () => resolve(base64Str);
  });
};

interface DashboardPageProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ products, orders, settings, setProducts, setOrders, setSettings }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (btoa(password) === settings.adminPasswordHash) setIsAuthenticated(true);
    else alert('كلمة المرور خاطئة');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-black dark:text-white">دخول الإدارة</h1>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none text-center font-bold"
              placeholder="كلمة المرور"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">دخول</button>
        </form>
      </div>
    );
  }

  const navLinks = [
    { to: "/dashboard", icon: <BarChart size={18}/>, label: "الإحصائيات" },
    { to: "/dashboard/orders", icon: <ShoppingBag size={18}/>, label: "الطلبات" },
    { to: "/dashboard/products", icon: <Package size={18}/>, label: "المنتجات" },
    { to: "/dashboard/settings", icon: <Settings size={18}/>, label: "الإعدادات" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right font-cairo">
      {/* Header Section - Same on all devices */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black dark:text-white mb-2">لوحة التحكم</h1>
        <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-black">
          <Radio size={14} className="animate-pulse" /> النظام يعمل بكفاءة
        </div>
      </div>

      {/* Unified Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-900 p-2 rounded-[25px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between mb-8 sticky top-20 z-40 overflow-x-auto no-scrollbar">
        {navLinks.map(link => (
          <Link 
            key={link.to}
            to={link.to} 
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all shrink-0 ${location.pathname === link.to ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-none' : 'text-gray-400 hover:text-emerald-600'}`}
          >
            {link.icon} <span className="text-xs md:text-sm">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in duration-500">
        <Routes>
          <Route path="/" element={<StatsOverview orders={orders} products={products} />} />
          <Route path="/orders" element={<OrdersList orders={orders} setOrders={setOrders} />} />
          <Route path="/products" element={<ProductsManager products={products} setProducts={setProducts} />} />
          <Route path="/settings" element={<SettingsManager settings={settings} setSettings={setSettings} />} />
        </Routes>
      </div>
    </div>
  );
};

const StatsOverview: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      { label: "المبيعات الإجمالية", value: `${orders.reduce((s,o)=>s+o.totalPrice,0).toLocaleString()} د.م.`, color: "text-emerald-600" },
      { label: "إجمالي الطلبات", value: orders.length, color: "text-gray-900 dark:text-white" },
      { label: "المنتجات المعروضة", value: products.length, color: "text-gray-900 dark:text-white" }
    ].map((stat, i) => (
      <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[35px] border border-gray-100 dark:border-gray-800 shadow-sm text-center">
        <div className="text-gray-400 text-[10px] font-black uppercase mb-2 tracking-widest">{stat.label}</div>
        <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
      </div>
    ))}
  </div>
);

const OrdersList: React.FC<{ orders: Order[], setOrders: any }> = ({ orders, setOrders }) => {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [deletedOrders, setDeletedOrders] = useState<Order[]>(getStoredDeletedOrders());

  const moveToTrash = (id: string) => {
    const orderToTrash = orders.find(o => o.id === id);
    if (orderToTrash && confirm('حذف الطلب؟')) {
      const newOrders = orders.filter(o => o.id !== id);
      const newTrash = [...deletedOrders, orderToTrash];
      setOrders(newOrders); saveOrders(newOrders);
      setDeletedOrders(newTrash); localStorage.setItem('deleted_orders', JSON.stringify(newTrash));
    }
  };

  const data = view === 'active' ? [...orders].reverse() : [...deletedOrders].reverse();

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl max-w-sm mx-auto">
        <button onClick={() => setView('active')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${view === 'active' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>النشطة</button>
        <button onClick={() => setView('trash')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${view === 'trash' ? 'bg-white dark:bg-gray-700 text-red-500 shadow-sm' : 'text-gray-400'}`}>المحذوفات</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-[35px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black dark:text-white text-lg">{order.fullName}</h4>
                <div className="text-xs font-bold text-emerald-600 mt-1">{order.city}</div>
              </div>
              <div className="text-emerald-600 font-black">{order.totalPrice} د.م.</div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${order.phone}`} className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-xl font-black text-xs flex items-center justify-center gap-2"><Phone size={14}/> اتصال</a>
              <button onClick={() => moveToTrash(order.id)} className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && <p className="text-center py-20 text-gray-400 font-black">لا توجد سجلات</p>}
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', price: 0, category: 'electronics', image: '', description: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Product;
    const updated = [...products, newProduct];
    setProducts(updated); saveProducts(updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowModal(true)} className="w-full bg-emerald-600 text-white p-6 rounded-[25px] font-black flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-700 transition-all">
        <PlusCircle size={22} /> إضافة منتج جديد
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-4 rounded-[30px] border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <img src={p.image} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            <div className="flex-grow">
              <h4 className="font-black text-xs dark:text-white line-clamp-1">{p.name}</h4>
              <div className="text-emerald-600 font-black text-sm">{p.price} د.م.</div>
            </div>
            <button onClick={() => { if(confirm('حذف؟')) { const u = products.filter(x=>x.id!==p.id); setProducts(u); saveProducts(u); } }} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[40px] p-8 shadow-2xl relative">
            <h3 className="text-xl font-black mb-6 dark:text-white">منتج جديد</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input required type="text" placeholder="اسم المنتج" className="w-full p-4 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black" onChange={e=>setFormData({...formData, name:e.target.value})} />
              <input required type="number" placeholder="السعر" className="w-full p-4 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black" onChange={e=>setFormData({...formData, price:Number(e.target.value)})} />
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg">حفظ المنتج</button>
              <button type="button" onClick={()=>setShowModal(false)} className="w-full text-gray-400 font-bold py-2">إلغاء</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManager: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  const [local, setLocal] = useState(settings);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border dark:border-gray-800 shadow-sm space-y-6">
        <h3 className="text-xl font-black dark:text-white">الإعدادات الفنية</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 mr-2 uppercase tracking-widest">Facebook Pixel ID</label>
            <input type="text" value={local.fbPixelId} onChange={e=>setLocal({...local, fbPixelId:e.target.value})} className="w-full p-4 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 mr-2 uppercase tracking-widest">Google AdSense ID</label>
            <input type="text" value={local.googleAdSenseId} onChange={e=>setLocal({...local, googleAdSenseId:e.target.value})} className="w-full p-4 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold" />
          </div>
        </div>
        <button onClick={() => { setSettings(local); saveSettings(local); alert('تم الحفظ'); }} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black shadow-lg">حفظ كافة الإعدادات</button>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[40px] border border-red-100 dark:border-red-900/20 text-center">
        <h3 className="text-lg font-black text-red-600 mb-4 flex items-center justify-center gap-2"><AlertTriangle size={20} /> منطقة الخطر</h3>
        <button onClick={factoryReset} className="w-full max-w-xs mx-auto bg-white dark:bg-gray-950 text-red-600 border-2 border-red-200 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all">إعادة ضبط المصنع</button>
      </div>
    </div>
  );
};

export default DashboardPage;
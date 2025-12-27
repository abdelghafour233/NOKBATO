
import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings, Category } from '../types';
import { saveProducts, saveOrders, saveSettings, getStoredOrders, getStoredProducts, factoryReset } from '../store';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Save, 
  Lock,
  Edit2,
  CheckCircle,
  User, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  Table,
  Globe,
  BarChart,
  ShieldAlert,
  Code,
  Bell,
  BellOff,
  Radio,
  ExternalLink,
  Smartphone,
  LayoutDashboard,
  LogOut,
  Facebook,
  FlaskConical,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  X,
  RefreshCw,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface DashboardPageProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أغادير", "مكناس", 
  "وجدة", "القنيطرة", "تطوان", "تمارة", "سلا", "آسفي", "العيون", 
  "المحمدية", "بني ملال", "الجديدة", "تازة", "الناظور", "سطات", 
  "خريبكة", "القصر الكبير", "العرائش", "الخميسات", "تارودانت"
];

const DashboardPage: React.FC<DashboardPageProps> = ({ products, orders, settings, setProducts, setOrders, setSettings }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRadarActive, setIsRadarActive] = useState(true);
  const location = useLocation();
  const lastOrderCount = useRef(orders.length);

  useEffect(() => {
    if (isRadarActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isRadarActive]);

  useEffect(() => {
    if (!isRadarActive) return;

    const checkForNewOrders = () => {
      const currentOrders = getStoredOrders();
      if (currentOrders.length > lastOrderCount.current) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
        
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

        if (Notification.permission === 'granted') {
          new Notification('💰 طلب جديد!', {
            body: `الزبون: ${currentOrders[currentOrders.length-1].fullName}`,
            icon: 'https://cdn-icons-png.flaticon.com/512/1162/1162499.png'
          });
        }

        setOrders(currentOrders);
        lastOrderCount.current = currentOrders.length;
      }
    };

    const interval = setInterval(checkForNewOrders, 5000);
    return () => clearInterval(interval);
  }, [isRadarActive, setOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (btoa(password) === settings.adminPasswordHash) {
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور خاطئة');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
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
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 lg:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black dark:text-white">لوحة التحكم</h1>
          <p className="text-gray-400 font-bold text-sm">إدارة المتجر والطلبات</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black bg-emerald-600 text-white shadow-lg radar-pulse`}>
          <Radio size={18} className="animate-pulse" /> التنبيهات نشطة
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 hidden lg:block space-y-2">
          <Link to="/dashboard" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <BarChart size={20} /> الإحصائيات
          </Link>
          <Link to="/dashboard/orders" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard/orders' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <ShoppingBag size={20} /> الطلبات
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard/products' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <Package size={20} /> المنتجات
          </Link>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard/settings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <Settings size={20} /> الإعدادات
          </Link>
        </aside>

        <main className="lg:col-span-9">
          <Routes>
            <Route path="/" element={<StatsOverview orders={orders} products={products} />} />
            <Route path="/orders" element={<OrdersList orders={orders} setOrders={setOrders} />} />
            <Route path="/products" element={<ProductsManager products={products} setProducts={setProducts} />} />
            <Route path="/settings" element={<SettingsManager settings={settings} setSettings={setSettings} />} />
          </Routes>
        </main>
      </div>

      <nav className="admin-footer-nav lg:hidden">
        <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}><BarChart size={24} /></Link>
        <Link to="/dashboard/orders" className={`relative ${location.pathname === '/dashboard/orders' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <ShoppingBag size={24} />
          {orders.filter(o => o.status === 'pending').length > 0 && <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></span>}
        </Link>
        <Link to="/dashboard/products" className={`${location.pathname === '/dashboard/products' ? 'text-emerald-600' : 'text-gray-400'}`}><Package size={24} /></Link>
        <Link to="/dashboard/settings" className={`${location.pathname === '/dashboard/settings' ? 'text-emerald-600' : 'text-gray-400'}`}><Settings size={24} /></Link>
      </nav>
    </div>
  );
};

const StatsOverview: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[30px] border border-gray-100 dark:border-gray-800">
      <div className="text-gray-400 text-xs font-bold mb-1">المبيعات الإجمالية</div>
      <div className="text-2xl font-black dark:text-white">{orders.reduce((s,o)=>s+o.totalPrice,0).toLocaleString()} د.م.</div>
    </div>
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[30px] border border-gray-100 dark:border-gray-800">
      <div className="text-gray-400 text-xs font-bold mb-1">الطلبات</div>
      <div className="text-2xl font-black dark:text-white">{orders.length}</div>
    </div>
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[30px] border border-gray-100 dark:border-gray-800">
      <div className="text-gray-400 text-xs font-bold mb-1">المنتجات</div>
      <div className="text-2xl font-black dark:text-white">{products.length}</div>
    </div>
  </div>
);

const OrdersList: React.FC<{ orders: Order[], setOrders: any }> = ({ orders, setOrders }) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const updateStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (id: string) => {
    if (confirm('حذف هذا الطلب؟')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      saveOrders(updated);
    }
  };

  const saveEditedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const updated = orders.map(o => o.id === editingOrder.id ? editingOrder : o);
    setOrders(updated);
    saveOrders(updated);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-4">
      {[...orders].reverse().map(order => (
        <div key={order.id} className={`bg-white dark:bg-gray-900 p-5 rounded-[30px] border-r-4 shadow-sm ${order.status === 'pending' ? 'border-orange-500' : 'border-emerald-500'}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-black dark:text-white">{order.fullName}</h3>
              <div className="flex gap-4 text-xs font-bold text-gray-400">
                <span className="flex items-center gap-1"><Phone size={12}/> {order.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {order.city}</span>
              </div>
              <div className="text-emerald-600 font-black">{order.totalPrice.toLocaleString()} د.م.</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setEditingOrder(order)} className="p-2 bg-gray-50 dark:bg-gray-800 text-emerald-600 rounded-lg"><Edit2 size={16}/></button>
              <button onClick={() => deleteOrder(order.id)} className="p-2 bg-gray-50 dark:bg-gray-800 text-red-500 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
          <div className="mt-4">
            <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as any)} className="w-full p-2 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white text-xs font-bold border-none">
              <option value="pending">قيد الانتظار</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التوصيل</option>
            </select>
          </div>
        </div>
      ))}

      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[40px] shadow-2xl p-6 md:p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black dark:text-white">تعديل الطلب</h3>
              <button onClick={() => setEditingOrder(null)}><X size={24}/></button>
            </div>
            <form onSubmit={saveEditedOrder} className="space-y-4 text-right">
              <input type="text" value={editingOrder.fullName} onChange={e=>setEditingOrder({...editingOrder, fullName:e.target.value})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold" placeholder="الاسم" />
              <input type="tel" value={editingOrder.phone} onChange={e=>setEditingOrder({...editingOrder, phone:e.target.value})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold text-right" placeholder="الهاتف" />
              <select value={editingOrder.city} onChange={e=>setEditingOrder({...editingOrder, city:e.target.value})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold">
                {MOROCCAN_CITIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" value={editingOrder.totalPrice} onChange={e=>setEditingOrder({...editingOrder, totalPrice:Number(e.target.value)})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold" placeholder="المبلغ" />
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">حفظ التغييرات</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  const fileInput = useRef<HTMLInputElement>(null);

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('أضف صورة');
    const newProduct = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Product;
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    setShowModal(false);
    setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowModal(true)} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2">
        <Plus size={20} /> إضافة منتج
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-4 rounded-3xl border dark:border-gray-800 flex gap-4 items-center">
            <img src={p.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
            <div className="flex-grow text-right">
              <h4 className="font-black text-sm dark:text-white">{p.name}</h4>
              <p className="text-emerald-600 font-black text-xs">{p.price.toLocaleString()} د.م.</p>
            </div>
            <button onClick={() => { setProducts(products.filter(pr=>pr.id!==p.id)); saveProducts(products.filter(pr=>pr.id!==p.id)); }} className="p-2 text-red-500"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[40px] shadow-2xl p-6 md:p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black dark:text-white">إضافة منتج</h3>
              <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={saveProduct} className="space-y-4 text-right">
              <div onClick={() => fileInput.current?.click()} className="border-2 border-dashed p-8 rounded-2xl text-center cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                {formData.image ? <img src={formData.image} className="w-20 h-20 mx-auto rounded-xl object-cover" /> : <Upload className="mx-auto text-gray-400" />}
                <p className="text-xs font-bold text-gray-400 mt-2">انقر لتحميل الصورة</p>
                <input type="file" ref={fileInput} onChange={handleUpload} className="hidden" accept="image/*" />
              </div>
              <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold" placeholder="اسم المنتج" />
              <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold" placeholder="السعر" />
              <textarea required rows={3} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-bold" placeholder="الوصف"></textarea>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">حفظ المنتج</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManager: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  const [local, setLocal] = useState(settings);

  const handleReset = () => {
    if (confirm('⚠️ تنبيه هام: سيتم مسح كافة البيانات (منتجات، طلبات، إعدادات) وإرجاع المتجر لحالته الأصلية. هل أنت متأكد؟')) {
      factoryReset();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-[35px] border dark:border-gray-800 space-y-6 text-right">
        <h3 className="text-xl font-black dark:text-white flex items-center justify-end gap-2">
           إعدادات التتبع <Facebook size={20} className="text-blue-600" />
        </h3>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border dark:border-gray-800 space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-end gap-1">
                رقم بيكسيل فيسبوك (Pixel ID) <ShieldAlert size={14} />
              </label>
              <input 
                type="text" 
                placeholder="1234567890"
                value={local.fbPixelId} 
                onChange={e=>setLocal({...local, fbPixelId:e.target.value})} 
                className="w-full p-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:border-emerald-500 outline-none font-bold" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-end gap-1">
                كود اختبار الأحداث (Test Event Code) <Zap size={14} fill="currentColor" />
              </label>
              <input 
                type="text" 
                placeholder="TEST12345"
                value={local.fbTestEventCode} 
                onChange={e=>setLocal({...local, fbTestEventCode:e.target.value})} 
                className="w-full p-3 rounded-xl border-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-gray-900 dark:text-white focus:border-emerald-500 outline-none font-bold" 
              />
              <p className="text-[10px] text-gray-400 mt-1 font-bold">يستخدم للتأكد من وصول البيانات لفيسبوك في وضع الاختبار</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">أكواد مخصصة (Custom Script Header)</label>
            <textarea 
              rows={4} 
              placeholder="<!-- ضع أكواد التتبع المخصصة هنا -->"
              value={local.customScript} 
              onChange={e=>setLocal({...local, customScript:e.target.value})} 
              className="w-full p-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white font-mono text-xs outline-none focus:border-emerald-500"
            ></textarea>
          </div>
        </div>
        <button onClick={() => { setSettings(local); saveSettings(local); alert('تم الحفظ بنجاح'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
          <Save size={20} /> حفظ الإعدادات
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[35px] border border-red-100 dark:border-red-900/30 space-y-4 text-right">
        <div className="flex items-center justify-end gap-2 text-red-600">
           <h3 className="text-lg font-black">إدارة البيانات (منطقة الخطر)</h3>
           <AlertTriangle size={20} />
        </div>
        <p className="text-red-500 text-xs font-bold">إذا كانت التغييرات لا تظهر أو تريد مسح "الأرشفة القديمة" تماماً، استخدم الزر أدناه:</p>
        <button 
          onClick={handleReset}
          className="w-full bg-white dark:bg-gray-900 text-red-600 border-2 border-red-200 dark:border-red-900/50 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> إعادة ضبط المصنع ومسح التخزين المؤقت
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

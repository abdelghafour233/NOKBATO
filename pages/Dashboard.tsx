
import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings, Category } from '../types';
import { saveProducts, saveOrders, saveSettings, getStoredOrders, getStoredProducts } from '../store';
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
  X
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
  const [isRadarActive, setIsRadarActive] = useState(false);
  const location = useLocation();
  const lastOrderCount = useRef(orders.length);

  useEffect(() => {
    if (!isRadarActive) return;

    const checkForNewOrders = () => {
      const currentOrders = getStoredOrders();
      if (currentOrders.length > lastOrderCount.current) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => console.log('Audio blocked by browser'));
        
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }

        if (Notification.permission === 'granted') {
          new Notification('طلب جديد! 💰', {
            body: `لديك طلب جديد من ${currentOrders[currentOrders.length-1].fullName}`,
            icon: 'https://cdn-icons-png.flaticon.com/512/1162/1162499.png'
          });
        }

        setOrders(currentOrders);
        lastOrderCount.current = currentOrders.length;
      }
    };

    window.addEventListener('storage', checkForNewOrders);
    const interval = setInterval(checkForNewOrders, 5000);

    return () => {
      window.removeEventListener('storage', checkForNewOrders);
      clearInterval(interval);
    };
  }, [isRadarActive, setOrders]);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setIsRadarActive(true);
        }
      });
    } else {
      setIsRadarActive(true);
    }
  };

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
        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock size={40} />
            </div>
            <h1 className="text-3xl font-black dark:text-white">دخول الإدارة</h1>
            <p className="text-gray-400 font-bold">يرجى إدخال كلمة المرور للمتابعة</p>
          </div>
          
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none text-center text-2xl tracking-widest transition-all pr-14 pl-14"
              placeholder="••••••••"
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-gray-700 ${showPassword ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors">
               <Lock size={20} />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 shadow-emerald-100 dark:shadow-none">
            تسجيل الدخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 lg:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black dark:text-white mb-2">لوحة التحكم</h1>
          <p className="text-gray-400 font-bold">مرحباً بك في مركز إدارة متجر بريمة</p>
        </div>
        
        <button 
          onClick={isRadarActive ? () => setIsRadarActive(false) : requestNotificationPermission}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all shadow-lg ${isRadarActive ? 'bg-emerald-600 text-white radar-pulse shadow-emerald-200' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}
        >
          {isRadarActive ? <Radio className="animate-pulse" size={20} /> : <BellOff size={20} />}
          {isRadarActive ? 'وضع الرادار نشط (تصلك تنبيهات)' : 'تفعيل تنبيهات الطلبات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 hidden lg:block space-y-2">
          <Link to="/dashboard" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <BarChart size={20} /> الإحصائيات
          </Link>
          <Link to="/dashboard/orders" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard/orders' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <ShoppingBag size={20} /> الطلبات
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="mr-auto bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-bounce">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard/products' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <Package size={20} /> المنتجات
          </Link>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${location.pathname === '/dashboard/settings' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <Settings size={20} /> الإعدادات
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 p-4 rounded-2xl font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-all mt-10">
            <LogOut size={20} /> خروج
          </button>
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
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <BarChart size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </Link>
        <Link to="/dashboard/orders" className={`flex flex-col items-center gap-1 relative ${location.pathname === '/dashboard/orders' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold">الطلبات</span>
          {orders.filter(o => o.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          )}
        </Link>
        <Link to="/dashboard/products" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard/products' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <Package size={24} />
          <span className="text-[10px] font-bold">المنتجات</span>
        </Link>
        <Link to="/dashboard/settings" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard/settings' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <Settings size={24} />
          <span className="text-[10px] font-bold">الإعدادات</span>
        </Link>
      </nav>
    </div>
  );
};

const StatsOverview: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
  const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[35px] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
          <CreditCard size={24} />
        </div>
        <div className="text-gray-400 font-bold text-sm mb-1">إجمالي المبيعات</div>
        <div className="text-3xl font-black dark:text-white">{totalSales.toLocaleString()} <span className="text-sm">د.م.</span></div>
      </div>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[35px] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingBag size={24} />
        </div>
        <div className="text-gray-400 font-bold text-sm mb-1">الطلبات المعلقة</div>
        <div className="text-3xl font-black dark:text-white">{pendingOrders} <span className="text-sm">طلب</span></div>
      </div>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[35px] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
          <Package size={24} />
        </div>
        <div className="text-gray-400 font-bold text-sm mb-1">إجمالي المنتجات</div>
        <div className="text-3xl font-black dark:text-white">{products.length} <span className="text-sm">منتج</span></div>
      </div>
    </div>
  );
};

const OrdersList: React.FC<{ orders: Order[], setOrders: any }> = ({ orders, setOrders }) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const updateStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      saveOrders(updated);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const updated = orders.map(o => o.id === editingOrder.id ? editingOrder : o);
    setOrders(updated);
    saveOrders(updated);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-800">
          <ShoppingBag size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-4" />
          <p className="text-gray-400 font-black">لا توجد طلبات حتى الآن</p>
        </div>
      ) : (
        [...orders].reverse().map(order => (
          <div key={order.id} className={`bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[35px] shadow-sm border-r-8 transition-all hover:scale-[1.01] ${order.status === 'pending' ? 'border-orange-500' : order.status === 'shipped' ? 'border-blue-500' : 'border-emerald-500'}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center dark:text-white">
                    <User size={20} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-xl dark:text-white">{order.fullName}</h3>
                      <button 
                        onClick={() => setEditingOrder(order)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                        title="تعديل بيانات الطلب"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                    <div className="text-gray-400 font-bold text-xs flex items-center gap-2">
                       <Calendar size={12} /> {new Date(order.date).toLocaleDateString('ar-MA')}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                    <Phone size={16} className="text-emerald-500" /> {order.phone}
                    <a href={`tel:${order.phone}`} className="mr-auto p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Phone size={14}/></a>
                    <a href={`https://wa.me/212${order.phone.replace(/^0/, '')}`} target="_blank" className="p-2 bg-green-100 text-green-600 rounded-lg"><Smartphone size={14}/></a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                    <MapPin size={16} className="text-emerald-500" /> {order.city}
                  </div>
                </div>

                <div className="border-t dark:border-gray-800 pt-4 mt-2">
                  <div className="text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">محتوى الطلب</div>
                  <div className="font-bold dark:text-gray-200">إجمالي السعر: <span className="text-emerald-600 dark:text-emerald-400">{order.totalPrice.toLocaleString()} د.م.</span></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center min-w-[150px]">
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as any)}
                  className="p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التوصيل</option>
                </select>
                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-black transition-all"
                >
                  <Trash2 size={18} /> حذف الطلب
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-2xl font-black dark:text-white">تعديل بيانات الطلب</h3>
               <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={32}/></button>
            </div>
            <form onSubmit={handleEditSave} className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="font-black text-sm text-gray-500 dark:text-gray-400">الاسم الكامل للزبون</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input 
                      required 
                      type="text" 
                      value={editingOrder.fullName} 
                      onChange={e => setEditingOrder({...editingOrder, fullName: e.target.value})} 
                      className="w-full p-4 pr-12 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" 
                    />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                      <input 
                        required 
                        type="tel" 
                        value={editingOrder.phone} 
                        onChange={e => setEditingOrder({...editingOrder, phone: e.target.value})} 
                        className="w-full p-4 pr-12 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold text-right" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">المدينة</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={18} />
                      <select 
                        required 
                        value={editingOrder.city} 
                        onChange={e => setEditingOrder({...editingOrder, city: e.target.value})} 
                        className="w-full p-4 pr-12 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold appearance-none cursor-pointer"
                      >
                        {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">المبلغ الإجمالي (د.م.)</label>
                    <input 
                      required 
                      type="number" 
                      value={editingOrder.totalPrice} 
                      onChange={e => setEditingOrder({...editingOrder, totalPrice: Number(e.target.value)})} 
                      className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">حالة الطلب</label>
                    <select 
                      value={editingOrder.status} 
                      onChange={e => setEditingOrder({...editingOrder, status: e.target.value as any})} 
                      className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold appearance-none cursor-pointer"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التوصيل</option>
                    </select>
                  </div>
               </div>

               <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                 <Save size={24} /> حفظ البيانات المعدلة
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, category: 'electronics', image: '', description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('يرجى تحميل صورة للمنتج');
      return;
    }
    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p);
      setProducts(updated);
      saveProducts(updated);
      setEditingId(null);
    } else {
      const newProduct = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Product;
      const updated = [...products, newProduct];
      setProducts(updated);
      saveProducts(updated);
      setShowAddModal(false);
    }
    setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  };

  const deleteProduct = (id: string) => {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black dark:text-white">قائمة المنتجات ({products.length})</h2>
        <button onClick={() => { setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '' }); setEditingId(null); setShowAddModal(true); }} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all">
          <Plus size={20} /> إضافة منتج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-900 p-6 rounded-[35px] shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
            <img src={product.image} className="w-24 h-24 rounded-2xl object-cover shrink-0" alt="" />
            <div className="flex-grow">
              <h4 className="font-black text-lg dark:text-white line-clamp-1">{product.name}</h4>
              <p className="text-emerald-600 dark:text-emerald-400 font-black">{product.price.toLocaleString()} د.م.</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setEditingId(product.id); setFormData(product); setShowAddModal(true); }} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Edit2 size={18} /></button>
                <button onClick={() => deleteProduct(product.id)} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
               <h3 className="text-2xl font-black dark:text-white">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
               <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={32}/></button>
            </div>
            <form onSubmit={saveProduct} className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload Area */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">صورة المنتج</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[30px] p-10 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 cursor-pointer transition-all bg-gray-50 dark:bg-gray-800 group overflow-hidden relative"
                    >
                      {formData.image ? (
                        <>
                          <img src={formData.image} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" alt="Preview" />
                          <div className="relative z-10 flex flex-col items-center">
                            <CheckCircle size={48} className="text-emerald-500 mb-2" />
                            <span className="font-black text-emerald-600">تم اختيار الصورة بنجاح</span>
                            <span className="text-xs text-gray-400">انقر لتغييرها</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                            <Upload size={32} />
                          </div>
                          <div className="text-center">
                             <div className="font-black text-gray-900 dark:text-white">انقر لتحميل الصورة</div>
                             <div className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (أقصى حجم 5MB)</div>
                          </div>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">اسم المنتج</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">السعر (د.م.)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-black text-sm text-gray-500 dark:text-gray-400">الفئة</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold appearance-none cursor-pointer">
                      <option value="electronics">إلكترونيات</option>
                      <option value="watches">ساعات</option>
                      <option value="glasses">نظارات</option>
                      <option value="home">منزل</option>
                      <option value="cars">سيارات</option>
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="font-black text-sm text-gray-500 dark:text-gray-400">الوصف الكامل للمنتج</label>
                  <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" placeholder="اكتب وصفاً تفصيلياً يشرح مميزات المنتج وفوائده للزبائن..."></textarea>
               </div>
               <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                 <Save size={24} /> حفظ المنتج والبيانات
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManager: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    setSettings(localSettings);
    saveSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="space-y-8 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4 mb-4 border-b dark:border-gray-800 pb-6">
         <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
            <Settings size={32} />
         </div>
         <div>
            <h2 className="text-3xl font-black dark:text-white">إعدادات المتجر</h2>
            <p className="text-gray-400 font-bold">إدارة البكسل، الروابط، والحماية</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2"><Facebook size={18} className="text-blue-600"/> Facebook Pixel ID</label>
            <input type="text" value={localSettings.fbPixelId} onChange={e => setLocalSettings({...localSettings, fbPixelId: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" placeholder="1234567890" />
          </div>
          <div className="space-y-2">
            <label className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2"><FlaskConical size={18} className="text-purple-600"/> Facebook Test Event Code</label>
            <input type="text" value={localSettings.fbTestEventCode} onChange={e => setLocalSettings({...localSettings, fbTestEventCode: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" placeholder="TEST12345" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2"><Table size={18} className="text-green-600"/> رابط Google Sheets</label>
            <input type="text" value={localSettings.googleSheetsUrl} onChange={e => setLocalSettings({...localSettings, googleSheetsUrl: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" placeholder="https://docs.google.com/..." />
          </div>
          <div className="space-y-2">
            <label className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2"><Globe size={18} className="text-emerald-600"/> اسم النطاق (Domain)</label>
            <input type="text" value={localSettings.domainName} onChange={e => setLocalSettings({...localSettings, domainName: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none font-bold" />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <label className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2"><Code size={18} className="text-gray-500"/> أكواد مخصصة (Header Scripts)</label>
        <textarea rows={4} value={localSettings.customScript} onChange={e => setLocalSettings({...localSettings, customScript: e.target.value})} className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-mono text-sm focus:border-emerald-500 outline-none" placeholder="<!-- Insert Analytics or Custom CSS here -->"></textarea>
      </div>

      <button onClick={handleSave} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-6">
        <Save size={24} /> حفظ كافة الإعدادات
      </button>
    </div>
  );
};

export default DashboardPage;

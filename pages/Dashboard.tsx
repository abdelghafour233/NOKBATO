import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings, Category, DailyVisits } from '../types';
import { 
  saveProducts, 
  saveOrders, 
  saveSettings, 
  getStoredOrders, 
  getStoredDeletedOrders,
  getStoredProducts,
  getStoredSettings,
  getStoredVisits
} from '../store';
import { 
  Settings as SettingsIcon, 
  Package, 
  ShoppingBag, 
  Trash2, 
  Lock,
  Edit2,
  Phone, 
  MapPin, 
  BarChart,
  X,
  PlusCircle,
  Eye,
  EyeOff,
  CheckCircle,
  KeyRound,
  Globe,
  Code,
  Tag,
  FileText,
  DollarSign,
  Images,
  Image as ImageIcon,
  Users,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Copy,
  Check,
  Megaphone,
  TableProperties,
  Plus,
  Clock,
  Truck,
  CheckCircle2
} from 'lucide-react';

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أغادير", "مكناس", 
  "وجدة", "القنيطرة", "تطوان", "تمارة", "سلا", "آسفي", "العيون", 
  "المحمدية", "بني ملال", "الجديدة", "تازة", "الناظور", "سطات", 
  "خريبكة", "القصر الكبير", "العرائش", "الخميسات", "تارودانت"
];

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
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
        resolve(canvas.toDataURL('image/jpeg', 0.7));
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
    else alert('كلمة المرور غير صحيحة');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[50px] shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-emerald-600 text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 dark:shadow-none">
              <Lock size={48} />
            </div>
            <h1 className="text-4xl font-black dark:text-white mb-3">دخول الإدارة</h1>
            <p className="text-gray-400 font-bold text-sm">أدخل كلمة المرور للوصول إلى الإعدادات</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none text-center font-black tracking-widest text-2xl transition-all"
                placeholder="••••••••"
                autoFocus
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600">
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">دخول آمن</button>
          </form>
          <div className="text-center text-xs text-gray-400 font-bold">
            كلمة المرور الافتراضية: <span className="text-emerald-600">halal2024</span>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { to: "/dashboard", icon: <BarChart size={20}/>, label: "إحصائيات" },
    { to: "/dashboard/orders", icon: <ShoppingBag size={20}/>, label: "طلبات" },
    { to: "/dashboard/products", icon: <Package size={20}/>, label: "منتجات" },
    { to: "/dashboard/settings", icon: <SettingsIcon size={20}/>, label: "إعدادات" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right font-cairo">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-2 rounded-[30px] border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-around mb-12 sticky top-4 z-[100] mx-auto max-w-3xl overflow-hidden">
        {navLinks.map(link => (
          <Link 
            key={link.to}
            to={link.to} 
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black transition-all ${location.pathname === link.to ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
          >
            {link.icon} <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<StatsOverview orders={orders} products={products} settings={settings} />} />
        <Route path="/orders" element={<OrdersList orders={orders} setOrders={setOrders} />} />
        <Route path="/products" element={<ProductsManager products={products} setProducts={setProducts} />} />
        <Route path="/settings" element={<SettingsManager settings={settings} setSettings={setSettings} />} />
      </Routes>
    </div>
  );
};

const StatsOverview: React.FC<{ orders: Order[], products: Product[], settings: AppSettings }> = ({ orders, products, settings }) => {
  const visits = getStoredVisits();
  const todayDate = new Date().toISOString().split('T')[0];
  const todayVisits = visits[todayDate] || 0;

  return (
    <div className="space-y-10 animate-in fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<TrendingUp className="text-emerald-600"/>} label="زوار اليوم" value={todayVisits} color="emerald" />
        <StatCard icon={<ShoppingBag className="text-blue-600"/>} label="إجمالي الطلبات" value={orders.length} color="blue" />
        <StatCard icon={<DollarSign className="text-orange-600"/>} label="المبيعات (د.م)" value={orders.reduce((s, o) => s + o.totalPrice, 0).toLocaleString()} color="orange" />
        <StatCard icon={<Package className="text-purple-600"/>} label="عدد المنتجات" value={products.length} color="purple" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800">
           <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity className="text-emerald-600"/> حالة التتبع</h3>
           <div className="space-y-4">
              <TrackingStatus label="Facebook Pixel" id={settings.fbPixelId} active={!!settings.fbPixelId} />
              <TrackingStatus label="TikTok Pixel" id={settings.tiktokPixelId} active={!!settings.tiktokPixelId} />
              <TrackingStatus label="Google Analytics" id={settings.googleAnalyticsId} active={!!settings.googleAnalyticsId} />
           </div>
        </div>
        <div className="bg-emerald-950 p-8 rounded-[40px] text-white flex flex-col justify-center">
           <h3 className="text-3xl font-black mb-2">مرحباً بك في الإدارة</h3>
           <p className="text-emerald-200/50 font-bold">يمكنك التحكم في كل شيء من هنا بسهولة تامة.</p>
           <div className="mt-8 flex gap-4">
              <Link to="/dashboard/settings" className="px-6 py-3 bg-white text-emerald-950 rounded-2xl font-black text-sm">ضبط الإعدادات</Link>
              <Link to="/" className="px-6 py-3 bg-white/10 text-white rounded-2xl font-black text-sm">عرض الموقع</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-${color}-500 transition-all`}>
    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 bg-${color}-50 dark:bg-${color}-900/20 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div className="text-gray-400 text-xs font-black mb-1 uppercase tracking-widest">{label}</div>
    <div className="text-4xl font-black dark:text-white">{value}</div>
  </div>
);

const TrackingStatus = ({ label, id, active }: any) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
      <span className="font-black text-sm dark:text-white">{label}</span>
    </div>
    <span className="text-xs font-mono text-gray-400">{id || 'غير معرف'}</span>
  </div>
);

const OrdersList: React.FC<{ orders: Order[], setOrders: any }> = ({ orders, setOrders }) => {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [deletedOrders, setDeletedOrders] = useState<Order[]>(getStoredDeletedOrders());
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const moveToTrash = (id: string) => {
    if (!confirm('نقل الطلب للمحذوفات؟')) return;
    const order = orders.find(o => o.id === id);
    if (order) {
      const newOrders = orders.filter(o => o.id !== id);
      const newTrash = [...deletedOrders, order];
      setOrders(newOrders); saveOrders(newOrders);
      setDeletedOrders(newTrash); localStorage.setItem('deleted_orders', JSON.stringify(newTrash));
    }
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const updated = orders.map(o => o.id === editingOrder.id ? editingOrder : o);
    setOrders(updated);
    saveOrders(updated);
    setEditingOrder(null);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return { text: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12}/> };
      case 'shipped': return { text: 'تم الشحن', color: 'bg-blue-100 text-blue-700', icon: <Truck size={12}/> };
      case 'delivered': return { text: 'تم التوصيل', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={12}/> };
      default: return { text: 'غير معروف', color: 'bg-gray-100 text-gray-700', icon: <X size={12}/> };
    }
  };

  const data = view === 'active' ? [...orders].reverse() : [...deletedOrders].reverse();

  return (
    <div className="space-y-8 animate-in fade-up">
      <div className="flex justify-center gap-4 mb-12">
        <button onClick={() => setView('active')} className={`px-10 py-4 rounded-[24px] font-black text-lg transition-all ${view === 'active' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>الطلبات النشطة ({orders.length})</button>
        <button onClick={() => setView('trash')} className={`px-10 py-4 rounded-[24px] font-black text-lg transition-all ${view === 'trash' ? 'bg-red-600 text-white shadow-xl' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>المحذوفات ({deletedOrders.length})</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.length > 0 ? data.map(order => {
          const status = getStatusLabel(order.status || 'pending');
          return (
            <div key={order.id} className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black dark:text-white text-xl mb-1">{order.fullName}</h4>
                  <div className="text-xs text-gray-400 font-bold">{new Date(order.date).toLocaleString('ar-MA')}</div>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${status.color}`}>
                    {status.icon} {status.text}
                  </div>
                </div>
                <div className="text-emerald-600 font-black text-2xl">{order.totalPrice} <span className="text-xs">د.م</span></div>
              </div>
              
              <div className="space-y-3 mb-8 text-sm font-bold text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl"><Phone size={16} className="text-emerald-500"/> {order.phone}</div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl"><MapPin size={16} className="text-emerald-500"/> {order.city}</div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${order.phone}`} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-center text-sm shadow-lg hover:bg-emerald-700 transition-all">اتصال</a>
                {view === 'active' && (
                  <>
                    <button onClick={() => setEditingOrder(order)} className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                      <Edit2 size={20}/>
                    </button>
                    <button onClick={() => moveToTrash(order.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all">
                      <Trash2 size={20}/>
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        }) : (
          <div className="col-span-full py-24 text-center">
             <ShoppingBag size={80} className="mx-auto text-gray-100 dark:text-gray-800 mb-6" />
             <h3 className="text-2xl font-black text-gray-300">لا توجد طلبات هنا</h3>
          </div>
        )}
      </div>

      {/* Modal تعديل الطلبية */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 w-full max-w-2xl rounded-[60px] p-10 max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black dark:text-white">تعديل الطلبية</h3>
              <button onClick={() => setEditingOrder(null)} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={32}/></button>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 pr-2">الاسم الكامل للعميل</label>
                <input required type="text" value={editingOrder.fullName} onChange={e => setEditingOrder({...editingOrder, fullName: e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2">رقم الهاتف</label>
                  <input required type="tel" value={editingOrder.phone} onChange={e => setEditingOrder({...editingOrder, phone: e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none text-right" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2">المدينة</label>
                  <select value={editingOrder.city} onChange={e => setEditingOrder({...editingOrder, city: e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none appearance-none">
                    {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400 pr-2">حالة الطلبية</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['pending', 'shipped', 'delivered'] as const).map((s) => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setEditingOrder({...editingOrder, status: s})}
                      className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${editingOrder.status === s ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}
                    >
                      {getStatusLabel(s).text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center text-xl font-black">
                   <span className="text-gray-400">إجمالي المبلغ:</span>
                   <span className="text-emerald-600">{editingOrder.totalPrice} د.م</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">تحديث الطلبية</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({ 
    name: '', 
    price: 0, 
    category: 'electronics', 
    image: '', 
    description: '',
    images: []
  });
  
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('يرجى اختيار صورة رئيسية');
    
    let updated;
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...formData as Product, id: p.id } : p);
    } else {
      updated = [...products, { ...formData as Product, id: 'p-' + Date.now() }];
    }
    setProducts(updated);
    saveProducts(updated);
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [...(formData.images || [])];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = async () => resolve(await compressImage(reader.result as string));
        });
        reader.readAsDataURL(file);
        const compressed = await promise;
        newImages.push(compressed);
      }
      setFormData({ ...formData, images: newImages });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-up">
      <button onClick={() => { 
        setEditingProduct(null); 
        setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '', images: [] }); 
        setShowModal(true); 
      }} className="w-full bg-emerald-600 text-white py-10 rounded-[45px] font-black text-2xl flex items-center justify-center gap-4 shadow-2xl shadow-emerald-200 dark:shadow-none hover:scale-[1.01] transition-all">
        <PlusCircle size={32}/> إضافة منتج جديد
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-5 rounded-[45px] border border-gray-100 dark:border-gray-800 flex flex-col items-center group shadow-sm hover:shadow-xl transition-all">
            <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[35px]">
               <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h4 className="font-black dark:text-white mb-2 text-center line-clamp-1 px-2">{p.name}</h4>
            <div className="text-emerald-600 font-black text-2xl mb-6">{p.price} <span className="text-xs">د.م</span></div>
            <div className="flex w-full gap-2">
              <button onClick={() => { setEditingProduct(p); setFormData(p); setShowModal(true); }} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all">تعديل</button>
              <button onClick={() => deleteProduct(p.id)} className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 w-full max-w-3xl rounded-[60px] p-10 max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-3xl font-black dark:text-white">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
               <button onClick={() => setShowModal(false)} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={32}/></button>
             </div>
             
             <form onSubmit={handleSave} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 pr-2">اسم المنتج</label>
                      <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 pr-2">السعر (د.م)</label>
                      <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none" />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-black text-gray-400 pr-2">الفئة</label>
                   <select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value as any})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none appearance-none">
                      <option value="electronics">إلكترونيات</option>
                      <option value="watches">ساعات</option>
                      <option value="cars">سيارات</option>
                      <option value="home">منزل</option>
                      <option value="glasses">نظارات</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-black text-gray-400 pr-2">الوصف</label>
                   <textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold h-32 focus:border-emerald-500 outline-none" placeholder="..." />
                </div>
                
                <div className="space-y-4">
                   <label className="text-sm font-black text-gray-400 pr-2">الصورة الرئيسية (Thumbnail)</label>
                   <div onClick={() => mainFileInputRef.current?.click()} className="p-10 border-4 border-dashed rounded-3xl text-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-gray-100 dark:border-gray-800 transition-all">
                    {formData.image ? (
                      <div className="relative inline-block">
                        <img src={formData.image} className="h-40 rounded-2xl mx-auto shadow-xl" />
                        <div className="absolute -top-2 -right-2 bg-emerald-600 text-white p-2 rounded-full"><CheckCircle size={16}/></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon size={64} className="mx-auto text-gray-200" />
                        <div className="text-gray-400 font-black">اضغط لرفع الصورة الأساسية</div>
                      </div>
                    )}
                    <input type="file" ref={mainFileInputRef} className="hidden" onChange={async e => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const reader = new FileReader();
                        reader.onloadend = async () => setFormData({...formData, image: await compressImage(reader.result as string)});
                        reader.readAsDataURL(f);
                      }
                    }} />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-sm font-black text-gray-400 pr-2">معرض الصور الإضافي (Gallery)</label>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {formData.images?.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group border border-gray-200 dark:border-gray-700">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => removeGalleryImage(idx)} 
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => galleryFileInputRef.current?.click()} 
                        className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                      >
                        <Plus size={32} />
                        <span className="text-[10px] font-black">أضف صورة</span>
                      </button>
                   </div>
                   <input type="file" multiple ref={galleryFileInputRef} className="hidden" onChange={handleGalleryUpload} />
                </div>
                
                <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">حفظ المنتج</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManager: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  const [local, setLocal] = useState<AppSettings>(settings);
  const [newPass, setNewPass] = useState('');
  const [activeTab, setActiveTab] = useState<'tracking' | 'domain' | 'security'>('tracking');

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    const final: AppSettings = { ...local };
    if (newPass.trim()) {
      final.adminPasswordHash = btoa(newPass);
    }
    setSettings(final);
    saveSettings(final);
    alert('✅ تم حفظ كافة الإعدادات بنجاح');
  };

  const updateField = (key: keyof AppSettings, value: string) => {
    setLocal(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-up">
      <div className="flex bg-white dark:bg-gray-900 p-2 rounded-[30px] border shadow-sm overflow-hidden">
         <button onClick={()=>setActiveTab('tracking')} className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'tracking' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}><Activity size={20}/> التتبع</button>
         <button onClick={()=>setActiveTab('domain')} className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'domain' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}><Globe size={20}/> النطاق و الربط</button>
         <button onClick={()=>setActiveTab('security')} className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'security' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}><Lock size={20}/> الأمان</button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-10 rounded-[50px] border shadow-sm space-y-8">
        {activeTab === 'tracking' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3"><Megaphone className="text-emerald-600"/> أكواد البيكسل و التتبع</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="Facebook Pixel ID" value={local.fbPixelId || ''} onChange={v => updateField('fbPixelId', v)} placeholder="1234567890..." />
              <InputGroup label="Test Event Code" value={local.fbTestEventCode || ''} onChange={v => updateField('fbTestEventCode', v)} placeholder="TEST12345..." />
              <InputGroup label="TikTok Pixel ID" value={local.tiktokPixelId || ''} onChange={v => updateField('tiktokPixelId', v)} placeholder="CT8..." />
              <InputGroup label="Google Analytics ID" value={local.googleAnalyticsId || ''} onChange={v => updateField('googleAnalyticsId', v)} placeholder="G-XXXXXXXX..." />
            </div>
            <InputGroup label="Google AdSense ID" value={local.googleAdSenseId || ''} onChange={v => updateField('googleAdSenseId', v)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
          </div>
        )}

        {activeTab === 'domain' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3"><Globe className="text-emerald-600"/> إعدادات النطاق و الربط</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="اسم النطاق (Domain)" value={local.domainName || ''} onChange={v => updateField('domainName', v)} placeholder="example.com" />
              <InputGroup label="Name Servers" value={local.nameServers || ''} onChange={v => updateField('nameServers', v)} placeholder="ns1.host.com, ns2.host.com" />
            </div>
            <div className="space-y-4 pt-6">
              <h4 className="text-xl font-black flex items-center gap-3"><TableProperties className="text-emerald-600"/> ربط Google Sheets</h4>
              <p className="text-sm text-gray-400 font-bold">ضع رابط الـ Webhook الخاص بك لإرسال الطلبات تلقائياً إلى ملف Excel.</p>
              <input type="text" value={local.googleSheetsUrl || ''} onChange={e => updateField('googleSheetsUrl', e.target.value)} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none" placeholder="https://script.google.com/macros/s/..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 pr-2">أكواد مخصصة (Custom Scripts)</label>
              <textarea value={local.customScript || ''} onChange={e => updateField('customScript', e.target.value)} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-mono text-sm h-32 focus:border-emerald-500 outline-none" placeholder="<script>...</script>" />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3"><KeyRound className="text-emerald-600"/> حماية لوحة التحكم</h3>
            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700">
               <label className="block text-sm font-black text-gray-400 mb-4 pr-2">تغيير كلمة مرور الإدارة</label>
               <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-900 bg-white dark:bg-gray-800 font-black tracking-widest text-center" placeholder="أدخل كلمة مرور جديدة" />
               <p className="text-xs text-gray-400 mt-2 font-bold text-center">اتركه فارغاً للحفاظ على كلمة المرور الحالية</p>
            </div>
          </div>
        )}
        
        <button type="button" onClick={handleSave} className="w-full bg-emerald-600 text-white py-8 rounded-3xl font-black text-2xl shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3">
           <Check size={28}/> حفظ كافة الإعدادات
        </button>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-black text-gray-400 pr-2">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:border-gray-800 font-bold focus:border-emerald-500 outline-none transition-all" 
      placeholder={placeholder} 
    />
  </div>
);

export default DashboardPage;
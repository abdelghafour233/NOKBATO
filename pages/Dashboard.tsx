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
  Settings, 
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
  Wifi,
  Megaphone,
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
  Check
} from 'lucide-react';

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
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock size={40} />
            </div>
            <h1 className="text-3xl font-black dark:text-white mb-2">تسجيل الدخول</h1>
            <p className="text-gray-400 font-bold text-sm">أهلاً بك في لوحة تحكم بريمة</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white focus:border-emerald-500 outline-none text-center font-black tracking-widest text-xl"
                placeholder="كلمة المرور"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all">دخول للإدارة</button>
          </form>
          <div className="text-center text-[10px] text-gray-400 font-bold">استخدم كلمة المرور التي اخترتها أو الافتراضية</div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { to: "/dashboard", icon: <BarChart size={20}/>, label: "الرئيسية" },
    { to: "/dashboard/orders", icon: <ShoppingBag size={20}/>, label: "الطلبات" },
    { to: "/dashboard/products", icon: <Package size={20}/>, label: "المنتجات" },
    { to: "/dashboard/settings", icon: <Settings size={20}/>, label: "الإعدادات" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right font-cairo">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black dark:text-white">لوحة التحكم</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 p-2 rounded-[25px] border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-between mb-10 sticky top-4 z-[100] overflow-x-auto no-scrollbar mx-auto max-w-2xl">
        {navLinks.map(link => (
          <Link 
            key={link.to}
            to={link.to} 
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black transition-all shrink-0 ${location.pathname === link.to ? 'bg-emerald-600 text-white shadow-md scale-105' : 'text-gray-400 hover:text-emerald-600'}`}
          >
            {link.icon} <span className="text-xs md:text-sm">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Routes>
          <Route path="/" element={<StatsOverview orders={orders} products={products} settings={settings} />} />
          <Route path="/orders" element={<OrdersList orders={orders} setOrders={setOrders} />} />
          <Route path="/products" element={<ProductsManager products={products} setProducts={setProducts} />} />
          <Route path="/settings" element={<SettingsManager settings={settings} setSettings={setSettings} />} />
        </Routes>
      </div>
    </div>
  );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-emerald-600'}`}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const VisitorChart: React.FC<{ data: DailyVisits }> = ({ data }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const values = last7Days.map(date => data[date] || 0);
  const maxVal = Math.max(...values, 5);
  
  const width = 600;
  const height = 150;
  const points = values.map((v, i) => {
    const x = (i / 6) * width;
    const y = height - (v / maxVal) * (height - 20);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-40 mt-8 relative">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d={`M 0,${height} L ${points} L ${width},${height} Z`} fill="url(#grad)" />
        <polyline fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {values.map((v, i) => (
          <circle key={i} cx={(i / 6) * width} cy={height - (v / maxVal) * (height - 20)} r="5" fill="#10b981" className="animate-pulse" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 px-1">
        {last7Days.map(date => (
          <div key={date} className="text-[8px] font-black text-gray-400 uppercase">
            {new Date(date).toLocaleDateString('ar-MA', { weekday: 'short' })}
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsOverview: React.FC<{ orders: Order[], products: Product[], settings: AppSettings }> = ({ orders, products, settings }) => {
  const [visits, setVisits] = useState<DailyVisits>(getStoredVisits());
  const todayDate = new Date().toISOString().split('T')[0];
  const todayVisits = visits[todayDate] || 0;
  const totalWeekVisits = Object.values(visits).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Facebook Tracking Status - Highly Visible & Interactive */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-1 px-1">
        <div className="bg-white dark:bg-gray-900 border-2 border-emerald-50 dark:border-emerald-900/30 p-5 rounded-3xl min-w-[240px] flex-1 shadow-lg flex items-center justify-between gap-4 group hover:border-emerald-500 transition-all">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
               <Activity size={24} className={settings.fbPixelId ? "animate-pulse" : ""} />
             </div>
             <div className="text-right">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">FB Pixel ID</div>
               <div className="text-sm font-black dark:text-white truncate max-w-[120px]">{settings.fbPixelId || 'غير مفعل'}</div>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${settings.fbPixelId ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] font-black text-gray-400">{settings.fbPixelId ? 'نشط الآن' : 'غير متصل'}</span>
               </div>
             </div>
           </div>
           {settings.fbPixelId && <CopyButton text={settings.fbPixelId} />}
        </div>

        <div className="bg-white dark:bg-gray-900 border-2 border-indigo-50 dark:border-indigo-900/30 p-5 rounded-3xl min-w-[240px] flex-1 shadow-lg flex items-center justify-between gap-4 group hover:border-indigo-500 transition-all">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
               <Code size={24} />
             </div>
             <div className="text-right">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Event Code</div>
               <div className="text-sm font-black dark:text-white truncate max-w-[120px]">{settings.fbTestEventCode || 'لا يوجد'}</div>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${settings.fbTestEventCode ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-gray-300'}`}></div>
                  <span className="text-[10px] font-black text-gray-400">وضع الاختبار</span>
               </div>
             </div>
           </div>
           {settings.fbTestEventCode && <CopyButton text={settings.fbTestEventCode} />}
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm text-center group hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-xl flex items-center justify-center"><TrendingUp size={20}/></div>
             <div className="text-[10px] font-black text-emerald-500 flex items-center gap-1">اليوم <ArrowUpRight size={10}/></div>
          </div>
          <div className="text-gray-400 text-[10px] font-black uppercase mb-2 tracking-widest text-right">زوار اليوم</div>
          <div className="text-4xl font-black text-emerald-600 text-right">{todayVisits.toLocaleString()}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm text-center group hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 text-blue-600 rounded-xl flex items-center justify-center"><Users size={20}/></div>
             <div className="text-[10px] font-black text-blue-500 flex items-center gap-1">الإجمالي</div>
          </div>
          <div className="text-gray-400 text-[10px] font-black uppercase mb-2 tracking-widest text-right">إجمالي الزيارات</div>
          <div className="text-4xl font-black dark:text-white text-right">{totalWeekVisits.toLocaleString()}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm text-center group hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/30 text-orange-600 rounded-xl flex items-center justify-center"><DollarSign size={20}/></div>
             <div className="text-[10px] font-black text-orange-500 flex items-center gap-1">المبيعات</div>
          </div>
          <div className="text-gray-400 text-[10px] font-black uppercase mb-2 tracking-widest text-right">إجمالي الدخل</div>
          <div className="text-3xl font-black dark:text-white text-right">
            {orders.reduce((s: number, o: Order) => s + o.totalPrice, 0).toLocaleString()} <span className="text-sm">د.م.</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[50px] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center"><BarChart size={24}/></div>
             <div>
               <h3 className="text-xl font-black dark:text-white">منحنى زوار المتجر</h3>
               <p className="text-gray-400 text-[10px] font-bold">مراقبة النشاط خلال آخر 7 أيام</p>
             </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">تحديث مباشر</div>
        </div>
        <VisitorChart data={visits} />
      </div>
    </div>
  );
};

const OrdersList: React.FC<{ orders: Order[], setOrders: any }> = ({ orders, setOrders }) => {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [deletedOrders, setDeletedOrders] = useState<Order[]>(getStoredDeletedOrders());

  const moveToTrash = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order && confirm('هل تريد نقل هذا الطلب إلى سلة المحذوفات؟')) {
      const newOrders = orders.filter(o => o.id !== id);
      const newTrash = [...deletedOrders, order];
      setOrders(newOrders); saveOrders(newOrders);
      setDeletedOrders(newTrash); localStorage.setItem('deleted_orders', JSON.stringify(newTrash));
    }
  };

  const data = view === 'active' ? [...orders].reverse() : [...deletedOrders].reverse();

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl max-w-sm mx-auto">
        <button onClick={() => setView('active')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${view === 'active' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>طلبات نشطة</button>
        <button onClick={() => setView('trash')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${view === 'trash' ? 'bg-white dark:bg-gray-700 text-red-500 shadow-sm' : 'text-gray-400'}`}>المحذوفات</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-[35px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-black dark:text-white text-lg">{order.fullName}</h4>
                <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><MapPin size={12}/> {order.city}</div>
              </div>
              <div className="text-emerald-600 font-black text-xl bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-2xl">{order.totalPrice} <span className="text-[10px]">د.م.</span></div>
            </div>
            <div className="space-y-3 mb-6">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Phone size={14} className="text-emerald-500"/> {order.phone}
               </div>
               <div className="text-[10px] text-gray-400 font-bold px-2">{new Date(order.date).toLocaleString('ar-MA')}</div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${order.phone}`} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"><Phone size={16}/> اتصال</a>
              {view === 'active' && <button onClick={() => moveToTrash(order.id)} className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>}
            </div>
          </div>
        ))}
      </div>
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
    images: [], 
    description: '' 
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const CATEGORIES: {id: Category, label: string}[] = [
    {id: 'electronics', label: 'إلكترونيات'},
    {id: 'watches', label: 'ساعات فاخرة'},
    {id: 'glasses', label: 'نظارات عصرية'},
    {id: 'home', label: 'مستلزمات منزلية'},
    {id: 'cars', label: 'سيارات واكسسوارات'}
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('يرجى اختيار صورة رئيسية');
    setIsProcessing(true);
    let updated: Product[];
    const finalData = { 
      ...formData, 
      images: formData.images || [],
      description: formData.description || '',
      category: formData.category || 'electronics'
    } as Product;

    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...finalData, id: p.id } : p);
    } else {
      updated = [...products, { ...finalData, id: Math.random().toString(36).substr(2, 9) }];
    }
    setProducts(updated);
    saveProducts(updated);
    setShowModal(false);
    setIsProcessing(false);
    setEditingProduct(null);
  };

  const handleMainFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData(prev => ({ ...prev, image: compressed }));
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsProcessing(true);
      const newImages: string[] = [...(formData.images || [])];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string);
            resolve(compressed);
          };
        });
        reader.readAsDataURL(files[i]);
        const result = await promise;
        newImages.push(result);
      }
      setFormData(prev => ({ ...prev, images: newImages }));
      setIsProcessing(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      <button onClick={() => { setEditingProduct(null); setFormData({ name: '', price: 0, category: 'electronics', image: '', images: [], description: '' }); setShowModal(true); }} className="w-full bg-emerald-600 text-white p-8 rounded-[35px] font-black flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 transition-all text-xl">
        <PlusCircle size={28} /> إضافة منتج جديد
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-5 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all flex flex-col items-center text-center">
            <div className="w-full aspect-square mb-4 rounded-[30px] overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner">
               <img src={p.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow w-full mb-6">
              <h4 className="font-black text-base dark:text-white line-clamp-1 mb-1">{p.name}</h4>
              <div className="text-emerald-600 font-black text-2xl">{p.price.toLocaleString()} <span className="text-xs">د.م.</span></div>
              <div className="text-[10px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-800 inline-block px-3 py-1 rounded-full mt-2">
                {CATEGORIES.find(c => c.id === p.category)?.label || p.category}
              </div>
            </div>
            <div className="flex w-full gap-2">
              <button onClick={() => { setEditingProduct(p); setFormData(p); setShowModal(true); }} className="flex-1 py-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all"><Edit2 size={16}/> تعديل</button>
              <button onClick={() => { if(confirm('حذف المنتج نهائياً؟')) { const u = products.filter(x=>x.id!==p.id); setProducts(u); saveProducts(u); } }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-[50px] shadow-2xl p-8 relative max-h-[95vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-8 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2 border-b dark:border-gray-800">
               <h3 className="text-2xl font-black dark:text-white">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h3>
               <button onClick={() => setShowModal(false)}><X size={32} className="text-gray-400"/></button>
             </div>

             <form onSubmit={handleSave} className="space-y-8 text-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><ImageIcon size={14}/> صورة الغلاف</label>
                    <div onClick={() => fileInputRef.current?.click()} className="aspect-square border-4 border-dashed rounded-[35px] flex items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-800 overflow-hidden relative group transition-all">
                      {formData.image ? (
                        <>
                          <img src={formData.image} className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black transition-opacity">تغيير الصورة</div>
                        </>
                      ) : (
                        <div className="text-center">
                          <PlusCircle size={40} className="mx-auto text-gray-300 mb-2"/>
                          <div className="text-gray-400 font-black text-xs">اضغط لرفع غلاف</div>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleMainFileChange} accept="image/*" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><Images size={14}/> صور إضافية</label>
                    <div className="grid grid-cols-2 gap-3 min-h-[150px]">
                      {formData.images?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <img src={img} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 left-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => galleryInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-all">
                        <PlusCircle size={24} />
                        <span className="text-[10px] font-black mt-1">إضافة صور</span>
                      </button>
                    </div>
                    <input type="file" ref={galleryInputRef} className="hidden" onChange={handleGalleryFileChange} accept="image/*" multiple />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><Tag size={14}/> اسم المنتج</label>
                    <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 bg-gray-50 dark:border-gray-700" placeholder="أدخل اسم المنتج..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><DollarSign size={14}/> السعر (د.م.)</label>
                    <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 bg-gray-50 dark:border-gray-700" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><Package size={14}/> فئة المنتج</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`p-4 rounded-2xl font-black text-xs border-2 transition-all ${formData.category === cat.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-400 dark:text-gray-500 hover:border-gray-200'}`}>{cat.label}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><FileText size={14}/> وصف المنتج</label>
                  <textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 bg-gray-50 dark:border-gray-700 min-h-[150px]" placeholder="وصف المنتج..." />
                </div>

                <button type="submit" disabled={isProcessing} className={`w-full py-6 rounded-3xl text-white font-black text-xl shadow-xl transition-all ${isProcessing ? 'bg-gray-400 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}`}>{isProcessing ? 'جاري الحفظ...' : (editingProduct ? 'تحديث المنتج' : 'حفظ المنتج')}</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManager: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  const [local, setLocal] = useState(settings);
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSave = () => {
    let finalSettings = { ...local };
    if (newPassword.trim()) finalSettings.adminPasswordHash = btoa(newPassword);
    setSettings(finalSettings);
    saveSettings(finalSettings);
    alert('✅ تم حفظ الإعدادات');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20 text-right">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"><Megaphone size={32} /></div>
            <div>
              <h3 className="text-2xl font-black">إعدادات تتبع فيسبوك</h3>
              <p className="text-blue-100 text-xs font-bold">اربط متجرك بفيسبوك لمتابعة نشاط الزوار</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200">Pixel ID</label>
              <input type="text" value={local.fbPixelId} onChange={e => setLocal({...local, fbPixelId: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-xl p-4 font-black outline-none focus:bg-white/20 transition-all placeholder:text-blue-300/50" placeholder="Pixel ID" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200">Test Code</label>
              <input type="text" value={local.fbTestEventCode} onChange={e => setLocal({...local, fbTestEventCode: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-xl p-4 font-black outline-none focus:bg-white/20 transition-all placeholder:text-blue-300/50" placeholder="TEST Code" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border dark:border-gray-800 shadow-xl space-y-10">
        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-3"><KeyRound size={24} className="text-emerald-600"/> الأمان</h3>
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500" placeholder="تغيير كلمة المرور" />
            <button onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-3"><Globe size={24} className="text-emerald-600"/> الموقع</h3>
          <input type="text" value={local.domainName} onChange={e=>setLocal({...local, domainName:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500" placeholder="النطاق (Domain)" />
        </div>
        <button onClick={handleSave} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all">حفظ</button>
      </div>
    </div>
  );
};

export default DashboardPage;
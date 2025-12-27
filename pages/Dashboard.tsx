import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings } from '../types';
import { 
  saveProducts, 
  saveOrders, 
  saveSettings, 
  getStoredOrders, 
  getStoredDeletedOrders,
  getStoredProducts,
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
  Upload,
  Image as ImageIcon,
  CheckCircle,
  ChevronLeft
} from 'lucide-react';

// وظيفة ضغط الصور لضمان سلاسة الموقع على الهاتف والحاسوب
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
    // التحقق من كلمة المرور (الافتراضية: halal2024)
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
          <div className="text-center text-[10px] text-gray-400 font-bold">كلمة السر الافتراضية هي: halal2024</div>
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
      {/* Header الموحد */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black dark:text-white">لوحة التحكم</h1>
        <div className="flex items-center justify-center gap-2 text-emerald-600 text-[10px] font-black mt-2 uppercase">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          النظام متصل ونشط الآن
        </div>
      </div>

      {/* شريط التنقل الموحد للحاسوب والهاتف */}
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

      {/* المحتوى */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
    <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm text-center group hover:border-emerald-500 transition-all">
      <div className="text-gray-400 text-[10px] font-black uppercase mb-3 tracking-widest">إجمالي المبيعات</div>
      <div className="text-4xl font-black text-emerald-600">{orders.reduce((s,o)=>s+o.totalPrice,0).toLocaleString()} <span className="text-sm">د.م.</span></div>
    </div>
    <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm text-center group hover:border-emerald-500 transition-all">
      <div className="text-gray-400 text-[10px] font-black uppercase mb-3 tracking-widest">عدد الطلبات</div>
      <div className="text-4xl font-black dark:text-white">{orders.length} <span className="text-sm">طلب</span></div>
    </div>
    <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm text-center group hover:border-emerald-500 transition-all">
      <div className="text-gray-400 text-[10px] font-black uppercase mb-3 tracking-widest">منتجات المتجر</div>
      <div className="text-4xl font-black dark:text-white">{products.length} <span className="text-sm">منتج</span></div>
    </div>
  </div>
);

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
              <a href={`tel:${order.phone}`} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"><Phone size={16}/> اتصال بالعميل</a>
              {view === 'active' && <button onClick={() => moveToTrash(order.id)} className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>}
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-[50px] border-2 border-dashed border-gray-200 dark:border-gray-800 font-black text-gray-400">لا توجد طلبات لعرضها</div>}
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('يرجى اختيار صورة للمنتج');
    
    setIsProcessing(true);
    let updated: Product[];
    
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } as Product : p);
    } else {
      const newProd = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Product;
      updated = [...products, newProd];
    }
    
    setProducts(updated);
    saveProducts(updated);
    setShowModal(false);
    setIsProcessing(false);
    setEditingProduct(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="space-y-8">
      <button onClick={() => { setEditingProduct(null); setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '' }); setShowModal(true); }} className="w-full bg-emerald-600 text-white p-8 rounded-[35px] font-black flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 transition-all text-xl">
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
              <div className="text-emerald-600 font-black text-2xl">{p.price} <span className="text-xs">د.م.</span></div>
            </div>
            <div className="flex w-full gap-2">
              <button onClick={() => { setEditingProduct(p); setFormData(p); setShowModal(true); }} className="flex-1 py-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all"><Edit2 size={16}/> تعديل</button>
              <button onClick={() => { if(confirm('هل أنت متأكد من حذف المنتج؟')) { const u = products.filter(x=>x.id!==p.id); setProducts(u); saveProducts(u); } }} className="p-4 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[50px] shadow-2xl p-8 md:p-12 relative max-h-[95vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black dark:text-white">{editingProduct ? 'تحديث المنتج' : 'إضافة منتج'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={32}/></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8 text-right">
              {/* اختيار الصور */}
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="aspect-video border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[40px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-50 dark:bg-gray-800 relative hover:border-emerald-500 transition-all shadow-inner"
              >
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center font-black text-gray-400 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-[25px] flex items-center justify-center shadow-lg">
                      <Upload size={40} className="text-emerald-500"/>
                    </div>
                    <span className="text-lg">اضغط هنا لتحميل صورة المنتج</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                {isProcessing && <div className="absolute inset-0 bg-emerald-600/20 backdrop-blur-sm flex items-center justify-center font-black text-emerald-900 animate-pulse">جاري المعالجة...</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2">اسم المنتج</label>
                  <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2">السعر بالدرهم</label>
                  <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full p-5 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2">التصنيف</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value as any})} className="w-full p-5 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                    <option value="electronics">إلكترونيات</option>
                    <option value="watches">ساعات</option>
                    <option value="glasses">نظارات</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2">وصف قصير</label>
                  <textarea rows={1} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 transition-all resize-none"></textarea>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3">
                <CheckCircle size={24} /> {editingProduct ? 'حفظ التعديلات' : 'نشر المنتج في المتجر'}
              </button>
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
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-[50px] border dark:border-gray-800 shadow-xl space-y-8">
        <h3 className="text-2xl font-black dark:text-white flex items-center gap-3 justify-center">إعدادات المنصات والبيكسل <Settings size={24} className="text-emerald-600"/></h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 pr-2 uppercase">Facebook Pixel ID</label>
            <input type="text" value={local.fbPixelId} onChange={e=>setLocal({...local, fbPixelId:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 transition-all" placeholder="ID البكسل الخاص بفيسبوك" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 pr-2 uppercase">Google AdSense ID</label>
            <input type="text" value={local.googleAdSenseId} onChange={e=>setLocal({...local, googleAdSenseId:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 transition-all" placeholder="مثال: pub-xxxxxxxxxxxxxxxx" />
          </div>
        </div>
        <button onClick={() => { setSettings(local); saveSettings(local); alert('✅ تم حفظ كافة الإعدادات بنجاح'); }} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all">حفظ الإعدادات</button>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-10 rounded-[50px] border border-red-100 dark:border-red-900/20 text-center">
        <h3 className="text-xl font-black text-red-600 mb-6 flex items-center justify-center gap-3"><AlertTriangle size={24} /> منطقة الخطر</h3>
        <p className="text-sm font-bold text-red-400 mb-8 px-4 leading-relaxed">تنبيه: زر إعادة ضبط المصنع سيقوم بمسح كافة المنتجات والطلبات والإعدادات نهائياً ولا يمكن التراجع.</p>
        <button onClick={factoryReset} className="w-full max-w-sm mx-auto bg-white dark:bg-gray-950 text-red-600 border-2 border-red-200 py-5 rounded-3xl font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3">
          <RefreshCw size={20}/> مسح كل البيانات والبدء من جديد
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
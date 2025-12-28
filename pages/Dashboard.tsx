import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings, Category } from '../types';
import { 
  saveProducts, 
  saveOrders, 
  saveSettings, 
  getStoredOrders, 
  getStoredDeletedOrders,
  getStoredProducts,
  getStoredSettings
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
  Image as ImageIcon
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
                {/* Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><ImageIcon size={14}/> صورة الغلاف (الرئيسية)</label>
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
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><Images size={14}/> صور إضافية (المعرض)</label>
                    <div className="grid grid-cols-2 gap-3 min-h-[150px]">
                      {formData.images?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 left-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-all"
                      >
                        <PlusCircle size={24} />
                        <span className="text-[10px] font-black mt-1">إضافة صور</span>
                      </button>
                    </div>
                    <input type="file" ref={galleryInputRef} className="hidden" onChange={handleGalleryFileChange} accept="image/*" multiple />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><Tag size={14}/> اسم المنتج</label>
                    <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 bg-gray-50 dark:border-gray-700" placeholder="أدخل اسم المنتج هنا..." />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><DollarSign size={14}/> السعر (د.م.)</label>
                    <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 bg-gray-50 dark:border-gray-700" placeholder="0.00" />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><Package size={14}/> فئة المنتج</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`p-4 rounded-2xl font-black text-xs border-2 transition-all ${formData.category === cat.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-400 dark:text-gray-500 hover:border-gray-200'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 pr-2 flex items-center gap-2"><FileText size={14}/> وصف المنتج</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e=>setFormData({...formData, description:e.target.value})} 
                    className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 bg-gray-50 dark:border-gray-700 min-h-[150px]" 
                    placeholder="اكتب وصفاً جذاباً لمنتجك هنا لتشجيع العملاء على الشراء..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing} 
                  className={`w-full py-6 rounded-3xl text-white font-black text-xl shadow-xl transition-all ${isProcessing ? 'bg-gray-400 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}`}
                >
                  {isProcessing ? 'جاري الحفظ...' : (editingProduct ? 'تحديث بيانات المنتج' : 'حفظ ونشر المنتج')}
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
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSave = () => {
    let finalSettings = { ...local };
    if (newPassword.trim()) {
      finalSettings.adminPasswordHash = btoa(newPassword);
    }
    setSettings(finalSettings);
    saveSettings(finalSettings);
    alert('✅ تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20 text-right">
      
      {/* Facebook Marketing Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
               <Megaphone size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black">إعدادات فيسبوك بيكسل</h3>
              <p className="text-blue-100 text-xs font-bold">تتبع زوار متجرك وحسن أداء حملاتك الإعلانية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200">Pixel ID</label>
              <input 
                type="text" 
                value={local.fbPixelId} 
                onChange={e => setLocal({...local, fbPixelId: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 font-black outline-none focus:bg-white/20 transition-all placeholder:text-blue-300/50"
                placeholder="مثال: 1234567890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200">Test Event Code</label>
              <input 
                type="text" 
                value={local.fbTestEventCode} 
                onChange={e => setLocal({...local, fbTestEventCode: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 font-black outline-none focus:bg-white/20 transition-all placeholder:text-blue-300/50"
                placeholder="TEST12345"
              />
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
             <p className="text-[10px] font-medium leading-relaxed text-blue-50 opacity-80">
               * النظام يدعم تتبع الأحداث القياسية (PageView, ViewContent, AddToCart, Purchase) تلقائياً بمجرد إدخال الـ ID.
             </p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border dark:border-gray-800 shadow-xl space-y-10">
        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-3"><KeyRound size={24} className="text-emerald-600"/> الأمان وكلمة المرور</h3>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400">تغيير كلمة المرور</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500" placeholder="اتركها فارغة لعدم التغيير" />
              <button onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-3"><Globe size={24} className="text-emerald-600"/> الويب والتتبع</h3>
          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs font-black text-gray-400">اسم النطاق (Domain)</label>
               <input type="text" value={local.domainName} onChange={e=>setLocal({...local, domainName:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500" placeholder="storebrima.com" />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-black text-gray-400">Google AdSense ID</label>
               <input type="text" value={local.googleAdSenseId} onChange={e=>setLocal({...local, googleAdSenseId:e.target.value})} className="w-full p-5 rounded-2xl border-2 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500" placeholder="ca-pub-xxxxxxxxxxxxxxxx" />
             </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all">حفظ الإعدادات</button>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, Order, AppSettings, Category } from '../types';
import { 
  saveProducts, 
  saveOrders, 
  saveDeletedOrders,
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
  Upload,
  ImageIcon,
  ChevronDown,
  X,
  RefreshCw,
  AlertTriangle,
  Zap,
  RotateCcw,
  PlusCircle,
  History,
  Layout,
  Key,
  Images,
  Eye,
  EyeOff,
  Check,
  Info
} from 'lucide-react';

// وظيفة ضغط الصور لضمان التوافق مع الهواتف (Max 100KB per image)
const compressImage = (base64Str: string, maxWidth = 600, maxHeight = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } else {
        resolve(base64Str);
      }
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
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletedOrders, setDeletedOrders] = useState<Order[]>(getStoredDeletedOrders());

  const updateStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  };

  const moveToTrash = (id: string) => {
    const orderToTrash = orders.find(o => o.id === id);
    if (orderToTrash && confirm('هل أنت متأكد؟ سيتم نقل الطلب إلى سلة المحذوفات ويمكنك استرجاعه لاحقاً.')) {
      const newOrders = orders.filter(o => o.id !== id);
      const newTrash = [...deletedOrders, orderToTrash];
      setOrders(newOrders);
      saveOrders(newOrders);
      setDeletedOrders(newTrash);
      saveDeletedOrders(newTrash);
    }
  };

  const restoreFromTrash = (id: string) => {
    const orderToRestore = deletedOrders.find(o => o.id === id);
    if (orderToRestore) {
      const newTrash = deletedOrders.filter(o => o.id !== id);
      const newOrders = [...orders, orderToRestore];
      setDeletedOrders(newTrash);
      saveDeletedOrders(newTrash);
      setOrders(newOrders);
      saveOrders(newOrders);
      alert(`✅ تم استرجاع طلب ${orderToRestore.fullName} بنجاح!`);
    }
  };

  const permanentDelete = (id: string) => {
    if (confirm('تنبيه: سيتم حذف الطلبية نهائياً ولا يمكن استرجاعها. هل أنت متأكد؟')) {
      const newTrash = deletedOrders.filter(o => o.id !== id);
      setDeletedOrders(newTrash);
      saveDeletedOrders(newTrash);
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
    <div className="space-y-6 text-right">
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl shadow-inner">
        <button 
          onClick={() => setView('active')}
          className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${view === 'active' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
        >
          <ShoppingBag size={18} /> الطلبات النشطة ({orders.length})
        </button>
        <button 
          onClick={() => setView('trash')}
          className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 relative ${view === 'trash' ? 'bg-white dark:bg-gray-700 text-red-500 shadow-sm' : 'text-gray-400'}`}
        >
          <Trash2 size={18} /> المحذوفات ({deletedOrders.length})
          {deletedOrders.length > 0 && view !== 'trash' && <span className="absolute top-1 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </button>
      </div>

      {view === 'active' && orders.length > 0 && (
         <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-4">
           <Info size={16} /> إذا حذفت طلبية بالخطأ، ستجدها في قسم "المحذوفات" أعلاه.
         </div>
      )}

      <div className="space-y-4">
        {(view === 'active' ? [...orders].reverse() : [...deletedOrders].reverse()).map(order => (
          <div key={order.id} className={`bg-white dark:bg-gray-900 p-5 rounded-[30px] border-r-4 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${order.status === 'pending' ? 'border-orange-500' : 'border-emerald-500'}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h3 className="font-black dark:text-white">{order.fullName}</h3>
                   {view === 'trash' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">محذوف</span>}
                </div>
                <div className="flex gap-3 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1"><Phone size={12}/> {order.phone}</span>
                  <span className="flex items-center gap-1 text-emerald-600"><MapPin size={12}/> {order.city}</span>
                </div>
                <div className="text-emerald-600 font-black pt-1">{order.totalPrice.toLocaleString()} د.م.</div>
              </div>
              <div className="flex flex-col gap-2">
                {view === 'active' ? (
                  <>
                    <button onClick={() => setEditingOrder(order)} className="p-2 bg-gray-50 dark:bg-gray-800 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Edit2 size={16}/></button>
                    <button onClick={() => moveToTrash(order.id)} className="p-2 bg-gray-50 dark:bg-gray-800 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => restoreFromTrash(order.id)} className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-1 text-[10px] font-black"><RotateCcw size={14}/> استرجاع</button>
                    <button onClick={() => permanentDelete(order.id)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                  </>
                )}
              </div>
            </div>
            {view === 'active' && (
              <div className="mt-4 pt-4 border-t dark:border-gray-800">
                <select 
                  value={order.status} 
                  onChange={(e) => updateStatus(order.id, e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white text-xs font-black border-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="pending">⏳ قيد الانتظار</option>
                  <option value="shipped">🚚 تم الشحن</option>
                  <option value="delivered">✅ تم التوصيل</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      {(view === 'active' && orders.length === 0) || (view === 'trash' && deletedOrders.length === 0) ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
           <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
           <p className="text-gray-400 font-black italic">لا توجد طلبيات لعرضها هنا</p>
        </div>
      ) : null}
      
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[40px] shadow-2xl p-6 md:p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black dark:text-white">تعديل معلومات الزبون</h3>
               <button onClick={()=>setEditingOrder(null)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
            </div>
            <form onSubmit={saveEditedOrder} className="space-y-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-black text-gray-400 mr-2">الاسم الكامل</label>
                <input type="text" value={editingOrder.fullName} onChange={e=>setEditingOrder({...editingOrder, fullName:e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-1 text-right">
                <label className="text-xs font-black text-gray-400 mr-2">رقم الهاتف</label>
                <input type="tel" value={editingOrder.phone} onChange={e=>setEditingOrder({...editingOrder, phone:e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 text-left" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all">حفظ التغييرات</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({ 
    name: '', 
    price: 0, 
    category: 'electronics', 
    image: '', 
    images: [],
    description: '' 
  });
  const mainFileInput = useRef<HTMLInputElement>(null);
  const galleryFileInput = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: 0, category: 'electronics', image: '', images: [], description: '' });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product, images: product.images || [] });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('يرجى إضافة صورة رئيسية');
    setIsProcessing(true);
    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } as Product : p);
    } else {
      const newProduct = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Product;
      updatedProducts = [...products, newProduct];
    }
    try {
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      setShowModal(false);
      alert('تم حفظ المنتج بنجاح');
    } catch (err) {
      alert('خطأ في الذاكرة: الصور كبيرة جداً لمساحة الهاتف. حاول استخدام صور أقل.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast the result of Array.from to File[] to fix unknown type inference which causes error on reader.readAsDataURL
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    setIsProcessing(true);
    const newImages: string[] = [];
    for (const file of files) {
      const base64 = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.readAsDataURL(file);
      });
      const compressed = await compressImage(base64, 500, 500); 
      newImages.push(compressed);
    }
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
    setIsProcessing(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6 text-right">
      <button onClick={openAddModal} className="w-full bg-emerald-600 text-white p-5 rounded-[25px] font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 active:scale-95 transition-all">
        <PlusCircle size={22} /> إضافة منتج جديد لمتجرك
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-4 rounded-[35px] border border-gray-100 dark:border-gray-800 flex gap-4 items-center shadow-sm hover:shadow-md transition-all">
            <div className="relative w-24 h-24 shrink-0">
              <img src={p.image} className="w-full h-full rounded-3xl object-cover shadow-inner" />
              {p.images && p.images.length > 0 && <span className="absolute -top-2 -left-2 bg-emerald-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black shadow-lg">+{p.images.length}</span>}
            </div>
            <div className="flex-grow space-y-1">
              <h4 className="font-black text-sm dark:text-white line-clamp-1">{p.name}</h4>
              <div className="text-emerald-600 font-black text-base">{p.price.toLocaleString()} د.م.</div>
              <div className="text-[10px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block">{p.category}</div>
            </div>
            <div className="flex flex-col gap-2 border-r pr-4 dark:border-gray-800">
              <button onClick={() => openEditModal(p)} className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Edit2 size={18}/></button>
              <button onClick={() => { if(confirm('هل تريد حذف المنتج نهائياً؟')) { const u = products.filter(x=>x.id!==p.id); setProducts(u); saveProducts(u); } }} className="p-2.5 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[45px] shadow-2xl p-6 md:p-10 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto relative">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 z-[210] flex flex-col items-center justify-center rounded-[45px]">
                <RefreshCw size={48} className="text-emerald-600 animate-spin mb-4" />
                <p className="font-black dark:text-white text-lg">جاري معالجة الصور لمتجرك...</p>
                <p className="text-gray-400 font-bold text-xs mt-2 text-center px-8">نقوم بتصغير حجم الصور لتناسب سرعة الهواتف ومساحة التخزين</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black dark:text-white">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><X size={28}/></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 text-right">
                  <label className="block text-xs font-black text-gray-500 mr-2">الصورة الرئيسية (الغلاف)</label>
                  <div onClick={() => mainFileInput.current?.click()} className="group border-2 border-dashed border-gray-100 dark:border-gray-800 p-4 rounded-[40px] text-center cursor-pointer hover:border-emerald-500 transition-all aspect-square flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full rounded-3xl object-cover" />
                    ) : (
                      <>
                        <Upload className="text-emerald-500 mb-2" size={32} />
                        <span className="text-[10px] font-black text-gray-400">إضغط للتحميل</span>
                      </>
                    )}
                    <input type="file" ref={mainFileInput} onChange={handleMainUpload} className="hidden" accept="image/*" />
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <label className="block text-xs font-black text-gray-500 mr-2">معرض الصور (إضافية)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(formData.images || []).map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-50 dark:border-gray-800 shadow-sm">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg shadow-md"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    {(!formData.images || formData.images.length < 9) && (
                      <button type="button" onClick={() => galleryFileInput.current?.click()} className="aspect-square border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50 transition-all">
                        <Plus size={24} />
                      </button>
                    )}
                  </div>
                  <input type="file" ref={galleryFileInput} onChange={handleGalleryUpload} className="hidden" accept="image/*" multiple />
                  <p className="text-[9px] text-gray-400 font-bold mr-1 italic">يمكنك إضافة حتى 9 صور إضافية</p>
                </div>
              </div>

              <div className="space-y-5 text-right">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-2">اسم المنتج</label>
                  <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 transition-all" placeholder="مثال: ساعة فاخرة ضد الماء" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 mr-2">السعر (بالدرهم)</label>
                    <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 dark:text-white font-black outline-none focus:border-emerald-500" placeholder="0.00" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 mr-2">التصنيف</label>
                    <select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value as any})} className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-black outline-none focus:border-emerald-500 cursor-pointer appearance-none">
                      <option value="electronics">إلكترونيات</option>
                      <option value="watches">ساعات</option>
                      <option value="glasses">نظارات</option>
                      <option value="home">منزل</option>
                      <option value="cars">سيارات</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-2">وصف المنتج (مميزات)</label>
                  <textarea required rows={5} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-bold outline-none focus:border-emerald-500 resize-none" placeholder="اكتب تفاصيل المنتج هنا لجذب الزبائن..."></textarea>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50">
                {editingProduct ? 'حفظ كافة التعديلات' : 'عرض المنتج في المتجر الآن'}
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
  const handleReset = () => { 
    if (confirm('⚠️ تحذير نهائي: سيتم مسح كافة المنتجات والطلبيات والإعدادات. هل أنت متأكد؟')) {
      factoryReset();
    }
  };

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border dark:border-gray-800 space-y-6 shadow-sm">
        <h3 className="text-xl font-black dark:text-white flex items-center justify-end gap-2">
           إعدادات المتجر الرئيسية <Settings size={22} className="text-emerald-600" />
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 mr-2">Facebook Pixel ID</label>
            <input type="text" placeholder="مثال: 1234567890" value={local.fbPixelId} onChange={e=>setLocal({...local, fbPixelId:e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 dark:text-white font-bold outline-none focus:border-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 mr-2">Google AdSense ID</label>
            <input type="text" placeholder="ca-pub-XXXXXXXXXXXXXXXX" value={local.googleAdSenseId} onChange={e=>setLocal({...local, googleAdSenseId:e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 dark:text-white font-bold outline-none focus:border-emerald-500" />
          </div>
        </div>
        <button onClick={() => { setSettings(local); saveSettings(local); alert('✅ تم حفظ الإعدادات بنجاح'); }} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
          <Save size={20} /> حفظ الإعدادات
        </button>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[40px] border border-red-100 dark:border-red-900/20 space-y-4">
        <h3 className="text-lg font-black text-red-600 flex items-center justify-end gap-2">
           منطقة الخطر <AlertTriangle size={20} />
        </h3>
        <p className="text-xs font-bold text-red-500/70">استخدم الخيار أدناه فقط إذا كنت تريد مسح بيانات المتجر بالكامل والبدء من جديد.</p>
        <button onClick={handleReset} className="w-full bg-white dark:bg-gray-950 text-red-600 border-2 border-red-200 dark:border-red-900/30 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
          <RefreshCw size={18} /> مسح كافة البيانات وإعادة الضبط
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
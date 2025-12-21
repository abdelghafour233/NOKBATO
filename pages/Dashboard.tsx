
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Product, Order, AppSettings } from '../types.ts';
import { saveProducts, saveOrders, saveSettings } from '../store.ts';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings as SettingsIcon, 
  ExternalLink, 
  Plus, 
  Globe, 
  Database, 
  BarChart as Analytics,
  Trash2,
  CheckCircle,
  Lock,
  Key,
  ShieldAlert,
  Image as ImageIcon,
  Upload,
  X as CloseIcon
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (btoa(passwordInput) === settings.adminPasswordHash) {
      setIsAuthenticated(true);
      setError(false);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setError(true);
      setPasswordInput("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-emerald-50 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-black mb-2">منطقة محظورة</h2>
          <p className="text-gray-400 mb-8 font-medium">يرجى إدخال رمز الدخول للإدارة</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="كلمة المرور"
                className={`w-full p-4 pr-12 rounded-2xl border-2 outline-none font-bold transition-all ${error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-emerald-500'}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">كلمة المرور غير صحيحة!</p>}
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
            >
              دخول المدير
            </button>
          </form>
          
          <Link to="/" className="mt-8 inline-block text-gray-400 hover:text-emerald-600 font-bold transition-colors">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-l shadow-sm p-6 space-y-2">
        <div className="flex items-center gap-2 mb-8 px-4">
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
           <h2 className="text-xl font-black text-gray-800">لوحة الإدارة</h2>
        </div>
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
          <button 
            onClick={() => {
              sessionStorage.removeItem('admin_auth');
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-colors mt-2"
          >
            <Lock size={20} /> تسجيل الخروج
          </button>
        </div>
      </aside>

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

const StatsOverview = ({ orders, products }: { orders: Order[], products: Product[] }) => {
  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">نظرة عامة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-gray-400 font-bold mb-2 text-sm uppercase">إجمالي المبيعات</div>
          <div className="text-4xl font-black text-emerald-600">{revenue.toLocaleString()} د.م.</div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-gray-400 font-bold mb-2 text-sm uppercase">عدد الطلبات</div>
          <div className="text-4xl font-black text-blue-600">{orders.length}</div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-gray-400 font-bold mb-2 text-sm uppercase">إجمالي المنتجات</div>
          <div className="text-4xl font-black text-orange-600">{products.length}</div>
        </div>
      </div>
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-black mb-6">أحدث الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b text-gray-400 font-bold text-sm">
                <th className="pb-4">العميل</th>
                <th className="pb-4">المدينة</th>
                <th className="pb-4">التاريخ</th>
                <th className="pb-4">المبلغ</th>
                <th className="pb-4">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(-5).reverse().map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors group">
                  <td className="py-4 font-bold group-hover:text-emerald-600">{order.fullName}</td>
                  <td className="py-4 text-gray-500">{order.city}</td>
                  <td className="py-4 text-gray-400">{new Date(order.date).toLocaleDateString('ar-MA')}</td>
                  <td className="py-4 font-black text-emerald-600">{order.totalPrice.toLocaleString()} د.م.</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black">قيد الانتظار</span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-bold italic">لا توجد طلبات بعد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrdersList = ({ orders, setOrders }: { orders: Order[], setOrders: (o: Order[]) => void }) => {
  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      saveOrders(updated);
    }
  };
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-black">إدارة الطلبات</h1>
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b text-gray-400 font-bold text-sm">
                <th className="pb-4">المعرف</th>
                <th className="pb-4">العميل</th>
                <th className="pb-4">الهاتف</th>
                <th className="pb-4">المدينة</th>
                <th className="pb-4">المبلغ</th>
                <th className="pb-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-4 font-mono text-xs text-gray-400">{order.id}</td>
                  <td className="py-4 font-bold">{order.fullName}</td>
                  <td className="py-4 font-mono font-bold text-blue-600">{order.phone}</td>
                  <td className="py-4">{order.city}</td>
                  <td className="py-4 font-black text-emerald-600">{order.totalPrice.toLocaleString()} د.م.</td>
                  <td className="py-4">
                    <button onClick={() => handleDelete(order.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
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
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ 
    category: 'electronics',
    image: '' 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image) {
      alert("يرجى تحميل صورة للمنتج");
      return;
    }
    const productToAdd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name || 'منتج جديد',
      price: Number(newProduct.price) || 0,
      category: (newProduct.category as any) || 'electronics',
      image: newProduct.image,
      description: newProduct.description || ''
    };
    const updated = [...products, productToAdd];
    setProducts(updated);
    saveProducts(updated);
    setShowAdd(false);
    setNewProduct({ category: 'electronics', image: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">إدارة المنتجات</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-100"
        >
          <Plus size={20} /> إضافة منتج جديد
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-[32px] shadow-xl border-4 border-emerald-50 animate-in zoom-in-95 duration-300">
           <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload Area */}
              <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[32px] p-8 bg-gray-50/50 hover:bg-gray-50 hover:border-emerald-300 transition-all cursor-pointer relative group"
                   onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
                
                {newProduct.image ? (
                  <div className="relative w-full aspect-square max-w-[250px]">
                    <img src={newProduct.image} className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white" alt="Preview" />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewProduct(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <CloseIcon size={16} />
                    </button>
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <p className="text-white text-xs font-bold">تغيير الصورة</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mx-auto text-gray-400 group-hover:text-emerald-500 transition-colors">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="font-black text-gray-700">اضغط لتحميل صورة المنتج</p>
                      <p className="text-xs text-gray-400 mt-1">يُفضل أن تكون الصورة مربعة (1:1)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 mr-2">اسم المنتج</label>
                  <input required placeholder="مثال: هاتف سامسونج S24" className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 mr-2">السعر (د.م.)</label>
                  <input required type="number" placeholder="0.00" className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                    onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 mr-2">الفئة</label>
                  <select className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                    <option value="electronics">إلكترونيات</option>
                    <option value="home">منزل</option>
                    <option value="cars">سيارات</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-500 mr-2">وصف المنتج</label>
                <textarea rows={3} placeholder="تحدث عن مواصفات ومميزات المنتج..." className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4 border-t">
                <button type="submit" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex-grow">حفظ المنتج الجديد</button>
                <button type="button" onClick={() => {
                  setShowAdd(false);
                  setNewProduct({ category: 'electronics', image: '' });
                }} className="bg-gray-100 text-gray-500 px-10 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-6 relative group hover:shadow-lg transition-all">
            <img src={p.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="" />
            <div className="flex-grow overflow-hidden">
              <h4 className="font-black text-gray-800 truncate mb-1">{p.name}</h4>
              <p className="text-emerald-600 font-black text-lg">{p.price.toLocaleString()} د.م.</p>
              <div className="mt-2">
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 border px-3 py-1 rounded-full uppercase tracking-wider">{p.category}</span>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(p.id)}
              className="absolute top-4 left-4 p-2 text-red-300 hover:text-red-500 bg-red-50/0 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="md:col-span-3 text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="text-gray-300 mb-4"><Package size={80} className="mx-auto" /></div>
            <h3 className="text-xl font-bold text-gray-400">لا توجد منتجات حالياً، ابدأ بإضافة منتجك الأول!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsManager = ({ settings, setSettings }: { settings: AppSettings, setSettings: (s: AppSettings) => void }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    saveSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);
    if (btoa(currentPass) !== settings.adminPasswordHash) {
      setPassError("كلمة السر الحالية غير صحيحة");
      return;
    }
    if (newPass.length < 4) {
      setPassError("كلمة السر الجديدة قصيرة جداً");
      return;
    }
    const updatedSettings = { ...localSettings, adminPasswordHash: btoa(newPass) };
    setLocalSettings(updatedSettings);
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    setPassSuccess(true);
    setCurrentPass("");
    setNewPass("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-black">الإعدادات الفنية</h1>
      <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-8">
        <div className="flex items-center gap-4 text-emerald-600 border-b pb-4">
           <Analytics size={32} />
           <h2 className="text-2xl font-black">أكواد التتبع والبيكسل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Facebook Pixel ID</label>
            <input className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm"
              value={localSettings.fbPixelId} onChange={e => setLocalSettings({...localSettings, fbPixelId: e.target.value})} placeholder="123456789" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Google Analytics ID</label>
            <input className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm"
              value={localSettings.googleAnalyticsId} onChange={e => setLocalSettings({...localSettings, googleAnalyticsId: e.target.value})} placeholder="G-XXXXXXX" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">TikTok Pixel ID</label>
            <input className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm"
              value={localSettings.tiktokPixelId} onChange={e => setLocalSettings({...localSettings, tiktokPixelId: e.target.value})} placeholder="C-XXXXXXX" />
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-6">
        <div className="flex items-center gap-4 text-red-500 border-b pb-4">
           <ShieldAlert size={28} />
           <h2 className="text-xl font-black">إعدادات الأمان</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">كلمة المرور الحالية</label>
            <input required type="password" className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-red-500 outline-none font-bold"
              value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">كلمة المرور الجديدة</label>
            <input required type="password" className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="md:col-span-2 flex items-center justify-between">
            <div className="flex flex-col">
              {passError && <p className="text-red-500 text-sm font-bold mb-2">{passError}</p>}
              {passSuccess && <p className="text-emerald-600 text-sm font-bold mb-2 flex items-center gap-1"><CheckCircle size={16}/> تم تغيير كلمة السر بنجاح</p>}
            </div>
            <button type="submit" className="bg-gray-800 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-md">تحديث كلمة السر</button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-6">
          <div className="flex items-center gap-4 text-blue-600 border-b pb-4">
             <Database size={28} />
             <h2 className="text-xl font-black">الربط مع Google Sheets</h2>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">رابط الـ Webhook الخاص بـ Sheets</label>
            <input className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm"
              value={localSettings.googleSheetsUrl} onChange={e => setLocalSettings({...localSettings, googleSheetsUrl: e.target.value})} placeholder="https://script.google.com/..." />
            <p className="text-xs text-gray-400 mt-2 px-2">سيتم إرسال كافة تفاصيل الطلبات تلقائياً إلى ملف الإكسل الخاص بك.</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border space-y-6">
          <div className="flex items-center gap-4 text-orange-600 border-b pb-4">
             <Globe size={28} />
             <h2 className="text-xl font-black">إعدادات الدومين والـ NS</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">اسم النطاق (Domain)</label>
              <input className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm"
                value={localSettings.domainName} onChange={e => setLocalSettings({...localSettings, domainName: e.target.value})} placeholder="matjarberrima.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Name Servers</label>
              <textarea className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm h-24"
                value={localSettings.nameServers} onChange={e => setLocalSettings({...localSettings, nameServers: e.target.value})} placeholder="ns1.host.com&#10;ns2.host.com" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-8">
        <button onClick={handleSave} className={`px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl transition-all ${saved ? 'bg-emerald-100 text-emerald-700 scale-95' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1'}`}>
          {saved ? <span className="flex items-center gap-3"><CheckCircle size={28} /> تم الحفظ بنجاح</span> : 'حفظ كافة التغييرات'}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

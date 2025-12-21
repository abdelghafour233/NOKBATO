
import React, { useState, useRef } from 'react';
import { Product, Order, AppSettings, Category } from '../types';
import { saveProducts, saveOrders, saveSettings } from '../store';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Lock,
  Edit2,
  Upload,
  X as CloseIcon,
  CheckCircle,
  ShieldAlert,
  Database,
  Globe,
  BarChart,
  User,
  Phone,
  MapPin,
  Eye,
  Calendar,
  CreditCard
} from 'lucide-react';

interface DashboardPageProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const OrdersManager: React.FC<{ orders: Order[], products: Product[], setOrders: (orders: Order[]) => void }> = ({ orders, products, setOrders }) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

  const updateStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      saveOrders(updated);
    }
  };

  const handleEditOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const updated = orders.map(o => o.id === editingOrder.id ? editingOrder : o);
    setOrders(updated);
    saveOrders(updated);
    setEditingOrder(null);
  };

  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <h2 className="text-3xl font-black text-gray-900">إدارة الطلبات ({orders.length})</h2>
      
      {/* Preview Order Modal */}
      {previewOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[50px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <Eye className="text-blue-600" /> معاينة الطلب #{previewOrder.id}
                </h3>
                <p className="text-gray-400 text-sm font-bold mt-1">تاريخ الطلب: {new Date(previewOrder.date).toLocaleString('ar-MA')}</p>
              </div>
              <button onClick={() => setPreviewOrder(null)} className="p-3 hover:bg-white rounded-full transition-colors bg-gray-100 shadow-sm">
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              {/* Customer Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                  <div className="text-emerald-600 mb-1"><User size={18} /></div>
                  <div className="font-black text-emerald-900">{previewOrder.fullName}</div>
                  <div className="text-[10px] text-emerald-700 font-bold">الاسم الكامل</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                  <div className="text-blue-600 mb-1"><Phone size={18} /></div>
                  <div className="font-black text-blue-900" dir="ltr">{previewOrder.phone}</div>
                  <div className="text-[10px] text-blue-700 font-bold">رقم الهاتف</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
                  <div className="text-orange-600 mb-1"><MapPin size={18} /></div>
                  <div className="font-black text-orange-900">{previewOrder.city}</div>
                  <div className="text-[10px] text-orange-700 font-bold">المدينة</div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="text-xl font-black text-gray-800 border-r-4 border-emerald-500 pr-3">المنتجات المطلوبة</h4>
                <div className="bg-gray-50 rounded-[32px] p-2 space-y-2">
                  {previewOrder.items.map((item, idx) => {
                    const product = getProductDetails(item.productId);
                    return (
                      <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                        <img 
                          src={product?.image || 'https://images.unsplash.com/photo-1594732832278-abd644401426?q=80&w=200'} 
                          className="w-16 h-16 rounded-xl object-cover border" 
                          alt="product"
                        />
                        <div className="flex-grow">
                          <div className="font-black text-gray-900">{product?.name || 'منتج غير متوفر'}</div>
                          <div className="text-emerald-600 font-bold text-sm">{product?.price.toLocaleString() || 0} د.م.</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-gray-100 rounded-xl">
                          <div className="text-[10px] font-bold text-gray-400">الكمية</div>
                          <div className="font-black text-gray-900">x{item.quantity}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-900 text-white p-8 rounded-[32px] flex justify-between items-center shadow-2xl">
                <div>
                  <div className="text-emerald-400 font-bold text-sm">المجموع الكلي</div>
                  <div className="text-3xl font-black">{previewOrder.totalPrice.toLocaleString()} <span className="text-sm">درهم مغربي</span></div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <CreditCard className="text-emerald-400" size={20} />
                  <span className="font-bold text-sm">الدفع عند الاستلام</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t bg-gray-50 shrink-0">
               <button onClick={() => setPreviewOrder(null)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl">
                  إغلاق المعاينة
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <Edit2 className="text-emerald-600" /> تحرير بيانات الزبون
              </h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <CloseIcon size={24} />
              </button>
            </div>
            <form onSubmit={handleEditOrder} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                    placeholder="الاسم الكامل"
                    value={editingOrder.fullName}
                    onChange={e => setEditingOrder({...editingOrder, fullName: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    dir="ltr"
                    className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-right"
                    placeholder="رقم الهاتف"
                    value={editingOrder.phone}
                    onChange={e => setEditingOrder({...editingOrder, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                    placeholder="المدينة"
                    value={editingOrder.city}
                    onChange={e => setEditingOrder({...editingOrder, city: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-grow bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all">
                  حفظ التعديلات
                </button>
                <button type="button" onClick={() => setEditingOrder(null)} className="bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
          <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all group">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">#{order.id}</span>
                <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                  <Calendar size={12} /> {new Date(order.date).toLocaleDateString('ar-MA')}
                </span>
              </div>
              <h3 className="text-xl font-black">{order.fullName}</h3>
              <p className="text-emerald-600 font-bold">{order.phone} | {order.city}</p>
              <div className="text-sm text-gray-500 font-medium">
                {order.items.length} منتجات | الإجمالي: <span className="font-black text-gray-900">{order.totalPrice.toLocaleString()} د.م.</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                className={`p-3 rounded-xl font-bold border-2 outline-none transition-all ${
                  order.status === 'delivered' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                  order.status === 'shipped' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                  'border-orange-500 bg-orange-50 text-orange-700'
                }`}
              >
                <option value="pending">قيد الانتظار</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
              </select>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setPreviewOrder(order)}
                  className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                  title="معاينة محتوى الطلب"
                >
                  <Eye size={22} />
                </button>
                <button 
                  onClick={() => setEditingOrder(order)}
                  className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                  title="تعديل بيانات العميل"
                >
                  <Edit2 size={22} />
                </button>
                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="حذف الطلب"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xl">
            لا توجد طلبات حالياً
          </div>
        )}
      </div>
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: (products: Product[]) => void }> = ({ products, setProducts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'electronics',
    image: '',
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert('يرجى ملء الحقول الأساسية وتحميل صورة');
      return;
    }

    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p);
      setProducts(updated);
      saveProducts(updated);
      setEditingId(null);
    } else {
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        price: Number(formData.price),
        category: formData.category as Category,
        image: formData.image,
        description: formData.description || ''
      };
      const updated = [product, ...products];
      setProducts(updated);
      saveProducts(updated);
    }
    
    setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0, category: 'electronics', image: '', description: '' });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900">إدارة المنتجات</h2>
      </div>
      
      <form onSubmit={handleSubmit} className={`bg-white p-8 rounded-[40px] shadow-sm border-2 transition-all duration-500 ${editingId ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-100'} grid grid-cols-1 md:grid-cols-2 gap-8`}>
        <div className="col-span-full flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-black text-emerald-600">
            {editingId ? `تحرير: ${formData.name}` : 'إضافة منتج جديد للمتجر'}
          </h3>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 font-bold flex items-center gap-1 text-sm">
              <CloseIcon size={16} /> إلغاء التعديل
            </button>
          )}
        </div>

        <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[32px] p-8 bg-gray-50/50 hover:bg-white hover:border-emerald-300 transition-all cursor-pointer relative group"
             onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          
          {formData.image ? (
            <div className="relative w-full aspect-square max-w-[250px]">
              <img src={formData.image} className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white" alt="Preview" />
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

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">اسم المنتج</label>
            <input required placeholder="اسم المنتج..." className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">السعر (د.م.)</label>
            <input required type="number" placeholder="السعر..." className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 mr-2">الفئة</label>
            <select className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
              <option value="electronics">إلكترونيات</option>
              <option value="watches">ساعات</option>
              <option value="glasses">نظارات</option>
              <option value="home">منزل</option>
              <option value="cars">سيارات</option>
            </select>
          </div>
        </div>

        <div className="col-span-full space-y-2">
          <label className="text-sm font-bold text-gray-500 mr-2">وصف المنتج</label>
          <textarea className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold h-32"
            placeholder="اكتب وصفاً جذاباً للمنتج..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <button type="submit" className="col-span-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl">
          {editingId ? <><Edit2 size={24} /> تحديث المنتج الآن</> : <><Plus size={24} /> إضافة المنتج للمخزن</>}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className={`bg-white p-5 rounded-[32px] shadow-sm border transition-all group ${editingId === product.id ? 'border-emerald-500 scale-[1.02]' : 'border-gray-100 hover:shadow-lg'}`}>
            <div className="flex gap-4 mb-4">
              <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
              <div className="flex-grow overflow-hidden">
                <h4 className="font-black text-sm line-clamp-1">{product.name}</h4>
                <div className="text-emerald-600 font-black text-lg">{product.price.toLocaleString()} د.م.</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-1 rounded-md inline-block">{product.category}</div>
              </div>
            </div>
            <div className="flex border-t pt-4 gap-2">
              <button 
                onClick={() => startEdit(product)}
                className="flex-grow flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all"
              >
                <Edit2 size={16} /> تعديل
              </button>
              <button 
                onClick={() => deleteProduct(product.id)}
                className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsManager: React.FC<{ settings: AppSettings, setSettings: (settings: AppSettings) => void }> = ({ settings, setSettings }) => {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(form);
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-gray-900">إعدادات المتجر الفنية</h2>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-emerald-600 border-b pb-4">
             <BarChart size={28} />
             <h3 className="text-xl font-black">أكواد التتبع والبيكسل</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Facebook Pixel ID</label>
              <input className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                value={form.fbPixelId} onChange={e => setForm({...form, fbPixelId: e.target.value})} placeholder="123456789" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">TikTok Pixel ID</label>
              <input className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                value={form.tiktokPixelId} onChange={e => setForm({...form, tiktokPixelId: e.target.value})} placeholder="C-XXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Google Analytics ID</label>
              <input className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                value={form.googleAnalyticsId} onChange={e => setForm({...form, googleAnalyticsId: e.target.value})} placeholder="G-XXXX" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-6">
              <div className="flex items-center gap-4 text-blue-600 border-b pb-4">
                 <Database size={28} />
                 <h3 className="text-xl font-black">الربط السحابي</h3>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">Google Sheets Webhook URL</label>
                <input className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-xs"
                  value={form.googleSheetsUrl} onChange={e => setForm({...form, googleSheetsUrl: e.target.value})} placeholder="https://script.google.com/..." />
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4 text-orange-600 border-b pb-4">
                 <Globe size={28} />
                 <h3 className="text-xl font-black">إعدادات النطاق</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input placeholder="example.com" className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                  value={form.domainName} onChange={e => setForm({...form, domainName: e.target.value})} />
                <input placeholder="ns1.hover.com, ns2.hover.com" className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                  value={form.nameServers} onChange={e => setForm({...form, nameServers: e.target.value})} />
              </div>
           </div>
        </div>

        <button className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-900 text-white hover:bg-black'}`}>
          {saved ? <><CheckCircle size={24} /> تم الحفظ بنجاح</> : <><Save size={24} /> حفظ كافة التغييرات</>}
        </button>
      </form>
    </div>
  );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  products, orders, settings, setProducts, setOrders, setSettings 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (btoa(password) === settings.adminPasswordHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  React.useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-black mb-2 text-gray-900">إدارة متجر بريمة</h2>
          <p className="text-gray-400 font-bold text-sm">يرجى إدخال كلمة المرور للمتابعة</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور"
                 className="w-full p-5 rounded-2xl border-2 border-gray-100 outline-none focus:border-emerald-500 font-bold bg-gray-50 focus:bg-white transition-all text-center text-2xl tracking-widest" />
          <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl">تسجيل الدخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-80 bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 space-y-3 sticky top-24 h-fit">
        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between p-5 rounded-3xl font-black transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-4"><ShoppingBag size={24} /> الطلبات</div>
          {orders.filter(o => o.status === 'pending').length > 0 && activeTab !== 'orders' && <span className="bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full animate-pulse">{orders.filter(o => o.status === 'pending').length}</span>}
        </button>
        <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${activeTab === 'products' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}>
          <Package size={24} /> المنتجات
        </button>
        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}>
          <Settings size={24} /> الإعدادات
        </button>
        <div className="pt-6 mt-6 border-t">
          <button onClick={() => {sessionStorage.removeItem('admin_auth'); setIsAuthenticated(false);}} className="w-full flex items-center gap-4 p-5 rounded-3xl font-black text-red-500 hover:bg-red-50 transition-all"><LogOut size={24} /> خروج آمن</button>
        </div>
      </div>
      <div className="flex-grow bg-gray-50/30 p-4 md:p-8 rounded-[50px] min-h-[600px]">
        {activeTab === 'orders' && <OrdersManager orders={orders} products={products} setOrders={setOrders} />}
        {activeTab === 'products' && <ProductsManager products={products} setProducts={setProducts} />}
        {activeTab === 'settings' && <SettingsManager settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
};

export default DashboardPage;

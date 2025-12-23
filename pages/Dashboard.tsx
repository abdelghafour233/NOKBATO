
import React, { useState, useRef } from 'react';
import { Product, Order, AppSettings, Category } from '../types';
import { saveProducts, saveOrders, saveSettings } from '../store';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Save, 
  Lock,
  Edit2,
  Upload,
  X as CloseIcon,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Calendar,
  CreditCard,
  Facebook,
  Play,
  Share2,
  Table,
  Globe,
  BarChart
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
      
      {/* Preview Modal */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                  <User className="text-emerald-600 mb-1" size={18} />
                  <div className="font-black text-emerald-900">{previewOrder.fullName}</div>
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">الاسم</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                  <Phone className="text-blue-600 mb-1" size={18} />
                  <div className="font-black text-blue-900" dir="ltr">{previewOrder.phone}</div>
                  <div className="text-[10px] text-blue-700 font-bold uppercase">الهاتف</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
                  <MapPin className="text-orange-600 mb-1" size={18} />
                  <div className="font-black text-orange-900">{previewOrder.city}</div>
                  <div className="text-[10px] text-orange-700 font-bold uppercase">المدينة</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-black text-gray-800 border-r-4 border-emerald-500 pr-3">المنتجات</h4>
                <div className="bg-gray-50 rounded-[32px] p-2 space-y-2">
                  {previewOrder.items.map((item, idx) => {
                    const product = getProductDetails(item.productId);
                    return (
                      <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                        <img src={product?.image} className="w-16 h-16 rounded-xl object-cover border" alt="p" />
                        <div className="flex-grow">
                          <div className="font-black text-gray-900">{product?.name || 'منتج محذوف'}</div>
                          <div className="text-emerald-600 font-bold text-sm">{product?.price.toLocaleString() || 0} د.م.</div>
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-xl font-black">x{item.quantity}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-900 text-white p-8 rounded-[32px] flex justify-between items-center shadow-2xl">
                <div>
                  <div className="text-emerald-400 font-bold text-sm">المجموع الكلي</div>
                  <div className="text-3xl font-black">{previewOrder.totalPrice.toLocaleString()} د.م.</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <CreditCard className="text-emerald-400" size={20} />
                  <span className="font-bold text-sm">COD</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t bg-gray-50 shrink-0">
               <button onClick={() => setPreviewOrder(null)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-2xl font-black text-gray-800">تحرير بيانات الزبون</h3>
              <button onClick={() => setEditingOrder(null)}><CloseIcon size={24} /></button>
            </div>
            <form onSubmit={handleEditOrder} className="p-8 space-y-6">
              <input required className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold"
                value={editingOrder.fullName} onChange={e => setEditingOrder({...editingOrder, fullName: e.target.value})} placeholder="الاسم" />
              <input required className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold"
                value={editingOrder.phone} onChange={e => setEditingOrder({...editingOrder, phone: e.target.value})} placeholder="الهاتف" />
              <input required className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold"
                value={editingOrder.city} onChange={e => setEditingOrder({...editingOrder, city: e.target.value})} placeholder="المدينة" />
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl">حفظ</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
          <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-500">#{order.id}</span>
                <Calendar size={12} /> {new Date(order.date).toLocaleDateString('ar-MA')}
              </div>
              <h3 className="text-xl font-black">{order.fullName}</h3>
              <p className="text-emerald-600 font-bold">{order.phone} | {order.city}</p>
              <div className="text-sm font-bold text-gray-900">{order.totalPrice.toLocaleString()} د.م.</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                className={`p-3 rounded-xl font-bold border-2 outline-none ${
                  order.status === 'delivered' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                  order.status === 'shipped' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-orange-500 bg-orange-50 text-orange-700'
                }`}>
                <option value="pending">قيد الانتظار</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
              </select>
              
              <div className="flex gap-2">
                <button onClick={() => setPreviewOrder(order)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl"><Eye size={22} /></button>
                <button onClick={() => setEditingOrder(order)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl"><Edit2 size={22} /></button>
                <button onClick={() => deleteOrder(order.id)} className="p-3 text-red-300 hover:text-red-500 rounded-xl"><Trash2 size={22} /></button>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">لا توجد طلبات</div>}
      </div>
    </div>
  );
};

const ProductsManager: React.FC<{ products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>> }> = ({ products, setProducts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'electronics',
    image: '',
    images: [],
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    files.forEach((file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        alert("إحدى الصور كبيرة جداً (أقصى حد 2 ميجابايت)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => {
          const newImages = [...(prev.images || []), result];
          return {
            ...prev,
            images: newImages,
            image: prev.image || result
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      const removed = newImages.splice(index, 1)[0];
      let newMain = prev.image;
      if (removed === prev.image) {
        newMain = newImages[0] || '';
      }
      return { ...prev, images: newImages, image: newMain };
    });
  };

  const setAsMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert('يرجى ملء البيانات وتحميل صورة واحدة على الأقل');
      return;
    }

    if (editingId) {
      // 1. حساب القائمة المحدثة
      const updatedList = products.map(p => 
        p.id === editingId ? { ...p, ...formData } as Product : p
      );
      
      // 2. تحديث الحالة في App.tsx
      setProducts(updatedList);
      
      // 3. الحفظ الفوري في LocalStorage
      saveProducts(updatedList);
      
      setSuccessMsg('تم تحديث المنتج بنجاح!');
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || '',
        price: Number(formData.price),
        category: (formData.category as Category) || 'electronics',
        image: formData.image || '',
        images: formData.images || [],
        description: formData.description || ''
      };
      
      const newList = [newProduct, ...products];
      setProducts(newList);
      saveProducts(newList);
      setSuccessMsg('تمت إضافة المنتج بنجاح!');
    }
    
    // إعادة تعيين النموذج
    setFormData({ name: '', price: 0, category: 'electronics', image: '', images: [], description: '' });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      images: product.images || [],
      description: product.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0, category: 'electronics', image: '', images: [], description: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900">إدارة المنتجات والمعرض</h2>
        {successMsg && (
          <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-black animate-bounce flex items-center gap-2">
            <CheckCircle size={20} /> {successMsg}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className={`bg-white p-8 rounded-[40px] shadow-sm border-2 transition-all ${editingId ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-100'} grid grid-cols-1 md:grid-cols-2 gap-8`}>
        <div className="col-span-full flex justify-between border-b pb-4">
          <h3 className="text-xl font-black text-emerald-600">{editingId ? `تعديل المنتج: ${formData.name}` : 'إضافة منتج جديد'}</h3>
          {editingId && <button type="button" onClick={cancelEdit} className="text-red-500 font-bold text-sm flex items-center gap-1"><CloseIcon size={16} /> إلغاء التعديل</button>}
        </div>

        <div className="md:col-span-1 space-y-4">
          <label className="text-sm font-black text-gray-500">صور المنتج</label>
          <div onClick={() => fileInputRef.current?.click()} 
               className="border-4 border-dashed border-gray-100 rounded-[32px] p-8 bg-gray-50/50 hover:bg-white hover:border-emerald-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImagesUpload} />
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mb-4 text-gray-400"><Upload size={32} /></div>
            <p className="font-black text-gray-700">اضغط لرفع الصور</p>
          </div>

          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${formData.image === img ? 'border-emerald-500 shadow-lg scale-105' : 'border-gray-100'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="prev" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                    <button type="button" onClick={() => setAsMainImage(img)} className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full font-bold">رئيسية</button>
                    <button type="button" onClick={() => removeGalleryImage(idx)} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full font-bold">حذف</button>
                  </div>
                  {formData.image === img && <div className="absolute top-1 right-1 bg-emerald-500 text-white p-1 rounded-full"><CheckCircle size={10} /></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">اسم المنتج</label>
            <input required placeholder="اسم المنتج..." className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 outline-none font-bold focus:border-emerald-500"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">السعر (د.م.)</label>
            <input required type="number" placeholder="السعر..." className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 outline-none font-bold focus:border-emerald-500"
              value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">الفئة</label>
            <select className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 outline-none font-bold"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
              <option value="electronics">إلكترونيات</option>
              <option value="watches">ساعات</option>
              <option value="glasses">نظارات</option>
              <option value="home">منزل</option>
              <option value="cars">سيارات</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">وصف المنتج</label>
            <textarea className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 outline-none font-bold h-24"
              placeholder="وصف المنتج..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 transition-all ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}>
            {editingId ? <><Save size={24} /> حفظ التعديلات</> : <><Plus size={24} /> إضافة للمتجر</>}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className={`bg-white p-5 rounded-[32px] border transition-all ${editingId === product.id ? 'border-emerald-500 scale-95 opacity-50' : 'border-gray-100'} flex flex-col gap-4 group`}>
            <div className="flex gap-4">
              <div className="relative">
                <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" alt="p" />
                {product.images && product.images.length > 1 && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">+{product.images.length - 1}</div>
                )}
              </div>
              <div className="flex-grow">
                <h4 className="font-black text-sm line-clamp-1">{product.name}</h4>
                <div className="text-emerald-600 font-black text-lg">{product.price.toLocaleString()} د.م.</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">{product.category}</div>
              </div>
            </div>
            <div className="flex border-t pt-4 gap-2">
              <button onClick={() => startEdit(product)} className="flex-grow flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"><Edit2 size={16} /> تعديل</button>
              <button onClick={() => {if(window.confirm('هل أنت متأكد من حذف المنتج؟')){const u = products.filter(p=>p.id!==product.id); setProducts(u); saveProducts(u);}}} className="p-3 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
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
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-gray-900">إعدادات المتجر والتتبع</h2>
        {saved && (
          <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-black flex items-center gap-2 animate-bounce">
            <CheckCircle size={20} /> تم حفظ جميع التغييرات
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-20">
        
        {/* Marketing Pixels Section */}
        <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Share2 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">أدوات التتبع والتسويق</h3>
              <p className="text-gray-400 font-bold text-sm">أدخل معرفات البيكسل لتتبع التحويلات (Facebook, TikTok, GA)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-blue-600 font-black">
                <Facebook size={20} /> Facebook Pixel ID
              </label>
              <input 
                className="w-full p-5 rounded-3xl border-2 border-blue-50 bg-blue-50/20 text-blue-900 font-black focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-blue-200"
                value={form.fbPixelId} 
                onChange={e => setForm({...form, fbPixelId: e.target.value})} 
                placeholder="أدخل المعرف (مثلاً: 123456789)" 
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-pink-500 font-black">
                <Play size={20} className="fill-current" /> TikTok Pixel ID
              </label>
              <input 
                className="w-full p-5 rounded-3xl border-2 border-pink-50 bg-pink-50/20 text-pink-900 font-black focus:border-pink-500 focus:bg-white outline-none transition-all placeholder:text-pink-200"
                value={form.tiktokPixelId} 
                onChange={e => setForm({...form, tiktokPixelId: e.target.value})} 
                placeholder="أدخل المعرف (مثلاً: C6...)" 
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="flex items-center gap-2 text-orange-500 font-black">
                <BarChart size={20} /> Google Analytics ID (GA4)
              </label>
              <input 
                className="w-full p-5 rounded-3xl border-2 border-orange-50 bg-orange-50/20 text-orange-900 font-black focus:border-orange-500 focus:bg-white outline-none transition-all placeholder:text-orange-200"
                value={form.googleAnalyticsId} 
                onChange={e => setForm({...form, googleAnalyticsId: e.target.value})} 
                placeholder="أدخل المعرف (G-XXXXXXXXXX)" 
              />
            </div>
          </div>
        </div>

        {/* Google Sheets Integration */}
        <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Table size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">ربط Google Sheets</h3>
              <p className="text-gray-400 font-bold text-sm">إرسال الطلبيات تلقائياً إلى ملف إكسل خاص بك</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-emerald-600 font-black">Google Sheets Webhook URL</label>
            <input 
              className="w-full p-5 rounded-3xl border-2 border-emerald-50 bg-emerald-50/20 text-emerald-900 font-black focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-emerald-200"
              value={form.googleSheetsUrl} 
              onChange={e => setForm({...form, googleSheetsUrl: e.target.value})} 
              placeholder="https://script.google.com/macros/s/..." 
            />
          </div>
        </div>

        {/* Domain Settings */}
        <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Globe size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">إعدادات النطاق (Domain)</h3>
              <p className="text-gray-400 font-bold text-sm">تهيئة اسم المتجر وسيرفرات الأسماء</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-indigo-600 font-black">اسم النطاق</label>
              <input 
                className="w-full p-5 rounded-3xl border-2 border-indigo-50 bg-indigo-50/20 text-indigo-900 font-black focus:border-indigo-500 focus:bg-white outline-none transition-all"
                value={form.domainName} 
                onChange={e => setForm({...form, domainName: e.target.value})} 
                placeholder="example.com" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-indigo-600 font-black">سيرفرات الأسماء (Name Servers)</label>
              <input 
                className="w-full p-5 rounded-3xl border-2 border-indigo-50 bg-indigo-50/20 text-indigo-900 font-black focus:border-indigo-500 focus:bg-white outline-none transition-all"
                value={form.nameServers} 
                onChange={e => setForm({...form, nameServers: e.target.value})} 
                placeholder="ns1.example.com, ns2.example.com" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-8 rounded-[35px] font-black text-2xl transition-all shadow-2xl bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4"
        >
          <Save size={32} /> {saved ? 'تم الحفظ بنجاح!' : 'حفظ جميع الإعدادات'}
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
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (btoa(password) === settings.adminPasswordHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else { alert('كلمة المرور غير صحيحة'); }
  };

  React.useEffect(() => { if (sessionStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true); }, []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">إدارة ستور حلال</h2>
          <p className="text-gray-400 font-bold text-sm mt-1">يُرجى إدخال كلمة المرور للمتابعة</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="كلمة المرور" 
              className="w-full p-5 pr-5 pl-14 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none text-center text-2xl font-black transition-all shadow-sm group-hover:border-emerald-200" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-600 transition-colors"
              title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all">
            دخول للوحة التحكم
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-80 bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 space-y-3 h-fit sticky top-24">
        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between p-5 rounded-3xl font-black transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50'}`}><div className="flex items-center gap-4"><ShoppingBag size={24} /> الطلبات</div></button>
        <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${activeTab === 'products' ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50'}`}><Package size={24} /> المنتجات والمعرض</button>
        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50'}`}><Settings size={24} /> الإعدادات</button>
        <button onClick={() => {sessionStorage.removeItem('admin_auth'); setIsAuthenticated(false);}} className="w-full p-5 text-red-500 font-black hover:bg-red-50 rounded-3xl transition-all">خروج</button>
      </div>
      <div className="flex-grow bg-gray-50/30 p-4 md:p-8 rounded-[50px] min-h-[800px]">
        {activeTab === 'orders' && <OrdersManager orders={orders} products={products} setOrders={setOrders} />}
        {activeTab === 'products' && <ProductsManager products={products} setProducts={setProducts} />}
        {activeTab === 'settings' && <SettingsManager settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
};

export default DashboardPage;

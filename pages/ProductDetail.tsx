
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
import { trackFBEvent } from '../App.tsx';
import { CheckCircle, Truck, User, Phone, MapPin, Zap, Star, ShieldCheck } from 'lucide-react';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const CITIES = ["الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أغادير", "مكناس", "وجدة", "القنيطرة", "تطوان"];

const ProductDetail: React.FC<ProductDetailProps> = ({ products, setOrders }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', city: '', phone: '' });

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      trackFBEvent('ViewContent', { content_name: product.name, value: product.price, currency: 'MAD' });
    }
  }, [product]);

  if (!product) return <div className="py-20 text-center font-black">المنتج غير متوفر</div>;

  const handleQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.city || !formData.phone) return;
    
    setIsSubmitting(true);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      items: [{ productId: product.id, quantity: 1 }],
      totalPrice: product.price,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    const updated = [...getStoredOrders(), newOrder];
    saveOrders(updated);
    setOrders(updated);
    trackFBEvent('Purchase', { value: product.price, currency: 'MAD', content_name: product.name });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="bg-white p-12 rounded-[50px] shadow-xl border-t-8 border-brand-primary">
          <div className="w-20 h-20 bg-emerald-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40}/></div>
          <h2 className="text-3xl font-black mb-4">طلبك وصل!</h2>
          <p className="text-gray-500 font-bold mb-10">سنتصل بك في أقرب وقت لتأكيد الشحن إلى مدينة {formData.city}.</p>
          <button onClick={() => navigate('/')} className="w-full bg-brand-slate text-white py-5 rounded-2xl font-black text-xl hover:bg-brand-primary transition-all">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12">
      <div className="bg-white rounded-[40px] border p-4 shadow-sm flex items-center justify-center aspect-square">
        <img src={product.image} className="max-h-full object-contain rounded-3xl" alt={product.name} />
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="bg-emerald-50 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-emerald-100"><ShieldCheck size={12}/> أصلي 100%</span>
            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-amber-100"><Star size={12} fill="currentColor"/> موصى به</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-brand-slate leading-tight">{product.name}</h1>
          <div className="flex items-center gap-6">
            <span className="text-4xl font-black text-brand-primary">{product.price} <span className="text-sm">د.م</span></span>
            <span className="text-xl text-gray-300 font-bold line-through">{(product.price * 1.3).toFixed(0)} د.م</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-2xl border-2 border-brand-primary/5 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black">اطلب الآن - الدفع عند الاستلام</h3>
            <p className="text-gray-400 font-bold text-xs">التوصيل مجاني لكافة المدن</p>
          </div>
          <form onSubmit={handleQuickOrder} className="space-y-4">
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required type="text" placeholder="الاسم الكامل" className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all" value={formData.fullName} onChange={e=>setFormData({...formData, fullName:e.target.value})} />
            </div>
            <div className="relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <select required className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-brand-primary outline-none font-bold appearance-none" value={formData.city} onChange={e=>setFormData({...formData, city:e.target.value})}>
                <option value="" disabled>اختر مدينتك</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required type="tel" dir="ltr" placeholder="رقم الهاتف" className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-brand-primary outline-none font-bold text-right" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-6 rounded-3xl bg-brand-primary text-white font-black text-2xl shadow-xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 active:scale-95">
              {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الشراء'} <Zap fill="currentColor" size={24}/>
            </button>
          </form>
          <div className="flex justify-center gap-6 text-[10px] font-black text-gray-400 uppercase">
            <div className="flex items-center gap-1"><Truck size={14}/> شحن مجاني</div>
            <div className="flex items-center gap-1"><ShieldCheck size={14}/> ضمان الجودة</div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Zap className="text-brand-primary"/> مميزات المنتج</h2>
          <p className="text-gray-500 font-bold leading-relaxed whitespace-pre-wrap text-lg">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

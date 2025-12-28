
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
import { 
  CheckCircle, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  Zap, 
  FileText 
} from 'lucide-react';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أغادير", "مكناس", 
  "وجدة", "القنيطرة", "تطوان", "تمارة", "سلا", "آسفي", "العيون", 
  "المحمدية", "بني ملال", "الجديدة", "تازة", "الناظور", "سطات", 
  "خريبكة", "القصر الكبير", "العرائش", "الخميسات", "تارودانت"
];

const ProductDetail: React.FC<ProductDetailProps> = ({ products, setOrders }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', city: '', phone: '' });

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) return <div className="py-24 text-center font-black text-gray-300">المنتج غير متوفر حالياً</div>;

  const handleOrder = (e: React.FormEvent) => {
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

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center animate-in zoom-in">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border-t-8 border-brand-primary">
          <div className="w-20 h-20 bg-emerald-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black mb-4">شكراً على طلبك!</h2>
          <p className="text-gray-500 text-lg mb-10 font-bold">
            لقد تم استلام طلبك بنجاح. سيتصل بك فريقنا قريباً لتأكيد الشحن إلى مدينة <span className="text-brand-primary">{formData.city}</span>.
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-brand-slate text-white py-5 rounded-2xl font-black text-xl hover:bg-brand-primary transition-all">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Gallery Section */}
        <section className="lg:col-span-7">
          <div className="bg-white rounded-[40px] overflow-hidden border p-4 shadow-sm group">
            <img src={activeImage} alt={product.name} className="w-full object-contain aspect-square transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
             {[product.image, ...(product.images || [])].map((img, i) => (
               <button key={i} onClick={() => setActiveImage(img)} className={`w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden shrink-0 ${activeImage === img ? 'border-brand-primary p-1 shadow-md' : 'border-transparent opacity-60'}`}>
                 <img src={img} className="w-full h-full object-cover rounded-xl" />
               </button>
             ))}
          </div>
        </section>

        {/* Action & Info Section */}
        <section className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className="bg-emerald-50 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-100"><ShieldCheck size={12}/> أصلي 100%</span>
              <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-100"><Star size={12} fill="currentColor"/> الأعلى مبيعاً</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-brand-slate leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6">
              <span className="text-4xl md:text-5xl font-black text-brand-primary">{product.price.toLocaleString()} <span className="text-sm">د.م</span></span>
              <span className="text-xl text-gray-300 font-bold line-through">{(product.price * 1.3).toLocaleString()} د.م</span>
            </div>
          </div>

          {/* Quick Order Form - نموذج الطلب السريع */}
          <div className="bg-white p-8 md:p-10 rounded-[45px] shadow-2xl border-2 border-brand-primary/5 space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-brand-slate">أدخل معلوماتك للطلب</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">التوصيل مجاني والدفع عند الاستلام</p>
            </div>

            <form onSubmit={handleOrder} className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required type="text" placeholder="الاسم الكامل" className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                <select required className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all appearance-none cursor-pointer" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                  <option value="" disabled>اختر مدينتك</option>
                  {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
              </div>

              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required type="tel" dir="ltr" placeholder="رقم الهاتف" className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all text-right" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-7 rounded-[30px] text-white font-black text-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-400' : 'bg-brand-primary hover:bg-brand-secondary active:scale-95 shadow-brand-primary/20'}`}>
                {isSubmitting ? 'جاري إرسال الطلب...' : 'اشتري الآن'} <Zap fill="currentColor" size={24}/>
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-6 pt-2">
               <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Truck size={16} className="text-brand-primary"/> شحن مجاني</div>
               <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><ShieldCheck size={16} className="text-brand-primary"/> دفع آمن</div>
            </div>
          </div>
        </section>
      </div>

      {/* Description Section */}
      <section className="bg-white p-10 md:p-16 rounded-[60px] border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-gray-50 text-brand-primary rounded-3xl">
            <FileText size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-brand-slate">تفاصيل ومميزات المنتج</h2>
        </div>
        <div className="text-gray-500 font-bold leading-relaxed whitespace-pre-wrap text-xl md:text-2xl">
          {product.description}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

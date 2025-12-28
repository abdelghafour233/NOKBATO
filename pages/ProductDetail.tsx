
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
import { trackFBEvent } from '../App.tsx';
import { 
  CheckCircle, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  Copy, 
  Check, 
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

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart, setOrders }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({ fullName: '', city: '', phone: '' });

  const productUrl = window.location.href;

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      document.title = `${product.name} | ستور بريمة`;
      window.scrollTo(0, 0);
      trackFBEvent('ViewContent', { content_name: product.name, value: product.price, currency: 'MAD' });
    }
  }, [product, id]);

  if (!product) return <div className="py-24 text-center font-black text-2xl text-slate-400">المنتج غير متوفر</div>;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDirectOrder = (e: React.FormEvent) => {
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
    
    const currentOrders = getStoredOrders();
    const updatedOrders = [...currentOrders, newOrder];
    saveOrders(updatedOrders);
    setOrders(updatedOrders);

    trackFBEvent('Purchase', { value: product.price, currency: 'MAD', content_name: product.name });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const allImages = [product.image, ...(product.images || [])];

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border-t-8 border-brand-primary">
          <div className="w-20 h-20 bg-emerald-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900">شكراً على طلبك!</h2>
          <p className="text-slate-500 text-lg mb-10 font-bold">
            سيتصل بك فريقنا قريباً لتأكيد الشحن إلى مدينة <span className="text-brand-primary">{formData.city}</span>.
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">
            العودة للمتجر <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Modern Gallery */}
        <section className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 relative group">
            <img src={activeImage} alt={product.name} className="w-full object-contain aspect-square" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-primary scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="gallery" />
              </button>
            ))}
          </div>
        </section>

        {/* Product Info & Quick Order Form */}
        <section className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-50 text-brand-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-100 flex items-center gap-1"><ShieldCheck size={12}/> أصلي 100%</span>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-orange-100 flex items-center gap-1"><Zap size={12}/> عرض محدود</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl font-black text-brand-primary">{product.price.toLocaleString()} <span className="text-xs">د.م.</span></span>
              <span className="text-xl text-slate-300 font-bold line-through">{(product.price * 1.4).toLocaleString()} د.م.</span>
            </div>
          </div>

          {/* Quick Buy Card */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border-2 border-brand-primary/10 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">اطلب الآن</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">توصيل مجاني لجميع المدن</p>
            </div>

            <form onSubmit={handleDirectOrder} className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="text" placeholder="الاسم الكامل" className="w-full p-5 pr-12 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all text-slate-900" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 z-10" size={18} />
                <select required className="w-full p-5 pr-12 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all appearance-none cursor-pointer text-slate-900" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                  <option value="" disabled>اختر المدينة</option>
                  {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>

              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="tel" dir="ltr" placeholder="رقم الهاتف" className="w-full p-5 pr-12 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-primary outline-none font-bold transition-all text-right text-slate-900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-6 rounded-2xl text-white font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400' : 'bg-brand-primary hover:bg-brand-secondary active:scale-95 shadow-brand-primary/20'}`}>
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب السريع'} <Zap fill="currentColor" size={20}/>
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-50">
               <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Truck size={14}/> شحن مجاني</div>
               <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={14}/> دفع آمن</div>
            </div>
          </div>
        </section>
      </div>

      {/* Modern Description Area */}
      <section className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-slate-50 text-brand-primary rounded-2xl">
            <FileText size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">مميزات المنتج</h2>
        </div>
        <div className="text-slate-500 font-bold leading-relaxed whitespace-pre-wrap text-lg md:text-xl">
          {product.description}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

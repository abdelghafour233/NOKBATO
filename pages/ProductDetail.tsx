
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
  Facebook, 
  Twitter, 
  Instagram, 
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

  if (!product) return <div className="py-24 text-center font-black text-2xl text-slate-500">المنتج غير متوفر</div>;

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
        <div className="bg-slate-900 p-12 rounded-[50px] shadow-2xl border-t-8 border-brand-primary">
          <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle size={56} />
          </div>
          <h2 className="text-4xl font-black mb-4 text-white">تم استلام طلبك!</h2>
          <p className="text-slate-400 text-xl mb-10 font-bold leading-relaxed">
            شكراً <span className="text-brand-primary">{formData.fullName}</span>. سيتصل بك فريقنا قريباً لتأكيد الشحن إلى <span className="text-brand-primary">{formData.city}</span>.
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-brand-primary text-white py-6 rounded-2xl font-black text-2xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-3">
            متابعة التسوق <ArrowRight size={28} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        
        {/* Gallery */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-[50px] overflow-hidden shadow-2xl border border-white/5 relative group">
            <img src={activeImage} alt={product.name} className="w-full object-contain aspect-square transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-brand-primary scale-105 shadow-xl' : 'border-slate-800 opacity-50 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="gallery" />
              </button>
            ))}
          </div>
        </section>

        {/* Product Info & Order Form */}
        <section className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={14}/> منتج أصلي</span>
              <span className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"><Star size={14} fill="currentColor"/> 4.9 تقييم</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl md:text-6xl font-black text-brand-primary">{product.price.toLocaleString()} <span className="text-sm">د.م.</span></span>
              <span className="text-2xl text-slate-600 font-bold line-through">{(product.price * 1.35).toLocaleString()} د.م.</span>
            </div>
          </div>

          {/* Social Share */}
          <div className="bg-slate-900/50 p-6 rounded-[35px] border border-white/5">
             <span className="block text-[10px] font-black text-slate-500 mb-5 uppercase tracking-widest text-center">شارك هذا المنتج المذهل:</span>
             <div className="flex flex-wrap gap-4 justify-center">
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' - ' + productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform"><MessageCircle size={28}/></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform"><Facebook size={28}/></a>
                <button onClick={handleCopyLink} className={`w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-all ${copied ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {copied ? <Check size={28} /> : <Copy size={28} />}
                </button>
             </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-slate-900 p-8 md:p-12 rounded-[50px] shadow-2xl border-t-8 border-brand-primary space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">اطلب الآن</h2>
              <p className="text-slate-500 font-bold text-sm">التوصيل مجاني والدفع عند الاستلام</p>
            </div>

            <form onSubmit={handleDirectOrder} className="space-y-4">
              <div className="relative group">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-primary" size={20} />
                <input required type="text" placeholder="الاسم الكامل" className="w-full p-6 pr-14 rounded-2xl border-2 border-slate-800 bg-slate-800/50 text-white focus:bg-slate-800 focus:border-brand-primary outline-none font-bold transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              <div className="relative group">
                <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-primary z-10" size={20} />
                <select required className="w-full p-6 pr-14 rounded-2xl border-2 border-slate-800 bg-slate-800/50 text-white focus:bg-slate-800 focus:border-brand-primary outline-none font-bold transition-all appearance-none cursor-pointer" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                  <option value="" disabled>اختر مدينتك</option>
                  {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
              </div>

              <div className="relative group">
                <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-primary" size={20} />
                <input required type="tel" dir="ltr" placeholder="رقم الهاتف" className="w-full p-6 pr-14 rounded-2xl border-2 border-slate-800 bg-slate-800/50 text-white focus:bg-slate-800 focus:border-brand-primary outline-none font-bold transition-all text-right" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-8 rounded-3xl text-white font-black text-2xl shadow-[0_20px_40px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-4 ${isSubmitting ? 'bg-slate-600' : 'bg-brand-primary hover:bg-brand-secondary active:scale-95'}`}>
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب الآن'} <Zap fill="currentColor" size={24}/>
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Description */}
      <section className="bg-slate-900/50 p-10 md:p-16 rounded-[60px] border border-white/5">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-brand-primary/10 text-brand-primary rounded-3xl">
            <FileText size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white">تفاصيل المنتج</h2>
        </div>
        <div className="prose prose-invert max-w-none text-slate-400 font-bold leading-relaxed whitespace-pre-wrap text-xl">
          {product.description}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

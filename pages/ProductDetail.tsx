
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
import { trackFBEvent } from '../App.tsx';
import { 
  ShoppingCart, 
  Heart, 
  CheckCircle, 
  Truck, 
  RefreshCcw, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  Star,
  ShieldCheck,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Award,
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

const MOCK_REVIEWS = [
  { name: "أحمد المراكشي", city: "مراكش", comment: "منتج رائع جداً، الجودة تفوق التوقعات. التوصيل كان سريعاً والتعامل احترافي.", rating: 5, date: "قبل يومين" },
  { name: "فاطمة الزهراء", city: "الرباط", comment: "شكراً ستور بريمة، تعامل راقي ومنتجات أصلية. أنصح الجميع بالتعامل معهم.", rating: 5, date: "قبل 4 أيام" },
  { name: "ياسين برادة", city: "طنجة", comment: "هذه المرة الثانية التي أطلب فيها من المتجر، دائماً في الموعد والمنتجات قمة في الأناقة.", rating: 5, date: "قبل أسبوع" },
];

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart, setOrders }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: ''
  });

  const shareUrl = window.location.origin;
  const productUrl = `${shareUrl}/#/product/${id}`;

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      document.title = `${product.name} | ستور بريمة`;
      window.scrollTo(0, 0);

      trackFBEvent('ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'MAD'
      });
    }
  }, [product]);

  if (!product) {
    return <div className="py-24 text-center font-black text-2xl text-gray-400 dark:text-gray-600">المنتج غير متاح حالياً</div>;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInstaShare = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setInstaCopied(true);
      setTimeout(() => setInstaCopied(false), 3000);
      // توجيه المستخدم لفتح انستغرام
      window.open('https://www.instagram.com/', '_blank');
    });
  };

  const handleDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.city || !formData.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setIsSubmitting(true);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      city: formData.city,
      phone: formData.phone,
      items: [{ productId: product.id, quantity: 1 }],
      totalPrice: product.price,
      date: new Date().toISOString(),
      status: 'pending'
    };
    const currentOrders = getStoredOrders();
    const updatedOrders = [...currentOrders, newOrder];
    saveOrders(updatedOrders);
    setOrders(updatedOrders);

    trackFBEvent('Purchase', {
      value: product.price,
      currency: 'MAD',
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const allImages = [product.image, ...(product.images || [])];

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white dark:bg-gray-900 p-12 rounded-[50px] shadow-2xl border-t-8 border-emerald-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 dark:text-white">تم استلام طلبك!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 font-bold">
            شكراً <span className="text-emerald-600 dark:text-emerald-400">{formData.fullName}</span>. سيتصل بك فريقنا قريباً لتأكيد الشحن إلى <span className="text-emerald-600 dark:text-emerald-400">{formData.city}</span>.
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-gray-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
            متابعة التسوق <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 mb-20">
        
        {/* Images Column */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 relative group transition-all">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full object-contain aspect-square group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 right-4 bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">الأصلي</div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-emerald-500 scale-105 shadow-md' : 'border-white dark:border-gray-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="gallery" />
              </button>
            ))}
          </div>
        </section>

        {/* Info Column */}
        <section className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black"><Star size={12} fill="currentColor"/> 4.9 تقييم</span>
              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black"><ShieldCheck size={12}/> ضمان سنة</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-500">{product.price.toLocaleString()} <span className="text-sm">د.م.</span></span>
              <span className="text-xl text-gray-300 dark:text-gray-600 font-bold line-through">{(product.price * 1.35).toLocaleString()} د.م.</span>
            </div>
          </div>

          {/* Social Share Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
             <span className="block text-sm font-black text-gray-400 mb-4 text-center md:text-right pr-2">شارك هذا المنتج مع أصدقائك:</span>
             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' ' + productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform" title="واتساب"><MessageCircle size={24}/></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform" title="فيسبوك"><Facebook size={24}/></a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform" title="تويتر X"><Twitter size={24}/></a>
                <button 
                  onClick={handleInstaShare}
                  className="w-12 h-12 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform relative group" 
                  title="انستغرام"
                >
                  <Instagram size={24}/>
                  {instaCopied && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-xl whitespace-nowrap animate-bounce font-black">
                      تم نسخ الرابط! افتح التطبيق
                    </span>
                  )}
                </button>
                <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#E60023] text-white rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-transform" title="بنتريست">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.987C23.97 5.39 18.592 0 11.985 0z"/></svg>
                </a>
                <button 
                  onClick={handleCopyLink}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 shadow-lg transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  title="نسخ الرابط"
                >
                  {copied ? <Check size={24} /> : <Copy size={24} />}
                </button>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[40px] shadow-2xl border-t-8 border-emerald-500 space-y-6 transition-colors">
            <div className="text-center space-y-1">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">أدخل معلوماتك للطلب</h2>
              <p className="text-gray-400 dark:text-gray-500 font-bold text-xs">سنتصل بك لتأكيد طلبك وتوصيله مجاناً</p>
            </div>

            <form onSubmit={handleDirectOrder} className="space-y-4">
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input required type="text" placeholder="الاسم الكامل" className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 outline-none font-bold transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              <div className="relative group">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={18} />
                <select required className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 outline-none font-bold transition-all appearance-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                  <option value="" disabled>اختر مدينتك</option>
                  {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>

              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input required type="tel" dir="ltr" placeholder="رقم الهاتف" className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 outline-none font-bold transition-all text-right" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-6 rounded-2xl text-white font-black text-xl md:text-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 active:scale-95'}`}>
                {isSubmitting ? 'جاري الإرسال...' : 'اضغط هنا للطلب الآن'} <Zap fill="currentColor"/>
              </button>
            </form>
          </div>
        </section>
      </div>

      <section className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 mb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <FileText size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">وصف المنتج</h2>
        </div>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-bold leading-relaxed whitespace-pre-wrap text-lg">
          {product.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}
        </div>
      </section>

      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-black text-sm">
             <Star size={16} fill="currentColor"/> آراء عملائنا المتميزين
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">لماذا يثق بنا آلاف المغاربة؟ 🇲🇦</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {MOCK_REVIEWS.map((review, i) => (
             <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-lg border border-gray-100 dark:border-gray-800 relative group hover:-translate-y-2 transition-transform">
               <div className="flex text-yellow-400 mb-6">
                 {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor"/>)}
               </div>
               <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed mb-8 italic">"{review.comment}"</p>
               <div className="flex items-center gap-4 border-t dark:border-gray-800 pt-6">
                 <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-black">
                    {review.name[0]}
                 </div>
                 <div>
                    <div className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                       {review.name}
                       <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold">{review.city} • {review.date}</div>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

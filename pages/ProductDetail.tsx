
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
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
  Zap
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
  const [isAdded, setIsAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      document.title = `${product.name} | ستور بريمة`;
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return <div className="py-24 text-center font-black text-2xl text-gray-400 dark:text-gray-600">المنتج غير متاح حالياً</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
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
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white dark:bg-gray-900 p-12 rounded-[50px] shadow-2xl border-t-8 border-emerald-500 transition-colors">
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
    <article className="max-w-7xl mx-auto px-4 py-8 md:py-16 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        
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
            {galleryImages.map((img, idx) => (
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

          {/* Quick Trust Badges */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex flex-col items-center gap-1">
              <Truck size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[8px] md:text-[10px] font-black dark:text-gray-400">توصيل مجاني</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[8px] md:text-[10px] font-black dark:text-gray-400">الدفع عند الاستلام</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCcw size={20} className="text-orange-600 dark:text-orange-400" />
              <span className="text-[8px] md:text-[10px] font-black dark:text-gray-400">استرجاع سهل</span>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[40px] shadow-2xl border-t-8 border-emerald-500 space-y-6 relative transition-colors">
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
                <select required className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 outline-none font-bold transition-all appearance-none cursor-pointer" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                  <option value="" disabled>اختر مدينتك</option>
                  {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>

              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input required type="tel" dir="ltr" placeholder="رقم الهاتف" className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 outline-none font-bold transition-all text-right" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-6 rounded-2xl text-white font-black text-xl md:text-2xl shadow-xl transition-all flex items-center justify-center gap-3 animate-pulse-subtle ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 active:scale-95 shadow-emerald-200 dark:shadow-none'}`}>
                {isSubmitting ? 'جاري الإرسال...' : 'اضغط هنا للطلب الآن'} <Zap fill="currentColor"/>
              </button>
            </form>
          </div>

          {/* Detailed Info */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-black border-r-4 border-emerald-500 pr-3 dark:text-white">لماذا تختار هذا المنتج؟</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-bold text-sm md:text-base">
              {product.description || "هذا المنتج مختار بعناية من أفضل المصانع العالمية لضمان تجربة مستخدم فريدة وجودة تدوم طويلاً. نحن في ستور بريمة لا نبيع إلا ما نثق به."}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};

export default ProductDetail;

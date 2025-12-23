
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
  ChevronDown
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
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      document.title = `${product.name} | ستور بريمة`;
      
      // Inject JSON-LD for Google Rich Snippets
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [product.image, ...(product.images || [])],
        "description": product.description || `اشتري ${product.name} الآن من ستور بريمة بأفضل سعر في المغرب.`,
        "sku": product.id,
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "MAD",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = 'product-schema';
      document.head.appendChild(script);

      return () => {
        const oldScript = document.getElementById('product-schema');
        if (oldScript) oldScript.remove();
      };
    }
  }, [product]);

  if (!product) {
    return <div className="py-24 text-center font-black text-2xl">المنتج غير موجود</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.city || !formData.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة واختيار المدينة');
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

    // Simulate server delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border-b-8 border-emerald-500 text-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={60} />
          </div>
          <h2 className="text-4xl font-black mb-4">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-500 text-xl mb-10 font-bold">
            شكراً لثقتك بنا يا <span className="text-emerald-600">{formData.fullName}</span>. سيتصل بك فريقنا قريباً لتأكيد الإرسال لمدينة <span className="text-blue-600">{formData.city}</span>.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            العودة للتسوق <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery Section */}
        <section className="space-y-6 lg:sticky lg:top-28">
          <div className="aspect-square bg-white rounded-[50px] overflow-hidden shadow-2xl border-4 border-white relative group">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-emerald-500 scale-105 shadow-lg' : 'border-white shadow-sm hover:border-emerald-200'}`}
                  aria-label={`عرض الصورة ${idx + 1}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${product.name} - صورة ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Info & Form Section */}
        <section className="space-y-10">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black shadow-sm">الأصلي 100%</span>
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 text-yellow-400">
               {[1,2,3,4,5].map(i => <span key={i} className="text-xl" aria-hidden="true">★</span>)}
               <span className="text-gray-400 text-sm font-bold mr-2">(+500 تقييم إيجابي)</span>
            </div>
            <div className="flex items-baseline gap-4 mt-6">
              <div className="text-6xl font-black text-emerald-600 tracking-tighter">
                {product.price.toLocaleString()} <span className="text-xl">د.م.</span>
              </div>
              <div className="text-2xl text-gray-300 font-bold line-through">
                {(product.price * 1.3).toLocaleString()} د.م.
              </div>
            </div>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={24} className="text-blue-600" />
              <span className="text-[10px] font-black">توصيل مجاني</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <CheckCircle size={24} className="text-emerald-600" />
              <span className="text-[10px] font-black">الدفع عند الاستلام</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCcw size={24} className="text-orange-600" />
              <span className="text-[10px] font-black">ضمان الاسترجاع</span>
            </div>
          </div>

          {/* THE ORDER FORM */}
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border-2 border-emerald-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black text-gray-900 flex items-center justify-center gap-2">
                <ShoppingBag className="text-emerald-600" /> اطلب الآن مباشرة
              </h2>
              <p className="text-gray-400 font-bold text-sm mt-1">الدفع عند الاستلام والتوصيل مجاني لمدينة <span className="text-emerald-500">{formData.city || 'كافة المدن'}</span></p>
            </div>

            <form onSubmit={handleDirectOrder} className="space-y-6">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input 
                  required
                  type="text"
                  placeholder="الاسم الكامل"
                  className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  aria-label="الاسم الكامل"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={20} />
                <select 
                  required
                  className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold transition-all appearance-none cursor-pointer"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  aria-label="اختر المدينة"
                >
                  <option value="" disabled>اختر مدينتك</option>
                  {MOROCCAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>

              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input 
                  required
                  type="tel"
                  dir="ltr"
                  placeholder="رقم الهاتف"
                  className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-bold transition-all text-right"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  aria-label="رقم الهاتف"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 rounded-2xl text-white font-black text-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 active:scale-95 ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 animate-pulse-subtle shadow-emerald-200'}`}
              >
                {isSubmitting ? 'جاري الطلب...' : 'اشتري الآن - الدفع عند الاستلام'}
              </button>
              <div className="text-center text-[10px] text-gray-400 font-bold">
                * سنقوم بالاتصال بك فوراً لتأكيد العنوان وموعد التوصيل
              </div>
            </form>
          </div>

          {/* Description */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-xl font-black mb-4 underline decoration-emerald-200 underline-offset-8">وصف المنتج وتفاصيله:</h3>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              {product.description || "هذا المنتج مصمم بعناية فائقة ليلبي جميع احتياجاتكم. يتميز بجودة الخامات واللمسة العصرية التي تناسب ذوقكم الرفيع."}
            </p>
          </div>

          {/* Regular Buttons (Secondary) */}
          <div className="flex gap-4 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <button 
              onClick={handleAddToCart}
              className={`flex-grow py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 ${isAdded ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'border-gray-200 text-gray-500'}`}
            >
              <ShoppingCart size={20} /> {isAdded ? 'تمت الإضافة للسلة' : 'أضف للسلة'}
            </button>
            <button className="p-4 border-2 border-gray-100 rounded-2xl text-gray-400" aria-label="أضف للمفضلة">
              <Heart size={20} />
            </button>
          </div>
        </section>
      </div>
    </article>
  );
};

export default ProductDetail;

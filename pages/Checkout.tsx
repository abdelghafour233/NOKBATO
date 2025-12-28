import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
import { trackFBEvent } from '../App.tsx';
import { CheckCircle, Truck, MapPin, User, Phone, ArrowRight, ChevronDown } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  clearCart: () => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أغادير", "مكناس", 
  "وجدة", "القنيطرة", "تطوان", "تمارة", "سلا", "آسفي", "العيون", 
  "المحمدية", "بني ملال", "الجديدة", "تازة", "الناظور", "سطات", 
  "خريبكة", "القصر الكبير", "العرائش", "الخميسات", "تارودانت"
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, clearCart, setOrders }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    // Facebook Pixel: InitiateCheckout
    if (cart.length > 0) {
      trackFBEvent('InitiateCheckout', {
        content_ids: cart.map(i => i.id),
        content_type: 'product',
        value: total,
        currency: 'MAD',
        num_items: cart.length
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.city || !formData.phone) return;
    
    setIsSubmitting(true);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
      totalPrice: total,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const currentOrders = getStoredOrders();
    const updatedOrders = [...currentOrders, newOrder];
    saveOrders(updatedOrders);
    setOrders(updatedOrders);

    // Facebook Pixel: Purchase
    trackFBEvent('Purchase', {
      value: total,
      currency: 'MAD',
      content_ids: cart.map(i => i.id),
      content_type: 'product',
      num_items: cart.length
    });

    // محاكاة الإرسال
    setTimeout(() => {
      setIsSuccess(true);
      clearCart();
      window.scrollTo(0, 0);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border-b-8 border-emerald-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle size={60} />
          </div>
          <h2 className="text-4xl font-black mb-4 text-gray-800">شكراً لثقتكم!</h2>
          <p className="text-gray-500 text-xl mb-10 leading-relaxed">
            تم استلام طلبك بنجاح. سيتصل بك فريقنا في أقرب وقت ممكن لتأكيد الطلب وترتيب عملية التوصيل إلى مدينة <span className="text-emerald-600 font-black">{formData.city}</span>.
          </p>
          
          <div className="bg-emerald-50 p-8 rounded-3xl mb-10 text-right space-y-4 border border-emerald-100">
            <div className="flex justify-between border-b border-emerald-100 pb-2">
              <span className="text-emerald-700 font-bold">الاسم:</span>
              <span className="font-black">{formData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-100 pb-2">
              <span className="text-emerald-700 font-bold">المدينة:</span>
              <span className="font-black">{formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700 font-bold">رقم الهاتف:</span>
              <span className="font-black font-mono">{formData.phone}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
          >
            العودة للتسوق <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Form Container */}
        <div className="w-full lg:w-3/5 bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-50">
          <div className="mb-10">
            <h1 className="text-3xl font-black mb-2">إكمال الطلب</h1>
            <p className="text-gray-400">يرجى إدخال معلوماتك بدقة لضمان وصول الطلب</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="block text-lg font-black text-gray-700 mb-3 pr-2">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                  <input 
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full p-5 pr-14 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-gray-300 shadow-sm"
                  />
                </div>
              </div>

              {/* City Field (DROPDOWN) */}
              <div className="group">
                <label className="block text-lg font-black text-gray-700 mb-3 pr-2">المدينة</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={24} />
                  <select 
                    required
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full p-5 pr-14 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-xl font-bold shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled>اختر مدينتك...</option>
                    {MOROCCAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={24} />
                </div>
              </div>

              {/* Phone Field */}
              <div className="group">
                <label className="block text-lg font-black text-gray-700 mb-3 pr-2">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                  <input 
                    required
                    type="tel"
                    dir="ltr"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="06 00 00 00 00"
                    className="w-full p-5 pr-14 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-gray-300 shadow-sm text-right"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info Box */}
            <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-100 flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                <Truck size={30} />
              </div>
              <div>
                <h4 className="font-black text-emerald-900 text-lg">الدفع عند الاستلام</h4>
                <p className="text-emerald-700 font-medium italic">التوصيل مجاني لجميع المدن</p>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className={`w-full py-6 rounded-[30px] text-white font-black text-2xl shadow-2xl transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 shadow-emerald-100'}`}
            >
              {isSubmitting ? 'جاري الحفظ...' : 'تأكيد الطلب الآن'}
            </button>
            <p className="text-center text-gray-400 text-sm font-medium">سيتم التواصل معك هاتفياً فور تأكيد الطلب</p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-2/5 space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl sticky top-24">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              ملخص السلة 
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full">{cart.length} منتجات</span>
            </h2>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pl-2">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">الكمية: {item.quantity}</span>
                      <span className="font-black text-emerald-400">{(item.price * item.quantity).toLocaleString()} د.م.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between text-gray-400">
                <span>المجموع الفرعي</span>
                <span>{total.toLocaleString()} د.م.</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>مصاريف التوصيل</span>
                <span>مجاني</span>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-xl font-bold">المجموع الكلي</span>
                <span className="text-3xl font-black text-emerald-400 underline underline-offset-8 decoration-emerald-500/30">{total.toLocaleString()} د.م.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
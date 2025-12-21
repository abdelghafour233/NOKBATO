
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';
import { saveOrders, getStoredOrders } from '../store';
import { CheckCircle, Truck, MapPin, User, Phone } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  clearCart: () => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    setTimeout(() => {
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-16 rounded-[40px] shadow-2xl border-4 border-emerald-50 inline-block max-w-2xl">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={56} />
          </div>
          <h2 className="text-4xl font-black mb-4 text-emerald-600">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-500 text-xl mb-8">شكراً لك على ثقتك بمتجر النخبة. سيتصل بك فريقنا لتأكيد الطلب قريباً.</p>
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-right space-y-2">
            <p><strong>الاسم:</strong> {formData.fullName}</p>
            <p><strong>المدينة:</strong> {formData.city}</p>
            <p><strong>رقم الهاتف:</strong> {formData.phone}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-emerald-700 transition-all"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          <h1 className="text-4xl font-black mb-8">معلومات الشحن</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                <User size={16} /> الاسم الكامل
              </label>
              <input 
                required
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                placeholder="أدخل اسمك الكامل"
                className="w-full p-4 rounded-2xl border bg-white focus:ring-4 focus:ring-emerald-50 outline-none border-gray-100 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                <MapPin size={16} /> المدينة
              </label>
              <input 
                required
                type="text"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="أدخل اسم مدينتك"
                className="w-full p-4 rounded-2xl border bg-white focus:ring-4 focus:ring-emerald-50 outline-none border-gray-100 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                <Phone size={16} /> رقم الهاتف
              </label>
              <input 
                required
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="06XXXXXXXX"
                className="w-full p-4 rounded-2xl border bg-white focus:ring-4 focus:ring-emerald-50 outline-none border-gray-100 font-bold"
              />
            </div>

            <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-100 flex gap-4">
              <Truck className="text-emerald-600 shrink-0" size={32} />
              <div>
                <h4 className="font-black text-emerald-800">الدفع عند الاستلام</h4>
                <p className="text-sm text-emerald-600">لا حاجة للدفع الآن، ستدفع عند استلام طلبك.</p>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className={`w-full py-5 rounded-3xl text-white font-black text-2xl shadow-xl transition-all ${isSubmitting ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700 transform hover:-translate-y-1'}`}
            >
              {isSubmitting ? 'جاري المعالجة...' : 'تأكيد الطلب'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 self-start sticky top-24">
          <h2 className="text-2xl font-black mb-8">ملخص المشتريات</h2>
          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto px-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                <div className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <span className="text-gray-400 text-xs">الكمية: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-emerald-600">{(item.price * item.quantity).toLocaleString()} د.م.</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-500 font-bold">
              <span>المجموع الفرعي</span>
              <span>{total.toLocaleString()} د.م.</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>الشحن</span>
              <span>مجاني</span>
            </div>
            <div className="pt-6 border-t flex justify-between items-center">
              <span className="text-2xl font-black">المجموع الكلي</span>
              <span className="text-3xl font-black text-emerald-600">{total.toLocaleString()} د.م.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

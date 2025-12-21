
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-16 rounded-[40px] shadow-sm border inline-block max-w-lg">
          <ShoppingBag size={80} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-3xl font-black mb-4">سلة المشتريات فارغة</h2>
          <p className="text-gray-400 mb-8">لم تضف أي منتج إلى سلتك بعد، استكشف منتجاتنا الآن.</p>
          <Link to="/" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold inline-block hover:bg-emerald-700 transition-colors">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-12">سلة المشتريات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-6">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-emerald-600 font-bold">{item.price.toLocaleString()} د.م.</p>
                <p className="text-gray-400 text-sm">الكمية: {item.quantity}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-emerald-50">
            <h2 className="text-2xl font-black mb-6">ملخص الطلب</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي</span>
                <span>{total.toLocaleString()} د.م.</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>الشحن</span>
                <span className="text-emerald-600 font-bold">مجاني</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-2xl font-black">
                <span>المجموع</span>
                <span className="text-emerald-600">{total.toLocaleString()} د.م.</span>
              </div>
            </div>
            <Link 
              to="/checkout"
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl"
            >
              إتمام الطلب <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

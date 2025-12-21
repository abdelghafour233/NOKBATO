
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag, ChevronLeft, Star, Truck, ShieldCheck, Headphones } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              أفضل العروض <br/><span className="text-emerald-400">لأفضل المنتجات</span>
            </h1>
            <p className="text-xl text-emerald-100 max-w-lg">
              تسوق الآن واستفد من خصومات حصرية على جميع الإلكترونيات والسيارات ومستلزمات المنزل.
            </p>
            <div className="flex gap-4">
              <Link to="/category/electronics" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-lg">
                تسوق الآن
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
             <img src="https://picsum.photos/seed/shop/800/600" alt="Banner" className="rounded-3xl shadow-2xl rotate-2" />
             <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl text-emerald-900 hidden md:block">
               <div className="text-sm font-bold opacity-60">تخفيضات تصل إلى</div>
               <div className="text-4xl font-black">50%</div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* Categories Icons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">تصفح حسب الفئة</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { id: 'electronics', name: 'الإلكترونيات', icon: '📱', color: 'bg-blue-50' },
               { id: 'home', name: 'المنزل والمطبخ', icon: '🏠', color: 'bg-orange-50' },
               { id: 'cars', name: 'السيارات والقطع', icon: '🚗', color: 'bg-red-50' }
             ].map(cat => (
               <Link 
                key={cat.id} 
                to={`/category/${cat.id}`}
                className={`${cat.color} p-10 rounded-3xl text-center group hover:shadow-lg transition-all`}
               >
                 <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                 <span className="text-2xl font-bold text-gray-800">{cat.name}</span>
               </Link>
             ))}
           </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck size={32} className="text-emerald-500" />, title: 'توصيل سريع', desc: 'في غضون 48 ساعة' },
            { icon: <ShieldCheck size={32} className="text-emerald-500" />, title: 'ضمان الجودة', desc: 'منتجات أصلية 100%' },
            { icon: <Headphones size={32} className="text-emerald-500" />, title: 'دعم متواصل', desc: 'نحن متاحون 24/7' },
            { icon: <Star size={32} className="text-emerald-500" />, title: 'أسعار منافسة', desc: 'أفضل قيمة مقابل المال' }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
              {feature.icon}
              <div>
                <h4 className="font-bold">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">أحدث المنتجات</h2>
              <p className="text-gray-500 text-lg">اكتشف ما هو جديد في متجرنا اليوم</p>
            </div>
            <Link to="/category/electronics" className="text-emerald-600 font-bold flex items-center gap-2 hover:underline">
              عرض الكل <ChevronLeft size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group border border-gray-100">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600">جديد</div>
                </Link>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-black text-emerald-600">{product.price.toLocaleString()} <span className="text-sm">د.م.</span></div>
                    <Link to={`/product/${product.id}`} className="p-3 bg-gray-50 rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

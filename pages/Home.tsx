
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { Star, ShoppingBag, Zap, ShieldCheck, Truck, Headphones, ChevronLeft } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Modern Hero Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative h-[400px] md:h-[550px] bg-brand-slate rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10 md:hidden"></div>
          <div className="relative z-20 p-8 md:p-16 text-center md:text-right md:w-1/2 space-y-6">
             <span className="inline-block bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">عرض حصري لمتابعينا</span>
             <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
               الجودة التي تستحقها <br/> <span className="text-brand-primary underline decoration-white/20 underline-offset-8">بأفضل الأسعار</span>
             </h1>
             <p className="text-gray-400 text-lg font-medium max-w-md mx-auto md:mx-0">نختار لك بعناية أفضل المنتجات العالمية ونوفرها لك مع خدمة التوصيل السريع للمنزل.</p>
             <button className="bg-white text-brand-slate px-10 py-4 rounded-2xl font-black text-xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl flex items-center gap-3 mx-auto md:mx-0">
               تصفح المنتجات <ChevronLeft size={24}/>
             </button>
          </div>
          <div className="absolute inset-0 md:relative md:w-1/2 h-full">
             <img 
               src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover opacity-60 md:opacity-100" 
               alt="Hero Product" 
             />
          </div>
        </div>
      </section>

      {/* Main Products Grid - الواجهة الأمامية */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-r-4 border-brand-primary pr-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-brand-slate">منتجاتنا المختارة</h2>
            <p className="text-gray-400 font-bold mt-2">تشكيلة واسعة تلبي جميع احتياجاتكم</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white px-6 py-2 rounded-full border text-xs font-black text-gray-400">إجمالي المنتجات: {products.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="product-card rounded-[35px] overflow-hidden flex flex-col group">
               <Link to={`/product/${product.id}`} className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={product.name} 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-primary text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm border border-brand-primary/10">موصى به</div>
               </Link>
               
               <div className="p-6 space-y-4 flex-grow flex flex-col">
                  <h3 className="text-xl font-black text-brand-slate line-clamp-1 group-hover:text-brand-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor"/>)}
                    <span className="text-[10px] text-gray-400 font-black mr-2">4.9 تقييم</span>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-3xl font-black text-brand-primary">{product.price} <span className="text-sm">د.م</span></span>
                        <span className="text-[10px] text-gray-300 line-through font-bold">{(product.price * 1.25).toFixed(0)} د.م</span>
                     </div>
                     <Link to={`/product/${product.id}`} className="p-3.5 bg-brand-slate text-white rounded-2xl hover:bg-brand-primary hover:scale-110 transition-all shadow-lg">
                        <ShoppingBag size={20} />
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureCard icon={<Truck/>} title="شحن مجاني وسريع" desc="نصلك في أقل من 48 ساعة لكافة مدن المغرب." />
           <FeatureCard icon={<ShieldCheck/>} title="ضمان الجودة 100%" desc="جميع منتجاتنا أصلية وتخضع للفحص قبل الإرسال." />
           <FeatureCard icon={<Headphones/>} title="دعم طوال اليوم" desc="فريقنا مستعد للإجابة على استفساراتكم عبر الواتساب." />
        </div>
      </section>

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-6">
         <div className="bg-brand-primary rounded-[40px] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 space-y-4 text-center md:text-right">
               <h3 className="text-3xl md:text-5xl font-black text-white">خصومات الموسم 🎁</h3>
               <p className="text-white/80 text-xl font-bold italic">استفد من تخفيضات تصل إلى 40% على تشكيلة الساعات.</p>
            </div>
            <Link to="/category/watches" className="px-12 py-5 bg-white text-brand-primary rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl">
               اكتشف العروض الآن
            </Link>
         </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-[35px] border border-gray-100 flex flex-col items-center text-center group hover:border-brand-primary/40 transition-all">
     <div className="w-14 h-14 bg-brand-bg text-brand-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 28 })}
     </div>
     <h4 className="text-xl font-black text-brand-slate mb-2">{title}</h4>
     <p className="text-gray-400 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;

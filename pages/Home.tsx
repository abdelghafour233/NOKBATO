
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
// Fixed missing Headphones import from lucide-react
import { ShoppingCart, Star, ArrowRight, Zap, ShieldCheck, Truck, ShoppingBag, ChevronLeft, Headphones } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="pb-20 space-y-24">
      {/* Cinematic Hero */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative h-[60vh] md:h-[75vh] rounded-[40px] md:rounded-[60px] overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1920" 
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]" 
            alt="Hero" 
          />
          <div className="absolute bottom-12 right-6 md:right-20 z-20 max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
             <div className="inline-flex items-center gap-2 bg-brand-primary px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                <Zap size={14} fill="white"/> جديدنا في ستور بريمة
             </div>
             <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] premium-gradient-text">
               تسوق بذكاء، <br/> تميز باختياراتك.
             </h1>
             <p className="text-slate-300 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
               نقدم لك أجود المنتجات العالمية بأفضل الأسعار في السوق المغربي، مع خدمة توصيل مجانية وسريعة.
             </p>
             <div className="pt-4">
               <button className="bg-white text-brand-dark px-10 py-5 rounded-2xl font-black text-xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl flex items-center gap-3">
                 اكتشف العروض <ChevronLeft size={24}/>
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* Direct Product Feed Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-r-4 border-brand-primary pr-6">
           <div>
             <h2 className="text-4xl md:text-6xl font-black text-white">معروضاتنا</h2>
             <p className="text-slate-500 font-bold mt-2">تصفح أحدث المنتجات المتوفرة حالياً في المتجر</p>
           </div>
           <div className="hidden md:flex gap-2">
              <span className="px-4 py-2 bg-white/5 rounded-xl text-xs font-black text-slate-400">جميع المنتجات: {products.length}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {products.map(product => (
            <div key={product.id} className="product-card bg-slate-900/40 rounded-[35px] overflow-hidden flex flex-col group">
               <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-800">
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={product.name} 
                  />
                  <div className="absolute top-4 right-4 bg-brand-primary/90 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-lg">أفضل سعر</div>
                  <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="bg-white text-brand-dark p-4 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <ShoppingBag size={24}/>
                     </div>
                  </div>
               </Link>
               
               <div className="p-8 space-y-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-black text-white line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">{product.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor"/>)}
                    <span className="text-[10px] text-slate-500 font-black mr-2">4.9 تقييم</span>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-3xl font-black text-brand-primary">{product.price} <span className="text-[10px]">د.م</span></span>
                        <span className="text-xs text-slate-500 line-through font-bold">{(product.price * 1.3).toFixed(0)} د.م</span>
                     </div>
                     <Link to={`/product/${product.id}`} className="p-4 bg-brand-primary text-white rounded-2xl hover:bg-brand-secondary hover:scale-110 transition-all shadow-lg shadow-brand-primary/20">
                        <ArrowRight size={20} />
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Services */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureBox icon={<Truck/>} title="توصيل مجاني وسريع" desc="نصلك أينما كنت في المغرب خلال 24 إلى 48 ساعة كحد أقصى." />
           <FeatureBox icon={<ShieldCheck/>} title="ضمان الجودة" desc="جميع منتجاتنا تخضع للفحص الدقيق قبل الشحن لضمان رضاكم." />
           <FeatureBox icon={<Headphones/>} title="دعم فني متميز" desc="فريقنا متاح طوال أيام الأسبوع للإجابة على جميع تساؤلاتكم." />
        </div>
      </section>

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-6">
         <div className="bg-brand-primary rounded-[50px] p-12 md:p-24 relative overflow-hidden text-center md:text-right">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-4">
                  <h3 className="text-4xl md:text-7xl font-black text-white">عروض خاصة 🇲🇦</h3>
                  <p className="text-white/80 text-xl font-bold">استفد من خصومات تصل إلى 40% على جميع المنتجات المختارة.</p>
               </div>
               <Link to="/category/electronics" className="px-16 py-6 bg-brand-dark text-white rounded-[30px] font-black text-2xl hover:bg-slate-900 transition-all shadow-2xl">
                  تصفح الآن
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

const FeatureBox = ({ icon, title, desc }: any) => (
  <div className="bg-slate-900/50 p-10 rounded-[40px] border border-white/5 hover:border-brand-primary/30 transition-colors group">
     <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 32 })}
     </div>
     <h4 className="text-xl font-black text-white mb-3">{title}</h4>
     <p className="text-slate-400 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;

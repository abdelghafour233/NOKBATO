
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { ShoppingCart, Star, ArrowRight, Zap, ShieldCheck, Truck, ShoppingBag, ChevronLeft, Headphones, Sparkles } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="pb-20 space-y-16">
      {/* Bright Professional Hero */}
      <section className="relative overflow-hidden bg-white pt-10 pb-16">
        <div className="hero-pattern absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-right">
             <div className="inline-flex items-center gap-2 bg-emerald-50 text-brand-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} /> متجر بريمة المغربي الأصلي
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.2]">
               تسوق بأمان، <br/> واكشف عن <span className="text-brand-primary">أناقتك</span>.
             </h1>
             <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
               نحن نختار لك بعناية أفضل المنتجات العالمية التي تجمع بين الجودة والجمال، مع ضمان التوصيل لباب منزلك مجاناً.
             </p>
             <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <button className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-3">
                 ابدأ التسوق <ChevronLeft size={24}/>
               </button>
               <button className="bg-slate-100 text-slate-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all">
                 أحدث العروض
               </button>
             </div>
          </div>
          <div className="relative hidden lg:block">
             <div className="absolute inset-0 bg-brand-primary/10 rounded-[60px] blur-3xl -z-10 animate-pulse"></div>
             <img 
               src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" 
               className="w-full h-auto rounded-[60px] shadow-2xl border-8 border-white" 
               alt="Featured product" 
             />
          </div>
        </div>
      </section>

      {/* Main Product Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-center md:text-right">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900">منتجاتنا المختارة</h2>
             <p className="text-slate-400 font-bold mt-2 italic">اكتشف التميز في كل قطعة</p>
           </div>
           <div className="flex gap-4">
              <span className="bg-white border border-slate-100 px-6 py-2 rounded-full text-sm font-black text-slate-400">جميع المنتجات ({products.length})</span>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map(product => (
            <div key={product.id} className="product-card rounded-[30px] border border-slate-100 overflow-hidden flex flex-col group shadow-sm">
               <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50">
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={product.name} 
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md text-brand-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border border-emerald-50">أفضل سعر</div>
                    {product.price > 200 && <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">الأكثر طلباً</div>}
                  </div>
               </Link>
               
               <div className="p-6 space-y-3 flex-grow flex flex-col">
                  <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                    <span className="text-[10px] text-slate-400 font-black mr-1">(4.9/5)</span>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-2xl font-black text-brand-primary">{product.price} <span className="text-[10px]">د.م</span></span>
                        <span className="text-xs text-slate-300 line-through font-bold">{(product.price * 1.4).toFixed(0)} د.م</span>
                     </div>
                     <Link to={`/product/${product.id}`} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-brand-primary hover:scale-105 transition-all shadow-lg">
                        <ShoppingBag size={18} />
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <FeatureItem icon={<Truck/>} title="توصيل مجاني" desc="لكافة مدن المغرب" />
           <FeatureItem icon={<ShieldCheck/>} title="ضمان الجودة" desc="فحص دقيق للمنتج" />
           <FeatureItem icon={<Headphones/>} title="دعم فني" desc="طوال أيام الأسبوع" />
           <FeatureItem icon={<Zap/>} title="دفع آمن" desc="عند الاستلام يداً بيد" />
        </div>
      </section>

      {/* Modern Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
         <div className="bg-brand-primary rounded-[40px] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-brand-primary/30">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 text-center md:text-right space-y-4">
               <h3 className="text-3xl md:text-5xl font-black text-white">تخفيضات تصل إلى 30%</h3>
               <p className="text-white/80 text-xl font-bold">على تشكيلة مختارة من الساعات والإلكترونيات الذكية.</p>
            </div>
            <Link to="/category/watches" className="px-12 py-5 bg-white text-brand-primary rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl">
               اكتشف الآن
            </Link>
         </div>
      </section>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:border-brand-primary/50 transition-all">
     <div className="w-12 h-12 bg-emerald-50 text-brand-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
     </div>
     <h4 className="text-sm font-black text-slate-900">{title}</h4>
     <p className="text-slate-400 font-bold text-[10px] mt-1">{desc}</p>
  </div>
);

export default HomePage;

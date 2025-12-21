
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { ShoppingBag, ChevronLeft, Star, Truck, ShieldCheck, Headphones, Zap, Gift } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section - Re-designed for high impact */}
      <section className="relative bg-white pt-10 pb-20 lg:pt-20 lg:pb-32 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-right z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-black animate-bounce">
              <Zap size={18} fill="currentColor" />
              عروض حصرية لفترة محدودة
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.1]">
              تسوق <span className="text-emerald-600">بذكاء</span><br/>
              وعش <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">برقيّ</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto lg:mr-0 leading-relaxed font-medium">
              اكتشف عالمنا المليء بالابتكارات. من أحدث الهواتف الذكية إلى فخامة مستلزمات المنزل، كل ما تحتاجه في مكان واحد بجودة مضمونة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/category/electronics" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-[24px] font-black text-xl transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 group">
                ابدأ التسوق <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-[24px] border border-gray-100">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1, 2, 3].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-4 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-400">يثق بنا أكثر من</div>
                  <div className="text-sm font-black text-gray-800">+10,000 عميل</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            {/* Main Visual Image - Attractive E-commerce Concept */}
            <div className="relative z-10 animate-in fade-in zoom-in duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern E-commerce" 
                className="rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white transform lg:rotate-3 hover:rotate-0 transition-transform duration-700 object-cover aspect-[4/5] lg:aspect-square"
              />
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-10 -right-10 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 hidden md:block animate-pulse">
                <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-100">
                  <ShoppingBag size={24} />
                </div>
                <div className="font-black text-lg">توصيل مجاني</div>
                <div className="text-gray-400 text-xs">لجميع مدن المغرب</div>
              </div>

              <div className="absolute -bottom-6 -left-10 bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                   <div className="flex text-yellow-400"><Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /></div>
                   <span className="text-xs font-bold opacity-60">4.9/5 تقييم</span>
                </div>
                <div className="text-2xl font-black">جودة عالمية</div>
                <div className="text-emerald-400 font-bold text-sm">ضمان سنتين على كل شيء</div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-100 rounded-full blur-[80px] -z-10 opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">APPLE</div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">SAMSUNG</div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">TOYOTA</div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">IKEA</div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">SONY</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Truck size={36} />, title: 'توصيل مجاني', desc: 'لجميع الطلبات فوق 500 درهم', color: 'bg-emerald-500' },
            { icon: <ShieldCheck size={36} />, title: 'دفع آمن', desc: 'ادفع عند الاستلام بكل راحة', color: 'bg-blue-500' },
            { icon: <Headphones size={36} />, title: 'دعم 24/7', desc: 'فريقنا جاهز للرد على استفساراتكم', color: 'bg-purple-500' },
            { icon: <Gift size={36} />, title: 'هدايا أسبوعية', desc: 'خصومات وكوبونات لعملائنا الأوفياء', color: 'bg-orange-500' }
          ].map((feature, i) => (
            <div key={i} className="group bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className={`${feature.color} w-16 h-16 rounded-[22px] flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:rotate-12 transition-transform`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-black mb-3">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-right">
              <h2 className="text-4xl md:text-5xl font-black mb-4">وصلنا حديثاً 🤩</h2>
              <p className="text-gray-500 text-lg">تصفح أحدث الصيحات والمنتجات التي وصلت إلى مخازننا</p>
            </div>
            <Link to="/category/electronics" className="bg-white border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all group">
              اكتشف المتجر كاملاً <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100">
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">الأكثر طلباً</div>
                    {product.price > 10000 && <div className="bg-red-500 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-sm">Premium</div>}
                  </div>
                </Link>
                <div className="p-8">
                  <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{product.category}</div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-emerald-600 transition-colors line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-black text-emerald-600">{product.price.toLocaleString()} <span className="text-sm">د.م.</span></div>
                      <div className="text-[10px] text-gray-400 font-bold line-through">{(product.price * 1.2).toLocaleString()} د.م.</div>
                    </div>
                    <Link to={`/product/${product.id}`} className="w-14 h-14 bg-gray-50 rounded-2xl text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-inner">
                      <ShoppingBag size={24} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="relative z-10 space-y-8">
             <h2 className="text-4xl md:text-6xl font-black text-white">هل تبحث عن هدية مميزة؟ 🎁</h2>
             <p className="text-gray-400 text-xl max-w-2xl mx-auto">
               سجل بريدك الإلكتروني لتصلك عروضنا السرية وكوبونات الخصم قبل الجميع.
             </p>
             <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
               <input type="email" placeholder="بريدك الإلكتروني" className="flex-grow p-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition-colors" />
               <button className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-700 shadow-xl shadow-emerald-900/20">انضم الآن</button>
             </form>
           </div>
           {/* Abstract shapes for background */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

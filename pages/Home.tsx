
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { ShoppingBag, ChevronLeft, Star, Truck, ShieldCheck, Headphones, Zap, Gift, ArrowRight, Facebook, Twitter, MessageCircle, Copy, Check } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const ProductCard: React.FC<{ product: Product, shareUrl: string }> = ({ product, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const productLink = `${shareUrl}/#/product/${product.id}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(productLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl md:rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-emerald-900/10 transition-all group border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1 md:gap-2">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black text-emerald-600 dark:text-emerald-400 shadow-sm uppercase tracking-wider">Premium</div>
        </div>
      </Link>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="text-sm md:text-lg font-black text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
        <div className="text-emerald-600 dark:text-emerald-400 font-black text-lg md:text-xl mb-4">
          {product.price.toLocaleString()} <span className="text-[10px] md:text-sm">د.م.</span>
        </div>
        
        {/* Social Share Buttons with Copy Link */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t dark:border-gray-700">
          <span className="text-[9px] font-black text-gray-400 hidden sm:block">مشاركة:</span>
          <div className="flex gap-2">
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' ' + productLink)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
              <MessageCircle size={14} />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productLink)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
              <Facebook size={14} />
            </a>
            <button 
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
              title="نسخ الرابط"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <Link to={`/product/${product.id}`} className="mr-auto w-8 h-8 md:w-10 md:h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg">
            <ShoppingBag size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const shareUrl = window.location.origin;

  return (
    <div className="overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-950 pt-8 pb-16 lg:pt-16 lg:pb-28 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-right z-10 animate-in fade-in slide-in-from-right duration-1000">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-5 py-2 rounded-full text-xs md:text-sm font-black tracking-wide">
              <Zap size={16} className="fill-emerald-600 text-emerald-600" />
              أفضل العروض المختارة في المغرب
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.15]">
              تسوق <span className="text-emerald-600 dark:text-emerald-500 relative inline-block">بذكاء<span className="absolute bottom-1 left-0 w-full h-3 bg-emerald-100 dark:bg-emerald-900/50 -z-10 rounded-full"></span></span><br/>
              مع <span className="text-gray-900 dark:text-gray-100 italic font-black underline decoration-emerald-200 dark:decoration-emerald-900/50 decoration-8 underline-offset-4">ستور بريمة</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mr-0 leading-relaxed font-bold">
              متجرنا يقدم لك أرقى المنتجات العالمية بأسعار محلية. جودة نضمنها لك وتوصيل مجاني لباب منزلك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/category/electronics" className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl transition-all shadow-xl shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-3 group">
                اكتشف العروض <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 group transition-colors">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1, 2, 3].map(i => (
                    <img key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover" src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-400">يثق بنا</div>
                  <div className="text-xs md:text-sm font-black text-gray-800 dark:text-gray-200">+15,000 عميل</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="relative z-10">
              <div className="relative group overflow-hidden rounded-[40px] md:rounded-[60px] shadow-2xl border-[6px] md:border-[12px] border-white dark:border-gray-900 transform lg:-rotate-2 hover:rotate-0 transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200" 
                  alt="Store Brima" 
                  className="w-full object-cover aspect-[4/5] md:aspect-square group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl shadow-2xl border border-emerald-50 dark:border-gray-700 hidden md:block animate-bounce-subtle">
                <div className="bg-emerald-500 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white mb-3">
                  <Truck size={22} />
                </div>
                <div className="font-black text-sm md:text-base text-gray-800 dark:text-white">توصيل مجاني</div>
                <div className="text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-black">لكل مدن المغرب</div>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* Modern Features Row */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: <Truck />, title: 'توصيل مجاني', color: 'bg-blue-500' },
            { icon: <ShieldCheck />, title: 'دفع آمن', color: 'bg-emerald-500' },
            { icon: <Headphones />, title: 'دعم مباشر', color: 'bg-purple-500' },
            { icon: <Gift />, title: 'هدايا مميزة', color: 'bg-orange-500' }
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group">
              <div className={`${feature.color} w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h4 className="text-sm md:text-lg font-black text-gray-800 dark:text-gray-100">{feature.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-right">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">وصلنا حديثاً 🤩</h2>
            <div className="h-1.5 w-24 bg-emerald-500 rounded-full"></div>
          </div>
          <Link to="/category/electronics" className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-2 hover:gap-4 transition-all">
            مشاهدة الكل <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} shareUrl={shareUrl} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-emerald-600 dark:bg-emerald-700 rounded-[40px] md:rounded-[60px] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-6 md:space-y-8">
             <h2 className="text-3xl md:text-6xl font-black text-white">اشترك لتحصل على قسيمة خصم 🎁</h2>
             <p className="text-emerald-50 dark:text-emerald-100 text-base md:text-xl max-w-2xl mx-auto font-medium">
               كن أول من يعلم بالعروض الحصرية والمنتجات الجديدة التي تصل إلى متجرنا.
             </p>
             <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
               <input type="email" placeholder="بريدك الإلكتروني" className="flex-grow p-4 md:p-5 rounded-2xl bg-white/20 border border-white/20 text-white placeholder:text-emerald-200 outline-none focus:bg-white focus:text-emerald-900 transition-all" />
               <button className="bg-white text-emerald-600 dark:text-emerald-700 px-8 py-4 md:py-5 rounded-2xl font-black hover:bg-emerald-50 transition-colors shadow-lg">اشتراك</button>
             </form>
           </div>
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { ShoppingBag, Truck, ShieldCheck, Globe, Zap, ArrowRight, Sparkles, Star } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const FeatureCard = ({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
  <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all group text-center flex flex-col items-center gap-4 hover:-translate-y-2 duration-500">
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h4 className="text-xl font-black dark:text-white">{title}</h4>
    <p className="text-gray-400 dark:text-gray-500 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Luxury Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-4 py-16 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 dark:bg-emerald-900/5 -z-10 skew-x-12 translate-x-1/4"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-200/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="space-y-10 text-center lg:text-right animate-in fade-in slide-in-from-right duration-1000">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-full text-sm font-black border border-emerald-100 dark:border-emerald-800 shadow-xl">
              <Sparkles size={18} className="animate-pulse" />
              الجودة والفخامة في كل تفصيل
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[1.1]">
              عالم من <br/>
              <span className="text-emerald-600">الخيارات</span> <br/>
              بين يديك
            </h1>
            
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mr-0 leading-relaxed font-bold">
              ستور بريمة ليس مجرد متجر، بل هو وجهتك الأولى لاكتشاف أرقى المنتجات العالمية بلمسة مغربية أصيلة وتجربة تسوق لا تنسى.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/dashboard" className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 group">
                إدارة المتجر <ArrowRight size={24} className="group-hover:-translate-x-2 transition-transform rotate-180" />
              </Link>
              <button className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-12 py-5 rounded-3xl font-black text-2xl hover:bg-gray-50 transition-all text-center shadow-lg">تعرف علينا</button>
            </div>

            {/* Trust Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t dark:border-gray-800">
               <div className="text-center lg:text-right">
                  <div className="text-3xl font-black dark:text-white">+10k</div>
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">عميل سعيد</div>
               </div>
               <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
               <div className="text-center lg:text-right">
                  <div className="text-3xl font-black dark:text-white">100%</div>
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">ضمان الجودة</div>
               </div>
               <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
               <div className="text-center lg:text-right">
                  <div className="text-3xl font-black dark:text-white">24/7</div>
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">دعم فني</div>
               </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
             <div className="relative z-10 aspect-square max-w-xl mx-auto group">
                <div className="absolute inset-0 bg-emerald-600 rounded-[100px] rotate-3 opacity-10 group-hover:rotate-6 transition-transform"></div>
                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-[100px] shadow-2xl border-8 border-white dark:border-gray-800 overflow-hidden">
                   <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
                    alt="Luxury Store Experience" 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000"
                   />
                </div>
                {/* Floating Decorative Badges */}
                <div className="absolute -top-10 -left-10 bg-emerald-600 text-white p-8 rounded-[40px] shadow-2xl border-4 border-white dark:border-gray-900 animate-bounce-subtle">
                   <Star size={40} fill="currentColor" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-2xl border-4 border-emerald-50 dark:border-gray-800">
                   <div className="text-emerald-600 font-black text-2xl">الأفضل في المغرب 🇲🇦</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950 transition-colors border-y dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Truck/>} 
              title="توصيل سريع" 
              desc="نصلك أينما كنت في المغرب في وقت قياسي وباحترافية عالية لضمان رضاكم."
              color="bg-emerald-600"
            />
            <FeatureCard 
              icon={<ShieldCheck/>} 
              title="دفع آمن" 
              desc="خيارات دفع متعددة تضمن لك الراحة والأمان التام عند التسوق من متجرنا."
              color="bg-blue-600"
            />
            <FeatureCard 
              icon={<Globe/>} 
              title="جودة عالمية" 
              desc="نختار منتجاتنا بعناية فائقة من أفضل الماركات والموردين الموثوقين عالمياً."
              color="bg-indigo-600"
            />
            <FeatureCard 
              icon={<Zap/>} 
              title="عروض حصرية" 
              desc="استفد من خصومات استثنائية وعروض يومية لا تجدها إلا في منصة ستور بريمة."
              color="bg-orange-600"
            />
          </div>
        </div>
      </section>

      {/* Brand CTA Branding Section - Final Visual Appeal */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 dark:bg-emerald-900/20 rounded-[80px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border dark:border-emerald-800/30">
          <div className="relative z-10 space-y-12">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">جاهز لبدء <br/> تجربة تسوق فريدة؟</h2>
            <p className="text-gray-400 text-xl font-bold max-w-2xl mx-auto">
              انضم إلى آلاف العملاء الذين يثقون بجودة خدماتنا ومنتجاتنا يومياً في جميع أنحاء المملكة.
            </p>
            <div className="flex justify-center">
              <Link to="/dashboard" className="bg-emerald-600 text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95">ادخل إلى لوحة التحكم</Link>
            </div>
          </div>
          {/* Subtle decoration blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
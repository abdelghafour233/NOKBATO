import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { Truck, ShieldCheck, Globe, Zap, ArrowRight, Sparkles, Star, Award } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const FeatureCard = ({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
  <div className="bg-white dark:bg-gray-900 p-10 rounded-[50px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all group text-center flex flex-col items-center gap-6 hover:-translate-y-3 duration-500">
    <div className={`${color} w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="text-2xl font-black dark:text-white">{title}</h4>
    <p className="text-gray-400 dark:text-gray-500 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Luxury Hero Section - Focus on Brand Identity */}
      <section className="relative min-h-[90vh] flex items-center px-4 py-16 overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-emerald-50/30 dark:bg-emerald-900/5 -z-10 skew-x-12 translate-x-1/4"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="space-y-12 text-center lg:text-right animate-in fade-in slide-in-from-right duration-1000">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-full text-sm font-black border border-emerald-100 dark:border-emerald-800 shadow-2xl">
              <Award size={20} className="animate-bounce" />
              الوجهة الأولى للتسوق الراقي في المغرب
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tighter">
              ستور <br/>
              <span className="text-emerald-600">بريمة</span>
            </h1>
            
            <p className="text-2xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mr-0 leading-relaxed font-bold">
              نحن لا نبيع المنتجات فقط، نحن نصنع تجربة تسوق تليق بمقامكم. جودة عالمية، إتقان مغربي، وخدمة استثنائية.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/dashboard" className="bg-emerald-600 text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-[0_20px_50px_rgba(5,150,105,0.3)] hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 group hover:scale-105 active:scale-95">
                ابدأ التجربة <ArrowRight size={28} className="group-hover:-translate-x-2 transition-transform rotate-180" />
              </Link>
              <button className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-16 py-6 rounded-3xl font-black text-2xl hover:bg-gray-50 transition-all text-center shadow-lg">
                اكتشف المزيد
              </button>
            </div>

            {/* Credibility Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-12 pt-12 border-t dark:border-gray-800">
               <div>
                  <div className="text-4xl font-black dark:text-white">+15,000</div>
                  <div className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">زبون وفي</div>
               </div>
               <div className="w-px h-12 bg-gray-200 dark:bg-gray-800"></div>
               <div>
                  <div className="text-4xl font-black dark:text-white">100%</div>
                  <div className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">رضا مضمون</div>
               </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 hidden lg:block">
             <div className="relative z-10 aspect-[4/5] max-w-lg mx-auto group">
                <div className="absolute inset-0 bg-emerald-600 rounded-[120px] rotate-6 opacity-10 group-hover:rotate-12 transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-[120px] shadow-2xl border-[12px] border-white dark:border-gray-800 overflow-hidden">
                   <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
                    alt="Luxury Branding" 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                   />
                </div>
                {/* Visual accents */}
                <div className="absolute -top-12 -left-12 bg-emerald-600 text-white p-10 rounded-[50px] shadow-2xl border-4 border-white dark:border-gray-950 animate-bounce-subtle">
                   <Star size={48} fill="currentColor" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-gray-900 dark:bg-emerald-800 p-8 rounded-[40px] shadow-2xl text-white">
                   <div className="font-black text-3xl">بريمة 🇲🇦</div>
                   <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Authentic Quality</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Brand Values & Features */}
      <section className="py-32 px-4 bg-gray-50 dark:bg-gray-950 transition-colors border-y dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-6xl font-black dark:text-white tracking-tight">لماذا ستور بريمة؟</h2>
             <div className="h-2 w-32 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard 
              icon={<Truck/>} 
              title="توصيل ملكي" 
              desc="خدمة توصيل سريعة ومجانية تغطي كافة ربوع المملكة المغربية بكل احترافية."
              color="bg-emerald-600"
            />
            <FeatureCard 
              icon={<ShieldCheck/>} 
              title="ثقة وأمان" 
              desc="نعتمد مبدأ الدفع عند الاستلام لضمان حقك وراحتك النفسية عند كل طلب."
              color="bg-blue-600"
            />
            <FeatureCard 
              icon={<Globe/>} 
              title="انتقاء عالمي" 
              desc="منتجاتنا مختارة بعناية من أرقى المصادر العالمية لتناسب ذوقكم الرفيع."
              color="bg-indigo-600"
            />
            <FeatureCard 
              icon={<Zap/>} 
              title="سرعة التجاوب" 
              desc="فريق دعم فني متواجد دائماً لخدمتكم وضمان تجربة تسوق مثالية."
              color="bg-orange-600"
            />
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-right">
             <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">وعدنا لكم بالجودة <br/> الدائمة</h2>
             <p className="text-xl text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
               في ستور بريمة، كل منتج يمر بمراحل فحص دقيقة قبل أن يصل إلى يديك. نحن نؤمن بأن التفاصيل الصغيرة هي ما يصنع الفارق الكبير.
             </p>
             <div className="space-y-4">
               {[
                 "منتجات أصلية 100%",
                 "تغليف فاخر وآمن",
                 "ضمان الاستبدال والاسترجاع",
                 "تواصل مباشر وشفاف"
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 text-emerald-600 font-black text-lg">
                    <CheckCircle className="shrink-0" size={24} />
                    <span>{item}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="lg:w-1/2 bg-emerald-600 rounded-[80px] aspect-video relative overflow-hidden shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover mix-blend-overlay opacity-60" 
               alt="Quality Commitment"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={80} className="text-white animate-pulse" />
             </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 dark:bg-emerald-900/30 rounded-[100px] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl border dark:border-emerald-800/20">
          <div className="relative z-10 space-y-12">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight">كن جزءاً من <br/> عالم بريمة</h2>
            <p className="text-emerald-100/60 text-2xl font-bold max-w-2xl mx-auto">انضم إلى مجتمعنا الراقي واكتشف معنى جديد للتسوق الإلكتروني.</p>
            <div className="flex justify-center">
              <Link to="/dashboard" className="bg-emerald-600 text-white px-20 py-8 rounded-[40px] font-black text-3xl shadow-2xl hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95">ادخل إلى المتجر</Link>
            </div>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
};

const CheckCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default HomePage;
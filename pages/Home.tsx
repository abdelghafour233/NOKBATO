import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { Truck, ShieldCheck, Globe, Zap, ArrowRight, Sparkles, Star, Award, CheckCircle2, ChevronLeft } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="group relative bg-white dark:bg-emerald-900/10 p-10 rounded-[50px] border border-gray-100 dark:border-white/5 hover:border-emerald-500 transition-all duration-500 shadow-sm hover:shadow-2xl text-center flex flex-col items-center">
    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-800/30 rounded-[28px] flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 group-hover:rotate-6 transition-transform">
      {React.cloneElement(icon, { size: 36 })}
    </div>
    <h4 className="text-2xl font-black mb-4 dark:text-white">{title}</h4>
    <p className="text-gray-400 dark:text-emerald-200/40 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className="bg-[#fcfcfc] dark:bg-gray-950 overflow-hidden">
      
      {/* Luxury Brand Hero Section */}
      <section className="relative min-h-[95vh] flex items-center px-6 pt-12 pb-24 overflow-hidden">
        {/* Abstract Artistic Backgrounds */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/[0.03] -z-10 skew-x-[-12deg] translate-x-1/4"></div>
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-emerald-500/[0.05] rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center w-full relative z-10">
          <div className="space-y-12 text-center lg:text-right">
            <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-8 py-4 rounded-full text-sm font-black border border-emerald-100 dark:border-emerald-800 animate-fade-up shadow-sm">
              <Award size={20} className="animate-bounce" />
              التميز في كل تفصيلة 🇲🇦
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-[9rem] font-black text-emerald-950 dark:text-white leading-[0.85] tracking-tighter">
              ستور <br/>
              <span className="gradient-text text-emerald-600">بريمة.</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-400 dark:text-emerald-200/40 max-w-xl mx-auto lg:mr-0 font-bold leading-relaxed">
              وجهتكم الأولى لاكتشاف أرقى المنتجات المختارة بعناية لتناسب أسلوب حياتكم العصري وبأفضل جودة في السوق.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/category/electronics" className="bg-emerald-600 text-white px-16 py-7 rounded-[35px] font-black text-2xl shadow-[0_25px_50px_rgba(5,150,105,0.3)] hover:bg-emerald-700 hover:scale-105 transition-all flex items-center justify-center gap-4 group">
                استكشف المتجر <ChevronLeft size={28} className="group-hover:-translate-x-2 transition-transform" />
              </Link>
              <button className="bg-white dark:bg-white/5 border-2 border-emerald-50 dark:border-white/10 text-emerald-900 dark:text-white px-16 py-7 rounded-[35px] font-black text-2xl hover:bg-emerald-50 transition-all shadow-xl">
                من نحن
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-12 pt-12 border-t border-emerald-100/50 dark:border-emerald-900/50">
               <div>
                  <div className="text-5xl font-black text-emerald-900 dark:text-white">+20k</div>
                  <div className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">زبون وفـي</div>
               </div>
               <div className="w-px h-16 bg-emerald-100 dark:bg-emerald-900"></div>
               <div>
                  <div className="text-5xl font-black text-emerald-900 dark:text-white">100%</div>
                  <div className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">ضمان الجودة</div>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-end animate-in zoom-in duration-1000 delay-300">
            <div className="relative w-full max-w-lg aspect-[4/5]">
               <div className="absolute inset-0 bg-emerald-600 rounded-[160px] rotate-6 opacity-10 animate-pulse"></div>
               <div className="absolute inset-0 bg-emerald-950 rounded-[160px] shadow-2xl border-[15px] border-white dark:border-gray-900 overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1541600391308-e859961922c3?auto=format&fit=crop&q=80&w=1200" 
                    alt="Luxury Experience" 
                    className="w-full h-full object-cover opacity-60 grayscale-[0.5] group-hover:scale-110 group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles size={120} className="text-emerald-400/30" />
                  </div>
               </div>
               
               <div className="absolute -top-12 -left-12 bg-emerald-600 text-white p-12 rounded-[60px] shadow-2xl animate-float">
                  <Star size={64} fill="currentColor" />
               </div>
               <div className="absolute -bottom-12 -right-12 glass-nav p-10 rounded-[50px] shadow-2xl border border-white/20">
                  <div className="font-black text-3xl text-emerald-900 dark:text-emerald-400">بريمة 🇲🇦</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Authentic Luxury</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-40 px-6 bg-emerald-50 dark:bg-emerald-950/20 border-y border-emerald-100 dark:border-emerald-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
             <h2 className="text-5xl md:text-7xl font-black text-emerald-950 dark:text-white tracking-tight">التزامنا تجاهكم</h2>
             <div className="h-2 w-40 bg-emerald-600 mx-auto rounded-full"></div>
             <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto">نحن نبني جسور الثقة مع عملائنا من خلال تقديم أفضل تجربة تسوق ممكنة في المغرب.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard 
              icon={<Truck/>} 
              title="توصيل ملكي" 
              desc="خدمة توصيل سريعة ومجانية تغطي كافة ربوع المملكة بكل احترافية وأمان."
            />
            <FeatureCard 
              icon={<ShieldCheck/>} 
              title="ضمان حقيقي" 
              desc="كل منتج في بريمة هو منتج أصلي خاضع لأعلى معايير فحص الجودة العالمية."
            />
            <FeatureCard 
              icon={<Globe/>} 
              title="دفع آمن" 
              desc="راحة بالكم تهمنا، لذا نوفر خدمة الدفع عند الاستلام بعد التأكد من منتجكم."
            />
            <FeatureCard 
              icon={<Zap/>} 
              title="تواصل ذكي" 
              desc="فريقنا متواجد دائماً للإجابة على تساؤلاتكم وضمان رضاكم التام."
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-1/2 space-y-10 text-right">
             <h2 className="text-5xl md:text-8xl font-black text-emerald-950 dark:text-white leading-[0.9]">الجودة <br/> هي عنواننا</h2>
             <p className="text-2xl text-gray-500 dark:text-emerald-200/40 font-bold leading-relaxed">
               في ستور بريمة، لا نبحث فقط عن بيع المنتجات، بل نبحث عن وضع بصمة من الجودة والجمال في حياتكم اليومية من خلال قطعنا المختارة.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
               {[
                 "فحص دقيق لكل شحنة",
                 "تغليف عصري وفاخر",
                 "سياسة استبدال مرنة",
                 "منتجات حصرية ونادرة"
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 text-emerald-600 font-black text-xl">
                    <CheckCircle2 className="shrink-0 text-emerald-500" size={28} />
                    <span>{item}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="bg-emerald-900 rounded-[100px] aspect-square rotate-3 relative overflow-hidden shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover opacity-50 mix-blend-luminosity" 
                  alt="Quality Commitment"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto bg-emerald-950 rounded-[120px] p-20 md:p-32 text-center relative overflow-hidden shadow-2xl border border-white/5">
          <div className="relative z-10 space-y-16">
            <h2 className="text-6xl md:text-9xl font-black text-white leading-tight">انضم إلى <br/> عالمنا الخاص</h2>
            <p className="text-emerald-200/40 text-2xl md:text-3xl font-bold max-w-2xl mx-auto">تجربة التسوق التي تليق بك تبدأ من هنا. جودة، سرعة، وفخامة.</p>
            <div className="flex justify-center">
              <Link to="/category/electronics" className="bg-emerald-600 text-white px-24 py-9 rounded-[45px] font-black text-4xl shadow-2xl hover:bg-emerald-500 hover:scale-105 transition-all active:scale-95">ادخل المتجر</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { Star, ShoppingBag, Zap } from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative h-64 md:h-96 bg-brand-slate rounded-[40px] overflow-hidden flex items-center px-10">
          <div className="relative z-10 space-y-4 max-w-lg">
            <span className="bg-brand-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">جديدنا اليوم</span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight">عالم من الجودة <br/> بين يديك 🇲🇦</h1>
            <p className="text-gray-400 font-medium hidden md:block">نحن نختار لك الأفضل، لنوفر عليك عناء البحث.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" className="absolute left-0 top-0 h-full w-1/2 object-cover opacity-30 md:opacity-100 mask-fade-right" />
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10 border-r-4 border-brand-primary pr-4">
          <div>
            <h2 className="text-3xl font-black">اكتشف منتجاتنا</h2>
            <p className="text-gray-400 font-bold">أحدث التشكيلات المتوفرة حالياً</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="product-card rounded-[30px] p-4 flex flex-col group">
              <Link to={`/product/${product.id}`} className="aspect-square rounded-[25px] overflow-hidden bg-gray-50 mb-4 block">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
              </Link>
              <h3 className="text-lg font-black line-clamp-1 mb-2 group-hover:text-brand-primary transition-colors">{product.name}</h3>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                <span className="text-[10px] text-gray-300 font-black mr-1">(4.9)</span>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-brand-primary">{product.price} <span className="text-xs">د.م</span></span>
                  <span className="text-[10px] text-gray-300 line-through font-bold">{(product.price * 1.3).toFixed(0)} د.م</span>
                </div>
                <Link to={`/product/${product.id}`} className="p-3 bg-brand-slate text-white rounded-2xl hover:bg-brand-primary hover:scale-110 transition-all">
                  <ShoppingBag size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

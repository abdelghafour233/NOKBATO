
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
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative h-64 md:h-96 bg-brand-slate rounded-[30px] md:rounded-[40px] overflow-hidden flex items-center px-6 md:px-10">
          <div className="relative z-10 space-y-4 max-w-lg">
            <span className="inline-block bg-brand-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">أفضل العروض في المغرب 🇲🇦</span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight">جودة نثق بها <br/> وأسعار تنافسية</h1>
            <p className="text-gray-400 font-medium hidden md:block">نوفر لكم أفضل المنتجات المختارة بعناية مع التوصيل المجاني والدفع عند الاستلام.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" className="absolute left-0 top-0 h-full w-full md:w-1/2 object-cover opacity-20 md:opacity-100 mask-fade-right" alt="Hero Background" />
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8 border-r-4 border-brand-primary pr-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">منتجاتنا المختارة</h2>
            <p className="text-gray-400 font-bold text-sm">توصيل مجاني لجميع المدن</p>
          </div>
        </div>

        {/* 
            Grid Config:
            grid-cols-2 -> الهاتف (منتجين)
            md:grid-cols-3 -> الأجهزة اللوحية (3 منتجات)
            lg:grid-cols-4 -> الحاسوب (4 منتجات)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map(product => (
            <div key={product.id} className="product-card rounded-[20px] md:rounded-[30px] p-3 md:p-4 flex flex-col group h-full">
              <Link to={`/product/${product.id}`} className="aspect-square rounded-[15px] md:rounded-[25px] overflow-hidden bg-gray-50 mb-3 md:mb-4 block">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
              </Link>
              
              <h3 className="text-sm md:text-lg font-black line-clamp-2 mb-1 md:mb-2 group-hover:text-brand-primary transition-colors h-10 md:h-14">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                <span className="text-[9px] md:text-[10px] text-gray-300 font-black mr-1">(4.9)</span>
              </div>

              <div className="mt-auto flex justify-between items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-lg md:text-2xl font-black text-brand-primary whitespace-nowrap">{product.price} <span className="text-[10px] md:text-xs">د.م</span></span>
                  <span className="text-[9px] md:text-[10px] text-gray-300 line-through font-bold">{(product.price * 1.3).toFixed(0)} د.م</span>
                </div>
                <Link to={`/product/${product.id}`} className="p-2 md:p-3 bg-brand-slate text-white rounded-xl md:rounded-2xl hover:bg-brand-primary transition-all shrink-0">
                  <ShoppingBag size={18} />
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

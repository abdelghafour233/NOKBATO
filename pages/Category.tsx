
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag, Watch, Glasses, Laptop, Home, Car } from 'lucide-react';

interface CategoryPageProps {
  products: Product[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  
  const categoryInfo: Record<string, { title: string, icon: React.ReactNode }> = {
    electronics: { title: 'الإلكترونيات', icon: <Laptop className="text-emerald-500" /> },
    home: { title: 'مستلزمات المنزل', icon: <Home className="text-emerald-500" /> },
    cars: { title: 'السيارات', icon: <Car className="text-emerald-500" /> },
    watches: { title: 'الساعات الفاخرة', icon: <Watch className="text-emerald-500" /> },
    glasses: { title: 'النظارات العصرية', icon: <Glasses className="text-emerald-500" /> }
  };

  const currentCategory = categoryInfo[id || ''] || { title: 'المنتجات', icon: null };
  const filteredProducts = products.filter(p => p.category === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-inner">
          {currentCategory.icon}
        </div>
        <div className="text-center md:text-right">
          <h1 className="text-5xl font-black mb-2">{currentCategory.title}</h1>
          <p className="text-gray-400 font-bold">تصفح أفضل التشكيلات المختارة بعناية</p>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100 flex flex-col">
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 right-4">
                     <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-emerald-600 shadow-xl">جديد</div>
                  </div>
                </Link>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-gray-400 text-sm font-bold line-clamp-2 mb-4">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto border-t pt-6">
                    <div>
                       <div className="text-3xl font-black text-emerald-600">{product.price.toLocaleString()} <span className="text-sm">د.م.</span></div>
                    </div>
                    <Link to={`/product/${product.id}`} className="w-14 h-14 bg-gray-900 rounded-2xl text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl">
                      <ShoppingBag size={24} />
                    </Link>
                  </div>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-100">
          <div className="text-9xl mb-8 grayscale opacity-20">📦</div>
          <h2 className="text-3xl font-black text-gray-400">لا توجد منتجات حالياً في هذه الفئة</h2>
          <Link to="/" className="mt-8 inline-block text-emerald-600 font-black hover:underline">العودة للرئيسية</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

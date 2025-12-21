
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';

interface CategoryPageProps {
  products: Product[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  
  const categoryTitles: Record<string, string> = {
    electronics: 'الإلكترونيات',
    home: 'مستلزمات المنزل',
    cars: 'السيارات'
  };

  const filteredProducts = products.filter(p => p.category === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{categoryTitles[id || ''] || 'المنتجات'}</h1>
        <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group border border-gray-100">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </Link>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-2xl font-black text-emerald-600">{product.price.toLocaleString()} <span className="text-sm">د.م.</span></div>
                    <Link to={`/product/${product.id}`} className="p-3 bg-gray-50 rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                    </Link>
                  </div>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-3xl">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-400">لا توجد منتجات حالياً في هذه الفئة</h2>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart, Heart, Share2, CheckCircle, Truck, RefreshCcw } from 'lucide-react';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return <div className="py-24 text-center">المنتج غير موجود</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-[40px] overflow-hidden shadow-inner border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border bg-white cursor-pointer hover:border-emerald-500 transition-colors">
                <img src={`https://picsum.photos/seed/${product.id}${i}/200/200`} alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">منتج أصلي</span>
            <h1 className="text-4xl font-black mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6 text-yellow-400">
               {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
               <span className="text-gray-400 text-sm mr-2">(45 تقييم)</span>
            </div>
            <div className="text-5xl font-black text-emerald-600 mb-6">
              {product.price.toLocaleString()} <span className="text-lg">د.م.</span>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed border-t pt-6">
              {product.description}
              <br/><br/>
              هذا المنتج هو الأفضل في فئته، يتميز بجودة الصنع وكفاءة الأداء العالية التي تلبي تطلعاتكم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y py-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Truck size={24} /></div>
              <span className="text-xs font-bold">توصيل مجاني</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-emerald-50 p-3 rounded-full text-emerald-600"><CheckCircle size={24} /></div>
              <span className="text-xs font-bold">ضمان سنتين</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-orange-50 p-3 rounded-full text-orange-600"><RefreshCcw size={24} /></div>
              <span className="text-xs font-bold">إرجاع خلال 15 يوم</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              className={`flex-grow py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl ${isAdded ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white transform hover:-translate-y-1'}`}
            >
              {isAdded ? (
                <>
                  <CheckCircle size={24} /> تم الإضافة
                </>
              ) : (
                <>
                  <ShoppingCart size={24} /> إضافة إلى السلة
                </>
              )}
            </button>
            <button className="p-5 border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-colors">
              <Heart size={28} />
            </button>
            <button className="p-5 border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-colors">
              <Share2 size={28} />
            </button>
          </div>
          
          <button 
            onClick={() => {
              addToCart(product);
              navigate('/checkout');
            }}
            className="w-full py-4 border-2 border-emerald-600 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-colors"
          >
            اشتري الآن مباشرة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

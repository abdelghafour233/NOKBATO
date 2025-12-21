
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart, Heart, Share2, CheckCircle, Truck, RefreshCcw, ChevronRight, ChevronLeft } from 'lucide-react';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return <div className="py-24 text-center">المنتج غير موجود</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Gallery Section */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-[50px] overflow-hidden shadow-2xl border-4 border-white relative group">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {galleryImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 {/* Navigation dots could be added here if needed */}
              </div>
            )}
          </div>
          
          {/* Thumbnails Grid */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-emerald-500 scale-105 shadow-lg' : 'border-white shadow-sm hover:border-emerald-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black shadow-sm">الأصلي 100%</span>
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-widest">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 text-yellow-400">
               {[1,2,3,4,5].map(i => <span key={i} className="text-xl">★</span>)}
               <span className="text-gray-400 text-sm font-bold mr-2">(تم تأكيد الجودة من قبل +500 زبون)</span>
            </div>
            <div className="flex items-baseline gap-4 mt-6">
              <div className="text-6xl font-black text-emerald-600 tracking-tighter">
                {product.price.toLocaleString()} <span className="text-xl">د.م.</span>
              </div>
              <div className="text-2xl text-gray-300 font-bold line-through">
                {(product.price * 1.3).toLocaleString()} د.م.
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed border-t border-gray-100 pt-8 font-medium">
            {product.description || "هذا المنتج مصمم بعناية فائقة ليلبي جميع احتياجاتكم. يتميز بجودة الخامات واللمسة العصرية التي تناسب ذوقكم الرفيع."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600"><Truck size={24} /></div>
              <span className="text-xs font-black">توصيل مجاني وسريع</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-600"><CheckCircle size={24} /></div>
              <span className="text-xs font-black">الدفع عند الاستلام</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-orange-600"><RefreshCcw size={24} /></div>
              <span className="text-xs font-black">إمكانية التغيير</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleAddToCart}
              className={`flex-grow py-6 rounded-[28px] font-black text-2xl flex items-center justify-center gap-4 transition-all shadow-2xl ${isAdded ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white transform hover:-translate-y-1'}`}
            >
              {isAdded ? (
                <>
                  <CheckCircle size={28} /> تم الحفظ في السلة
                </>
              ) : (
                <>
                  <ShoppingCart size={28} /> إضافة إلى السلة
                </>
              )}
            </button>
            <button className="p-6 border-2 border-gray-100 rounded-[28px] text-gray-400 hover:text-red-500 hover:border-red-50 transition-all bg-white shadow-sm group">
              <Heart size={32} className="group-hover:fill-current" />
            </button>
          </div>
          
          <button 
            onClick={() => {
              addToCart(product);
              navigate('/checkout');
            }}
            className="w-full py-5 border-4 border-gray-900 text-gray-900 rounded-[28px] font-black text-xl hover:bg-gray-900 hover:text-white transition-all shadow-lg"
          >
            اشتري الآن مباشرة - الدفع عند الاستلام
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

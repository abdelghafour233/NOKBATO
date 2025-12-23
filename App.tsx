
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Menu, X, CreditCard, Watch, Glasses } from 'lucide-react';
import { Product, Order, AppSettings, CartItem } from './types.ts';
import { getStoredProducts, getStoredOrders, getStoredSettings, saveOrders } from './store.ts';

// Pages
import HomePage from './pages/Home.tsx';
import CategoryPage from './pages/Category.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CartPage from './pages/Cart.tsx';
import CheckoutPage from './pages/Checkout.tsx';
import DashboardPage from './pages/Dashboard.tsx';

const SEOManager: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title & Meta based on Route
    const path = location.pathname;
    let title = "ستور حلال - تسوق أفضل المنتجات";
    let description = "اكتشف أفضل العروض على الإلكترونيات والساعات في المغرب.";

    if (path === '/') {
      title = "الرئيسية | ستور حلال - جودة وسعر";
    } else if (path.includes('/category/')) {
      const cat = path.split('/').pop();
      title = `قسم ${cat} | ستور حلال`;
    } else if (path.includes('/product/')) {
      title = "عرض المنتج | ستور حلال";
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);

    // 2. Pixel Injection Logic (Placeholder for real scripts)
    if (settings.fbPixelId) {
      console.log(`FB Pixel Active: ${settings.fbPixelId}`);
    }
  }, [location, settings]);

  return null;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <HashRouter>
      <SEOManager settings={settings} />
      <div className="min-h-screen flex flex-col font-cairo">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-gray-100"
                  aria-label="القائمة"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Link to="/" className="text-2xl font-black text-emerald-600 tracking-tight ml-4">
                  ستور حلال
                </Link>
                <div className="hidden lg:flex gap-6 mr-4">
                  <Link to="/" className="text-gray-600 hover:text-emerald-600 font-bold transition-colors">الرئيسية</Link>
                  <Link to="/category/electronics" className="text-gray-600 hover:text-emerald-600 font-bold transition-colors">إلكترونيات</Link>
                  <Link to="/category/watches" className="text-gray-600 hover:text-emerald-600 font-bold flex items-center gap-1 transition-colors"><Watch size={18}/> ساعات</Link>
                  <Link to="/category/glasses" className="text-gray-600 hover:text-emerald-600 font-bold flex items-center gap-1 transition-colors"><Glasses size={18}/> نظارات</Link>
                  <Link to="/category/home" className="text-gray-600 hover:text-emerald-600 font-bold transition-colors">منزل</Link>
                  <Link to="/category/cars" className="text-gray-600 hover:text-emerald-600 font-bold transition-colors">سيارات</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-500 hover:text-emerald-600 p-2 hidden md:block transition-colors" title="لوحة التحكم">
                  <LayoutDashboard size={22} />
                </Link>
                <Link to="/cart" className="relative p-3 bg-gray-50 rounded-2xl text-gray-700 hover:bg-emerald-600 hover:text-white transition-all" aria-label="سلة التسوق">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black shadow-lg">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-white p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-3 text-gray-700 font-black border-b">الرئيسية</Link>
              <Link to="/category/electronics" onClick={() => setIsMenuOpen(false)} className="block py-3 text-gray-700 font-black border-b">إلكترونيات</Link>
              <Link to="/category/watches" onClick={() => setIsMenuOpen(false)} className="block py-3 text-emerald-600 font-black border-b flex items-center gap-2"><Watch size={20}/> ساعات</Link>
              <Link to="/category/glasses" onClick={() => setIsMenuOpen(false)} className="block py-3 text-emerald-600 font-black border-b flex items-center gap-2"><Glasses size={20}/> نظارات</Link>
              <Link to="/category/home" onClick={() => setIsMenuOpen(false)} className="block py-3 text-gray-700 font-black border-b">منزل</Link>
              <Link to="/category/cars" onClick={() => setIsMenuOpen(false)} className="block py-3 text-gray-700 font-black border-b">سيارات</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-4 text-emerald-600 font-black bg-emerald-50 rounded-2xl px-4">لوحة التحكم</Link>
            </div>
          )}
        </nav>

        {/* Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} />} />
            <Route path="/category/:id" element={<CategoryPage products={products} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
            <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
            <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-emerald-600 mb-4 font-black">ستور حلال</h3>
              <p className="text-gray-500 leading-relaxed font-medium">وجهتكم الأولى للتسوق الإلكتروني في المغرب. جودة عالية وأسعار منافسة وتوصيل سريع.</p>
            </div>
            <div>
              <h4 className="font-black mb-4">أقسام المتجر</h4>
              <ul className="space-y-2 text-gray-500 font-bold">
                <li><Link to="/category/watches" className="hover:text-emerald-600 transition-colors">الساعات الفاخرة</Link></li>
                <li><Link to="/category/glasses" className="hover:text-emerald-600 transition-colors">النظارات العصرية</Link></li>
                <li><Link to="/category/electronics" className="hover:text-emerald-600 transition-colors">الإلكترونيات</Link></li>
                <li><Link to="/category/home" className="hover:text-emerald-600 transition-colors">المنزل</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4">الدعم الفني</h4>
              <ul className="space-y-2 text-gray-500 font-bold">
                <li className="hover:text-emerald-600 cursor-pointer">سياسة الخصوصية</li>
                <li className="hover:text-emerald-600 cursor-pointer">الشروط والأحكام</li>
                <li className="hover:text-emerald-600 cursor-pointer">تواصل معنا</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4">طرق الدفع</h4>
              <div className="flex gap-4 items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                 <CreditCard className="text-emerald-600" aria-hidden="true" />
                 <span className="text-emerald-900 font-black text-sm">الدفع عند الاستلام (COD)</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-12 text-gray-400 border-t pt-8 font-bold">
            &copy; 2024 ستور حلال. جميع الحقوق محفوظة.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

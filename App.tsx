
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Menu, X, CreditCard, Watch, Glasses, Smartphone, Home, Car, ShoppingBag, Sun, Moon, Truck, Star, Settings as SettingsIcon } from 'lucide-react';
import { Product, Order, AppSettings, CartItem } from './types.ts';
import { getStoredProducts, getStoredOrders, getStoredSettings, saveOrders, trackVisit } from './store.ts';

// Pages
import HomePage from './pages/Home.tsx';
import CategoryPage from './pages/Category.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CartPage from './pages/Cart.tsx';
import CheckoutPage from './pages/Checkout.tsx';
import DashboardPage from './pages/Dashboard.tsx';

export const trackFBEvent = (eventName: string, params?: object) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

const SEOManager: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const location = useLocation();
  useEffect(() => {
    trackVisit();
    const path = location.pathname;
    let title = "ستور بريمة | فخامة التسوق المغربي";
    if (path === '/') title = "الرئيسية | ستور بريمة";
    else if (path.includes('/product/')) title = "طلب منتج | ستور بريمة";
    document.title = title;

    if (settings.fbPixelId) {
      const fbScriptId = 'fb-pixel-logic';
      if (!document.getElementById(fbScriptId)) {
        const script = document.createElement('script');
        script.id = fbScriptId;
        script.text = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.fbPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }
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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const location = useLocation();

  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    trackFBEvent('AddToCart', { content_name: product.name, value: product.price, currency: 'MAD' });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  const categoryShortcuts = [
    { id: 'electronics', label: 'إلكترونيات', icon: <Smartphone size={18}/> },
    { id: 'watches', label: 'ساعات', icon: <Watch size={18}/> },
    { id: 'cars', label: 'السيارات', icon: <Car size={18}/> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-[#fcfcfc] dark:bg-gray-950">
      <SEOManager settings={settings} />
      
      {/* Top Floating Nav */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-3">
        <nav className="max-w-7xl mx-auto glass-nav rounded-[24px] shadow-lg border border-white/20 dark:border-white/5 overflow-hidden transition-all duration-300">
          <div className="px-6 h-16 md:h-20 flex justify-between items-center">
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-emerald-200 shadow-lg group-hover:rotate-12 transition-transform">
                <ShoppingBag size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-emerald-900 dark:text-emerald-400 leading-none">ستور بريمة</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Premium Quality</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className={`text-sm font-bold transition-colors ${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}>الرئيسية</Link>
              {categoryShortcuts.map(cat => (
                <Link key={cat.id} to={`/category/${cat.id}`} className={`text-sm font-bold transition-colors ${location.pathname.includes(cat.id) ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}>
                  {cat.label}
                </Link>
              ))}
              <Link to="/dashboard" className={`text-sm font-black flex items-center gap-2 transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}>
                <LayoutDashboard size={18} /> لوحة التحكم
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-gray-100 dark:bg-emerald-900/40 text-gray-600 dark:text-yellow-400 transition-all">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <Link to="/cart" className="relative p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-105 transition-all">
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white dark:border-emerald-600">
                    {cart.length}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-emerald-950 shadow-2xl transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 flex justify-between items-center border-b dark:border-emerald-900">
            <span className="text-2xl font-black text-emerald-600">القائمة</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-emerald-900 rounded-xl"><X size={24}/></button>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-emerald-900/30 text-lg font-black"><Home size={20}/> الرئيسية</Link>
            {categoryShortcuts.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl text-lg font-bold text-gray-600 dark:text-gray-300">{cat.icon} {cat.label}</Link>
            ))}
            <div className="pt-8">
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 w-full p-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 dark:shadow-none"><LayoutDashboard size={20}/> لوحة التحكم</Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow pt-24 md:pt-32 pb-24 lg:pb-0">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/category/:id" element={<CategoryPage products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
          <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
        </Routes>
      </main>

      {/* Floating Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <div className="glass-nav rounded-[28px] shadow-2xl border border-white/20 dark:border-white/5 flex items-center justify-around p-2">
          <Link to="/" className={`flex flex-col items-center p-3 rounded-2xl ${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <Home size={20} />
            <span className="text-[10px] font-black mt-1">الرئيسية</span>
          </Link>
          <Link to="/category/electronics" className={`flex flex-col items-center p-3 rounded-2xl ${location.pathname.startsWith('/category') ? 'text-emerald-600' : 'text-gray-400'}`}>
            <ShoppingBag size={20} />
            <span className="text-[10px] font-black mt-1">المتجر</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center p-3 rounded-2xl relative ${location.pathname === '/cart' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <ShoppingCart size={20} />
            <span className="text-[10px] font-black mt-1">السلة</span>
            {cart.length > 0 && <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full"></span>}
          </Link>
          <Link to="/dashboard" className={`flex flex-col items-center p-3 rounded-2xl ${location.pathname.startsWith('/dashboard') ? 'text-emerald-600' : 'text-gray-400'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black mt-1">إدارة</span>
          </Link>
        </div>
      </div>

      <footer className="bg-emerald-950 text-white pt-24 pb-32 lg:pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><ShoppingBag size={24}/></div>
              <span className="text-2xl font-black">ستور بريمة</span>
            </div>
            <p className="text-emerald-200/60 font-bold leading-relaxed">نحن نؤمن بأن الجودة لا تحتاج إلى تعقيد. متجر بريمة هو تجسيد للبساطة والفخامة في آن واحد.</p>
          </div>
          <div>
            <h4 className="text-xl font-black mb-8">روابط سريعة</h4>
            <ul className="space-y-4 text-emerald-200/70 font-bold">
              <li><Link to="/">الرئيسية</Link></li>
              <li><Link to="/dashboard">لوحة التحكم</Link></li>
              <li><Link to="/category/electronics">الإلكترونيات</Link></li>
              <li><Link to="/category/watches">الساعات</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-black mb-8">عن المتجر</h4>
            <ul className="space-y-4 text-emerald-200/70 font-bold">
              <li>سياسة التوصيل</li>
              <li>سياسة الاستبدال</li>
              <li>تواصل معنا</li>
            </ul>
          </div>
          <div>
            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
              <h4 className="text-xl font-black mb-4">الدفع عند الاستلام</h4>
              <p className="text-emerald-200/50 text-sm font-bold mb-6">تسوق بكل أمان، ادفع فقط عندما تلمس منتجك وتتأكد من جودته.</p>
              <div className="flex items-center gap-3 bg-emerald-600 px-6 py-4 rounded-2xl font-black text-sm">
                <Truck size={20} /> توصيل مجاني سريع
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-emerald-200/30 text-xs font-black uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Store Brima. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

const Main: React.FC = () => (
  <HashRouter>
    <App />
  </HashRouter>
);
export default Main;

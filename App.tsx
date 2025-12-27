import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Menu, X, CreditCard, Watch, Glasses, Smartphone, Home, Car, ShoppingBag, Sun, Moon, Truck } from 'lucide-react';
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
    const path = location.pathname;
    let title = "ستور بريمة - تسوق أفضل المنتجات";
    let description = "اكتشف أفضل العروض على الإلكترونيات والساعات في المغرب.";

    if (path === '/') {
      title = "الرئيسية | ستور بريمة - جودة وسعر";
    } else if (path.includes('/category/')) {
      const cat = path.split('/').pop();
      title = `قسم ${cat} | ستور بريمة`;
    } else if (path.includes('/product/')) {
      title = "عرض المنتج | ستور بريمة";
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);

    // Facebook Pixel Logic
    const fbScriptId = 'fb-pixel-logic';
    const oldFbScript = document.getElementById(fbScriptId);
    if (oldFbScript) oldFbScript.remove();

    if (settings.fbPixelId) {
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
        ${settings.fbTestEventCode ? `fbq('set', 'test_event_code', '${settings.fbTestEventCode}');` : ''}
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    // Google AdSense Logic
    const adsenseScriptId = 'adsense-logic';
    const oldAdsenseScript = document.getElementById(adsenseScriptId);
    if (oldAdsenseScript) oldAdsenseScript.remove();

    if (settings.googleAdSenseId) {
      const script = document.createElement('script');
      script.id = adsenseScriptId;
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.googleAdSenseId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
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
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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

  const categoryShortcuts = [
    { id: 'electronics', label: 'إلكترونيات', icon: <Smartphone size={20}/> },
    { id: 'watches', label: 'ساعات', icon: <Watch size={20}/> },
    { id: 'glasses', label: 'نظارات', icon: <Glasses size={20}/> },
    { id: 'cars', label: 'السيارات', icon: <Car size={20}/> },
    { id: 'home', label: 'المنزل', icon: <Home size={20}/> },
  ];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-[#FDFDFD] dark:bg-gray-950 transition-colors duration-300">
      <SEOManager settings={settings} />
      
      {/* Sticky Header Container */}
      <div className="sticky top-0 z-50">
        {/* Announcement Bar */}
        <div className="bg-emerald-600 dark:bg-emerald-700 text-white py-2 text-center text-[10px] sm:text-xs md:text-sm font-black tracking-wide shadow-md flex items-center justify-center gap-2 overflow-hidden">
          <div className="animate-pulse flex items-center gap-2">
            <Truck size={16} className="hidden xs:block" />
            التوصيل بالمجان والدفع عند الاستلام في جميع مدن المغرب 🇲🇦
          </div>
        </div>

        {/* Modern Navigation */}
        <nav className="glass border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 md:h-20 items-center">
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                  aria-label="القائمة"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Link to="/" className="text-xl md:text-2xl font-black text-emerald-600 tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <ShoppingBag size={20} />
                  </div>
                  <span className="hidden xs:inline dark:text-emerald-500 font-black">ستور بريمة</span>
                </Link>
                <div className="hidden lg:flex gap-4 xl:gap-6 mr-6 xl:mr-8 border-r dark:border-gray-800 pr-6 xl:pr-8">
                  <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 font-bold transition-all text-xs xl:text-sm">الرئيسية</Link>
                  {categoryShortcuts.map(cat => (
                    <Link key={cat.id} to={`/category/${cat.id}`} className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 font-bold transition-all text-xs xl:text-sm flex items-center gap-1">
                      {cat.icon} {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 md:p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-all shadow-inner"
                  title={darkMode ? "تبديل للنظام النهاري" : "تبديل للنظام الليلي"}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Dashboard Link - Now visible on mobile header too */}
                <Link to="/dashboard" className="text-gray-400 hover:text-emerald-600 p-2 transition-all" title="لوحة التحكم">
                  <LayoutDashboard size={22} />
                </Link>
                
                <Link to="/cart" className="relative p-2.5 md:p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" aria-label="سلة التسوق">
                  <ShoppingCart size={20} className="md:w-6 md:h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full font-black shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Category Scroll Bar */}
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 flex overflow-x-auto no-scrollbar py-3 px-2 gap-3 shadow-inner">
            {categoryShortcuts.map(cat => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.id}`} 
                className={`flex flex-col items-center gap-1.5 min-w-[70px] shrink-0 p-2 rounded-2xl transition-colors ${location.pathname === `/category/${cat.id}` ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'text-gray-500'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${location.pathname === `/category/${cat.id}` ? 'bg-emerald-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-500'}`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-black">{cat.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>
          <div className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-[60] transform transition-transform duration-300 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-500 font-black">القائمة</div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg dark:text-gray-300"><X size={24}/></button>
            </div>
            <div className="p-4 space-y-2 h-[calc(100%-80px)] overflow-y-auto">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block p-4 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-all">الرئيسية</Link>
                {categoryShortcuts.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.id}`} onClick={() => setIsMenuOpen(false)} className="block p-4 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-all flex items-center gap-3">
                    {cat.icon} {cat.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t dark:border-gray-800">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block p-4 bg-gray-900 dark:bg-emerald-600 text-white font-black rounded-xl text-center shadow-lg">لوحة التحكم</Link>
                </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Content */}
      <main className="flex-grow pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/category/:id" element={<CategoryPage products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
          <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
        <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[30px] shadow-2xl flex items-center justify-around p-2 pointer-events-auto">
          <Link to="/" className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${location.pathname === '/' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}>
            <Home size={22} strokeWidth={location.pathname === '/' ? 3 : 2} />
            <span className="text-[9px] font-black">الرئيسية</span>
          </Link>
          <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Menu size={22} />
            <span className="text-[9px] font-black">الأقسام</span>
          </button>
          <Link to="/cart" className={`relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${location.pathname === '/cart' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}>
            <ShoppingCart size={22} strokeWidth={location.pathname === '/cart' ? 3 : 2} />
            <span className="text-[9px] font-black">السلة</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/dashboard" className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${location.pathname.startsWith('/dashboard') ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}>
            <LayoutDashboard size={22} strokeWidth={location.pathname.startsWith('/dashboard') ? 3 : 2} />
            <span className="text-[9px] font-black">لوحة التحكم</span>
          </Link>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 pt-16 pb-32 md:pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-500 font-black">ستور بريمة</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm">وجهتكم الموثوقة للتسوق الإلكتروني الراقي في المغرب. نهتم بأدق التفاصيل لضمان رضاكم.</p>
          </div>
          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">أقسامنا</h4>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400 font-bold text-sm">
              {categoryShortcuts.map(cat => (
                <li key={cat.id}><Link to={`/category/${cat.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{cat.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">مساعدة</h4>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400 font-bold text-sm">
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">سياسة الاستبدال</li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">الأسئلة الشائعة</li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">تواصل معنا</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">الدفع المريح</h4>
            <div className="flex flex-col gap-3">
               <div className="flex items-center justify-center md:justify-start gap-3 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                  <CreditCard className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-900 dark:text-emerald-100 font-black text-sm">الدفع عند الاستلام</span>
               </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 text-gray-400 dark:text-gray-600 border-t dark:border-gray-800 pt-8 font-bold text-xs">
          &copy; {new Date().getFullYear()} ستور بريمة. جودة وأناقة مغربية.
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
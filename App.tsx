
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Menu, X, ShoppingBag, Sun, Moon, Home, Search, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { Product, Order, AppSettings, CartItem } from './types.ts';
import { getStoredProducts, getStoredOrders, getStoredSettings, trackVisit } from './store.ts';

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

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    trackVisit();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-brand-dark transition-colors duration-500">
      
      {/* Sleek Minimalist Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3">
             <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]">
               <ShoppingBag size={24} />
             </div>
             <div className="flex flex-col">
               <span className="text-xl md:text-2xl font-black tracking-tighter text-white">ستور بريمة</span>
               <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.2em]">Luxury Shopping</span>
             </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <NavLink to="/" current={location.pathname === '/'}>الرئيسية</NavLink>
            <NavLink to="/category/electronics" current={location.pathname.includes('electronics')}>الإلكترونيات</NavLink>
            <NavLink to="/category/watches" current={location.pathname.includes('watches')}>الساعات</NavLink>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-black text-brand-primary hover:text-white transition-colors">
              <LayoutDashboard size={18} /> لوحة التحكم
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <Link to="/cart" className="relative p-3 text-slate-300 hover:text-brand-primary transition-colors">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute top-1 left-1 w-5 h-5 bg-brand-primary text-white text-[10px] flex items-center justify-center rounded-full font-black ring-4 ring-brand-dark">
                  {cart.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-white bg-white/5 rounded-xl">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[200] lg:hidden ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-brand-dark/95 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-slate-900 shadow-2xl transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-8 border-b border-white/5 flex justify-between items-center">
             <span className="text-2xl font-black text-brand-primary">القائمة</span>
             <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400"><X size={28}/></button>
           </div>
           <div className="p-6 space-y-2">
             <MobileLink to="/" onClick={() => setIsMenuOpen(false)} icon={<Home/>}>الرئيسية</MobileLink>
             <MobileLink to="/category/electronics" onClick={() => setIsMenuOpen(false)} icon={<ShoppingBag/>}>المتجر</MobileLink>
             <MobileLink to="/dashboard" onClick={() => setIsMenuOpen(false)} icon={<LayoutDashboard/>}>الإدارة</MobileLink>
           </div>
        </div>
      </div>

      <main className="flex-grow pt-24 md:pt-32">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/category/:id" element={<CategoryPage products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
          <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
        </Routes>
      </main>

      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-6">
            <h4 className="text-3xl font-black tracking-tighter">ستور بريمة</h4>
            <p className="text-slate-400 font-medium leading-relaxed">بوابتكم المفضلة لتجربة تسوق آمنة وسريعة في المغرب. نختار منتجاتنا بدقة لنضمن لكم الأفضل دائماً.</p>
          </div>
          <div>
            <h5 className="font-black text-lg mb-8 text-brand-primary">أقسام المتجر</h5>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link to="/category/electronics" className="hover:text-white transition-colors">الإلكترونيات</Link></li>
              <li><Link to="/category/watches" className="hover:text-white transition-colors">الساعات</Link></li>
              <li><Link to="/category/cars" className="hover:text-white transition-colors">إكسسوارات السيارات</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-lg mb-8 text-brand-primary">المساعدة</h5>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link to="/" className="hover:text-white transition-colors">سياسة التوصيل</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mb-4">
               <Truck size={32} />
             </div>
             <h5 className="font-black text-xl mb-2">توصيل مجاني</h5>
             <p className="text-slate-500 text-xs font-bold leading-relaxed">في كافة أنحاء المغرب، الدفع دائماً بعد الاستلام والمعاينة.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Store Brima. Engineered for Luxury.
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ to, children, current }: any) => (
  <Link to={to} className={`text-sm font-black transition-all ${current ? 'text-brand-primary underline underline-offset-8 decoration-2' : 'text-slate-400 hover:text-white'}`}>
    {children}
  </Link>
);

const MobileLink = ({ to, icon, children, onClick }: any) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 text-lg font-black text-white hover:bg-brand-primary transition-all">
    {React.cloneElement(icon, { size: 20 })}
    {children}
  </Link>
);

export default App;

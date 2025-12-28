
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
    <div className="min-h-screen flex flex-col font-cairo bg-brand-light transition-colors duration-500">
      
      {/* Clean Light Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2">
             <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
               <ShoppingBag size={22} />
             </div>
             <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">ستور بريمة</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" current={location.pathname === '/'}>الرئيسية</NavLink>
            <NavLink to="/category/electronics" current={location.pathname.includes('electronics')}>الإلكترونيات</NavLink>
            <NavLink to="/category/watches" current={location.pathname.includes('watches')}>الساعات</NavLink>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-primary transition-colors">
              <LayoutDashboard size={18} /> الإدارة
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2.5 text-slate-600 hover:text-brand-primary transition-colors bg-slate-100 rounded-xl">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-brand-primary text-white text-[10px] flex items-center justify-center rounded-full font-black ring-2 ring-white">
                  {cart.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-slate-900 bg-slate-100 rounded-xl">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[200] lg:hidden ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-8 border-b border-slate-100 flex justify-between items-center">
             <span className="text-2xl font-black text-slate-900">القائمة</span>
             <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400"><X size={28}/></button>
           </div>
           <div className="p-6 space-y-4">
             <MobileLink to="/" onClick={() => setIsMenuOpen(false)} icon={<Home/>}>الرئيسية</MobileLink>
             <MobileLink to="/category/electronics" onClick={() => setIsMenuOpen(false)} icon={<ShoppingBag/>}>المتجر</MobileLink>
             <MobileLink to="/dashboard" onClick={() => setIsMenuOpen(false)} icon={<LayoutDashboard/>}>لوحة التحكم</MobileLink>
           </div>
        </div>
      </div>

      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/category/:id" element={<CategoryPage products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
          <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
        </Routes>
      </main>

      <footer className="bg-white text-slate-900 pt-20 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-brand-primary">ستور بريمة</h4>
            <p className="text-slate-500 font-medium leading-relaxed">أفضل تجربة تسوق أونلاين في المغرب. نضمن لكم الجودة العالية، التوصيل السريع، والدفع عند الاستلام.</p>
          </div>
          <div>
            <h5 className="font-black text-lg mb-6">أقسامنا</h5>
            <ul className="space-y-3 text-slate-500 font-bold">
              <li><Link to="/category/electronics" className="hover:text-brand-primary transition-colors">الإلكترونيات</Link></li>
              <li><Link to="/category/watches" className="hover:text-brand-primary transition-colors">الساعات</Link></li>
              <li><Link to="/category/cars" className="hover:text-brand-primary transition-colors">إكسسوارات السيارات</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-lg mb-6">الدعم</h5>
            <ul className="space-y-3 text-slate-500 font-bold">
              <li>سياسة التوصيل</li>
              <li>الأسئلة الشائعة</li>
              <li>اتصل بنا</li>
            </ul>
          </div>
          <div className="bg-brand-light p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
             <div className="w-14 h-14 bg-white text-brand-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
               <Truck size={28} />
             </div>
             <h5 className="font-black text-lg mb-1">توصيل مجاني</h5>
             <p className="text-slate-500 text-xs font-bold">لكافة مدن المغرب، والدفع عند الاستلام.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs font-bold">
          &copy; {new Date().getFullYear()} Store Brima. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ to, children, current }: any) => (
  <Link to={to} className={`text-sm font-black transition-all ${current ? 'text-brand-primary underline underline-offset-8 decoration-2' : 'text-slate-500 hover:text-slate-900'}`}>
    {children}
  </Link>
);

const MobileLink = ({ to, icon, children, onClick }: any) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 text-slate-900 font-black hover:bg-brand-primary hover:text-white transition-all">
    {React.cloneElement(icon, { size: 20 })}
    {children}
  </Link>
);

export default App;


import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Menu, X, ShoppingBag, Home, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { Product, Order, AppSettings, CartItem } from './types.ts';
import { getStoredProducts, getStoredOrders, getStoredSettings, trackVisit } from './store.ts';

// Pages
import HomePage from './pages/Home.tsx';
import CategoryPage from './pages/Category.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CartPage from './pages/Cart.tsx';
import CheckoutPage from './pages/Checkout.tsx';
import DashboardPage from './pages/Dashboard.tsx';

// Fix: Export trackFBEvent function to be used by other components (e.g., CheckoutPage)
export const trackFBEvent = (eventName: string, params?: any) => {
  console.log(`[FB Tracking] ${eventName}:`, params);
  // Real implementation would interface with window.fbq if initialized
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
    <div className="min-h-screen flex flex-col font-cairo bg-brand-bg transition-all">
      {/* Premium Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-header border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
               <ShoppingBag size={24} />
             </div>
             <div className="flex flex-col">
               <span className="text-xl font-black text-brand-slate leading-none">ستور بريمة</span>
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Store Brima</span>
             </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            <NavLink to="/" current={location.pathname === '/'}>الرئيسية</NavLink>
            <NavLink to="/category/electronics" current={location.pathname.includes('electronics')}>الإلكترونيات</NavLink>
            <NavLink to="/category/watches" current={location.pathname.includes('watches')}>الساعات</NavLink>
            <Link to="/dashboard" className="text-sm font-bold text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1">
               لوحة التحكم <LayoutDashboard size={16} />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-3 bg-gray-50 text-brand-slate hover:bg-brand-primary hover:text-white transition-all rounded-xl shadow-sm">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-brand-primary text-white text-[10px] flex items-center justify-center rounded-full font-black ring-2 ring-white">
                  {cart.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2.5 text-brand-slate bg-gray-100 rounded-xl">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-brand-slate/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-4/5 bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-8 border-b flex justify-between items-center">
             <span className="text-xl font-black">القائمة</span>
             <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 p-1"><X size={28}/></button>
           </div>
           <div className="p-6 space-y-4">
             <MobileLink to="/" onClick={() => setIsMenuOpen(false)} icon={<Home/>}>الرئيسية</MobileLink>
             <MobileLink to="/category/electronics" onClick={() => setIsMenuOpen(false)} icon={<ShoppingBag/>}>المتجر</MobileLink>
             <MobileLink to="/dashboard" onClick={() => setIsMenuOpen(false)} icon={<LayoutDashboard/>}>الإدارة</MobileLink>
           </div>
        </div>
      </div>

      <main className="flex-grow pt-28">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/category/:id" element={<CategoryPage products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
          <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
        </Routes>
      </main>

      <footer className="bg-white border-t mt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <h4 className="text-2xl font-black text-brand-primary mb-6">ستور بريمة</h4>
             <p className="text-gray-500 font-medium leading-relaxed">بوابتكم المفضلة لأرقى المنتجات في المغرب. جودة مضمونة وسرعة في التوصيل.</p>
          </div>
          <div>
            <h5 className="font-black mb-6">روابط سريعة</h5>
            <ul className="space-y-3 text-gray-400 font-bold">
              <li><Link to="/category/electronics" className="hover:text-brand-primary">الإلكترونيات</Link></li>
              <li><Link to="/category/watches" className="hover:text-brand-primary">الساعات</Link></li>
              <li><Link to="/category/cars" className="hover:text-brand-primary">السيارات</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-6">المساعدة</h5>
            <ul className="space-y-3 text-gray-400 font-bold">
              <li>سياسة التوصيل</li>
              <li>الأسئلة الشائعة</li>
              <li>تواصل معنا</li>
            </ul>
          </div>
          <div className="bg-brand-bg p-8 rounded-3xl border text-center flex flex-col items-center">
             <div className="w-14 h-14 bg-white text-brand-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
               <Truck size={28} />
             </div>
             <h5 className="font-black text-lg mb-1">توصيل مجاني</h5>
             <p className="text-gray-400 text-xs font-bold leading-relaxed">الدفع بعد المعاينة والاستلام في كافة المدن.</p>
          </div>
        </div>
        <div className="text-center text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Store Brima. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ to, children, current }: any) => (
  <Link to={to} className={`text-sm font-black transition-all ${current ? 'text-brand-primary border-b-2 border-brand-primary pb-1' : 'text-gray-400 hover:text-brand-slate'}`}>
    {children}
  </Link>
);

const MobileLink = ({ to, icon, children, onClick }: any) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900 font-black hover:bg-brand-primary hover:text-white transition-all">
    {React.cloneElement(icon, { size: 20 })}
    {children}
  </Link>
);

export default App;

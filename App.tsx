
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LayoutDashboard, Home, Menu, X, Truck, ShieldCheck, Zap } from 'lucide-react';
import { Product, Order, AppSettings, CartItem } from './types.ts';
import { getStoredProducts, getStoredOrders, getStoredSettings, trackVisit } from './store.ts';

// Pages
import HomePage from './pages/Home.tsx';
import CategoryPage from './pages/Category.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CartPage from './pages/Cart.tsx';
import DashboardPage from './pages/Dashboard.tsx';

export const trackFBEvent = (eventName: string, params?: any) => {
  console.log(`[Tracking] ${eventName}`, params);
  if ((window as any).fbq) (window as any).fbq('track', eventName, params);
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

  return (
    <div className="min-h-screen bg-brand-bg font-cairo flex flex-col">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-[100] glass-header border-b border-gray-100 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <ShoppingBag size={24} />
            </div>
            <span className="text-xl font-black text-brand-slate tracking-tight">ستور بريمة</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className={`font-bold hover:text-brand-primary transition-colors ${location.pathname === '/' ? 'text-brand-primary' : 'text-gray-400'}`}>الرئيسية</Link>
            <Link to="/category/electronics" className="font-bold text-gray-400 hover:text-brand-primary">الإلكترونيات</Link>
            <Link to="/category/watches" className="font-bold text-gray-400 hover:text-brand-primary">الساعات</Link>
            <Link to="/dashboard" className="flex items-center gap-1 font-bold text-gray-300 hover:text-brand-primary"><LayoutDashboard size={18}/> الإدارة</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2.5 bg-gray-50 text-brand-slate rounded-xl hover:bg-brand-primary hover:text-white transition-all">
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -left-1 w-5 h-5 bg-brand-primary text-white text-[10px] rounded-full flex items-center justify-center font-black">{cart.length}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-brand-slate bg-gray-50 rounded-xl"><Menu size={24}/></button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-4/5 bg-white shadow-2xl p-8 transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <span className="text-2xl font-black">القائمة</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={32}/></button>
          </div>
          <div className="space-y-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl font-black"><Home size={20}/> الرئيسية</Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl font-black"><LayoutDashboard size={20}/> لوحة التحكم</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/category/:id" element={<CategoryPage products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} setOrders={setOrders} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h4 className="text-2xl font-black text-brand-primary">ستور بريمة</h4>
            <p className="text-gray-400 font-medium mt-2">تسوق بذكاء، تميز باختياراتك.</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-gray-400 font-bold"><Truck size={20}/> توصيل سريع</div>
            <div className="flex items-center gap-2 text-gray-400 font-bold"><ShieldCheck size={20}/> جودة مضمونة</div>
          </div>
        </div>
        <div className="text-center mt-10 text-[10px] font-black text-gray-200 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Store Brima. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;

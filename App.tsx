
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Home, Package, Phone, Search, Menu, X, Settings, ListOrdered, PlusCircle, CreditCard, ChevronRight, Car, Tv, Sofa } from 'lucide-react';
import { Product, Order, AppSettings, CartItem } from './types';
import { getStoredProducts, getStoredOrders, getStoredSettings, saveOrders } from './store';

// Pages
import HomePage from './pages/Home';
import CategoryPage from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import DashboardPage from './pages/Dashboard';

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
      <div className="min-h-screen flex flex-col font-cairo">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Link to="/" className="text-2xl font-black text-emerald-600 tracking-tight">
                  متجر النخبة
                </Link>
                <div className="hidden md:flex gap-6 mr-8">
                  <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium">الرئيسية</Link>
                  <Link to="/category/electronics" className="text-gray-600 hover:text-emerald-600 font-medium">إلكترونيات</Link>
                  <Link to="/category/home" className="text-gray-600 hover:text-emerald-600 font-medium">منزل</Link>
                  <Link to="/category/cars" className="text-gray-600 hover:text-emerald-600 font-medium">سيارات</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-500 hover:text-emerald-600 p-2 hidden md:block">
                  <LayoutDashboard size={22} />
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-500 hover:text-emerald-600 transition-colors">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-white p-4 space-y-4 shadow-xl">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 font-bold border-b">الرئيسية</Link>
              <Link to="/category/electronics" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 font-bold border-b">إلكترونيات</Link>
              <Link to="/category/home" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 font-bold border-b">منزل</Link>
              <Link to="/category/cars" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 font-bold border-b">سيارات</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 text-emerald-600 font-bold">لوحة التحكم</Link>
            </div>
          )}
        </nav>

        {/* Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} />} />
            <Route path="/category/:id" element={<CategoryPage products={products} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
            <Route path="/dashboard/*" element={<DashboardPage products={products} orders={orders} settings={settings} setProducts={setProducts} setOrders={setOrders} setSettings={setSettings} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-emerald-600 mb-4">متجر النخبة</h3>
              <p className="text-gray-500 leading-relaxed">وجهتكم الأولى للتسوق الإلكتروني في المغرب. جودة عالية وأسعار منافسة.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-500">
                <li><Link to="/category/electronics">الإلكترونيات</Link></li>
                <li><Link to="/category/home">مستلزمات المنزل</Link></li>
                <li><Link to="/category/cars">السيارات</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الدعم الفني</h4>
              <ul className="space-y-2 text-gray-500">
                <li>سياسة الخصوصية</li>
                <li>الشروط والأحكام</li>
                <li>تواصل معنا</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">طرق الدفع</h4>
              <div className="flex gap-4">
                 <CreditCard className="text-gray-400" />
                 <span className="text-gray-500">الدفع عند الاستلام</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-12 text-gray-400 border-t pt-8">
            &copy; 2024 متجر النخبة. جميع الحقوق محفوظة.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

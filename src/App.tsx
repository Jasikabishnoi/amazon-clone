import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header, { MobileSidebar } from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/Category';
import SearchPage from '@/pages/Search';
import ProductDetails from '@/pages/ProductDetails';
import CartPage from '@/pages/Cart';
import CheckoutPage from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import LoginPage from '@/pages/Login';
import AccountPage from '@/pages/Account';
import { Link } from 'react-router-dom';

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="container py-20 text-center">
      <div className="font-display text-8xl md:text-9xl font-bold bg-gradient-to-r from-amazon-orange via-amazon-yellow to-amazon-teal bg-clip-text text-transparent">
        404
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-2">Page not found</h1>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved, or the address could be wrong.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Link to="/" className="btn-amazon-yellow">Back to Home</Link>
        <Link to="/search" className="btn-amazon-outline">Browse All Products</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmation />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

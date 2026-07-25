import { Link } from 'react-router-dom';
import { ChevronUp, Globe, Flag } from 'lucide-react';
import { categories } from '@/data/categories';

const links = {
  'Get to Know Us': ['Careers', 'About Amazon.clone', 'Investor Relations', 'Press Releases', 'Science'],
  'Make Money with Us': ['Sell on Marketplace', 'Become an Affiliate', 'Advertise Your Products', 'Self-Publish with Us'],
  'Payment Products': ['Business Card', 'Shop with Points', 'Reload Your Balance', 'Currency Converter'],
  'Let Us Help You': ['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns & Replacements', 'Help Center'],
};

export default function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return (
    <footer className="mt-12">
      <button
        onClick={scrollToTop}
        className="w-full bg-amazon-teal hover:bg-[#485769] text-white text-sm py-3.5 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5">
          Back to top <ChevronUp size={16} />
        </span>
      </button>

      <div className="bg-amazon-tealDark text-white">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold mb-3 text-sm">{title}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {items.map((t) => (
                  <li key={t} className="hover:underline cursor-pointer">{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" className="font-display font-bold text-2xl">
              <span className="text-white">amazon</span>
              <span className="text-amazon-orange">.</span>
              <span className="text-amazon-yellow text-sm font-sans">clone</span>
            </Link>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/30 hover:bg-white/5">
                <Globe size={14} /> English
              </button>
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/30 hover:bg-white/5">
                <span>$ USD - U.S. Dollar</span>
              </button>
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/30 hover:bg-white/5">
                <Flag size={14} /> United States
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0F1111] text-gray-400 text-xs py-8">
        <div className="container">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-y-4 gap-x-4 mb-8">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="hover:text-white hover:underline flex flex-col"
              >
                <span className="font-semibold text-white/90 text-[11px]">{c.name}</span>
                <span className="text-[10px] opacity-80">Shop now</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mb-3">
            <span>Conditions of Use</span>
            <span>Privacy Notice</span>
            <span>Your Ads Privacy Choices</span>
          </div>
          <div className="text-center text-[11px]">
            © {new Date().getFullYear()} Amazon.clone — A demo e-commerce UI. Built with React, Vite, and Tailwind CSS.
          </div>
        </div>
      </div>
    </footer>
  );
}

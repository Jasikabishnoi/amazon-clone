import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  UserCircle2,
  Menu,
  X,
  Package,
  LogIn,
  LogOut,
} from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useCartStore, useCartTotals } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useFilterStore } from '@/store/filterStore';
import type { Product } from '@/types';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setQuery = useFilterStore((s) => s.setQuery);
  const [q, setQ] = useState(params.get('q') ?? '');
  const [suggestions, setSuggestions] = useState<Array<{ type: string; id: string; text: string }>>([]);
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const wrapRef = useRef<HTMLFormElement>(null);
  const count = useCartTotals().count;
  const user = useUserStore((s) => s.profile);
  const isGuest = useUserStore((s) => s.isGuest);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    setQ(params.get('q') ?? '');
  }, [params]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      setSuggestions([]);
      return;
    }
    const productHits: Product[] = products
      .filter((p) => p.title.toLowerCase().includes(term) || p.tags.some((t) => t.toLowerCase().includes(term)))
      .slice(0, 5);
    const catHits = categories
      .filter((c) => c.name.toLowerCase().includes(term))
      .slice(0, 2);
    const out: any[] = [];
    catHits.forEach((c) => out.push({ type: 'category', id: c.id, text: c.name }));
    productHits.forEach((p) => out.push({ type: 'product', id: p.id, text: p.title }));
    setSuggestions(out.slice(0, 8));
  }, [q]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(q);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (category && category !== 'all') p.set('category', category);
    navigate({ pathname: '/search', search: p.toString() });
    setFocused(false);
  }

  function pickSuggestion(s: { type: string; id: string; text: string }) {
    if (s.type === 'category') navigate(`/category/${s.id}`);
    else navigate(`/product/${s.id}`);
    setFocused(false);
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-amazon-navy text-white">
        <div className="container">
          <div className="flex items-center gap-2 lg:gap-3 py-2">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-transparent hover:border-white/70"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            )}
            <Link
              to="/"
              className="flex items-center shrink-0 px-2 py-1.5 rounded border border-transparent hover:border-white/80"
            >
              <span className="font-display font-bold text-2xl leading-none tracking-tight">
                <span className="text-white">amazon</span>
                <span className="text-amazon-orange">.</span>
                <span className="text-amazon-yellow text-sm font-sans">clone</span>
              </span>
            </Link>

            <button
              onClick={() => {
                /* location select demo */
              }}
              className="hidden lg:flex items-end gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/80"
            >
              <MapPin size={20} className="mb-0.5" />
              <div className="text-left leading-tight">
                <div className="text-[11px] text-gray-300">Deliver to</div>
                <div className="text-sm font-bold">New York 10001</div>
              </div>
            </button>

            <form
              onSubmit={onSubmit}
              ref={wrapRef}
              className="flex-1 min-w-0 relative"
            >
              <div className="flex items-stretch overflow-hidden rounded-md focus-within:ring-2 focus-within:ring-amazon-orange">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="hidden sm:inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 border-r border-gray-300 focus:outline-none"
                  aria-label="Category filter"
                >
                  <option value="all">All</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  value={q}
                  onFocus={() => setFocused(true)}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Amazon.clone"
                  className="flex-1 min-w-0 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-amazon-orange hover:bg-amazon-orangeDark transition-colors px-4 text-black"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>

              {focused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white text-gray-900 rounded-md shadow-xl border border-gray-200 overflow-hidden z-50 animate-scale-in">
                  <ul>
                    {suggestions.map((s, i) => (
                      <li key={`${s.id}-${i}`}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pickSuggestion(s)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-amazon-yellow/10 flex items-center gap-2"
                        >
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                              s.type === 'category' ? 'bg-gray-200 text-gray-700' : 'bg-amazon-yellow/60 text-amazon-navy'
                            }`}
                          >
                            {s.type}
                          </span>
                          <span className="truncate">{s.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            <div className="hidden md:flex items-end gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/80">
              <span className="text-[11px] text-gray-300">
                {isGuest ? 'Hello, sign in' : `Hello, ${user?.name ?? 'Customer'}`}
              </span>
              <div className="text-sm font-bold flex items-center">
                Account &amp; Lists <ChevronDown size={14} />
              </div>
            </div>

            <Link
              to="/account"
              className="hidden lg:flex items-end gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/80"
            >
              <span className="text-[11px] text-gray-300">Returns</span>
              <div className="text-sm font-bold flex items-center">
                &amp; Orders <Package size={14} />
              </div>
            </Link>

            <Link
              to="/cart"
              className="flex items-end gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/80 shrink-0"
            >
              <div className="relative">
                <ShoppingCart size={28} />
                <span className="absolute -top-2 left-4 inline-flex min-w-[20px] h-5 px-1 items-center justify-center rounded-full bg-amazon-orange text-[12px] font-bold text-white">
                  {count}
                </span>
              </div>
              <span className="hidden sm:inline text-sm font-bold pb-0.5">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-amazon-tealDark text-white">
        <div className="container">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1 text-sm">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/70 font-bold"
            >
              <Menu size={18} /> All
            </button>
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="whitespace-nowrap px-2 py-1.5 rounded border border-transparent hover:border-white/70"
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/search"
              className="ml-auto whitespace-nowrap px-2 py-1.5 rounded border border-transparent hover:border-white/70 font-bold text-amazon-yellow"
            >
              Today's Deals
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isGuest = useUserStore((s) => s.isGuest);
  const profile = useUserStore((s) => s.profile);
  const logout = useUserStore((s) => s.logout);
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="bg-amazon-tealDark text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle2 size={28} />
            <span className="font-bold">
              {isGuest ? 'Hello, sign in' : `Hello, ${profile?.name ?? 'Customer'}`}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
          {isGuest ? (
            <Link
              to="/login"
              onClick={onClose}
              className="block px-4 py-3 border-b hover:bg-gray-50 flex items-center gap-2"
            >
              <LogIn size={18} /> Sign in
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-left px-4 py-3 border-b hover:bg-gray-50 flex items-center gap-2"
            >
              <LogOut size={18} /> Sign out
            </button>
          )}
          <div className="px-4 py-2 text-xs font-bold uppercase text-gray-500">Shop by Department</div>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              onClick={onClose}
              className="block px-4 py-2 hover:bg-gray-50 text-sm"
            >
              {c.name}
            </Link>
          ))}
          <div className="px-4 py-2 text-xs font-bold uppercase text-gray-500 border-t mt-2 pt-3">Help &amp; Settings</div>
          <Link to="/account" onClick={onClose} className="block px-4 py-2 hover:bg-gray-50 text-sm">Your Account</Link>
          <Link to="/search" onClick={onClose} className="block px-4 py-2 hover:bg-gray-50 text-sm">Today's Deals</Link>
        </div>
      </aside>
    </>
  );
}

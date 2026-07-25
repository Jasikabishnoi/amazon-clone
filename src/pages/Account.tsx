import { Link } from 'react-router-dom';
import {
  UserCircle2,
  MapPin,
  Package,
  CreditCard,
  Settings,
  ChevronRight,
  Plus,
  LogOut,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { formatDate } from '@/utils/format';
import { getProductById } from '@/data/products';

const tiles = [
  { label: 'Your Orders', sub: 'Track, return or buy again', icon: Package, to: '#orders' },
  { label: 'Your Addresses', sub: 'Edit addresses for orders', icon: MapPin, to: '#addresses' },
  { label: 'Login & Security', sub: 'Edit name, email, password', icon: Settings, to: '/login' },
  { label: 'Payment Options', sub: 'Manage saved cards (coming soon)', icon: CreditCard, to: '#' },
];

export default function AccountPage() {
  const profile = useUserStore((s) => s.profile);
  const isGuest = useUserStore((s) => s.isGuest);
  const logout = useUserStore((s) => s.logout);
  const orders = useUserStore((s) => s.orders);
  const removeAddress = useUserStore((s) => s.removeAddress);

  if (isGuest || !profile) {
    return (
      <div className="container py-16 text-center">
        <UserCircle2 size={56} className="mx-auto text-gray-300 mb-3" />
        <h1 className="font-display text-2xl font-bold mb-2">Sign in to Your Account</h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You’re currently shopping as a guest. Sign in to track orders, save addresses, and check out faster.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/login" className="btn-amazon-yellow px-8">Sign in</Link>
          <Link to="/" className="btn-amazon-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Your Account</h1>
            <p className="text-sm text-gray-600 mt-1">
              Hello, {profile.name}. From here you can manage your orders, addresses, and account settings.
            </p>
          </div>
          <button onClick={logout} className="btn-amazon-outline !py-2 text-xs inline-flex items-center gap-1.5">
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tiles.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group bg-white rounded-md border p-4 card-hover flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amazon-orange/15 to-amazon-yellow/30 inline-flex items-center justify-center text-amazon-orange shrink-0">
                <t.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold inline-flex items-center gap-1 group-hover:text-amazon-linkHover">
                  {t.label}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{t.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section id="addresses" className="lg:col-span-1 bg-white rounded-md border shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg inline-flex items-center gap-2">
                <MapPin size={18} className="text-amazon-orange" /> Addresses
              </h2>
              <Link to="/checkout" className="amazon-link inline-flex items-center gap-1">
                <Plus size={14} /> Add
              </Link>
            </div>
            {profile.addresses.length === 0 ? (
              <div className="border-2 border-dashed rounded-md p-6 text-center text-sm text-gray-500">
                <MapPin size={28} className="mx-auto text-gray-300 mb-2" />
                No saved addresses yet.
                <div className="mt-2">
                  <Link to="/checkout" className="btn-amazon-outline !py-1.5 text-xs">
                    Add address at checkout
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {profile.addresses.map((a) => (
                  <li key={a.id} className="rounded-md border p-3 bg-gray-50/40 text-sm">
                    <div className="font-semibold">{a.fullName}</div>
                    <div className="text-gray-700">{a.line1}</div>
                    {a.line2 && <div className="text-gray-700">{a.line2}</div>}
                    <div className="text-gray-700">{a.city}, {a.state} {a.zip}</div>
                    <div className="text-gray-700">{a.country}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{a.phone}</div>
                    <button
                      onClick={() => removeAddress(a.id)}
                      className="mt-2 text-xs amazon-link !text-amazon-deal"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="orders" className="lg:col-span-2 bg-white rounded-md border shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h2 className="font-bold text-lg inline-flex items-center gap-2">
                <Package size={18} className="text-amazon-orange" /> Your Orders
              </h2>
              <Link to="/search" className="btn-amazon-outline !py-1.5 text-xs inline-flex items-center gap-1.5">
                <ShoppingBag size={14} /> Shop again
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-md border-2 border-dashed p-10 text-center">
                <Sparkles size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-bold text-lg mb-1">No orders yet</h3>
                <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                  Your past orders will appear here. Start exploring products and place your first order today!
                </p>
                <Link to="/" className="btn-amazon">Start Shopping</Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-md border overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2.5 text-xs grid grid-cols-2 md:grid-cols-4 gap-2 border-b">
                      <div>
                        <div className="text-gray-500">ORDER PLACED</div>
                        <div className="font-semibold text-gray-900">{formatDate(o.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">TOTAL</div>
                        <div className="font-semibold text-gray-900">${o.totals.total.toFixed(2)}</div>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-gray-500">SHIP TO</div>
                        <div className="font-semibold text-gray-900 truncate">{o.shipping.fullName}</div>
                      </div>
                      <div className="col-span-2 md:col-span-1 md:text-right">
                        <div className="text-gray-500">ORDER #</div>
                        <div className="font-mono font-semibold text-gray-900 text-xs">{o.id.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="p-4 flex gap-4">
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 4).map((it) => {
                          const p = getProductById(it.productId);
                          if (!p) return null;
                          return (
                            <div key={p.id} className="w-14 h-14 shrink-0 rounded bg-white border-2 overflow-hidden">
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-semibold text-amazon-success inline-flex items-center gap-1">
                            ■ {o.status.toUpperCase()}
                          </span>
                          <span className="text-gray-500 ml-2">Est. arrival: {formatDate(o.estimatedDelivery)}</span>
                        </div>
                        <ul className="mt-2 text-xs text-gray-700 space-y-0.5">
                          {o.items.slice(0, 3).map((it) => {
                            const p = getProductById(it.productId);
                            return p ? (
                              <li key={p.id} className="truncate">
                                • {p.title} <span className="text-gray-500">× {it.quantity}</span>
                              </li>
                            ) : null;
                          })}
                          {o.items.length > 3 && (
                            <li className="text-gray-500">and {o.items.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Link to={`/order/${o.id}`} className="btn-amazon-outline !py-1.5 text-xs">
                          View order
                        </Link>
                        <button className="btn-amazon-yellow !py-1.5 text-xs">Buy it again</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

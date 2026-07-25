import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Truck as Delivered, ChevronRight, ShoppingBag, FileText, Home } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useCartTotals } from '@/store/cartStore';
import { getProductById } from '@/data/products';
import { formatCurrency, formatDate } from '@/utils/format';
import { products } from '@/data/products';
import ProductRow from '@/components/ProductRow';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const orders = useUserStore((s) => s.orders);
  const profile = useUserStore((s) => s.profile);
  const order = orders.find((o) => o.id === orderId);
  const recommendations = products.slice(0, 10);

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <FileText size={52} className="mx-auto text-gray-300 mb-3" />
        <h1 className="font-display text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          We couldn’t find that order. It may have been placed as a guest, or the link is old.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/account" className="btn-amazon-outline">Your Account</Link>
          <Link to="/" className="btn-amazon">Keep Shopping</Link>
        </div>
      </div>
    );
  }

  const placed = order.status === 'placed';
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-8">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden animate-scale-in">
          <div className="bg-gradient-to-r from-amazon-success via-emerald-500 to-teal-500 text-white px-6 md:px-10 py-8 md:py-10">
            <div className="flex items-start md:items-center gap-4">
              <div className="relative shrink-0">
                <CheckCircle2 size={56} className="animate-scale-in" strokeWidth={2.2} />
                <div className="absolute inset-0 rounded-full bg-white/30 blur-xl -z-10 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-sm opacity-90">Thank you, {profile?.name ?? 'Customer'}!</div>
                <h1 className="font-display text-2xl md:text-4xl font-bold leading-tight">
                  Your order has been placed.
                </h1>
                <p className="opacity-95 mt-1">
                  A confirmation has been sent to <b>{order.userEmail}</b>.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10 py-6 grid md:grid-cols-3 gap-4 text-sm border-b">
            <StatCard
              icon={<FileText size={18} />}
              label="Order number"
              value={order.id.toUpperCase()}
            />
            <StatCard
              icon={<Package size={18} />}
              label="Estimated delivery"
              value={formatDate(order.estimatedDelivery)}
            />
            <StatCard
              icon={<Truck size={18} />}
              label="Shipping to"
              value={`${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}`}
            />
          </div>

          <div className="px-6 md:px-10 py-5 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center text-xs">
              {[
                { label: 'Placed', icon: CheckCircle2, active: true, done: true },
                { label: 'Packing', icon: Package, active: true, done: false },
                { label: 'Shipped', icon: Truck, active: false, done: false },
                { label: 'Delivered', icon: Delivered, active: false, done: false },
              ].map((st, i, arr) => (
                <div key={st.label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full inline-flex items-center justify-center ${
                      st.done
                        ? 'bg-amazon-success text-white'
                        : st.active
                        ? 'bg-amazon-yellow text-black ring-4 ring-amazon-yellow/30'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <st.icon size={14} />
                  </div>
                  <span
                    className={
                      st.done ? 'text-amazon-success font-semibold' : st.active ? 'font-semibold text-gray-900' : 'text-gray-500'
                    }
                  >
                    {st.label}
                  </span>
                  {i < arr.length - 1 && (
                    <div className={`hidden md:block w-8 h-0.5 ${st.done ? 'bg-amazon-success' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr,340px] gap-6 px-6 md:px-10 py-6">
            <div>
              <h3 className="font-bold mb-3">Order items ({order.items.length})</h3>
              <ul className="divide-y divide-gray-100 rounded-md border overflow-hidden">
                {order.items.map((it) => {
                  const p = getProductById(it.productId);
                  if (!p) return null;
                  return (
                    <li key={p.id} className="p-4 bg-white flex gap-4 items-center">
                      <Link to={`/product/${p.id}`} className="w-20 h-20 shrink-0 rounded bg-gray-50 border overflow-hidden">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${p.id}`} className="font-medium hover:text-amazon-linkHover hover:underline line-clamp-2">
                          {p.title}
                        </Link>
                        <div className="text-xs text-gray-500 mt-1">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{p.currency}{(p.price * it.quantity).toFixed(2)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="border rounded-md p-4 bg-gray-50/50">
                  <div className="font-bold text-sm mb-1">Shipping address</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {order.shipping.fullName}<br />
                    {order.shipping.line1}{order.shipping.line2 && <>, {order.shipping.line2}</>}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
                    {order.shipping.country}
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-gray-50/50">
                  <div className="font-bold text-sm mb-1">Payment method</div>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.payment.cardBrand}</span>
                      <span className="font-mono tracking-widest">•••• {order.payment.cardNumberLast4}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{order.payment.cardHolder} · Expires {order.payment.expiry}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-5 bg-white shadow-sm">
                <h3 className="font-bold mb-3">Receipt summary</h3>
                <dl className="space-y-1.5 text-sm">
                  <Row label="Items:" value={`$${order.totals.subtotal.toFixed(2)}`} />
                  {order.totals.discount > 0 && (
                    <Row label="Promo discount:" value={`-$${order.totals.discount.toFixed(2)}`} valueClass="text-amazon-success" />
                  )}
                  <Row label="Shipping & handling:" value={order.totals.shipping === 0 ? 'FREE' : `$${order.totals.shipping.toFixed(2)}`} valueClass={order.totals.shipping === 0 ? 'text-amazon-success font-semibold' : ''} />
                  <Row label="Estimated tax:" value={`$${order.totals.tax.toFixed(2)}`} />
                </dl>
                <hr className="my-3" />
                <div className="flex items-baseline justify-between">
                  <span className="font-bold">Order total</span>
                  <span className="text-2xl font-bold text-amazon-deal">${order.totals.total.toFixed(2)}</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Ordered on {formatDate(order.createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link to="/account" className="btn-amazon-outline justify-center !py-2.5 text-sm">
                  <FileText size={14} className="mr-1" /> All Orders
                </Link>
                <Link to="/" className="btn-amazon justify-center !py-2.5 text-sm">
                  <Home size={14} className="mr-1" /> Home
                </Link>
              </div>
              <Link to="/search" className="w-full btn-amazon-yellow justify-center !py-2.5 text-sm inline-flex">
                <ShoppingBag size={14} className="mr-1.5" /> Keep Shopping <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <ProductRow title="Recommended for you" products={recommendations} compact />
      </div>
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-600">{label}</dt>
      <dd className={`font-medium ${valueClass ?? ''}`}>{value}</dd>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-amazon-orange/10 text-amazon-orange inline-flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
        <div className="font-semibold text-gray-900 break-all">{value}</div>
      </div>
    </div>
  );
}

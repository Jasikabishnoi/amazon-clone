import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Truck, ShieldCheck, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCartStore, useCartTotals } from '@/store/cartStore';
import { getProductById } from '@/data/products';
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';
import StarRating from '@/components/StarRating';
import PrimeBadge from '@/components/PrimeBadge';
import ProductRow from '@/components/ProductRow';
import { products } from '@/data/products';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromo = useCartStore((s) => s.setPromo);
  const totals = useCartTotals();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    setPromo(code);
    if (!code) {
      setPromoMsg(null);
      return;
    }
    if (totals.promoValid) {
      setPromoMsg(`Applied! Save ${Math.round(totals.discountRate * 100)}% on your order.`);
    } else {
      setPromoMsg(`Code “${code}” is not valid. Try SAVE10, WELCOME15 or PRIME20.`);
    }
  }

  const recommendations = products.filter((p) => !items.some((i) => i.productId === p.id)).slice(0, 10);

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="container py-10">
          <div className="bg-white rounded-md p-8 md:p-12 border text-center">
            <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Your Amazon.cart is empty</h1>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Browse products, add favorites to your cart, and check out when you’re ready.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/" className="btn-amazon-yellow px-8">
                Start Shopping
              </Link>
              <Link to="/account" className="btn-amazon-outline">
                Your Account
              </Link>
            </div>
          </div>
          <ProductRow title="Today’s picks for you" products={recommendations} compact />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Shopping Cart
        </h1>
        <div className="text-sm text-gray-600 mb-5">
          <span className="amazon-link" onClick={clear}>Clear all items</span>
          <span className="mx-2 text-gray-300">·</span>
          <span>The price and availability of items at Amazon.clone are subject to change.</span>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-6 items-start">
          <div className="bg-white rounded-md border overflow-hidden">
            <div className="hidden md:grid md:grid-cols-[120px,1fr,auto,140px,48px] gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
              <div>Image</div>
              <div>Product</div>
              <div>Price</div>
              <div className="text-center">Qty</div>
              <div />
            </div>
            <ul>
              {items.map((it, idx) => {
                const p = getProductById(it.productId);
                if (!p) return null;
                const itemTotal = p.price * it.quantity;
                return (
                  <li
                    key={p.id}
                    className={`px-3 md:px-5 py-4 md:grid md:grid-cols-[120px,1fr,auto,140px,48px] md:gap-4 md:items-center ${
                      idx !== items.length - 1 ? 'border-b' : ''
                    } grid grid-cols-[96px,1fr] gap-3`}
                  >
                    <Link to={`/product/${p.id}`} className="col-span-1 md:col-span-1">
                      <div className="aspect-square rounded overflow-hidden bg-gray-50 border">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>
                    <div className="md:col-span-1 min-w-0 flex flex-col">
                      <Link
                        to={`/product/${p.id}`}
                        className="text-sm md:text-base font-medium text-gray-900 hover:text-amazon-linkHover hover:underline line-clamp-2 leading-snug"
                      >
                        {p.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <StarRating rating={p.rating} size={12} reviewCount={p.reviewCount} />
                      </div>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        {p.prime && <PrimeBadge />}
                        <span className="text-xs text-amazon-success inline-flex items-center gap-1">
                          <Truck size={12} /> In Stock
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <div className="md:hidden">
                          <span className="text-lg font-bold">
                            {p.currency}
                            {itemTotal.toFixed(2)}
                          </span>
                          {p.originalPrice && (
                            <span className="ml-2 text-xs text-gray-500 line-through">
                              {formatCurrency(p.originalPrice * it.quantity, p.currency)}
                            </span>
                          )}
                        </div>
                        <div className="md:hidden inline-flex items-center gap-1.5">
                          <QtyButtons
                            qty={it.quantity}
                            onChange={(q) => setQty(p.id, q)}
                            max={p.stock}
                          />
                        </div>
                        <button
                          onClick={() => removeItem(p.id)}
                          className="md:hidden inline-flex items-center gap-1 text-xs amazon-link !text-amazon-deal"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                      <div className="md:mt-3 hidden md:flex items-center gap-2 flex-wrap text-xs">
                        <span className="amazon-link" onClick={() => addItem(p.id, 1)}>
                          Save for later
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="amazon-link">Compare with similar</span>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => removeItem(p.id)}
                          className="amazon-link"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-1 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {p.currency}
                        {itemTotal.toFixed(2)}
                      </div>
                      {p.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatCurrency(p.originalPrice * it.quantity, p.currency)}
                        </div>
                      )}
                    </div>
                    <div className="hidden md:flex md:col-span-1 justify-center">
                      <QtyButtons
                        qty={it.quantity}
                        onChange={(q) => setQty(p.id, q)}
                        max={p.stock}
                      />
                    </div>
                    <button
                      onClick={() => removeItem(p.id)}
                      title="Remove item"
                      className="hidden md:inline-flex md:col-span-1 w-10 h-10 items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 py-4 bg-gray-50 border-t text-sm md:text-right">
              Subtotal ({totals.count} items):{' '}
              <span className="font-bold text-lg ml-1">
                {totals.subtotal < 25 ? (
                  <span className="text-amazon-success inline-flex items-center gap-1">
                    <Truck size={14} /> FREE shipping eligible at $25
                  </span>
                ) : (
                  <span className="text-gray-900">${totals.subtotal.toFixed(2)}</span>
                )}
              </span>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[130px]">
            <div className="bg-white rounded-md border p-5 shadow-sm">
              <div className="text-sm text-amazon-success inline-flex items-center gap-1.5 mb-3 font-semibold">
                <Truck size={16} /> Your order qualifies for FREE Shipping.
              </div>

              <div className="bg-gray-50 border rounded-md p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-amazon-orange shrink-0" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="Enter promo code"
                    className="flex-1 min-w-0 bg-transparent focus:outline-none text-sm"
                  />
                  <button onClick={applyPromo} className="btn-amazon-outline !py-1 !text-xs !px-3">
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <div
                    className={`mt-2 text-xs ${
                      totals.promoValid ? 'text-amazon-success' : 'text-amazon-deal'
                    }`}
                  >
                    {promoMsg}
                  </div>
                )}
                <div className="mt-2 text-[11px] text-gray-500">
                  Try <b>SAVE10</b>, <b>WELCOME15</b> or <b>PRIME20</b>.
                </div>
              </div>

              <dl className="space-y-1.5 text-sm">
                <Row label="Items:" value={`$${totals.subtotal.toFixed(2)}`} />
                {totals.discount > 0 && (
                  <Row
                    label={`Promo (${promoCode}):`}
                    value={`-$${totals.discount.toFixed(2)}`}
                    valueClass="text-amazon-success"
                  />
                )}
                <Row
                  label="Shipping &amp; handling:"
                  value={totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
                  valueClass={totals.shipping === 0 ? 'text-amazon-success font-semibold' : ''}
                />
                <Row label={`Est. tax (8%):`} value={`$${totals.tax.toFixed(2)}`} />
              </dl>
              <hr className="my-3" />
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-lg font-bold text-gray-900">Order total</div>
                <div className="text-2xl font-bold text-amazon-deal">
                  ${totals.total.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-amazon-yellow justify-center py-2.5 font-semibold mb-2"
              >
                Proceed to checkout <ChevronRight size={16} className="ml-1" />
              </button>
              <Link to="/" className="w-full btn-amazon-outline justify-center py-2.5 text-sm">
                Continue shopping
              </Link>
              <div className="mt-4 text-xs text-gray-500 flex items-start gap-1.5">
                <ShieldCheck size={14} className="text-amazon-success shrink-0 mt-0.5" />
                Your transaction is secured with end-to-end encryption.
              </div>
            </div>
          </aside>
        </div>

        <ProductRow title="Customers who shopped for items in your cart also bought" products={recommendations} compact />
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

function QtyButtons({
  qty,
  onChange,
  max,
}: {
  qty: number;
  onChange: (q: number) => void;
  max: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-gray-100 border border-gray-300 overflow-hidden">
      <button
        onClick={() => onChange(Math.max(0, qty - 1))}
        className="w-8 h-8 hover:bg-gray-200 inline-flex items-center justify-center"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        className="w-8 h-8 hover:bg-gray-200 inline-flex items-center justify-center"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

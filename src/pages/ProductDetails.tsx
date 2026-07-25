import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  MapPin,
  Heart,
  Star as StarIcon,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getProductById, products } from '@/data/products';
import { getCategoryById } from '@/data/categories';
import { getReviewsByProduct, getRatingBreakdown } from '@/data/reviews';
import StarRating from '@/components/StarRating';
import PrimeBadge from '@/components/PrimeBadge';
import ProductRow from '@/components/ProductRow';
import { useCartStore, useRelatedProduct } from '@/store/cartStore';
import { formatCurrency, formatRelativeDate } from '@/utils/format';
import type { Review } from '@/types';
import { cn } from '@/lib/utils';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const p = productId ? getProductById(productId) : undefined;
  const { related } = useRelatedProduct(productId);
  const addItem = useCartStore((s) => s.addItem);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const reviews = useMemo(() => (p ? getReviewsByProduct(p.id) : [] as Review[]), [p]);
  const breakdown = useMemo(() => (p ? getRatingBreakdown(p.id) : { total: 0, stars: [] }), [p]);

  if (!p) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-3xl font-bold mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-4">That product doesn’t exist or has been removed.</p>
        <Link to="/" className="btn-amazon">Back to Home</Link>
      </div>
    );
  }

  const discount = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;
  const category = getCategoryById(p.categoryId);
  const stockUrgent = p.stock <= 20;

  function addToCart() {
    addItem(p.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    addItem(p.id, qty);
    navigate('/cart');
  }

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="container py-2 text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-amazon-linkHover hover:underline">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          {category && (
            <>
              <Link to={`/category/${category.id}`} className="hover:text-amazon-linkHover hover:underline">
                {category.name}
              </Link>
              <ChevronRight size={14} className="text-gray-400" />
            </>
          )}
          <span className="text-gray-900 truncate">{p.title}</span>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <div
              className="sticky top-[130px]"
              onMouseLeave={() => setZoom(null)}
            >
              <div className="flex gap-3">
                <div className="hidden sm:flex flex-col gap-2">
                  {p.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        'w-14 h-14 rounded border-2 overflow-hidden transition-colors',
                        activeImg === i ? 'border-amazon-orange ring-1 ring-amazon-orange' : 'border-gray-200 hover:border-gray-400'
                      )}
                    >
                      <img src={src} alt={`view ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
                <div
                  className="flex-1 aspect-square rounded-md overflow-hidden bg-gray-50 relative border border-gray-200 group"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoom({ x, y });
                  }}
                  onMouseEnter={() => setZoom({ x: 50, y: 50 })}
                >
                  <img
                    src={p.images[activeImg]}
                    alt={p.title}
                    className={cn(
                      'w-full h-full object-contain transition-transform',
                      zoom ? 'scale-[2.2]' : ''
                    )}
                    style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                  />
                  <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {p.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn(
                          'h-1.5 rounded-full transition-all',
                          activeImg === i ? 'w-6 bg-amazon-orange' : 'w-1.5 bg-gray-400/70'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button className="amazon-link inline-flex items-center gap-1.5">
                  <Share2 size={14} /> Share
                </button>
                <button
                  onClick={() => setWish(!wish)}
                  className={cn(
                    'amazon-link inline-flex items-center gap-1.5',
                    wish && '!text-amazon-deal'
                  )}
                >
                  <Heart size={14} className={cn(wish && 'fill-current')} />
                  {wish ? 'Saved to wishlist' : 'Add to wishlist'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <h1 className="font-display text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
              {p.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Link to="#reviews" onClick={() => setTab('reviews')} className="inline-flex items-center gap-2">
                <StarRating rating={p.rating} size={16} />
                <span className="text-sm font-semibold text-amazon-link hover:text-amazon-linkHover hover:underline">
                  {p.rating.toFixed(1)}
                </span>
              </Link>
              <span className="text-sm text-gray-600">
                {p.reviewCount.toLocaleString()} ratings
              </span>
              <span className="text-gray-300">|</span>
              <PrimeBadge />
            </div>

            <hr className="my-4" />

            <div className="flex items-baseline gap-3">
              {discount > 0 && (
                <span className="bg-amazon-deal text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
              <span className="text-3xl font-semibold text-gray-900">
                {p.currency}
                {Math.floor(p.price)}
                <span className="text-lg align-top">
                  {(p.price % 1).toFixed(2).slice(1)}
                </span>
              </span>
            </div>
            {p.originalPrice && (
              <div className="text-sm text-gray-500 mt-1">
                List Price:{' '}
                <span className="line-through">{formatCurrency(p.originalPrice, p.currency)}</span>
              </div>
            )}

            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <DetailRow icon={<Truck size={16} />} label="FREE delivery" value="Tomorrow — Order within 8 hrs 23 mins" />
              <DetailRow icon={<Zap size={16} />} label="prime FREE Same-Day delivery" value="on orders $25+" />
              <DetailRow icon={<RotateCcw size={16} />} label="Returns" value="30-day returns, free replacement" />
            </div>

            <hr className="my-4" />

            <div className="mb-2">
              <span className={cn('font-semibold text-sm', stockUrgent ? 'text-amazon-deal' : 'text-amazon-success')}>
                {stockUrgent ? `Only ${p.stock} left in stock.` : 'In Stock.'}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-700">Qty:</span>
              <div className="inline-flex items-center rounded-full bg-gray-100 overflow-hidden border border-gray-300">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 hover:bg-gray-200 inline-flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
                  className="w-9 h-9 hover:bg-gray-200 inline-flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={addToCart}
                disabled={p.stock <= 0}
                className={cn(
                  'w-full btn-amazon-yellow justify-center py-2.5 text-sm font-semibold relative disabled:opacity-50',
                  added && '!bg-amazon-success !border-amazon-success !text-white'
                )}
              >
                {added ? (
                  <>
                    <Check size={16} className="mr-1" /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} className="mr-1.5" /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={buyNow}
                disabled={p.stock <= 0}
                className="w-full btn-amazon justify-center py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                <Zap size={16} className="mr-1.5" /> Buy Now
              </button>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <ShieldBadge title="Secure transaction" body="SSL encrypted checkout" />
              <ShieldBadge title="Amazon Basics Warranty" body="1-year limited warranty" />
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-gray-600">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>Deliver to <b>New York 10001</b> — <Link to="/cart" className="text-amazon-link hover:underline">Update location</Link></span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="sticky top-[130px] border border-gray-300 rounded-md p-4 bg-white shadow-sm">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs text-gray-500">Buy with</span>
                <PrimeBadge />
              </div>
              <div className="text-3xl font-semibold">
                {p.currency}
                {Math.floor(p.price)}
                <span className="text-lg align-top">{(p.price % 1).toFixed(2).slice(1)}</span>
              </div>
              <div className="mt-1 text-sm space-y-1 text-gray-700">
                <div>FREE delivery <b className="text-amazon-success">Tomorrow</b></div>
                <div className="text-xs text-gray-500">Or fastest delivery <b>Today</b> — 5 hrs 12 mins</div>
              </div>
              <hr className="my-3" />
              <div className="text-xs text-gray-500 mb-1">Ships from</div>
              <div className="text-sm">Amazon.clone</div>
              <div className="text-xs text-gray-500 mt-2 mb-1">Sold by</div>
              <div className="text-sm amazon-link">Marketplace Retailer</div>
              <div className="text-xs text-gray-500 mt-2 mb-1">Returns</div>
              <div className="text-sm">30-day returns</div>
              <hr className="my-3" />
              <button
                onClick={addToCart}
                className="w-full btn-amazon-yellow justify-center py-2 text-sm mb-2"
              >
                Add to Cart
              </button>
              <button
                onClick={buyNow}
                className="w-full btn-amazon justify-center py-2 text-sm mb-2"
              >
                Buy Now
              </button>
              <label className="inline-flex items-center gap-2 text-xs cursor-pointer mt-1">
                <input type="checkbox" className="accent-amazon-orange" defaultChecked />
                <span>Add a gift receipt</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b">
            {[
              { id: 'desc', label: 'Product description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: `Customer reviews (${p.reviewCount.toLocaleString()})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={cn(
                  'px-4 py-3 whitespace-nowrap text-sm transition-colors border-b-2 -mb-px',
                  tab === t.id
                    ? 'text-amazon-linkHover font-semibold border-amazon-orange bg-amazon-yellow/10'
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-6" id="reviews">
            {tab === 'desc' && (
              <div className="grid md:grid-cols-2 gap-10 max-w-5xl">
                <div>
                  <h3 className="font-display text-xl font-bold mb-3">About this item</h3>
                  <ul className="space-y-2 text-gray-800 list-disc pl-5 text-[15px] leading-relaxed">
                    <li>{p.description}</li>
                    <li>Premium materials and craftsmanship ensure long-lasting quality.</li>
                    <li>Ergonomic and user-friendly design for everyday use.</li>
                    <li>Backed by a dedicated customer support team.</li>
                    <li>Ships in frustration-free, recyclable packaging.</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-amazon-orange/5 to-amazon-yellow/10 rounded-lg p-5 border border-amazon-orange/10">
                  <h4 className="font-bold mb-3 text-gray-900">Product Highlights</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(p.specs).slice(0, 6).map(([k, v]) => (
                      <div key={k} className="bg-white rounded p-3 border shadow-sm">
                        <div className="text-[11px] uppercase text-gray-500 tracking-wide">{k}</div>
                        <div className="text-sm font-semibold text-gray-900 mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'specs' && (
              <div className="max-w-3xl">
                <h3 className="font-display text-xl font-bold mb-3">Technical Details</h3>
                <table className="w-full border border-gray-200 rounded overflow-hidden text-sm">
                  <tbody>
                    {Object.entries(p.specs).map(([k, v], i) => (
                      <tr key={k} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <th className="w-1/3 text-left px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-200">{k}</th>
                        <td className="px-4 py-2.5 text-gray-900">{v}</td>
                      </tr>
                    ))}
                    <tr>
                      <th className="w-1/3 text-left px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-200">Category</th>
                      <td className="px-4 py-2.5">{category?.name ?? '-'}</td>
                    </tr>
                    <tr>
                      <th className="w-1/3 text-left px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-200">ASIN</th>
                      <td className="px-4 py-2.5 font-mono">{p.id.toUpperCase()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="max-w-6xl grid md:grid-cols-[320px,1fr] gap-8">
                <div>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h3 className="font-bold text-lg mb-2">Customer ratings</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-bold">{p.rating.toFixed(1)}</span>
                      <span className="text-gray-500">/ 5</span>
                    </div>
                    <StarRating rating={p.rating} size={18} className="mt-1" />
                    <div className="text-sm text-gray-600 mt-1">{breakdown.total.toLocaleString()} global ratings</div>
                    <div className="mt-4 space-y-2">
                      {breakdown.stars.map((s) => (
                        <div key={s.stars} className="grid grid-cols-[auto,1fr,auto] items-center gap-2 text-sm">
                          <span className="text-amazon-link hover:underline cursor-pointer">{s.stars} star</span>
                          <div className="h-4 bg-gray-200 rounded overflow-hidden">
                            <div className="h-full bg-amazon-orange rounded" style={{ width: `${s.percent}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">{s.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3">Top reviews from customers</h3>
                  <div className="space-y-6">
                    {reviews.slice(0, 8).map((r) => (
                      <div key={r.id} className="border-b pb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amazon-orange to-amazon-yellow inline-flex items-center justify-center text-white font-bold text-sm">
                            {r.userName.slice(0, 1)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{r.userName}</div>
                            <div className="text-xs text-gray-500">Reviewed {formatRelativeDate(r.date)}</div>
                          </div>
                          {r.verified && (
                            <div className="ml-auto inline-flex items-center gap-1 text-[11px] text-amazon-orange font-bold">
                              <Check size={12} strokeWidth={3} /> Verified Purchase
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <StarRating rating={r.rating} size={14} />
                          <div className="text-sm font-semibold">{r.title}</div>
                        </div>
                        <p className="text-sm text-gray-800 mt-1.5 leading-relaxed">{r.body}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                          <button className="inline-flex items-center gap-1 rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1">
                            👍 Helpful ({r.helpful})
                          </button>
                          <button className="hover:underline">Report</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductRow title="Customers who viewed this also viewed" products={related} compact />
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-amazon-link mt-0.5 shrink-0">{icon}</div>
      <div>
        <span className="font-semibold">{label}</span> <span className="text-gray-700">{value}</span>
      </div>
    </div>
  );
}

function ShieldBadge({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-2 border rounded-md p-3 bg-gray-50/50">
      <ShieldCheck size={16} className="text-amazon-success shrink-0 mt-0.5" />
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{body}</div>
      </div>
    </div>
  );
}

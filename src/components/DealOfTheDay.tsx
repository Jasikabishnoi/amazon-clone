import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ShoppingCart, Tag } from 'lucide-react';
import { products } from '@/data/products';
import { formatCurrency } from '@/utils/format';
import StarRating from './StarRating';
import PrimeBadge from './PrimeBadge';
import { useCartStore } from '@/store/cartStore';

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function DealOfTheDay() {
  const dealProduct = products.find((p) => p.originalPrice && p.tags.includes('Deal')) ?? products[0];
  const discount = dealProduct.originalPrice
    ? Math.round(((dealProduct.originalPrice - dealProduct.price) / dealProduct.originalPrice) * 100)
    : 0;
  const target = Date.now() + (1000 * 60 * 60 * 6 + 1000 * 60 * 42 + 1000 * 17);
  const { h, m, s } = useCountdown(target);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  return (
    <section className="container mt-10">
      <div className="relative bg-gradient-to-r from-amazon-deal via-rose-500 to-orange-400 rounded-xl p-[2px] shadow-lg">
        <div className="bg-white rounded-[10px] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-rose-50 to-amber-50">
            <div className="flex items-center gap-2">
              <Tag className="text-amazon-deal" size={20} />
              <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Deal of the Day</h2>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock size={18} />
              <span className="text-sm font-semibold hidden sm:inline">Ends in</span>
              <div className="flex items-center gap-1">
                {[pad(h), pad(m), pad(s)].map((v, i, arr) => (
                  <span key={i} className="inline-flex items-center">
                    <span className="bg-amazon-navy text-amazon-yellow font-mono font-bold text-sm px-2 py-1 rounded tabular-nums">
                      {v}
                    </span>
                    {i < arr.length - 1 && <span className="mx-0.5 font-bold text-amazon-navy">:</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[280px,1fr,auto] gap-5 p-5 items-center">
            <div className="aspect-square max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={dealProduct.images[0]}
                alt={dealProduct.title}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onClick={() => navigate(`/product/${dealProduct.id}`)}
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="bg-amazon-deal text-white text-xs font-bold uppercase px-2 py-1 rounded">
                  Save {discount}%
                </span>
                <span className="bg-amazon-yellow text-amazon-navy text-xs font-bold uppercase px-2 py-1 rounded">
                  Limited Time
                </span>
              </div>
              <Link
                to={`/product/${dealProduct.id}`}
                className="font-semibold text-lg md:text-xl text-gray-900 hover:text-amazon-linkHover hover:underline leading-snug"
              >
                {dealProduct.title}
              </Link>
              <div className="mt-2">
                <StarRating rating={dealProduct.rating} showValue reviewCount={dealProduct.reviewCount} size={16} />
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2 md:line-clamp-3">
                {dealProduct.description}
              </p>
              <div className="mt-2">
                <PrimeBadge />
              </div>
            </div>

            <div className="flex md:flex-col items-start gap-2 md:items-end md:min-w-[200px]">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    {dealProduct.currency}
                    {dealProduct.price.toFixed(2)}
                  </span>
                </div>
                {dealProduct.originalPrice && (
                  <div className="text-sm text-gray-500">
                    List price:{' '}
                    <span className="line-through">
                      {formatCurrency(dealProduct.originalPrice, dealProduct.currency)}
                    </span>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-0.5">
                  Only <span className="font-bold text-amazon-deal">{dealProduct.stock}</span> left in stock
                </div>
              </div>
              <div className="flex md:flex-col gap-2 md:w-full">
                <button
                  onClick={() => addItem(dealProduct.id, 1)}
                  className="btn-amazon-yellow md:w-full"
                >
                  <ShoppingCart size={16} className="mr-1" /> Add to Cart
                </button>
                <Link
                  to={`/product/${dealProduct.id}`}
                  className="btn-amazon-outline md:w-full"
                >
                  See Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

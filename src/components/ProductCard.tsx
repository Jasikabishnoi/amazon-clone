import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import StarRating from './StarRating';
import PrimeBadge from './PrimeBadge';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

export default function ProductCard({ product, className, compact }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div
      className={cn(
        'group bg-white rounded-md border border-gray-200 overflow-hidden card-hover flex flex-col',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-amazon-orange/10 via-transparent to-amazon-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.bestseller && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-amazon-orange text-white px-2 py-0.5 rounded shadow">
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span className="text-[11px] font-bold bg-amazon-deal text-white px-2 py-0.5 rounded shadow">
              -{discount}%
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/product/${product.id}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-white text-gray-700"
            title="View details"
          >
            <Eye size={16} />
          </Link>
          <button
            type="button"
            onClick={() => addItem(product.id, 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-amazon-yellow hover:bg-amazon-yellowDark text-black shadow"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      <div className={cn('flex-1 p-3 flex flex-col gap-2', compact && 'p-2')}>
        <Link to={`/product/${product.id}`} className="group/title">
          <h3
            className={cn(
              'text-gray-900 font-medium line-clamp-2 leading-snug group-hover/title:text-amazon-linkHover',
              compact ? 'text-[13px]' : 'text-sm'
            )}
          >
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <StarRating
            rating={product.rating}
            showValue
            reviewCount={compact ? undefined : product.reviewCount}
            size={14}
          />
          {compact && (
            <span className="text-xs text-gray-500">{product.reviewCount.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-gray-900">
            <span className="text-xs align-top">{product.currency}</span>
            {Math.floor(product.price)}
            <span className="text-xs align-top">
              {(product.price % 1).toFixed(2).slice(1)}
            </span>
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              {formatCurrency(product.originalPrice, product.currency)}
            </span>
          )}
        </div>
        {product.prime && <PrimeBadge />}
        {!compact && (
          <div className="mt-auto pt-1 flex items-center gap-2 flex-wrap">
            {product.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

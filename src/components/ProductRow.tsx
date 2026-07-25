import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  compact?: boolean;
}

export default function ProductRow({ title, subtitle, products, compact }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <section className="container mt-10">
      <div className="flex items-end justify-between mb-4 pl-1 gap-3">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className={`shrink-0 snap-start ${compact ? 'w-[200px] sm:w-[220px]' : 'w-[240px] sm:w-[260px] md:w-[280px]'}`}
          >
            <ProductCard product={p} compact={compact} />
          </div>
        ))}
      </div>
    </section>
  );
}

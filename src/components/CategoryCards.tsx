import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';
import { categories } from '@/data/categories';

interface Props {
  items?: Category[];
  title?: string;
}

export default function CategoryCards({
  items = categories.slice(0, 8),
  title = 'Shop by Category',
}: Props) {
  return (
    <section className="container -mt-6 sm:-mt-10 md:-mt-14 relative z-10 animate-fade-in">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4 pl-1">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((c, i) => (
          <Link
            key={c.id}
            to={`/category/${c.id}`}
            style={{ animationDelay: `${i * 40}ms` }}
            className="group bg-white rounded-sm shadow hover:shadow-xl transition-all animate-fade-in p-4 border border-gray-100 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 leading-tight pr-2 line-clamp-2">
                {c.name}
              </h3>
            </div>
            <div className="aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-gray-50 to-gray-100 mb-3">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,' +
                    encodeURIComponent(
                      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23FF9900'/><stop offset='100%' stop-color='%23FFD814'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/><text x='50%' y='50%' fill='white' text-anchor='middle' dy='.35em' font-family='serif' font-size='52' font-weight='bold'>${escapeXml(c.name.slice(0,2).toUpperCase())}</text></svg>`
                    );
                }}
              />
            </div>
            <div className="inline-flex items-center text-amazon-link text-sm group-hover:text-amazon-linkHover group-hover:underline">
              Shop now <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[c]!));
}

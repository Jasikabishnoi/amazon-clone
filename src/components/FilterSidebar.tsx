import { Star, X } from 'lucide-react';
import { useFilterStore, type SortOption } from '@/store/filterStore';
import { categories } from '@/data/categories';
import { useMemo } from 'react';

export default function FilterSidebar({ onClose, counts }: { onClose?: () => void; counts?: { total: number } }) {
  const s = useFilterStore();
  const priceMin = s.minPrice ?? '' as any;
  const priceMax = s.maxPrice ?? '' as any;

  const activeCount = useMemo(() => {
    let n = 0;
    if (s.categoryId) n++;
    if (typeof s.minPrice === 'number') n++;
    if (typeof s.maxPrice === 'number') n++;
    if (typeof s.minRating === 'number') n++;
    if (s.primeOnly) n++;
    return n;
  }, [s]);

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="md:sticky md:top-[128px] bg-white rounded-md md:bg-transparent md:rounded-none p-4 md:p-0 md:pr-4 border md:border-0 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">Filters</h3>
            {activeCount > 0 && (
              <span className="text-xs bg-amazon-yellow text-amazon-navy rounded-full px-2 py-0.5 font-bold">
                {activeCount}
              </span>
            )}
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden inline-flex p-1 rounded hover:bg-gray-100">
              <X size={18} />
            </button>
          )}
        </div>

        {counts && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-bold text-gray-900">{counts.total}</span> results
          </div>
        )}

        <div className="space-y-5 max-h-[70vh] md:max-h-[calc(100vh-160px)] overflow-y-auto pr-1 md:pr-2">
          <section>
            <h4 className="text-sm font-bold mb-2">Department</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  onClick={() => s.setCategory(undefined)}
                  className={`flex items-center gap-2 w-full text-left hover:text-amazon-linkHover ${
                    !s.categoryId ? 'text-amazon-linkHover font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span>All Departments</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => s.setCategory(c.id)}
                    className={`flex items-center gap-2 w-full text-left hover:text-amazon-linkHover ${
                      s.categoryId === c.id ? 'text-amazon-linkHover font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-sm font-bold mb-2">Price</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 focus-within:border-amazon-orange">
                <span className="text-gray-600">$</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) =>
                    s.setPriceRange(e.target.value ? Number(e.target.value) : undefined, s.maxPrice)
                  }
                  className="w-16 bg-transparent focus:outline-none text-sm"
                />
              </div>
              <span className="text-gray-500">–</span>
              <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 focus-within:border-amazon-orange">
                <span className="text-gray-600">$</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) =>
                    s.setPriceRange(s.minPrice, e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-16 bg-transparent focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              {[
                { label: 'Under $25', min: undefined, max: 25 },
                { label: '$25 to $50', min: 25, max: 50 },
                { label: '$50 to $100', min: 50, max: 100 },
                { label: '$100 to $200', min: 100, max: 200 },
                { label: 'Over $200', min: 200, max: undefined },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => s.setPriceRange(opt.min, opt.max)}
                  className="block w-full text-left hover:text-amazon-linkHover hover:underline"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold mb-2">Customer Review</h4>
            <ul className="space-y-1.5 text-sm">
              {[4, 3, 2, 1].map((r) => {
                const active = s.minRating === r;
                return (
                  <li key={r}>
                    <button
                      onClick={() => s.setMinRating(active ? undefined : r)}
                      className={`w-full text-left inline-flex items-center gap-1.5 px-2 py-1 rounded ${
                        active ? 'bg-amazon-yellow/60 text-amazon-navy' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="inline-flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < r ? 'fill-amazon-orange text-amazon-orange' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-amazon-link hover:text-amazon-linkHover hover:underline">
                        &amp; Up
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h4 className="text-sm font-bold mb-2">Eligible for Free Shipping</h4>
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={s.primeOnly}
                onChange={(e) => s.setPrimeOnly(e.target.checked)}
                className="w-4 h-4 accent-amazon-orange"
              />
              <span>prime FREE Shipping</span>
            </label>
          </section>

          {activeCount > 0 && (
            <button
              onClick={s.reset}
              className="w-full btn-amazon-outline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function SearchSortBar({
  total,
  sort,
  setSort,
  onOpenFilters,
}: {
  total: number;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  onOpenFilters: () => void;
}) {
  const options: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Avg. Customer Review' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2 py-3 border-b border-gray-200 bg-white">
      <div className="text-sm text-gray-700">
        <span className="font-bold">1-{Math.min(24, total)}</span> of{' '}
        <span className="font-bold">{total.toLocaleString()}</span> results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenFilters}
          className="md:hidden inline-flex items-center gap-1.5 btn-amazon-outline !py-1.5 !text-xs"
        >
          Filters
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          Sort by:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages: (number | '...')[] = [];
  const add = (x: number | '...') => pages.push(x);
  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      add(i);
    } else if (pages[pages.length - 1] !== '...') {
      add('...');
    }
  }
  return (
    <nav className="flex items-center justify-center gap-1.5 py-8">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="btn-amazon-outline !py-1.5 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className="px-2 text-gray-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`min-w-[36px] h-9 text-sm rounded-md border transition-colors ${
              p === page
                ? 'bg-amazon-orange border-amazon-orangeDark text-black font-bold'
                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="btn-amazon-outline !py-1.5 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
}

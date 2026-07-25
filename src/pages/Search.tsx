import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { Pagination, SearchSortBar } from '@/components/FilterSidebar';
import { useFilterStore, useFilteredProducts } from '@/store/filterStore';

export default function SearchPage() {
  const [sp] = useSearchParams();
  const query = sp.get('q') ?? '';
  const category = sp.get('category') ?? undefined;

  const setQuery = useFilterStore((s) => s.setQuery);
  const setCategory = useFilterStore((s) => s.setCategory);
  const sort = useFilterStore((s) => s.sort);
  const setSort = useFilterStore((s) => s.setSort);
  const reset = useFilterStore((s) => s.reset);

  useEffect(() => {
    reset();
    if (query) setQuery(query);
    if (category) setCategory(category);
  }, [query, category]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useFilteredProducts();
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const perPage = 24;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const paged = results.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [query, category]);

  const headerTitle = useMemo(() => {
    if (query) return `Results for “${query}”`;
    if (category) return `All ${category.replace(/(^|\/)[a-z]/g, (m) => m.toUpperCase())}`;
    return 'All Products';
  }, [query, category]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container py-3 flex items-center gap-2 text-sm text-gray-700">
          <Link to="/" className="hover:text-amazon-linkHover hover:underline">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-semibold truncate">{headerTitle}</span>
        </div>
      </div>
      <div className="container py-4">
        <SearchSortBar
          total={results.length}
          sort={sort}
          setSort={setSort}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <div className="flex gap-6 relative">
          <div className="hidden md:block">
            <FilterSidebar counts={{ total: results.length }} />
          </div>
          {filtersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in overflow-y-auto">
                <FilterSidebar onClose={() => setFiltersOpen(false)} counts={{ total: results.length }} />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-xl md:text-2xl font-bold text-gray-900 truncate">
                <SearchIcon size={20} className="inline mr-2 text-gray-400" />
                {headerTitle}
              </h1>
              <div className="md:hidden">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-1.5 btn-amazon-outline !py-1.5 !text-xs"
                >
                  <Filter size={14} /> Filters
                </button>
              </div>
            </div>

            {paged.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-md border">
                <SearchIcon size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-bold text-lg mb-1">We couldn’t find any matches</h3>
                <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                  Try checking your spelling, using more general words, or clearing filters.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={reset} className="btn-amazon-outline">Clear all filters</button>
                  <Link to="/" className="btn-amazon">Go to Home</Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {paged.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onPage={(np) => {
                setPage(np);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

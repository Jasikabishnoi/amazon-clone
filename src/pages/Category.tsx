import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter } from 'lucide-react';
import { getCategoryById, categories } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { Pagination, SearchSortBar } from '@/components/FilterSidebar';
import { useFilterStore, useFilteredProducts } from '@/store/filterStore';
import { categories as cat } from '@/data/categories';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const catData = getCategoryById(categoryId ?? '');
  const sort = useFilterStore((s) => s.sort);
  const setSort = useFilterStore((s) => s.setSort);
  const setCategory = useFilterStore((s) => s.setCategory);
  useMemo(() => setCategory(categoryId), [categoryId, setCategory]);

  const base = categoryId ? getProductsByCategory(categoryId) : [];
  const results = useFilteredProducts(base);

  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const perPage = 18;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const paged = results.slice((page - 1) * perPage, page * perPage);

  if (!catData) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-3xl font-bold mb-2">Category Not Found</h1>
        <p className="text-gray-600 mb-4">We couldn’t find that category.</p>
        <Link to="/" className="btn-amazon">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="relative h-56 md:h-72 overflow-hidden bg-gradient-to-br from-amazon-tealDark via-amazon-teal to-black text-white">
        {catData.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
            style={{ backgroundImage: `url(${catData.heroImage})` }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0" aria-hidden />
        <div className="container relative h-full flex flex-col justify-center">
          <nav className="text-xs text-white/80 mb-2 flex items-center gap-1.5">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} />
            <span className="hover:underline cursor-pointer">All Categories</span>
            <ChevronRight size={14} />
            <span className="text-white">{catData.name}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-5xl font-bold drop-shadow-sm">{catData.name}</h1>
          <p className="mt-2 max-w-2xl text-white/90">{catData.description}</p>
          <div className="mt-4 flex items-center gap-3">
            {categories.slice(0, 6).filter((c) => c.id !== catData.id).map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="text-xs bg-white/15 backdrop-blur hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-full transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6">
        <SearchSortBar
          total={results.length}
          sort={sort}
          setSort={setSort}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <div className="flex gap-6 relative">
          <div className="hidden md:block">
            <FilterSidebar />
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
              <h2 className="font-bold text-gray-900">
                {results.length.toLocaleString()} results in <span className="text-amazon-linkHover">{catData.name}</span>
              </h2>
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
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-bold text-lg mb-1">No results match your filters</h3>
                <p className="text-sm text-gray-600 mb-4">Try adjusting your price, rating, or other filters.</p>
                <button
                  onClick={() => {
                    useFilterStore.getState().reset();
                    setCategory(categoryId);
                  }}
                  className="btn-amazon-outline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {paged.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPage={(np) => { setPage(np); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

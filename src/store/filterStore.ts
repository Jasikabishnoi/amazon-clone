import { create } from 'zustand';
import type { FilterState, SortOption, Product } from '@/types';
export type { SortOption };
import { products } from '@/data/products';

interface FilterStore extends FilterState {
  setQuery: (q: string) => void;
  setCategory: (c?: string) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setMinRating: (r?: number) => void;
  setPrimeOnly: (v: boolean) => void;
  setSort: (s: SortOption) => void;
  reset: () => void;
}

const defaults: FilterState = {
  query: '',
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  primeOnly: false,
  sort: 'relevance',
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...defaults,
  setQuery: (q) => set({ query: q }),
  setCategory: (c) => set({ categoryId: c }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
  setMinRating: (r) => set({ minRating: r }),
  setPrimeOnly: (v) => set({ primeOnly: v }),
  setSort: (s) => set({ sort: s }),
  reset: () => set(defaults),
}));

function scoreQuery(q: string, p: Product): number {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return 1;
  let score = 0;
  const hay = `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
  terms.forEach((t) => {
    if (hay.includes(t)) score += 2;
    if (p.title.toLowerCase().includes(t)) score += 3;
  });
  return score;
}

export function useFilteredProducts(base?: Product[]): Product[] {
  const state = useFilterStore();
  const src = base ?? products;
  const results = src.filter((p) => {
    if (state.categoryId && p.categoryId !== state.categoryId) return false;
    if (typeof state.minPrice === 'number' && p.price < state.minPrice) return false;
    if (typeof state.maxPrice === 'number' && p.price > state.maxPrice) return false;
    if (typeof state.minRating === 'number' && p.rating < state.minRating) return false;
    if (state.primeOnly && !p.prime) return false;
    if (state.query.trim()) {
      const score = scoreQuery(state.query, p);
      if (score <= 0) return false;
    }
    return true;
  });
  const q = state.query.trim();
  const sort = state.sort;
  const copy = [...results];
  switch (sort) {
    case 'price-asc':
      copy.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      copy.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'newest':
      copy.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      break;
    case 'relevance':
    default:
      if (q) copy.sort((a, b) => scoreQuery(q, b) - scoreQuery(q, a));
      else copy.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  }
  return copy;
}

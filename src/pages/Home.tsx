import HeroCarousel from '@/components/HeroCarousel';
import CategoryCards from '@/components/CategoryCards';
import DealOfTheDay from '@/components/DealOfTheDay';
import ProductRow from '@/components/ProductRow';
import { products } from '@/data/products';

export default function Home() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 10);
  const newArrivals = [...products]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 10);
  const deals = products.filter((p) => p.originalPrice && p.price < p.originalPrice).slice(0, 10);
  const popular = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 10);

  return (
    <div className="bg-gray-50">
      <HeroCarousel />
      <CategoryCards />
      <DealOfTheDay />
      <ProductRow
        title="Best Sellers in Electronics & More"
        subtitle="The most-loved picks right now"
        products={bestsellers.length ? bestsellers : products.slice(0, 10)}
      />
      <ProductRow
        title="New Arrivals"
        subtitle="Just landed — fresh finds you’ll love"
        products={newArrivals}
      />
      <ProductRow
        title="Deals & Promotions"
        subtitle="Save big on these limited-time offers"
        products={deals.length ? deals : products.slice(2, 12)}
        compact
      />
      <ProductRow
        title="Customers’ Most-Reviewed"
        subtitle="Loved by thousands of shoppers"
        products={popular}
      />
    </div>
  );
}

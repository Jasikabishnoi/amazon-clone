import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80',
    description: 'Cutting-edge electronics, devices, and gadgets for every lifestyle.',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    description: 'Trendy clothing, footwear, and accessories for men, women, and kids.',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80',
    description: 'Furniture, decor, cookware, and essentials for a beautiful home.',
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
    description: 'Skincare, makeup, hair care, and grooming essentials from top brands.',
  },
  {
    id: 'books',
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80',
    description: 'Bestsellers, new releases, and timeless classics across every genre.',
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80',
    description: 'Gear, apparel, and equipment for your favorite sports and adventures.',
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80',
    description: 'Toys, games, and learning resources for kids of all ages.',
  },
  {
    id: 'grocery',
    name: 'Grocery & Gourmet',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1600&q=80',
    description: 'Fresh groceries, pantry staples, and gourmet treats delivered.',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

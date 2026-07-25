export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  categoryId: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  prime: boolean;
  tags: string[];
  specs: Record<string, string>;
  createdAt?: string;
  bestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  heroImage?: string;
  description?: string;
  parentId?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
  helpful?: number;
}

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  cardNumberLast4: string;
  cardBrand: string;
  cardHolder: string;
  expiry: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shipping: Address;
  payment: PaymentInfo;
  userEmail: string;
  createdAt: string;
  status: 'placed' | 'shipped' | 'delivered';
  estimatedDelivery: string;
}

export interface UserProfile {
  email: string;
  name: string;
  hashedPassword?: string;
  addresses: Address[];
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface FilterState {
  query: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  primeOnly: boolean;
  sort: SortOption;
}

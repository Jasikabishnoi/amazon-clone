import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { products, getProductById } from '@/data/products';

interface CartState {
  items: CartItem[];
  promoCode: string;
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  setPromo: (code: string) => void;
}

const PROMOS: Record<string, number> = {
  SAVE10: 0.1,
  WELCOME15: 0.15,
  PRIME20: 0.2,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      addItem: (productId, qty = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity: qty }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQty: (productId, qty) => {
        const safeQty = Math.max(0, Math.floor(qty));
        if (safeQty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: safeQty } : i
          ),
        });
      },
      clear: () => set({ items: [], promoCode: '' }),
      setPromo: (code) => set({ promoCode: code.trim().toUpperCase() }),
    }),
    { name: 'amazon-clone:cart' }
  )
);

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  let subtotal = 0;
  let count = 0;
  items.forEach((i) => {
    const p = getProductById(i.productId);
    if (!p) return;
    subtotal += p.price * i.quantity;
    count += i.quantity;
  });
  const discountRate = PROMOS[promoCode] ?? 0;
  const discount = subtotal * discountRate;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = subtotal > 25 || items.some((i) => getProductById(i.productId)?.prime) ? 0 : 5.99;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;
  return {
    subtotal,
    discount,
    discountRate,
    shipping,
    tax,
    total,
    count,
    promoValid: !promoCode || !!PROMOS[promoCode],
  };
}

export function useRelatedProduct(productId?: string) {
  if (!productId) return { related: products.slice(0, 8) };
  const p = getProductById(productId);
  const related = products
    .filter((x) => x.id !== productId && (x.categoryId === p?.categoryId || x.bestseller))
    .slice(0, 8);
  return { related: related.length ? related : products.slice(0, 8) };
}

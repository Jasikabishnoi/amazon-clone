import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, Order, UserProfile, PaymentInfo } from '@/types';
import { uid } from '@/utils/format';
import type { CartItem } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isGuest: boolean;
  orders: Order[];
  login: (email: string, name?: string) => void;
  logout: () => void;
  addAddress: (addr: Omit<Address, 'id'>) => Address;
  removeAddress: (id: string) => void;
  placeOrder: (args: {
    items: CartItem[];
    totals: Order['totals'];
    shipping: Address;
    payment: PaymentInfo;
  }) => Order;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isGuest: true,
      orders: [],
      login: (email, name) => {
        const trimmed = email.trim().toLowerCase();
        const existing = get().profile;
        const displayName =
          name?.trim() ||
          existing?.name ||
          trimmed.split('@')[0]?.replace(/[^a-z0-9]+/gi, ' ').trim() ||
          'Customer';
        set({
          isGuest: false,
          profile: {
            email: trimmed,
            name: displayName,
            addresses: existing?.addresses ?? [],
          },
        });
      },
      logout: () => set({ isGuest: true, profile: null }),
      addAddress: (addr) => {
        const address: Address = { ...addr, id: uid('addr') };
        set((s) => ({
          profile: s.profile
            ? { ...s.profile, addresses: [...s.profile.addresses, address] }
            : { email: 'guest@example.com', name: 'Guest', addresses: [address] },
        }));
        return address;
      },
      removeAddress: (id) =>
        set((s) => ({
          profile: s.profile
            ? { ...s.profile, addresses: s.profile.addresses.filter((a) => a.id !== id) }
            : s.profile,
        })),
      placeOrder: ({ items, totals, shipping, payment }) => {
        const now = new Date();
        const est = new Date(now.getTime() + 3 * 86400000);
        const order: Order = {
          id: uid('ord'),
          items,
          totals,
          shipping,
          payment,
          userEmail: get().profile?.email ?? 'guest@example.com',
          createdAt: now.toISOString(),
          status: 'placed',
          estimatedDelivery: est.toISOString().slice(0, 10),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
    }),
    { name: 'amazon-clone:user' }
  )
);

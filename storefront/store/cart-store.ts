import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Cart Store - Global state management for shopping cart
 *
 * Features:
 * - Add/remove items from cart
 * - Update item quantities
 * - Calculate totals
 * - Persist cart in localStorage
 * - Cart drawer open/close state
 *
 * @example
 * const { items, addItem, removeItem, isCartOpen, toggleCart } = useCartStore();
 */

export interface CartItem {
  id: string;
  title: string;
  variant_id?: string;
  variant_title?: string;
  price: number; // Price in cents (BRL)
  quantity: number;
  thumbnail?: string;
  metadata?: Record<string, any>;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, variant_id?: string) => void;
  updateQuantity: (id: string, quantity: number, variant_id?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (item) => {
        const items = get().items;
        const itemKey = item.variant_id
          ? `${item.id}-${item.variant_id}`
          : item.id;

        // Check if item already exists
        const existingItemIndex = items.findIndex((i) => {
          const existingKey = i.variant_id
            ? `${i.id}-${i.variant_id}`
            : i.id;
          return existingKey === itemKey;
        });

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += item.quantity || 1;
          set({ items: updatedItems });
        } else {
          // Add new item
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          });
        }

        // Auto-open cart when item is added
        set({ isCartOpen: true });
      },

      removeItem: (id, variant_id) => {
        const items = get().items;
        const filteredItems = items.filter((item) => {
          if (variant_id) {
            return !(item.id === id && item.variant_id === variant_id);
          }
          return item.id !== id;
        });
        set({ items: filteredItems });
      },

      updateQuantity: (id, quantity, variant_id) => {
        const items = get().items;

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeItem(id, variant_id);
          return;
        }

        const updatedItems = items.map((item) => {
          if (variant_id) {
            if (item.id === id && item.variant_id === variant_id) {
              return { ...item, quantity };
            }
          } else if (item.id === id) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [], isCartOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      openCart: () => {
        set({ isCartOpen: true });
      },

      closeCart: () => {
        set({ isCartOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'use-nerd-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

export default useCartStore;

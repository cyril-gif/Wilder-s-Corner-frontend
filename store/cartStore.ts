import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const existing = get().items.find(
          (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
        );
        if (existing) {
          const newQty = Math.min(existing.qty + newItem.qty, existing.stock);
          set({
            items: get().items.map((i) =>
              i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
                ? { ...i, qty: newQty }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, qty: Math.min(qty, i.stock) } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' }
  )
);

export default useCartStore;


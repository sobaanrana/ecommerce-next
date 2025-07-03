import { Product } from "@/types/product";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// export type CartItem = {
//   product: Product;
// };

type CartState = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string, keyIndex: number) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, product] };
        }),
      removeItem: (id, keyIndex) => {
        console.log("Removing item with id:", id, "at index:", keyIndex);
        set((state) => ({
          items: state.items.filter((item, key) => {
            return !(key === keyIndex && item._id === id);
          }),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

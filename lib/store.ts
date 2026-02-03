import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PhotoStyle = "straight-on" | "angled";
export type PhotoPackage = "ecommerce" | "lifestyle" | "fullpackage";

// Cart Item interface
export interface CartItem {
  id: string;
  orderId: string;
  packageType: PhotoPackage | null;
  photoStyle?: PhotoStyle;
  aspectRatios: string[];
  skuCount: number;
  productNotes: string;
  price: number;
  addedAt: string;
  // E-commerce specific
  selectedAngles?: string[];
  // Lifestyle specific
  customConcept?: string;
}

// Cart store - with localStorage persistence
interface CartState {
  items: CartItem[];
  editingCartItemId: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<CartItem>) => Promise<void>;
  setEditingCartItemId: (id: string | null) => void;
  getEditingItem: () => CartItem | null;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
  setItems: (items: CartItem[]) => void;
  syncWithDB: () => Promise<void>; // Sync to database
  loadFromDB: () => Promise<void>; // Load cart from database
  mergeAndSync: () => Promise<void>; // Merge local cart with DB after login
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      editingCartItemId: null,

      // Add item (localStorage auto-persisted by zustand)
      addItem: async (item) => {
        set((state) => ({ items: [...state.items, item] }));
        // Try to sync to DB in background (will fail silently if not logged in or no table)
        get().syncWithDB().catch(() => {});
      },

      // Remove item
      removeItem: async (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        get().syncWithDB().catch(() => {});
      },

      // Update item
      updateItem: async (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
        get().syncWithDB().catch(() => {});
      },

      setEditingCartItemId: (id) => set({ editingCartItemId: id }),

      getEditingItem: () => {
        const state = get();
        if (!state.editingCartItemId) return null;
        return state.items.find((i) => i.id === state.editingCartItemId) || null;
      },

      // Clear cart
      clearCart: async () => {
        console.log("[Cart] clearCart called");
        set({ items: [], editingCartItemId: null });
        get().syncWithDB().catch(() => {});
      },

      getCartTotal: () => get().items.reduce((sum, item) => sum + item.price, 0),
      getItemCount: () => get().items.length,
      setItems: (items) => {
        console.log("[Cart] setItems called with", items.length, "items");
        set({ items });
      },

      // Sync cart to database (silent failures)
      syncWithDB: async () => {
        try {
          const sessionCheck = await fetch("/api/auth/session");
          const sessionData = await sessionCheck.json();

          if (!sessionData || !sessionData.user) {
            return; // Not logged in, just use localStorage
          }

          const items = get().items;
          console.log("[Cart] Syncing cart to database:", items.length, "items");
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
            cache: "no-store",
          });
          if (response.ok) {
            console.log("[Cart] Successfully synced to database");
          }
        } catch (error) {
          // Silent fail - localStorage still works
        }
      },

      // Load cart from database only
      loadFromDB: async () => {
        try {
          console.log("[Cart] Loading cart from database...");
          const response = await fetch("/api/cart", {
            cache: "no-store",
          });
          if (response.ok) {
            const { items: dbItems } = await response.json();
            if (dbItems && Array.isArray(dbItems) && dbItems.length > 0) {
              set({ items: dbItems });
              console.log("[Cart] Cart loaded from DB:", dbItems.length, "items");
            }
          }
        } catch (error) {
          // Silent fail - localStorage still works
        }
      },

      // Merge local cart with DB cart after login
      mergeAndSync: async () => {
        try {
          const localItems = get().items;
          const response = await fetch("/api/cart", { cache: "no-store" });

          if (response.ok) {
            const { items: dbItems } = await response.json();

            if (dbItems && Array.isArray(dbItems)) {
              // Merge: local items + DB items (avoid duplicates by id)
              const existingIds = new Set(dbItems.map((i: CartItem) => i.id));
              const newItems = localItems.filter(i => !existingIds.has(i.id));
              const mergedItems = [...dbItems, ...newItems];

              set({ items: mergedItems });
              console.log("[Cart] Merged cart:", mergedItems.length, "items");

              // Sync merged cart back to DB
              if (newItems.length > 0) {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ items: mergedItems }),
                  cache: "no-store",
                });
              }
            }
          }
        } catch (error) {
          console.error("[Cart] Merge error:", error);
        }
      },
    }),
    {
      name: "rush-photo-cart", // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

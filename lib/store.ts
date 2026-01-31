import { create } from "zustand";

export type PhotoStyle = "straight-on" | "top-down" | "angled";
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

// Cart store - Database only (no localStorage)
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
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  editingCartItemId: null,

  // Add item and sync to database (non-blocking for speed)
  addItem: async (item) => {
    set((state) => ({ items: [...state.items, item] }));
    // Sync in background - don't block UI
    get().syncWithDB().catch(console.error);
  },

  // Remove item and sync to database (non-blocking for speed)
  removeItem: async (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    // Sync in background - don't block UI
    get().syncWithDB().catch(console.error);
  },

  // Update item and sync to database (non-blocking for speed)
  updateItem: async (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    // Sync in background - don't block UI
    get().syncWithDB().catch(console.error);
  },

  setEditingCartItemId: (id) => set({ editingCartItemId: id }),

  getEditingItem: () => {
    const state = get();
    if (!state.editingCartItemId) return null;
    return state.items.find((i) => i.id === state.editingCartItemId) || null;
  },

  // Clear cart and sync to database
  clearCart: async () => {
    console.log("[Cart] clearCart called");
    set({ items: [], editingCartItemId: null });
    await get().syncWithDB();
  },

  getCartTotal: () => get().items.reduce((sum, item) => sum + item.price, 0),
  getItemCount: () => get().items.length,
  setItems: (items) => {
    console.log("[Cart] setItems called with", items.length, "items");
    set({ items });
  },

  // Sync cart to database
  syncWithDB: async () => {
    try {
      const items = get().items;
      console.log("[Cart] Syncing cart to database:", items.length, "items");
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
        cache: "no-store",
      });
      if (!response.ok) {
        console.error("[Cart] Failed to sync cart to database, status:", response.status);
      } else {
        console.log("[Cart] Successfully synced to database");
      }
    } catch (error) {
      console.error("[Cart] Error syncing cart:", error);
    }
  },

  // Load cart from database only
  loadFromDB: async () => {
    try {
      console.log("[Cart] Loading cart from database...");
      const response = await fetch("/api/cart", {
        cache: "no-store", // Prevent caching
      });
      if (response.ok) {
        const { items: dbItems } = await response.json();
        console.log("[Cart] Loaded items from DB:", dbItems);
        if (dbItems && Array.isArray(dbItems)) {
          set({ items: dbItems });
          console.log("[Cart] Cart updated with", dbItems.length, "items");
        }
      } else {
        console.error("[Cart] Failed to load cart, status:", response.status);
      }
    } catch (error) {
      console.error("[Cart] Error loading cart from DB:", error);
    }
  },
}));

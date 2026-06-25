"use client";

import {
  createContext, useContext, useReducer, useEffect,
  useState, useCallback, useMemo, type ReactNode,
} from "react";
import type { Product } from "@/lib/collections";
import { getProductPrice } from "@/lib/currency";

// ─── Types ────────────────────────────────────────────────────
export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize: string | null;
};

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "ADD"; product: Product; quantity: number; selectedSize: string | null }
  | { type: "REMOVE"; slug: string; selectedSize: string | null }
  | { type: "UPDATE_QTY"; slug: string; selectedSize: string | null; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

// ─── Cart Reducer ─────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE": return { items: action.items };
    case "ADD": {
      const key = `${action.product.slug}::${action.selectedSize ?? ""}`;
      const existing = state.items.find(
        (i) => `${i.product.slug}::${i.selectedSize ?? ""}` === key
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            `${i.product.slug}::${i.selectedSize ?? ""}` === key
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: action.quantity, selectedSize: action.selectedSize }],
      };
    }
    case "REMOVE": {
      const key = `${action.slug}::${action.selectedSize ?? ""}`;
      return { items: state.items.filter((i) => `${i.product.slug}::${i.selectedSize ?? ""}` !== key) };
    }
    case "UPDATE_QTY": {
      const key = `${action.slug}::${action.selectedSize ?? ""}`;
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => `${i.product.slug}::${i.selectedSize ?? ""}` !== key) };
      }
      return {
        items: state.items.map((i) =>
          `${i.product.slug}::${i.selectedSize ?? ""}` === key ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case "CLEAR": return { items: [] };
    default: return state;
  }
}

// ─── Cart Context ─────────────────────────────────────────────
type CartCtx = {
  items: CartItem[];
  cartCount: number;
  cartTotal: string; // Keep for backwards compatibility
  cartTotalRaw: number;
  miniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  addToCart: (product: Product, qty: number, size: string | null) => void;
  removeFromCart: (slug: string, size: string | null) => void;
  updateQty: (slug: string, size: string | null, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tz_cart");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("tz_cart", JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const cartCount = useMemo(() => state.items.reduce((s, i) => s + i.quantity, 0), [state.items]);
  const cartTotalRaw = useMemo(() => {
    return state.items.reduce((s, i) => {
      const raw = getProductPrice(i.product);
      return s + raw * i.quantity;
    }, 0);
  }, [state.items]);
  const cartTotal = useMemo(() => "₹" + cartTotalRaw.toLocaleString("en-IN"), [cartTotalRaw]);

  const addToCart = useCallback((product: Product, qty: number, size: string | null) => {
    dispatch({ type: "ADD", product, quantity: qty, selectedSize: size });
    setMiniCartOpen(true);
  }, []);
  const removeFromCart = useCallback((slug: string, size: string | null) => dispatch({ type: "REMOVE", slug, selectedSize: size }), []);
  const updateQty = useCallback((slug: string, size: string | null, qty: number) => dispatch({ type: "UPDATE_QTY", slug, selectedSize: size, quantity: qty }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openMiniCart = useCallback(() => setMiniCartOpen(true), []);
  const closeMiniCart = useCallback(() => setMiniCartOpen(false), []);

  return (
    <CartContext.Provider value={{ items: state.items, cartCount, cartTotal, cartTotalRaw, miniCartOpen, openMiniCart, closeMiniCart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

// ─── Wishlist Context ─────────────────────────────────────────
type WishlistCtx = {
  wishlist: string[];            // product slugs
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (product: Product) => void;
  wishlistProducts: Product[];
};

const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children, allProducts }: { children: ReactNode; allProducts: Product[] }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tz_wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("tz_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.slug) ? prev.filter((s) => s !== product.slug) : [...prev, product.slug]
    );
  }, []);

  const wishlistProducts = useMemo(
    () => allProducts.filter((p) => wishlist.includes(p.slug)),
    [wishlist, allProducts]
  );

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, wishlistProducts }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}

// ─── Search Context ───────────────────────────────────────────
type SearchCtx = {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  query: string;
  setQuery: (q: string) => void;
  results: Product[];
};

const SearchContext = createContext<SearchCtx | null>(null);

function tokenize(str: string) {
  return str.toLowerCase().replace(/[""'"']/g, '"').replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
}

function scoreProduct(product: Product, tokens: string[]): number {
  const fields = [
    product.name,
    product.handle ?? "",
    product.category,
    product.categoryLabel,
    (product.tags ?? []).join(" "),
    (product.variants ?? []).map((v) => v.sku).join(" "),
  ].join(" ").toLowerCase();

  return tokens.reduce((score, token) => {
    if (fields.includes(token)) return score + 1;
    return score;
  }, 0);
}

export function SearchProvider({ children, allProducts }: { children: ReactNode; allProducts: Product[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => { setSearchOpen(false); setQuery(""); }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    const tokens = tokenize(q);
    return allProducts
      .map((p) => ({ p, score: scoreProduct(p, tokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ p }) => p)
      .slice(0, 24);
  }, [query, allProducts]);

  return (
    <SearchContext.Provider value={{ searchOpen, openSearch, closeSearch, query, setQuery, results }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be inside SearchProvider");
  return ctx;
}

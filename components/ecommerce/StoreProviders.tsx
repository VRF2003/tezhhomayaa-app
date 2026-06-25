"use client";

import { CartProvider, WishlistProvider, SearchProvider } from "@/lib/store";
import MiniCart from "@/components/ecommerce/MiniCart";
import SearchOverlay from "@/components/ecommerce/SearchOverlay";
import type { Product } from "@/lib/collections";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { CommerceProvider } from "@/lib/commerce-context";

export default function StoreProviders({ children, allProducts }: { children: React.ReactNode, allProducts: Product[] }) {
  return (
    <CommerceProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider allProducts={allProducts}>
            <SearchProvider allProducts={allProducts}>
              {children}
              <MiniCart />
              <SearchOverlay />
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </CommerceProvider>
  );
}

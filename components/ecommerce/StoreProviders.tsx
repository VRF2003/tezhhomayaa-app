"use client";

import { CartProvider, WishlistProvider, SearchProvider, AuthProvider } from "@/lib/store";
import MiniCart from "@/components/ecommerce/MiniCart";
import SearchOverlay from "@/components/ecommerce/SearchOverlay";
import type { Product } from "@/lib/collections";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { CommerceProvider } from "@/lib/commerce-context";
import { MarketProvider } from "@/lib/market/MarketContext";
import { MarketUIProvider } from "@/components/market/MarketUIProvider";
import { MarketDialog } from "@/components/market/MarketDialog";

export default function StoreProviders({ children, allProducts }: { children: React.ReactNode, allProducts: Product[] }) {
  return (
    <CommerceProvider>
      <MarketProvider>
        <MarketUIProvider>
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider allProducts={allProducts}>
                  <SearchProvider allProducts={allProducts}>
                    {children}
                    <MiniCart />
                    <SearchOverlay />
                    <MarketDialog />
                  </SearchProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </CurrencyProvider>
        </MarketUIProvider>
      </MarketProvider>
    </CommerceProvider>
  );
}

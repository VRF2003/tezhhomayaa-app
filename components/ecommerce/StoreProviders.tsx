"use client";

import { CartProvider, WishlistProvider, SearchProvider, AuthProvider } from "@/lib/store";
import MiniCart from "@/components/ecommerce/MiniCart";
import SearchOverlay from "@/components/ecommerce/SearchOverlay";
import type { Product } from "@/lib/collections";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { CommerceProvider } from "@/lib/commerce-context";
import { MarketProvider } from "@/lib/market/MarketContext";
import { MarketUIProvider } from "@/components/market/MarketUIProvider";
import { MaisonArrival } from "@/components/arrival/MaisonArrival";
import { GlobalExperienceProvider } from "@/lib/global-experience/context/GlobalExperienceContext";

import { PrivateConciergeToast } from "@/components/ecommerce/PrivateConciergeToast";

export default function StoreProviders({ children, allProducts, initialGeeMarketId, activePromotions = [] }: { children: React.ReactNode, allProducts: Product[], initialGeeMarketId?: string, activePromotions?: any[] }) {
  return (
    // GlobalExperienceProvider is the outermost wrapper.
    // This ensures the GEE context is initialized before any other system,
    // and is available to both the Maison Arrival Platform and the Homepage.
    <GlobalExperienceProvider initialMarketId={initialGeeMarketId}>
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
                      <MaisonArrival />
                      <PrivateConciergeToast activePromotions={activePromotions} />
                    </SearchProvider>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </CurrencyProvider>
          </MarketUIProvider>
        </MarketProvider>
      </CommerceProvider>
    </GlobalExperienceProvider>
  );
}

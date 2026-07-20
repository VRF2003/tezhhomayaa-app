"use client";

import { useState, useEffect } from "react";
import ProductDetailPage from "@/components/layout/ProductDetailPage";
import type { Product } from "@/lib/collections";
import { CartProvider, WishlistProvider, SearchProvider, AuthProvider } from "@/lib/store";
import { GlobalExperienceProvider } from "@/lib/global-experience/context/GlobalExperienceContext";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { CommerceProvider } from "@/lib/commerce-context";
import { MarketProvider } from "@/lib/market/MarketContext";
import { MarketUIProvider } from "@/components/market/MarketUIProvider";

export default function ProductPreviewPage() {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_PRODUCT_PREVIEW" && event.data?.product) {
        setProduct(event.data.product);
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    // Notify parent that we are ready to receive data
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!product) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#edeae5] text-[#9a9690] uppercase tracking-widest text-xs">
        Initializing Preview...
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <GlobalExperienceProvider>
        <CommerceProvider>
          <MarketProvider>
            <MarketUIProvider>
              <CurrencyProvider>
                <AuthProvider>
                  <CartProvider>
                    <WishlistProvider allProducts={[product]}>
                      <SearchProvider allProducts={[product]}>
                        <ProductDetailPage product={product} related={[]} isPreviewMode={true} />
                      </SearchProvider>
                    </WishlistProvider>
                  </CartProvider>
                </AuthProvider>
              </CurrencyProvider>
            </MarketUIProvider>
          </MarketProvider>
        </CommerceProvider>
      </GlobalExperienceProvider>
    </div>
  );
}

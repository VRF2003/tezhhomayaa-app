"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Market } from "./types";
import { MarketService, MARKET_COOKIE_NAME } from "./MarketService";

type MarketContextType = {
  market: Market;
  setMarket: (marketCode: string) => Promise<void>;
  isLoading: boolean;
};

const MarketContext = createContext<MarketContextType | null>(null);

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function MarketProvider({ children, initialMarket }: { children: ReactNode, initialMarket?: Market }) {
  // If initialMarket is passed (e.g. from server components), use it.
  // Otherwise resolve it on client mount using cookie.
  const [market, setMarketState] = useState<Market>(initialMarket || MarketService.getDefaultMarket());
  const [isLoading, setIsLoading] = useState(!initialMarket);

  useEffect(() => {
    if (!initialMarket) {
      const cookieMarket = getCookieValue(MARKET_COOKIE_NAME);
      // For now, we only resolve cookie -> default on the client if no server initial market was provided.
      // (User profile and Geolocation would ideally be resolved on the server and passed down).
      const resolved = MarketService.resolveMarket(null, cookieMarket, null);
      setMarketState(resolved);
      setIsLoading(false);
    }
  }, [initialMarket]);

  useEffect(() => {
    if (!isLoading) {
      console.log(`[Global Market Engine] Active Market: ${market.marketName} (${market.currencyCode})`);
    }
  }, [market, isLoading]);

  const setMarket = async (marketCode: string) => {
    // 1. Resolve and validate locally
    const newMarket = MarketService.getMarketByCode(marketCode);
    if (!newMarket) throw new Error("Invalid market code");

    // 2. Optimistic update
    setMarketState(newMarket);

    // 3. Update cookie on client
    if (typeof document !== "undefined") {
      document.cookie = `${MARKET_COOKIE_NAME}=${marketCode}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
    
    // In a full implementation, you might want to router.refresh() here 
    // to update server components with the new market context.
  };

  return (
    <MarketContext.Provider value={{ market, setMarket, isLoading }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const ctx = useContext(MarketContext);
  if (!ctx) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return ctx;
}

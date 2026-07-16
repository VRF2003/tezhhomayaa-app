"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { MARKET_COOKIE_NAME } from "@/lib/market/MarketService";
import { useMarket } from "@/lib/market/MarketContext";

export type MarketUIContextType = {
  isOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
  hasInitialized: boolean;
};

export const MarketUIContext = createContext<MarketUIContextType | null>(null);

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function MarketUIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { isLoading } = useMarket();

  useEffect(() => {
    // Only check the cookie once the core market engine has loaded
    if (!isLoading) {
      const existingCookie = getCookieValue(MARKET_COOKIE_NAME);
      if (!existingCookie) {
        setTimeout(() => setIsOpen(true), 600);
      }
      setHasInitialized(true);
    }
  }, [isLoading]);

  const openSelector = () => setIsOpen(true);
  const closeSelector = () => setIsOpen(false);

  return (
    <MarketUIContext.Provider value={{ isOpen, openSelector, closeSelector, hasInitialized }}>
      {children}
    </MarketUIContext.Provider>
  );
}

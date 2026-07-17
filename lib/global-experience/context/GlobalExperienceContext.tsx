"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
import { Market } from "../types/market";
import { GlobalExperienceRegistry } from "../GlobalExperienceRegistry";

interface GlobalExperienceContextType {
  activeMarket: Market;
  activeRegion: string;
  activeCountry: string;
  activeLanguage: string;
  locale: string;
  currency: string;
  timezone: string;
  numberFormat: string;
  dateFormat: string;
  /** Set the active market by its GEE Market ID (e.g., "in-en"). */
  setMarket: (marketId: string) => void;
}

const GlobalExperienceContext = createContext<GlobalExperienceContextType | undefined>(undefined);

export function GlobalExperienceProvider({ children }: { children: React.ReactNode }) {
  // Initialize with the global default market — no persistence, memory only.
  const [activeMarket, setActiveMarket] = useState<Market>(
    () => GlobalExperienceRegistry.getGlobalDefaultMarket()
  );

  /**
   * setMarket — stable function reference via useCallback.
   * Validates the Market ID against the registry before committing state.
   * Silently warns and ignores invalid IDs rather than crashing.
   */
  const setMarket = useCallback((marketId: string) => {
    const market = GlobalExperienceRegistry.getMarketById(marketId);
    if (market) {
      setActiveMarket(market);
    } else {
      console.warn(
        `[GlobalExperienceProvider] Ignored invalid market ID: "${marketId}". ` +
        `No matching market found in GlobalExperienceRegistry.`
      );
    }
  }, []);

  /**
   * Memoize the entire context value to prevent downstream re-renders
   * whenever an unrelated parent component re-renders.
   */
  const value = useMemo<GlobalExperienceContextType>(
    () => ({
      activeMarket,
      activeRegion: activeMarket.region,
      activeCountry: activeMarket.country,
      activeLanguage: activeMarket.language,
      locale: activeMarket.locale,
      currency: activeMarket.currency,
      timezone: activeMarket.timezone,
      numberFormat: activeMarket.numberFormat,
      dateFormat: activeMarket.dateFormat,
      setMarket,
    }),
    [activeMarket, setMarket]
  );

  return (
    <GlobalExperienceContext.Provider value={value}>
      {children}
    </GlobalExperienceContext.Provider>
  );
}

export { GlobalExperienceContext };

"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
import { Market } from "../types/market";
import { GlobalExperienceRegistry } from "../GlobalExperienceRegistry";
import { Observability } from "@/lib/infrastructure/observability";

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

export function GlobalExperienceProvider({ children, initialMarketId }: { children: React.ReactNode, initialMarketId?: string }) {
  // Initialize with the global default market, overridden by initialMarketId if provided by server
  const [activeMarket, setActiveMarket] = useState<Market>(
    () => {
      if (initialMarketId) {
        const m = GlobalExperienceRegistry.getMarketById(initialMarketId);
        if (m) return m;
      }
      return GlobalExperienceRegistry.getGlobalDefaultMarket();
    }
  );

  /**
   * setMarket — stable function reference via useCallback.
   * Validates the Market ID against the registry before committing state.
   */
  const setMarket = useCallback((marketId: string) => {
    const market = GlobalExperienceRegistry.getMarketById(marketId);
    if (market) {
      setActiveMarket(market);
      // Persist the GEE market ID in a cookie so the server knows about the language selection
      if (typeof document !== "undefined") {
        document.cookie = `tz_gee_market_id=${marketId}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      }
    } else {
      Observability.getLogger("System").warn.bind(Observability.getLogger("System"), "Warn")(
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

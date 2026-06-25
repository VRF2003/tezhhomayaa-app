"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CurrencyCode, COUNTRY_TO_CURRENCY, parsePrice, formatPriceForCurrency, SUPPORTED_CURRENCIES } from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (rawPrice: string | number) => string;
  isReady: boolean;
  rates: Record<string, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isReady, setIsReady] = useState(false);

  // Initialize currency and rates
  useEffect(() => {
    async function init() {
      // 1. Fetch rates
      try {
        const res = await fetch("/api/exchange-rates");
        if (res.ok) {
          const data = await res.json();
          if (data.rates && Object.keys(data.rates).length > 0) {
            setRates(data.rates);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch rates, falling back to INR only.", err);
      }

      // 2. Determine currency
      const saved = localStorage.getItem("tz_currency") as CurrencyCode;
      if (saved && SUPPORTED_CURRENCIES.find(c => c.code === saved)) {
        setCurrencyState(saved);
        setIsReady(true);
        return;
      }

      // 3. Fallback to IP geolocation
      try {
        const geoRes = await fetch("/api/geolocation");
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const detected = COUNTRY_TO_CURRENCY[geoData.country];
          if (detected) {
            setCurrencyState(detected);
            setIsReady(true);
            return;
          }
        }
      } catch (err) {
        console.warn("Geolocation failed, defaulting to INR.", err);
      }

      setIsReady(true); // Defaulted to INR
    }
    
    init();
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("tz_currency", code);
  };

  const formatPrice = (rawPrice: string | number) => {
    const amount = parsePrice(rawPrice);
    const rate = rates[currency] || 1;
    // If we're on the server or hydrating, we might want to return the base currency strictly 
    // to prevent hydration mismatch. But since we use `isReady`, we can conditionally render or
    // just return the raw string if we want to preserve SSR SEO.
    // However, the cleanest way without hydration mismatch is to always render the INR text during SSR
    // and let the client patch it.
    if (!isReady && typeof window === "undefined") {
      return formatPriceForCurrency(amount, "INR", 1);
    }
    
    return formatPriceForCurrency(amount, currency, rate);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isReady, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

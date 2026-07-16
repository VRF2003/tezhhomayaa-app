"use client";

import { useContext } from "react";
import { MarketUIContext, MarketUIContextType } from "@/components/market/MarketUIProvider";

export function useMarketSelector(): MarketUIContextType {
  const context = useContext(MarketUIContext);
  if (!context) {
    throw new Error("useMarketSelector must be used within a MarketUIProvider");
  }
  return context;
}

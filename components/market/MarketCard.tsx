"use client";

import React from "react";
import { Market } from "@/lib/market/types";

export function MarketCard({ 
  market, 
  isActive, 
  onSelect 
}: { 
  market: Market; 
  isActive: boolean; 
  onSelect: (marketCode: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(market.marketCode)}
      className={`w-full flex items-start justify-between p-5 mb-4 rounded-xl transition-all duration-300 text-left border relative ${
        isActive 
          ? "border-[var(--obsidian)] bg-[#fafaf8]/50" 
          : "border-transparent bg-transparent hover:bg-black/[0.02]"
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Country & Currency */}
        <div className="flex items-center gap-2 mb-1">
          <span 
            className="text-xl md:text-2xl text-[var(--obsidian)]"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            {market.marketName}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            {market.currencyCode} ({market.currencySymbol})
          </span>
        </div>

        {/* Shipping & Delivery info */}
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 9l2-2h10l2 2" />
              <rect x="3" y="9" width="18" height="12" rx="2" ry="2" />
              <path d="M12 12v6" />
            </svg>
            {market.shippingOrigin || `Ships from ${market.marketName}`}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {market.estimatedDelivery || "Estimated Delivery: 2–5 Business Days"}
          </span>
          {market.description && (
            <span className="text-xs text-gray-400 mt-1 italic">
              {market.description}
            </span>
          )}
        </div>
      </div>

      {/* Right Side: Recommended Tag & Check Icon */}
      <div className="flex flex-col items-end gap-3 h-full justify-between">
        {isActive ? (
          <span className="text-[10px] uppercase tracking-widest text-[var(--slate)] bg-gray-100 px-2 py-1 rounded-full">
            Recommended
          </span>
        ) : (
          <div /> // Spacer
        )}
        
        <div className="mt-auto">
          {isActive ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--obsidian)" strokeWidth="1.5" className="opacity-100 transition-opacity duration-300">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-0 transition-opacity duration-300 text-gray-300">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

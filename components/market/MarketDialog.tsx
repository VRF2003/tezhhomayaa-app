"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarket } from "@/lib/market/MarketContext";
import { MarketService } from "@/lib/market/MarketService";
import { useMarketSelector } from "@/hooks/useMarketSelector";

export function MarketDialog() {
  const { market, setMarket, isLoading } = useMarket();
  const { isOpen, closeSelector } = useMarketSelector();
  const [selectedMarketCode, setSelectedMarketCode] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize selected market when modal opens
  useEffect(() => {
    if (isOpen && market && !selectedMarketCode) {
      setSelectedMarketCode(market.marketCode);
    }
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, market, selectedMarketCode]);

  // Trap focus & Escape key support
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSelector();
    };
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeSelector]);

  const handleContinue = async () => {
    if (selectedMarketCode) {
      await setMarket(selectedMarketCode);
      closeSelector();
    }
  };

  const allMarkets = MarketService.getAllMarkets();

  // Filter and group markets
  const groupedMarkets = useMemo(() => {
    const filtered = allMarkets.filter(
      (m) =>
        m.marketName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.countryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.currencyCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, typeof allMarkets> = {};
    filtered.forEach((m) => {
      if (!groups[m.region]) groups[m.region] = [];
      groups[m.region].push(m);
    });

    return groups;
  }, [allMarkets, searchQuery]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.4, delay: 0.1 } }
  };

  const modalVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut", delay: 0.1 } },
    exit: { y: 10, opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto p-4 md:p-8"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeSelector}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-3xl bg-white flex flex-col overflow-hidden max-h-full shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={closeSelector}
              className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full flex flex-col p-6 md:p-10 md:pb-6 border-b border-gray-100">
              <div className="text-center mb-6">
                <span className="text-xl text-[#6b2c2c] tracking-[0.1em] block mb-4" style={{ fontFamily: "var(--font-cormorant, serif)" }}>Tezhhomayaa</span>
                <h2 className="text-2xl md:text-3xl text-[var(--obsidian)] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
                  Select your shipping destination
                </h2>
                <p className="text-sm text-gray-500">
                  This sets your currency, shipping options, and regional pricing.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input 
                  type="text"
                  placeholder="Search for a country or currency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-[var(--obsidian)] pl-11 pr-4 py-3 rounded-none focus:outline-none focus:border-[var(--obsidian)] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Scrollable Regions */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-10 bg-[#fafaf8]">
              {Object.keys(groupedMarkets).length === 0 ? (
                <div className="text-center text-gray-400 py-10">No matching markets found.</div>
              ) : (
                <div className="columns-1 md:columns-2 gap-x-12 gap-y-8 space-y-8">
                  {Object.entries(groupedMarkets).map(([region, markets]) => (
                    <div key={region} className="break-inside-avoid">
                      <h3 
                        className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold"
                        style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                      >
                        {region}
                      </h3>
                      <ul className="space-y-1">
                        {markets.map((m) => {
                          const isSelected = selectedMarketCode === m.marketCode;
                          return (
                            <li key={m.id}>
                              <button
                                disabled={!m.enabled}
                                onClick={() => setSelectedMarketCode(m.marketCode)}
                                className={`w-full flex items-center justify-between py-2.5 px-3 -mx-3 transition-colors text-left group ${
                                  !m.enabled 
                                    ? "opacity-50 cursor-not-allowed" 
                                    : "hover:bg-black/5"
                                } ${isSelected ? "bg-black/5" : ""}`}
                              >
                                <span className={`text-[15px] ${isSelected ? "font-medium text-black" : "text-gray-700"} flex items-center gap-2`}>
                                  {m.marketName}
                                  {!m.enabled && (
                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded-sm">
                                      Coming Soon
                                    </span>
                                  )}
                                </span>
                                {m.enabled && (
                                  <span className={`text-xs ${isSelected ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}>
                                    {m.currencyCode}
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-white border-t border-gray-100 flex justify-center">
              <button
                onClick={handleContinue}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={!selectedMarketCode}
                className="group flex items-center justify-center gap-3 w-full md:w-auto bg-[var(--obsidian)] border border-[var(--obsidian)] hover:bg-black text-white py-3.5 px-12 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="uppercase tracking-widest text-[11px] md:text-xs">Enter Market</span>
                <svg 
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="transition-transform duration-300 ease-out"
                  style={{ transform: isHovered && selectedMarketCode ? "translateX(4px)" : "translateX(0)" }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

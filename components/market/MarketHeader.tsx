"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarket } from "@/lib/market/MarketContext";
import { useMarketSelector } from "@/hooks/useMarketSelector";
import { useExperienceServices } from "@/lib/global-experience/services";

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function MarketHeader() {
  const { isLoading } = useMarket();
  const { openSelector } = useMarketSelector();
  const services = useExperienceServices();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (isLoading) return null; 

  const flag = getFlagEmoji(services.getCountryCode());

  return (
    <div ref={dropdownRef} className="relative z-50 flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer uppercase text-[var(--obsidian)] hover:opacity-70 transition-opacity"
        style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1rem" }}
        aria-label="Market Settings"
      >
        <span className="text-[1.1rem] leading-none" style={{ fontFamily: "apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol" }}>{flag}</span>
        <span>{services.getCountry()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 bg-[#fafaf8]/98 backdrop-blur-md border border-[var(--border-soft)] py-2 min-w-[240px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col"
          >
            {/* Current Market Display */}
            <div className="px-5 py-3 border-b border-[var(--border-soft)]">
              <span className="block text-[10px] uppercase tracking-widest text-[var(--slate)] mb-1" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                Current Market
              </span>
              <span className="flex items-center gap-2 text-base text-[var(--obsidian)]" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
                <span style={{ fontFamily: "apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol" }}>{flag}</span>
                <span>{services.getCountry()}</span>
              </span>
            </div>

            <div className="px-5 py-3 border-b border-[var(--border-soft)]">
              <span className="block text-[10px] uppercase tracking-widest text-[var(--slate)] mb-1" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                Language
              </span>
              <span className="block text-base text-[var(--obsidian)]" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
                {services.getLanguage()}
              </span>
            </div>

            <div className="px-5 py-3 border-b border-[var(--border-soft)]">
              <div className="flex justify-between items-center mb-1">
                <span className="block text-[10px] uppercase tracking-widest text-[var(--slate)]" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                  Product Prices
                </span>
                <span className="block text-sm text-[var(--obsidian)] font-medium">
                  {services.getCurrencyCode()}
                </span>
              </div>
              <span className="block text-xs text-[var(--slate)] leading-tight italic mt-1" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
                Prices are currently displayed in {services.getCurrencyCode()}.
              </span>
            </div>

            {/* Menu Items */}
            <button
              onClick={() => {
                setIsOpen(false);
                openSelector();
              }}
              className="w-full text-left px-5 py-3 text-[1.05rem] text-[var(--obsidian)] hover:bg-black/5 transition-colors flex justify-between items-center"
              style={{ fontFamily: "var(--font-cormorant, serif)" }}
            >
              Change Market
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-5 py-3 text-[1.05rem] text-[var(--obsidian)] hover:bg-black/5 transition-colors flex justify-between items-center"
              style={{ fontFamily: "var(--font-cormorant, serif)" }}
            >
              Shipping Information
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

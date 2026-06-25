"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";
import { motion, AnimatePresence } from "framer-motion";

export default function CurrencySelector() {
  const { currency, setCurrency, isReady } = useCurrency();
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

  if (!isReady) return null; // Or a skeleton

  const currentConfig = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];

  return (
    <div ref={dropdownRef} style={{ position: "relative", zIndex: 50, display: "flex", alignItems: "center" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          fontFamily: "var(--font-cormorant, serif)",
          fontSize: "1rem",
          color: "var(--obsidian)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          textTransform: "uppercase"
        }}
        aria-label="Select Currency"
      >
        {currentConfig.code}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "100%",
              right: 0, // align right edge to button
              marginTop: "12px",
              background: "rgba(250, 250, 248, 0.98)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--border-soft)",
              padding: "8px 0",
              minWidth: "160px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "300px",
              overflowY: "auto"
            }}
          >
            {SUPPORTED_CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code);
                  setIsOpen(false);
                }}
                style={{
                  background: c.code === currency ? "var(--border-soft)" : "transparent",
                  border: "none",
                  padding: "8px 16px",
                  textAlign: "left",
                  fontFamily: "var(--font-cormorant, serif)",
                  fontSize: "1rem",
                  color: "var(--obsidian)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (c.code !== currency) e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (c.code !== currency) e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{c.code}</span>
                <span style={{ opacity: 0.6 }}>{c.symbol}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

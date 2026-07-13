"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <motion.svg 
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </motion.svg>
);

export type FilterGroup = {
  id: string;
  label: string;
  options: string[];
};

export type FilterState = Record<string, string[]>;

interface FilterSortOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  selectedFilters: FilterState;
  onFilterChange: (groupId: string, option: string) => void;
  sortMethod: string;
  onSortChange: (method: string) => void;
  totalItems: number;
  onClearAll: () => void;
}

export default function FilterSortOverlay({
  isOpen,
  onClose,
  filterGroups,
  selectedFilters,
  onFilterChange,
  sortMethod,
  onSortChange,
  totalItems,
  onClearAll
}: FilterSortOverlayProps) {

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "newest", label: "Newest" },
    { id: "price-low", label: "Price (Low to High)" },
    { id: "price-high", label: "Price (High to Low)" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
            style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(26,26,24,0.28)", backdropFilter: "blur(2px)" }}
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-label="Filter and Sort"
            aria-modal="true"
            initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.15, 1] }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 900,
              width: `min(440px, 100vw)`,
              background: "#ffffff",
              display: "flex", flexDirection: "column",
              boxShadow: "-4px 0 40px rgba(26,26,24,0.08)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 clamp(1.5rem, 4vw, 2rem)",
              height: "80px", flexShrink: 0,
            }}>
              <span style={{ 
                fontFamily: "var(--font-jost, sans-serif)", 
                fontWeight: 500, 
                fontSize: "1rem", 
                letterSpacing: "0.08em",
                textTransform: "uppercase" 
              }}>
                FILTER AND SORT
              </span>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  onClick={onClearAll}
                  style={{ 
                    background: "none", border: "none", cursor: "pointer", 
                    fontFamily: "var(--font-jost, sans-serif)", 
                    fontSize: "0.7rem", textDecoration: "underline", color: "#6b6865" 
                  }}
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  style={{ 
                    background: "#000", border: "none", cursor: "pointer", 
                    width: "32px", height: "32px", borderRadius: "50%",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" 
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Content (Accordions) */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 clamp(1.5rem, 4vw, 2rem) 2rem" }}>
              
              {/* Filter Groups */}
              {filterGroups.map((group) => {
                if (group.options.length === 0) return null;
                const isOpen = openSections[group.id];
                return (
                  <div key={group.id} style={{ borderBottom: "1px solid #e8e4df" }}>
                    <button
                      onClick={() => toggleSection(group.id)}
                      style={{
                        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "1.2rem 0", background: "none", border: "none", cursor: "pointer",
                        fontFamily: "var(--font-jost, sans-serif)", fontSize: "0.85rem", fontWeight: 500,
                        color: "#1a1a18"
                      }}
                    >
                      {group.label}
                      <ChevronDownIcon open={!!isOpen} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ paddingBottom: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            {group.options.map(option => {
                              const isSelected = selectedFilters[group.id]?.includes(option);
                              return (
                                <label key={option} style={{ display: "flex", alignItems: "center", gap: "0.8rem", cursor: "pointer", position: "relative" }}>
                                  <div style={{ 
                                    width: "16px", height: "16px", border: "1px solid #1a1a18", 
                                    background: isSelected ? "#1a1a18" : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                  }}>
                                    {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                  </div>
                                  <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1rem", color: "#1a1a18", fontWeight: 300 }}>
                                    {option}
                                  </span>
                                  <input 
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={() => onFilterChange(group.id, option)}
                                    style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Sort By Group */}
              <div style={{ borderBottom: "1px solid #e8e4df" }}>
                <button
                  onClick={() => toggleSection('sort')}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "1.2rem 0", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "var(--font-jost, sans-serif)", fontSize: "0.85rem", fontWeight: 500,
                    color: "#1a1a18"
                  }}
                >
                  Sort By
                  <ChevronDownIcon open={!!openSections['sort']} />
                </button>
                <AnimatePresence>
                  {openSections['sort'] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ paddingBottom: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        {sortOptions.map(option => {
                          const isSelected = sortMethod === option.id;
                          return (
                            <label key={option.id} style={{ display: "flex", alignItems: "center", gap: "0.8rem", cursor: "pointer" }}>
                              <div style={{ 
                                width: "16px", height: "16px", border: "1px solid #1a1a18", borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                                {isSelected && <div style={{ width: "8px", height: "8px", background: "#1a1a18", borderRadius: "50%" }} />}
                              </div>
                              <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1rem", color: "#1a1a18", fontWeight: 300 }}>
                                {option.label}
                              </span>
                              {/* Using hidden radio input for accessibility */}
                              <input 
                                type="radio" 
                                name="sortMethod" 
                                value={option.id}
                                checked={isSelected}
                                onChange={() => onSortChange(option.id)}
                                style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Footer */}
            <div style={{ flexShrink: 0, padding: "clamp(1.2rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2rem)", background: "#ffffff" }}>
              <button
                onClick={onClose}
                style={{
                  display: "block", width: "100%", padding: "1.1rem",
                  background: "#000000", color: "#ffffff",
                  textDecoration: "none", textAlign: "center",
                  fontFamily: "var(--font-jost, sans-serif)", fontSize: "0.75rem",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  border: "none", cursor: "pointer",
                  transition: "background 0.3s",
                }}
              >
                SHOW {totalItems} ITEMS
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

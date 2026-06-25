"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearch, useCart } from "@/lib/store";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice } from "@/lib/currency";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function SearchOverlay() {
  const { searchOpen, closeSearch, query, setQuery, results } = useSearch();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeSearch]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(247, 245, 242, 0.98)",
            backdropFilter: "blur(20px)",
            display: "flex", flexDirection: "column",
            overflowY: "auto",
          }}
          role="dialog"
          aria-label="Product search"
          aria-modal="true"
        >
          {/* ── Header ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 clamp(2rem, 5vw, 6rem)",
            height: "80px", flexShrink: 0,
            borderBottom: "1px solid #ddd9d4",
          }}>
            <Link href="/" onClick={closeSearch} style={{ display: "block" }}>
              <Image
                src="/branding/tezhhomayaa-logo-v2.png" alt="Tezhhomayaa"
                width={240} height={89}
                style={{ width: "auto", height: "clamp(28px, 3.5vw, 38px)", objectFit: "contain" }}
              />
            </Link>
            <button
              onClick={closeSearch}
              aria-label="Close search"
              id="search-close"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", color: "#1a1a18", display: "flex", alignItems: "center" }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* ── Search Input ── */}
          <div style={{
            padding: "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 6rem) clamp(2rem, 4vw, 3rem)",
            borderBottom: "1px solid #ddd9d4", flexShrink: 0,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "1rem", maxWidth: "860px" }}
            >
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, collections, categories…"
                id="search-input"
                aria-label="Search products"
                style={{
                  flex: 1, border: "none", background: "transparent", outline: "none",
                  fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "0.01em",
                  color: "#1a1a18",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9a9690", padding: "0.25rem", display: "flex", alignItems: "center" }}
                >
                  <CloseIcon />
                </button>
              )}
            </motion.div>
          </div>

          {/* ── Results ── */}
          <div style={{ padding: "clamp(2rem, 4vw, 3rem) clamp(2rem, 5vw, 6rem)", flex: 1 }}>
            {query.trim().length >= 2 && results.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
                  fontStyle: "italic", fontSize: "1.2rem", color: "#9a9690", letterSpacing: "0.04em",
                }}
              >
                No pieces found for &ldquo;{query}&rdquo;
              </motion.p>
            )}

            {results.length > 0 && (
              <>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                    letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9690",
                    marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                  }}
                >
                  {results.length} {results.length === 1 ? "piece" : "pieces"} found
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "clamp(1.5rem, 3vw, 2.5rem)",
                  }}
                >
                  {results.map((product) => (
                    <Link
                      key={product.slug}
                      href={product.href}
                      onClick={closeSearch}
                      style={{ textDecoration: "none", display: "block" }}
                      id={`search-result-${product.slug}`}
                    >
                      <div style={{
                        position: "relative", width: "100%",
                        paddingBottom: "133%",
                        background: "#edeae5", overflow: "hidden", marginBottom: "0.9rem",
                      }}>
                        <Image
                          src={product.image} alt={product.name}
                          fill sizes="220px"
                          style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
                        />
                      </div>
                      <p style={{
                        fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
                        fontSize: "1rem", color: "#1a1a18", margin: "0 0 0.25rem",
                        letterSpacing: "0.01em",
                        overflow: "hidden", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {product.name}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                        letterSpacing: "0.14em", color: "#9a9690", margin: 0,
                      }}>
                        {formatPrice(getProductPrice(product))}
                      </p>
                    </Link>
                  ))}
                </motion.div>
              </>
            )}

            {/* Default state — show categories */}
            {query.trim().length < 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <p style={{
                  fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                  letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9690",
                  marginBottom: "1.5rem",
                }}>Browse categories</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {[
                    { label: "Women's Ready To Wear", href: "/women/ready-to-wear" },
                    { label: "Men's Ready To Wear", href: "/men/ready-to-wear" },
                    { label: "Dresses", href: "/women/ready-to-wear/dresses-jumpsuits" },
                    { label: "Shirts", href: "/men/ready-to-wear/shirts" },
                    { label: "Skirts", href: "/women/ready-to-wear/skirts" },
                    { label: "Trousers", href: "/women/ready-to-wear/pants-shorts" },
                    { label: "Fragrances", href: "/fragrances" },
                    { label: "Bags", href: "/bags" },
                  ].map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={closeSearch}
                      style={{
                        fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
                        fontSize: "1.05rem", color: "#3a3835",
                        textDecoration: "none", letterSpacing: "0.03em",
                        padding: "0.5rem 1rem",
                        border: "1px solid #ddd9d4",
                        transition: "border-color 0.3s, color 0.3s",
                      }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

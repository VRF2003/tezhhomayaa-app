"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/collections";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice } from "@/lib/currency";

/**
 * ProductCard
 * ───────────────────────────────────────────────────────────────
 * Luxury editorial card inspired by Gucci / Louis Vuitton / Saint Laurent.
 *
 * Image rules:
 *  • Fixed 3:4 portrait aspect ratio (tall rectangle — fashion standard)
 *  • object-fit: cover — no stretching, no letter-boxing
 *  • Uniform height across all cards in the grid
 *  • Subtle scale on hover (0 → 1.04 over 1.1s cubic easing)
 */
export function ProductCard({ product, presentation }: { product: Product, presentation?: any }) {
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { formatPrice } = useCurrency();
  
  const thumbIndex = product.merchandising?.gridThumbnail ?? 0;
  let gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  if (!product.gallery || product.gallery.length === 0) {
    if (product.hoverImage) gallery.push(product.hoverImage);
  }
  if (thumbIndex > 0 && thumbIndex < gallery.length) {
    gallery = [...gallery.slice(thumbIndex), ...gallery.slice(0, thumbIndex)];
  }

  let pb = "133.33%"; // default 3:4
  if (presentation?.imageRatio === "Square" || presentation?.imageRatio === "1:1") pb = "100%";
  if (presentation?.imageRatio === "4:5") pb = "125%";
  if (presentation?.imageRatio === "3:4") pb = "133.33%";
  const isOriginal = presentation?.imageRatio === "Original" || presentation?.imageRatio === "original";

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 40) { // swipe sensitivity
      if (diff > 0 && activeIndex < gallery.length - 1) {
        setActiveIndex(prev => prev + 1);
        touchStartX.current = null;
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        touchStartX.current = null;
      }
    }
  };
  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (activeIndex < gallery.length - 1) setActiveIndex(prev => prev + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  return (
    <Link
      href={product.href}
      style={{ textDecoration: "none", display: "block" }}
      aria-label={product.name}
    >
      <article
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') {
            setHovered(true);
            if (gallery.length > 1 && activeIndex === 0) setActiveIndex(1);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') {
            setHovered(false);
            setActiveIndex(0);
          }
        }}
        style={{ 
          cursor: "pointer", 
          border: "none",
          padding: "0",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        {/* ── Image Container ── */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: isOriginal ? "0" : pb,
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          {/* Badges */}
          {product.badge && (
            <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 10 }}>
              <span style={{ 
                padding: "0.4rem 0.6rem", 
                background: "rgba(255,255,255,0.9)", 
                backdropFilter: "blur(4px)",
                color: "#1a1a18", 
                fontSize: "0.55rem", 
                textTransform: "uppercase", 
                letterSpacing: "0.2em", 
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
              }}>
                {product.badge}
              </span>
            </div>
          )}

          {gallery.map((img, i) => {
            return (
              <Image
                key={img + i}
                src={img}
                alt={`${product.name} - ${i + 1}`}
                {...(isOriginal ? { width: 0, height: 0, sizes: "100vw" } : { fill: true, sizes: "(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw" })}
                style={{
                  ...(isOriginal ? { width: "100%", height: "auto", position: i === 0 ? "relative" as any : "absolute" as any, top: 0, left: 0 } : { objectFit: "cover", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }),
                  objectPosition: "center top",
                  transition: "opacity 1000ms cubic-bezier(0.25, 1, 0.5, 1), transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)",
                  opacity: i === activeIndex ? 1 : 0,
                  transform: i === activeIndex && hovered ? "scale(1.02)" : "scale(1)",
                  zIndex: i === activeIndex ? 2 : 1,
                }}
              />
            );
          })}

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              {activeIndex > 0 && (
                <button
                  onClick={handlePrev}
                  style={{
                    position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%) scale(1)",
                    zIndex: 10, background: "rgba(255,255,255,0.5)", borderRadius: "50%", width: "32px", height: "32px",
                    display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)",
                    transition: "opacity 300ms ease, transform 300ms ease",
                    opacity: hovered ? 1 : 0,
                    pointerEvents: hovered ? "auto" : "none"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
                  aria-label="Previous image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a18" strokeWidth="1.2">
                    <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              {activeIndex < gallery.length - 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%) scale(1)",
                    zIndex: 10, background: "rgba(255,255,255,0.5)", borderRadius: "50%", width: "32px", height: "32px",
                    display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)",
                    transition: "opacity 300ms ease, transform 300ms ease",
                    opacity: hovered ? 1 : 0,
                    pointerEvents: hovered ? "auto" : "none"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
                  aria-label="Next image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a18" strokeWidth="1.2">
                    <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Caption ── */}
        <div style={{ paddingTop: "1.2rem", paddingBottom: `${presentation?.cardBottomSpacing ?? 24}px`, paddingLeft: "1rem", paddingRight: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
          {(presentation?.showCategory) && (
             <p style={{
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: "0.5rem",
              letterSpacing: "0.15em",
              color: "#9a9690",
              margin: "0 0 0.4rem",
              textTransform: "uppercase",
            }}>
              {product.categoryLabel || product.category || "Piece"}
            </p>
          )}

          {(presentation?.showProductName ?? true) && (
            <p
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "clamp(0.8rem, 1vw, 0.92rem)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: "#1a1a18",
                margin: 0,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.6em",
              }}
            >
              {product.name}
            </p>
          )}

          {(presentation?.showPrice ?? true) && (
            <p
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: "#9a9690",
                margin: "0.45rem 0 0",
                textTransform: "uppercase",
              }}
            >
              {formatPrice(getProductPrice(product))}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Empty state ───────────────────────────────────────────────
function EmptyState() {
  return (
    <section
      style={{
        padding: "clamp(5rem, 10vw, 9rem) clamp(3rem, 8vw, 9rem)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant, serif)",
          fontSize: "1.1rem",
          color: "#9a9690",
          letterSpacing: "0.08em",
          fontWeight: 300,
        }}
      >
        No products found in this category
      </p>
    </section>
  );
}

// ─── Grid ──────────────────────────────────────────────────────
export default function ProductGrid({ products, presentation }: { products: Product[], presentation?: any }) {
  if (!products || products.length === 0) return <EmptyState />;

  const deskCols = presentation?.desktopColumns ?? 4;
  const mobCols = presentation?.mobileColumns ?? 2;
  const deskGap = presentation?.desktopGap ?? 1;
  const mobGap = presentation?.mobileGap ?? 1;
  
  const density = presentation?.density || 10; // 0 (Dense) -> 100 (Spacious)
  const paddingH = 0; // Gucci style typically stretches to the edges or has minimal padding
  const paddingV = 0;

  return (
    <section
      aria-label="Product collection"
      style={{ 
        padding: `clamp(0rem, ${paddingV}vw, 2rem) clamp(0rem, ${paddingH}vw, 0rem)`,
        background: "#ffffff",
      }}
      className="mobile-product-section"
    >
      <div 
        className="dynamic-tezh-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${deskCols}, 1fr)`,
          columnGap: `${deskGap}px`,
          rowGap: `${deskGap}px`,
          backgroundColor: "#e8e4df", // Hairline border color
          borderTop: "1px solid #e8e4df",
          borderBottom: "1px solid #e8e4df",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} presentation={presentation} />
        ))}
      </div>

      <style>{`
        .dynamic-tezh-grid {
          display: grid;
          /* Desktop is handled by inline styles above to support dynamic columns perfectly, 
             but we add media queries to override for mobile */
        }

        @media (max-width: 900px) {
          .dynamic-tezh-grid {
            grid-template-columns: repeat(${Math.max(1, Math.min(3, Math.floor((deskCols + mobCols)/2)))}, 1fr) !important;
            column-gap: ${Math.round((deskGap + mobGap)/2)}px !important;
            row-gap: ${Math.round((deskGap + mobGap)/2)}px !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-product-section {
            padding-top: var(--mobile-section-spacing, 4rem) !important;
            padding-bottom: var(--mobile-section-spacing, 4rem) !important;
          }
          .dynamic-tezh-grid {
            grid-template-columns: repeat(${mobCols}, 1fr) !important;
            column-gap: var(--mobile-product-gap, ${mobGap}px) !important;
            row-gap: var(--mobile-product-gap, ${mobGap}px) !important;
          }
        }
      `}</style>
    </section>
  );
}

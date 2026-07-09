"use client";

import { useState } from "react";
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

  // Always use the luxury crossfade + subtle 1.02 zoom (per user spec)
  const imgTransform = hovered && gallery.length > 1 ? "scale(1.02)" : "scale(1)";
  const imgTransition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  // The Row / Saint Laurent styling: no borders, no boxes
  const hasBorder = false;

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
          background: "transparent"
        }}
      >
        {/* ── Image Container ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: isOriginal ? "0" : pb,
            overflow: "hidden",
            background: "#f0ede9",
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

          {gallery.map((img, i) => (
            <Image
              key={img + i}
              src={img}
              alt={`${product.name} - ${i + 1}`}
              {...(isOriginal ? { width: 0, height: 0, sizes: "100vw" } : { fill: true, sizes: "(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw" })}
              style={{
                ...(isOriginal ? { width: "100%", height: "auto", position: i === 0 ? "relative" as any : "absolute" as any, top: 0, left: 0 } : { objectFit: "cover", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }),
                objectPosition: "center top",
                transition: imgTransition,
                transform: imgTransform,
                opacity: i === activeIndex ? 1 : 0,
                zIndex: i === activeIndex ? 2 : 1,
              }}
            />
          ))}

          {/* Navigation Arrows (Visible on Hover) */}
          {hovered && gallery.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  zIndex: 10, background: "rgba(255,255,255,0.7)", borderRadius: "50%", width: "28px", height: "28px",
                  display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)", backdropFilter: "blur(4px)"
                }}
                aria-label="Previous image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a18" strokeWidth="1.5">
                  <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                style={{
                  position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  zIndex: 10, background: "rgba(255,255,255,0.7)", borderRadius: "50%", width: "28px", height: "28px",
                  display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)", backdropFilter: "blur(4px)"
                }}
                aria-label="Next image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a18" strokeWidth="1.5">
                  <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div style={{
                position: "absolute", bottom: "1rem", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "6px", zIndex: 10
              }}>
                {gallery.map((_, i) => (
                  <div key={i} style={{
                    width: "4px", height: "4px", borderRadius: "50%",
                    background: i === activeIndex ? "#1a1a18" : "rgba(0,0,0,0.2)",
                    transition: "background 0.3s ease"
                  }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Caption ── */}
        <div style={{ paddingTop: "0.85rem", paddingBottom: `${presentation?.cardBottomSpacing ?? 10}px`, paddingLeft: "0", paddingRight: "0" }}>
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
  const deskGap = presentation?.desktopGap ?? 32;
  const mobGap = presentation?.mobileGap ?? 12;
  
  const density = presentation?.density || 10; // 0 (Dense) -> 100 (Spacious)
  const paddingH = 0.5 + (density / 100) * 3; // 0.5rem to 3.5rem
  const paddingV = 1 + (density / 100) * 3; // 1rem to 4rem

  return (
    <section
      aria-label="Product collection"
      style={{ 
        padding: `clamp(1rem, ${paddingV}vw, 4rem) clamp(0.5rem, ${paddingH}vw, 3rem)`,
        background: "#F7F5F2", // Ivory background per luxury requirements
      }}
      className="mobile-product-section"
    >
      <div 
        className="dynamic-tezh-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(calc(100% / ${deskCols} - ${deskGap}px), 1fr))`,
          columnGap: `${deskGap}px`,
          rowGap: `${deskGap}px`
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

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
function ProductCard({ product, presentation }: { product: Product, presentation?: any }) {
  const [hovered, setHovered] = useState(false);
  const { formatPrice } = useCurrency();
  
  const thumbIndex = product.merchandising?.gridThumbnail ?? 0;
  const mainImg = product.gallery?.[thumbIndex] || product.image;
  const hoverImg = product.gallery?.[thumbIndex + 1] || mainImg;

  let pb = "133.33%"; // default 3:4
  if (presentation?.imageRatio === "Square" || presentation?.imageRatio === "1:1") pb = "100%";
  if (presentation?.imageRatio === "4:5") pb = "125%";
  if (presentation?.imageRatio === "3:4") pb = "133.33%";
  const isOriginal = presentation?.imageRatio === "Original" || presentation?.imageRatio === "original";

  const hoverEffect = presentation?.hoverEffect || "zoom";
  const isSwap = hoverEffect === "swap";
  const isZoom = hoverEffect === "zoom";

  let imgTransform = "scale(1)";
  if (isZoom && hovered) imgTransform = "scale(1.04)";

  // The Row / Saint Laurent styling: no borders, no boxes
  const hasBorder = false;

  return (
    <Link
      href={product.href}
      style={{ textDecoration: "none", display: "block" }}
      aria-label={product.name}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
          {/* Primary image */}
          <Image
            src={mainImg}
            alt={product.name}
            {...(isOriginal ? { width: 0, height: 0, sizes: "100vw" } : { fill: true, sizes: "(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw" })}
            style={{
              ...(isOriginal ? { width: "100%", height: "auto" } : { objectFit: "cover" }),
              objectPosition: "center top",
              transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
              transform: imgTransform,
              opacity: (isSwap && hovered && hoverImg !== mainImg) ? 0 : 1,
            }}
          />

          {/* Hover crossfade image */}
          {hoverImg && hoverImg !== mainImg && (
            <Image
              src={hoverImg}
              alt=""
              {...(isOriginal ? { width: 0, height: 0, sizes: "100vw" } : { fill: true, sizes: "(max-width: 1100px) 50vw, 25vw" })}
              aria-hidden="true"
              style={{
                ...(isOriginal ? { width: "100%", height: "auto", position: "absolute", top: 0, left: 0 } : { objectFit: "cover" }),
                objectPosition: "center top",
                transition: "opacity 0.65s ease",
                opacity: (isSwap && hovered) ? 1 : 0,
              }}
            />
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

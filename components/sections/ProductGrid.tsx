"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/collections";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice, getProductComparePrice } from "@/lib/currency";
import { DiscoverDrawer } from "@/components/ecommerce/DiscoverDrawer";

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
export function ProductCard({ product, presentation, onDiscover }: { product: Product, presentation?: any, onDiscover?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { formatPrice } = useCurrency();
  
  const getSignatureDetails = () => {
    const d: string[] = [];
    if (product.material) d.push(product.material);
    else if (product.fabricDetails) {
      const fd = product.fabricDetails.split(/[,.]/)[0].trim();
      if (fd.length > 3 && fd.length < 45) d.push(fd);
    }
    
    if (product.fit) {
      const fit = product.fit.split(/[,.]/)[0].trim();
      if (fit.length > 3 && fit.length < 45) d.push(fit);
    }
    
    if (d.length < 2 && product.designStory) {
      const ds = product.designStory.split(/[,.]/)[0].trim();
      if (ds.length > 5 && ds.length < 45) d.push(ds);
    }
    return d.slice(0, 2);
  };
  
  const signatureDetails = getSignatureDetails();
  
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <article
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse' && !isMobile) {
          setHovered(true);
          if (gallery.length > 1 && activeIndex === 0) setActiveIndex(1);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && !isMobile) {
          setHovered(false);
          setActiveIndex(0);
        }
      }}
      style={{ 
        border: "none",
        padding: "0",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative"
      }}
    >
      {/* ── Image Container ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: isOriginal ? "0" : pb,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <Link href={product.href} style={{ display: "block", position: "absolute", inset: 0, zIndex: 5 }} aria-label={product.name} />
        
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

        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: isOriginal ? "relative" : "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: isOriginal ? "auto" : "100%",
          }}
        >
          {gallery.map((img, i) => (
            <div key={img + i} style={{ 
              position: (isOriginal && i === 0) ? "relative" : "absolute",
              top: 0, left: 0,
              width: "100%", 
              height: isOriginal ? "auto" : "100%",
              opacity: i === activeIndex ? 1 : 0,
              transition: "opacity 850ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              zIndex: i === activeIndex ? 2 : 1
            }}>
              <Image
                src={img}
                alt={`${product.name} - ${i + 1}`}
                {...(isOriginal ? { width: 0, height: 0, sizes: "100vw" } : { fill: true, sizes: "(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw" })}
                style={{
                  ...(isOriginal ? { width: "100%", height: "auto" } : { objectFit: "cover" }),
                  objectPosition: "center top",
                  transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1), filter 400ms ease",
                  transform: (hovered && !isMobile) ? "scale(1.03)" : "scale(1)",
                  filter: (hovered && !isMobile) ? "brightness(0.95)" : "brightness(1)"
                }}
                priority={i === 0 || i === 1}
              />
            </div>
          ))}
        </div>

        {/* Editorial Hover Overlay */}
        {!isMobile && (
          <div 
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%)",
              zIndex: 6,
              opacity: hovered ? 1 : 0,
              transition: "opacity 300ms ease",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "1.5rem"
            }}
          >
            <div style={{
              transform: hovered ? "translateY(0)" : "translateY(10px)",
              transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}>
              {signatureDetails.length > 0 ? (
                <>
                  <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#f7f5f2", margin: "0 0 0.3rem" }}>
                    {signatureDetails[0]}
                  </p>
                  {signatureDetails[1] && (
                    <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "0.95rem", fontWeight: 300, color: "#f7f5f2", margin: "0 0 0.8rem", fontStyle: "italic" }}>
                      {signatureDetails[1]}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {!isMobile && gallery.length > 1 && (
          <>
            {activeIndex > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  zIndex: 10, background: "rgba(255,255,255,0.5)", borderRadius: "50%", width: "32px", height: "32px",
                  display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)",
                  transition: "opacity 450ms cubic-bezier(0.25, 1, 0.5, 1)",
                  opacity: hovered ? 1 : 0,
                  pointerEvents: hovered ? "auto" : "none"
                }}
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
                  position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  zIndex: 10, background: "rgba(255,255,255,0.5)", borderRadius: "50%", width: "32px", height: "32px",
                  display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)",
                  transition: "opacity 450ms cubic-bezier(0.25, 1, 0.5, 1)",
                  opacity: hovered ? 1 : 0,
                  pointerEvents: hovered ? "auto" : "none"
                }}
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
          <Link href={product.href} style={{ textDecoration: "none", outline: "none" }}>
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
          </Link>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.45rem" }}>
          {(presentation?.showPrice ?? true) && (
            <div className="flex gap-2 items-baseline" style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                margin: 0,
                textTransform: "uppercase",
            }}>
              {getProductComparePrice(product) ? (
                <>
                  <span className="text-[0.65rem] text-gray-400 line-through tracking-wider">
                    {formatPrice(getProductComparePrice(product)!)}
                  </span>
                  <span className="text-[0.65rem] text-[#1a1a18] tracking-wider">
                    {formatPrice(getProductPrice(product))}
                  </span>
                </>
              ) : (
                <span className="text-[0.65rem] text-gray-500 tracking-wider">
                  {formatPrice(getProductPrice(product))}
                </span>
              )}
            </div>
          )}

          {/* Discover Action */}
          {onDiscover && (
            <button
              onClick={(e) => { e.preventDefault(); onDiscover(); }}
              className={`discover-btn ${isMobile ? 'mobile-discover' : (hovered ? 'desktop-visible' : 'desktop-hidden')}`}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.2rem 0",
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.55rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#1a1a18",
                borderBottom: "1px solid #1a1a18",
                transition: "opacity 300ms ease",
                zIndex: 10
              }}
            >
              Discover &rarr;
            </button>
          )}
        </div>
      </div>
      <style>{`
        .desktop-hidden { opacity: 0; pointer-events: none; }
        .desktop-visible { opacity: 1; pointer-events: auto; }
        .mobile-discover { opacity: 1; pointer-events: auto; }
      `}</style>
    </article>
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
  const [discoverProduct, setDiscoverProduct] = useState<Product | null>(null);

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
          <ProductCard key={product.id} product={product} presentation={presentation} onDiscover={() => setDiscoverProduct(product)} />
        ))}
      </div>
      
      <DiscoverDrawer product={discoverProduct} onClose={() => setDiscoverProduct(null)} />

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

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCurrencyFormatter } from "@/lib/global-experience/formatters";
import { DiscoverDrawer } from "@/components/ecommerce/DiscoverDrawer";

// Mock Product Type
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  hoverImage?: string;
  gallery?: string[];
  category: string;
  badge?: "NEW" | "SOLD OUT" | "PREORDER" | "EXCLUSIVE" | null;
  colors?: string[];
  sizes?: string[];
  href?: string;
  fabricDetails?: string;
  fit?: string;
  productStory?: string;
  material?: string;
}

export function LuxuryProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  
  const formatter = useCurrencyFormatter();

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
    
    if (d.length < 2 && product.productStory) {
      const ds = product.productStory.split(/[,.]/)[0].trim();
      if (ds.length > 5 && ds.length < 45) d.push(ds);
    }
    return d.slice(0, 2);
  };
  
  const signatureDetails = getSignatureDetails();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  let gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  if (!product.gallery || product.gallery.length === 0) {
    if (product.hoverImage) gallery.push(product.hoverImage);
  }

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
    <div 
      className="group relative flex flex-col w-full bg-transparent"
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
    >
      {/* ── Image Container ── */}
      <div 
        className="relative w-full aspect-[3/4] bg-[#f0ece6] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link href={product.href || `/product/${product.slug}`} className="absolute inset-0 z-[5]" aria-label={product.name} />

        {/* Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-[9px] uppercase tracking-[0.2em] shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {gallery.map((img, i) => {
          return (
            <div key={img + i} style={{ 
              position: "absolute",
              top: 0, left: 0,
              width: "100%", 
              height: "100%",
              opacity: i === activeIndex ? 1 : 0,
              transition: "opacity 850ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              zIndex: i === activeIndex ? 2 : 1
            }}>
              <Image
                src={img}
                alt={`${product.name} - ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                  transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1), filter 400ms ease",
                  transform: (hovered && !isMobile) ? "scale(1.03)" : "scale(1)",
                  filter: (hovered && !isMobile) ? "brightness(0.95)" : "brightness(1)"
                }}
              />
            </div>
          );
        })}

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

      {/* ── Metadata ── */}
      <div className="mt-6 flex flex-col items-center">
        <Link href={product.href || `/product/${product.slug}`} className="flex flex-col items-center outline-none">
          <h3 className="text-sm font-light text-black tracking-wide leading-tight">{product.name}</h3>
        </Link>
        
        <div className="flex w-full justify-between items-center mt-3 px-1">
          <p className="text-xs text-gray-500 tracking-wider font-dm-mono uppercase">
            {formatter.formatCurrency(product.price)}
          </p>
          
          <button
            onClick={(e) => { e.preventDefault(); setShowDiscover(true); }}
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
        </div>
      </div>

      {showDiscover && (
        <DiscoverDrawer product={product as any} onClose={() => setShowDiscover(false)} />
      )}
      
      <style>{`
        .desktop-hidden { opacity: 0; pointer-events: none; }
        .desktop-visible { opacity: 1; pointer-events: auto; }
        .mobile-discover { opacity: 1; pointer-events: auto; }
      `}</style>
    </div>
  );
}

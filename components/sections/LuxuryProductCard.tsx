"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCurrencyFormatter } from "@/lib/global-experience/formatters";

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
}

export function LuxuryProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const formatter = useCurrencyFormatter();

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
        setQuickAdd(false); // reset quick add state on leave
      }}
    >
      {/* ── Image Container ── */}
      <div 
        className="relative w-full aspect-[3/4] bg-[#f0ece6] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-[9px] uppercase tracking-[0.2em] shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button - Soft Fade */}
        <button 
          onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }}
          className="absolute top-4 right-4 z-20 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          aria-label="Add to Wishlist"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlist ? "black" : "none"} stroke="black" strokeWidth="1.25" className="transition-all duration-500">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {gallery.map((img, i) => {
          return (
            <Image
              key={img + i}
              src={img}
              alt={`${product.name} - ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: "cover",
                objectPosition: "top center",
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

        {/* Quick Add Drawer - Emerges from inside the bottom edge */}
        <div 
          className={`absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 ${hovered ? "translate-y-0" : "translate-y-full"}`}
        >
          {!quickAdd ? (
            <button 
              onClick={(e) => { e.preventDefault(); setQuickAdd(true); }}
              className="w-full py-5 text-[10px] uppercase tracking-[0.2em] text-center hover:bg-black hover:text-white transition-colors duration-500"
            >
              Quick Add
            </button>
          ) : (
            <div className="w-full py-5 px-4 flex justify-center gap-6">
              {product.sizes ? (
                product.sizes.map(size => (
                  <button key={size} className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors duration-300">
                    {size}
                  </button>
                ))
              ) : (
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">One Size</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Metadata ── */}
      <Link href={`/product/${product.slug}`} className="mt-6 flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-8">
        <h3 className="text-sm font-light text-black tracking-wide leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-500 tracking-wider mt-2">{formatter.formatCurrency(product.price)}</p>
        
        {/* Color Swatches */}
        <div className={`flex justify-center gap-3 mt-4 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${product.colors && product.colors.length > 0 && hovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          {product.colors?.map((color, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full border border-gray-200/50 shadow-sm cursor-pointer hover:border-gray-400 transition-colors" style={{ backgroundColor: color }} />
          ))}
        </div>
      </Link>
    </div>
  );
}

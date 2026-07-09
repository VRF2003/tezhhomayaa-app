"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice } from "@/lib/currency";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Product } from "@/lib/collections";
import { useCart, useWishlist } from "@/lib/store";
import { useCommerce } from "@/lib/commerce-context";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";

export type ProductDetailPageProps = {
  product: Product;
  related: Product[];
  isPreviewMode?: boolean;
};

function getSizes(product: Product): string[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants
      .filter((v) => v.optionName === "Size" && (v.quantity === undefined || v.quantity > 0))
      .map((v) => v.option);
  }
  if (product.category.includes("ready-to-wear")) return ["XS", "S", "M", "L", "XL"];
  if (product.category.includes("fragrances")) return ["50 ml", "100 ml"];
  return [];
}

// ─── Arrow SVGs ───────────────────────────────────────────────
function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M14 18L8 11L14 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M8 4L14 11L8 18" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Cinematic Morphing Gallery (with In-Place Zoom & Video) ─
function isVideo(src: string) {
  return !!src.match(/\.(mp4|webm|mov)$/i);
}

export function CinematicMorphingGallery({ images, isPreviewMode, merchandising }: { images: string[], isPreviewMode?: boolean, merchandising?: any }) {
  const [displayImages, setDisplayImages] = useState<string[]>(images);
  const [current, setCurrent] = useState(0);
  const total = displayImages.length;
  
  // Set display images based on custom sequence
  useEffect(() => {
    let order: number[] = [];
    if (merchandising) {
      const w = window.innerWidth;
      if (w < 768 && merchandising.mobileGalleryOrder) {
        order = merchandising.mobileGalleryOrder;
      } else if (w >= 768 && w <= 1024 && merchandising.tabletGalleryOrder) {
        order = merchandising.tabletGalleryOrder;
      } else if (w > 1024 && merchandising.desktopGalleryOrder) {
        order = merchandising.desktopGalleryOrder;
      }
      
      // Fallback for legacy fields just in case
      if (order.length === 0) {
        if (w < 768 && merchandising.mobileHeroImage !== undefined) {
          order = [merchandising.mobileHeroImage];
        } else if (w >= 768 && w <= 1024 && merchandising.tabletHeroImage !== undefined) {
          order = [merchandising.tabletHeroImage];
        } else if (w > 1024 && merchandising.desktopHeroImage !== undefined) {
          order = [merchandising.desktopHeroImage];
        }
      }
    }
    
    if (order.length > 0) {
      const customSequence: string[] = [];
      const usedIndices = new Set<number>();
      
      order.forEach(idx => {
        if (idx >= 0 && idx < images.length && !usedIndices.has(idx)) {
          customSequence.push(images[idx]);
          usedIndices.add(idx);
        }
      });
      
      images.forEach((img, idx) => {
        if (!usedIndices.has(idx)) {
          customSequence.push(img);
        }
      });
      
      setDisplayImages(customSequence);
    } else {
      setDisplayImages(images);
    }
    setCurrent(0);
  }, [merchandising, images]);

  // In-place Zoom State
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const isDragging = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const spring = {
    type: "tween" as const,
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  const zoomTransition = isDragging.current
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  function getFrameSize(i: number, cur: number) {
    if (isMobile) return { width: "100%", height: "100%" };
    if (cur === 0) {
      if (i === 0) return { width: "100%", height: "100%" };
      return { width: "50%", height: "100%" };
    }
    return { width: "50%", height: "100%" };
  }

  function getFrameX(i: number, cur: number) {
    if (isMobile) {
      const offset = i - cur;
      return `${offset * 100}vw`;
    }
    if (cur === 0) {
      if (i === 0) return "0vw";
      return `${(i - 1) * 50 + 75}vw`;
    }
    const offset = i - cur;
    return `${offset * 50 + 25}vw`;
  }

  const navigate = (direction: number) => {
    if (zoomed) return;
    setCurrent(c => {
      const next = c + direction;
      if (next < 0 || next >= total) return c;
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomed, total]); // dependencies ensure fresh closure

  // Handle click to zoom / unzoom / navigate
  const handleImageClick = (e: React.MouseEvent, i: number, isLeft: boolean, isRight: boolean) => {
    // Ignore click if we were just dragging
    if (isDragging.current && dragStart.current) {
      const dx = Math.abs(e.clientX - dragStart.current.mx);
      const dy = Math.abs(e.clientY - dragStart.current.my);
      if (dx > 5 || dy > 5) return;
    }

    if (isLeft && !zoomed) { navigate(-1); return; }
    if (isRight && !zoomed) { navigate(1); return; }
    
    if (i === current) {
      if (zoomed) {
        // Unzoom
        setZoomed(false);
        setPanOffset({ x: 0, y: 0 });
      } else {
        // Zoom in at click position
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setZoomOrigin({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setZoomed(true);
        setPanOffset({ x: 0, y: 0 });
      }
    }
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!zoomed) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { mx: clientX, my: clientY, ox: panOffset.x, oy: panOffset.y };
    isDragging.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!zoomed || !dragStart.current) return;
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.current.mx;
    const dy = clientY - dragStart.current.my;
    setPanOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  };
  const handleMouseUp = () => {
    setTimeout(() => {
      dragStart.current = null;
      isDragging.current = false;
    }, 0); // Clear after click event has a chance to read it
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    if (zoomed) return;
    const swipe = offset.x;
    if (swipe < -50) navigate(1);
    else if (swipe > 50) navigate(-1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <div style={{ position: "relative", width: "100%", flexGrow: 1, overflow: "hidden" }}>
        {/* Image/Video Frames */}
        {displayImages.map((src, i) => {
          const xOffset = getFrameX(i, current);
          const { width, height } = getFrameSize(i, current);
          const zIndex = i === current ? 10 : 5;
          const isAdjacentLeft = i === current - 1;
          const isAdjacentRight = i === current + 1;
          const isCurrent = i === current;

          // Cursors
          let cursor = "default";
          if (!zoomed) {
            if (isCurrent) cursor = "zoom-in";
            else if (isAdjacentLeft) cursor = "w-resize";
            else if (isAdjacentRight) cursor = "e-resize";
          } else if (isCurrent) {
            cursor = isDragging.current ? "grabbing" : "grab";
          }

          return (
            <motion.div
              key={src}
              initial={{ width, height, x: `calc(-50% + ${xOffset})`, y: "-50%", opacity: 1 }}
              animate={{ width, height, x: `calc(-50% + ${xOffset})`, y: "-50%", opacity: 1 }}
              transition={spring}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                overflow: "hidden",
                zIndex,
                background: "#ffffff",
                cursor,
              }}
              drag={isCurrent && !zoomed ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={isCurrent && !zoomed ? handleDragEnd : undefined}
              onClick={(e) => handleImageClick(e, i, isAdjacentLeft, isAdjacentRight)}
              onMouseDown={isCurrent ? handleMouseDown : undefined}
              onMouseMove={isCurrent ? handleMouseMove : undefined}
              onMouseUp={isCurrent ? handleMouseUp : undefined}
              onMouseLeave={isCurrent ? handleMouseUp : undefined}
              onTouchStart={isCurrent ? handleMouseDown : undefined}
              onTouchMove={isCurrent ? handleMouseMove : undefined}
              onTouchEnd={isCurrent ? handleMouseUp : undefined}
            >
              <motion.div
                animate={{
                  scale: isCurrent && zoomed ? 2.5 : 1,
                  x: isCurrent && zoomed ? panOffset.x : 0,
                  y: isCurrent && zoomed ? panOffset.y : 0,
                }}
                transition={zoomTransition}
                style={{
                  width: "100%",
                  height: "100%",
                  transformOrigin: isCurrent && zoomed ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : "center center"
                }}
              >
                {isVideo(src) ? (
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", pointerEvents: "none" }}
                  />
                ) : (
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(max-width: 900px) 100vw, 78vw"
                    style={{ objectFit: "cover", objectPosition: "center", pointerEvents: "none" }}
                    draggable={false}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Left Arrow - hidden when zoomed */}
        {total > 1 && current > 0 && !zoomed && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Previous media"
            className="tz-stage-arrow tz-stage-arrow-left"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Right Arrow - hidden when zoomed */}
        {total > 1 && current < total - 1 && !zoomed && (
          <button
            onClick={() => navigate(1)}
            aria-label="Next media"
            className="tz-stage-arrow tz-stage-arrow-right"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Thumbnails Navigation (Below Gallery) */}
      {total > 1 && !zoomed && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 1.5rem",
          background: "#ffffff",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          borderTop: "1px solid #f0ece6"
        }}>
          {displayImages.map((src, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setZoomed(false); }}
              aria-label={`View frame ${i + 1}`}
              style={{
                position: "relative",
                width: current === i ? "48px" : "40px",
                height: current === i ? "64px" : "54px",
                border: current === i ? "1px solid #1a1a18" : "1px solid transparent",
                padding: current === i ? "2px" : "0",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                opacity: current === i ? 1 : 0.5,
                flexShrink: 0
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                {isVideo(src) ? (
                  <video src={`${src}#t=0.1`} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} muted playsInline />
                ) : (
                  <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="48px" style={{ objectFit: "cover", pointerEvents: "none" }} draggable={false} />
                )}
              </div>
            </button>
          ))}
          <div style={{
            marginLeft: "0.5rem",
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: "0.55rem",
            letterSpacing: "0.14em",
            color: "#9a9690",
            whiteSpace: "nowrap"
          }}>
            {current + 1} / {total}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page component ────────────────────────────────────
export default function ProductDetailPage({ product, related, isPreviewMode }: ProductDetailPageProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [globalData, setGlobalData] = useState<{ sections: any[] }>({ sections: [] });

  const triggerRef = useRef<HTMLElement>(null);

  const { addToCart, openMiniCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const commerce = useCommerce();
  const router = useRouter();
  const wishlisted = isWishlisted(product.slug);

  useEffect(() => {
    fetch("/api/product-pages")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setGlobalData(json.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (product.enableStickyCheckout === false) return; // Feature disabled

    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        // Show sticky bar when the bottom of the trigger area scrolls out of view
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIntroComplete(true), 1700);
    return () => clearTimeout(t);
  }, []);
  const sizes = getSizes(product);

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addToCart(product, quantity, selectedSize);
  }

  function handleBuyNow() {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addToCart(product, quantity, selectedSize);
    router.push("/cart");
  }

  return (
    <main className={`bg-[#fdfdfa] ${isPreviewMode ? 'min-h-full' : 'min-h-screen'}`}>
      {!isPreviewMode && <Navbar />}

      {/* ─── Hero Cinematic Gallery ──────────────────────────────── */}
      <section style={{ 
        position: "relative", 
        width: "100%", 
        height: isPreviewMode ? "600px" : "100vh", // scaled down for preview
        overflow: "hidden", 
        background: "#000" 
      }}>
        <CinematicMorphingGallery images={product.gallery} isPreviewMode={isPreviewMode} merchandising={product.merchandising} />
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        style={{ background: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* ── Footer Information Area ── */}
        <footer
          ref={triggerRef}
          style={{
            background: "#f7f5f2",
            padding: "clamp(4rem, 6vw, 6rem) clamp(2rem, 5vw, 6rem)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "4rem",
          }}
        >
          <div style={{ maxWidth: "440px" }}>
            <h1 style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
              fontWeight: 300, letterSpacing: "0.01em", lineHeight: 1.07,
              color: "#1a1a18", margin: "0 0 0.2rem",
            }}>
              {product.name}
            </h1>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "clamp(0.88rem, 1.2vw, 1rem)",
              fontWeight: 300, fontStyle: "italic", letterSpacing: "0.07em",
              color: "#9a9690", margin: "0 0 1.5rem",
            }}>
              SS 2026 Collection
            </p>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)",
              fontWeight: 300, letterSpacing: "0.04em", color: "#1a1a18", margin: "0 0 2rem",
            }}>
              {formatPrice(getProductPrice(product))}
            </p>
            {product.productStory && (
              <p style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "clamp(1rem, 1.35vw, 1.12rem)",
                fontWeight: 300, fontStyle: "italic", lineHeight: 1.85,
                letterSpacing: "0.015em", color: "#6b6865", margin: 0,
              }}>
                {product.productStory}
              </p>
            )}
          </div>

          <div className="tz-desktop-sticky" style={{ width: "100%", maxWidth: "340px", position: "sticky", top: "120px" }}>
            {sizes.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                <span style={{
                  fontFamily: commerce.style.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                  letterSpacing: "0.14em", color: sizeError ? "#7c2a00" : "#6b6865", textTransform: "uppercase",
                }}>
                  {sizeError ? "Please select a size" : commerce.addToBag.selectSizeLabel}
                </span>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      style={{
                        padding: "0.6rem 1rem",
                        background: selectedSize === s ? "#1a1a18" : "transparent",
                        color: selectedSize === s ? "#f7f5f2" : "#3a3835",
                        border: "1px solid",
                        borderColor: sizeError && !selectedSize ? "#c0392b" : selectedSize === s ? "#1a1a18" : "#ccc9c4",
                        fontFamily: "var(--font-dm-mono, monospace)",
                        fontSize: "0.57rem", letterSpacing: "0.13em",
                        cursor: "pointer", transition: "all 0.3s ease", borderRadius: 0,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Quantity Selector ── */}
            <div style={{ marginBottom: "1.2rem" }}>
              <p style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.52rem",
                letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9690",
                margin: "0 0 0.75rem",
              }}>
                Quantity
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ccc9c4" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{
                    width: "40px", height: "40px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: "1rem", color: "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  −
                </button>
                <span style={{
                  width: "44px", textAlign: "center",
                  fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
                  letterSpacing: "0.12em", color: "#1a1a18",
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  style={{
                    width: "40px", height: "40px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: "1rem", color: "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Add To Cart ── */}
            <button
              onClick={handleAddToCart}
              id="add-to-cart-btn"
              className="tz-cta-primary"
              style={{
                display: "block", width: "100%", padding: "1.2rem",
                background: commerce.style.addToBagBg || "#1a1a18", color: commerce.style.addToBagColor || "#f7f5f2",
                fontFamily: commerce.style.bodyFont || "var(--font-dm-mono, monospace)",
                fontSize: commerce.style.addToBagFontSize || "0.58rem",
                letterSpacing: commerce.style.addToBagLetterSpacing || "0.2em", textTransform: "uppercase",
                textDecoration: "none", textAlign: "center",
                borderRadius: commerce.style.addToBagBorderRadius || "0px",
                border: "none", cursor: "pointer",
                transition: "background 0.4s ease", boxSizing: "border-box", marginBottom: "0.75rem",
              }}
            >
              {commerce.addToBag.buttonLabel}
            </button>

            {/* ── Buy Now ── */}
            <button
              onClick={handleBuyNow}
              id="buy-now-btn"
              className="tz-cta-secondary"
              style={{
                display: "block", width: "100%", padding: "1.2rem",
                background: "transparent", color: "#3a3835",
                fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.58rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                border: "1px solid #ccc9c4", borderRadius: 0, cursor: "pointer",
                transition: "border-color 0.4s ease, color 0.4s ease",
                boxSizing: "border-box", marginBottom: "0.75rem",
              }}
            >
              Buy Now
            </button>

            {/* ── Wishlist ── */}
            <button
              onClick={() => toggleWishlist(product)}
              id="wishlist-btn"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", width: "100%", padding: "0.85rem",
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: commerce.style.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: wishlisted ? "#1a1a18" : "#9a9690",
                transition: "color 0.3s",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={wishlisted ? "#1a1a18" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlisted ? commerce.addToBag.wishlistAddedLabel : commerce.addToBag.wishlistLabel}
            </button>

            <p style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
              letterSpacing: "0.1em", color: "#9a9690",
              margin: "1.8rem 0 0", lineHeight: 2, textTransform: "uppercase", textAlign: "center",
            }}>
              Made to order &nbsp;·&nbsp; 3–5 weeks delivery
              <br />
              Complimentary packaging with every piece
            </p>

            {/* ── Information Accordions ── */}
            {(product.editorialDescription || product.sizeGuide || product.fabricCare || product.shippingReturns) && (
              <div style={{ marginTop: "2.5rem", width: "100%", borderBottom: "1px solid #ccc9c4" }}>
                {product.editorialDescription && <LuxuryAccordion title="Description" content={product.editorialDescription} />}
                {product.sizeGuide && <LuxuryAccordion title="Size Guide" content={product.sizeGuide} />}
                {product.fabricCare && <LuxuryAccordion title="Fabric & Care" content={product.fabricCare} />}
                {product.shippingReturns && <LuxuryAccordion title="Shipping & Returns" content={product.shippingReturns} />}
              </div>
            )}
          </div>
        </footer>

        {/* ── Luxury Storytelling ── */}
        {(product.designStory || product.inspirationStory || product.craftsmanshipDetails || product.fabricDetails) && (
          <section style={{
            padding: "clamp(5rem, 8vw, 8rem) clamp(2.5rem, 6vw, 9rem)",
            background: "#ffffff",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(4rem, 6vw, 6rem)",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}>
            {/* The Story */}
            {(product.designStory || product.inspirationStory) && (
              <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
                <h2 style={{
                  fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 300, letterSpacing: "0.04em", color: "#1a1a18", margin: "0 0 1.5rem",
                }}>The Story</h2>
                {product.designStory && (
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.designStory }} 
                    style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)", fontWeight: 300, lineHeight: 1.8, color: "#4a4845", marginBottom: product.inspirationStory ? "1.5rem" : "0" }}
                  />
                )}
                {product.inspirationStory && (
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.inspirationStory }} 
                    style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)", fontWeight: 300, lineHeight: 1.8, color: "#4a4845" }}
                  />
                )}
              </div>
            )}

            {/* Craftsmanship */}
            {product.craftsmanshipDetails && (
              <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
                <h2 style={{
                  fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 300, letterSpacing: "0.04em", color: "#1a1a18", margin: "0 0 1.5rem",
                }}>Craftsmanship</h2>
                <div 
                  dangerouslySetInnerHTML={{ __html: product.craftsmanshipDetails }} 
                  style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)", fontWeight: 300, lineHeight: 1.8, color: "#4a4845" }}
                />
              </div>
            )}

            {/* Fabric & Materials */}
            {product.fabricDetails && (
              <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
                <h2 style={{
                  fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 300, letterSpacing: "0.04em", color: "#1a1a18", margin: "0 0 1.5rem",
                }}>Fabric & Materials</h2>
                <div 
                  dangerouslySetInnerHTML={{ __html: product.fabricDetails }} 
                  style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)", fontWeight: 300, lineHeight: 1.8, color: "#4a4845" }}
                />
              </div>
            )}
          </section>
        )}

        {/* ── Related Pieces ── */}
        {related.length > 0 && (
          <section style={{
            padding: "clamp(5rem, 8vw, 9rem) clamp(2.5rem, 6vw, 9rem) clamp(6rem, 10vw, 10rem)",
            borderTop: "1px solid #ddd9d4",
            background: "#ffffff",
          }}>
            <div style={{
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              marginBottom: "clamp(3rem, 5vw, 5rem)",
            }}>
              <h2 style={{
                fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
                fontWeight: 300, letterSpacing: "0.04em", color: "#1a1a18", margin: 0,
              }}>
                You May Also Consider
              </h2>
              <Link href={`/${product.category}`} style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.52rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#9a9690", textDecoration: "none",
                borderBottom: "1px solid #ccc9c4", paddingBottom: "2px",
              }}>
                View Collection
              </Link>
            </div>

            <div className="tz-related-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(1.5rem, 3vw, 3.5rem)",
            }}>
              {related.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* ── Global Product Pages Builder Sections ── */}
        {globalData.sections && globalData.sections.length > 0 && (
          <div style={{ width: "100%", background: "#fff" }}>
            <HomepageClientWrapper initialSections={globalData.sections} />
          </div>
        )}

        <Footer />
      </motion.div>

      {/* ── Sticky Purchase Bar ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "1px solid #e8e4df",
              zIndex: 9000,
              padding: "clamp(0.75rem, 2vw, 1.2rem) clamp(1rem, 3vw, 2.5rem)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
              <div style={{ position: "relative", width: "48px", height: "64px", background: "#f7f5f2" }}>
                <Image src={product.gallery?.[0] || product.image} alt={product.name} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="tz-sticky-info" style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#1a1a18" }}>
                  {product.name}
                </span>
                <span style={{ fontSize: "1.1rem", letterSpacing: "0.06em", color: "var(--obsidian)" }}>
                  {formatPrice(getProductPrice(product))}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 2vw, 2rem)" }}>
              {/* Quantity */}
              <div className="tz-sticky-qty" style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ccc9c4" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{ width: "32px", height: "32px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-dm-mono, monospace)", color: "#1a1a18" }}
                >−</button>
                <span style={{ width: "24px", textAlign: "center", fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem", color: "#1a1a18" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  style={{ width: "32px", height: "32px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-dm-mono, monospace)", color: "#1a1a18" }}
                >+</button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="tz-cta-primary"
                style={{
                  padding: "0.85rem clamp(1.2rem, 3vw, 2.5rem)",
                  background: commerce.style.addToBagBg || "#1a1a18", color: commerce.style.addToBagColor || "#f7f5f2",
                  fontFamily: commerce.style.bodyFont || "var(--font-dm-mono, monospace)",
                  fontSize: commerce.style.addToBagFontSize || "0.55rem",
                  letterSpacing: commerce.style.addToBagLetterSpacing || "0.18em", textTransform: "uppercase",
                  borderRadius: commerce.style.addToBagBorderRadius || "0px",
                  border: "none", cursor: "pointer", transition: "background 0.4s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {commerce.addToBag.buttonLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .tz-cta-primary:hover  { background: #2d2b28 !important; }
        .tz-cta-secondary:hover { border-color: #1a1a18 !important; color: #1a1a18 !important; }

        .tz-stage-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          z-index: 20; background: none; border: none; padding: 0.85rem;
          cursor: pointer; color: #1a1a18; opacity: 0.38;
          transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex; align-items: center; justify-content: center;
        }
        .tz-stage-arrow-left  { left: clamp(0.75rem, 4vw, 5rem); }
        .tz-stage-arrow-right { right: clamp(0.75rem, 4vw, 5rem); }
        .tz-stage-arrow:hover { opacity: 0.9; }
        .tz-stage-arrow-right:hover { transform: translateY(-50%) translateX(4px); }

        @media (max-width: 1024px) { 
          .tz-related-grid { grid-template-columns: repeat(2, 1fr) !important; } 
          .tz-desktop-sticky { position: relative !important; top: 0 !important; }
        }
        @media (max-width: 520px)  { 
          .tz-related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1.25rem !important; } 
          .tz-sticky-qty { display: none !important; }
          .tz-sticky-info { display: none !important; }
        }
      `}</style>
    </main>
  );
}

// ─── Related product card ─────────────────────────────────────
function RelatedCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={product.href} style={{ textDecoration: "none", display: "block" }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer" }}
      >
        <div style={{
          position: "relative", width: "100%", aspectRatio: "3/4",
          background: "#edeae5", marginBottom: "1rem", overflow: "hidden",
        }}>
          <motion.div
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              src={product.gallery?.[0] || product.image} alt={product.name} fill
              sizes="(max-width: 768px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </div>
        <h3 style={{
          fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem",
          fontWeight: 300, color: "#1a1a18", margin: "0 0 0.3rem", letterSpacing: "0.02em",
        }}>
          {product.name}
        </h3>
        <p style={{
          fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
          letterSpacing: "0.14em", color: "#9a9690", margin: 0,
        }}>
          {getProductPrice(product)}
        </p>
      </article>
    </Link>
  );
}

// ─── Luxury Accordion ─────────────────────────────────────────
function LuxuryAccordion({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div style={{ borderTop: "1px solid #ccc9c4" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.2rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a1a18",
        }}
      >
        <span style={{
          fontFamily: "var(--font-dm-mono, monospace)",
          fontSize: "0.55rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          {title}
        </span>
        <span style={{
          fontFamily: "var(--font-dm-mono, monospace)",
          fontSize: "0.8rem",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
        }}>
          +
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                paddingBottom: "1.5rem",
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "#6b6865",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

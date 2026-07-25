"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/collections";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice, getProductComparePrice } from "@/lib/currency";
import { useCart, useWishlist } from "@/lib/store";

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function DiscoverDrawer({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  
  const { formatPrice } = useCurrency();
  const { addToCart, openMiniCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      // Reset state when opening a new product
      setSelectedSize(null);
      setQuantity(1);
      setSizeError(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const sizes = product.variants
    ?.filter((v) => v.optionName === "Size" && (v.quantity === undefined || v.quantity > 0))
    .map((v) => v.option) || [];

  if (sizes.length === 0) {
    if (product.category.includes("ready-to-wear")) sizes.push("XS", "S", "M", "L", "XL");
    if (product.category.includes("fragrances")) sizes.push("50 ml", "100 ml");
  }
  const gallery = product.gallery && product.gallery.length > 0 ? [...product.gallery] : [product.image];
  if ((!product.gallery || product.gallery.length === 0) && product.hoverImage && !gallery.includes(product.hoverImage)) {
    gallery.push(product.hoverImage);
  }

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addToCart(product, quantity, selectedSize);
    onClose();
    openMiniCart();
  };

  const drawerVariants = isMobile
    ? {
        hidden: { y: "100%" },
        visible: { y: "0%" },
        exit: { y: "100%" },
      }
    : {
        hidden: { x: "100%" },
        visible: { x: "0%" },
        exit: { x: "100%" },
      };

  return (
    <AnimatePresence>
      <motion.div
        key="discover-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="fixed inset-0 z-[400] bg-black/40 backdrop-blur-[2px]"
      />
      <motion.aside
        key="discover-drawer"
        role="dialog"
        aria-modal="true"
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-[500] bg-white flex flex-col shadow-2xl overflow-hidden"
        style={
          isMobile
            ? {
                bottom: 0,
                left: 0,
                right: 0,
                height: "85vh",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }
            : {
                top: 0,
                right: 0,
                bottom: 0,
                width: "50vw",
              }
        }
      >
        {isMobile ? (
          /* =========================================
             MOBILE VIEW (Bottom Sheet)
             ========================================= */
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <span className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase text-gray-500">Quick Shop</span>
              <button onClick={onClose} className="p-2 -mr-2 text-black opacity-60 hover:opacity-100">
                <CloseIcon />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {gallery.map((img, i) => (
                  <div key={img + i} className="relative w-full flex-shrink-0 snap-center aspect-[3/4] bg-[#f7f5f2]">
                    <Image src={img} alt={`${product.name} ${i+1}`} fill sizes="100vw" className="object-cover object-top" />
                  </div>
                ))}
              </div>
              
              <div className="p-6">
                <h2 className="font-cormorant text-2xl font-light text-black leading-tight">{product.name}</h2>
                <p className="font-dm-mono text-[0.7rem] uppercase tracking-[0.15em] text-gray-500 mt-2 mb-6">
                  {formatPrice(getProductPrice(product))}
                </p>
                
                {(product as any).colors && (product as any).colors.length > 0 && (
                  <div className="mb-6">
                    <span className="block font-dm-mono text-[0.6rem] tracking-[0.15em] uppercase text-gray-500 mb-3">Color</span>
                    <div className="flex gap-3">
                      {(product as any).colors.map((c: string) => (
                        <div key={c} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                )}
                
                {sizes.length > 0 && (
                  <div className="mb-8">
                    <span className={`block font-dm-mono text-[0.6rem] tracking-[0.15em] uppercase mb-3 ${sizeError ? 'text-red-600' : 'text-gray-500'}`}>
                      {sizeError ? "Please select a size" : "Size"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSelectedSize(s); setSizeError(false); }}
                          className={`min-w-[40px] px-3 py-2 font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase transition-all border ${
                            selectedSize === s
                              ? 'border-black text-black font-medium bg-gray-50'
                              : `border-gray-200 text-gray-500 bg-white ${sizeError && !selectedSize ? 'border-red-400' : ''}`
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#0a0a0a] text-white py-4 font-dm-mono text-[0.75rem] uppercase tracking-[0.2em] hover:bg-black transition-colors mb-4"
                >
                  Add to Bag
                </button>
                
                <div className="text-center">
                  <Link href={product.href || `/product/${product.slug}`} onClick={onClose} className="inline-block font-dm-mono text-[0.6rem] tracking-[0.2em] uppercase text-gray-500 border-b border-gray-300 pb-1 hover:text-black hover:border-black transition-all">
                    Full Details
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* =========================================
             DESKTOP VIEW (Two-Column Wide Drawer)
             ========================================= */
          <div className="flex flex-row w-full h-full relative">
            
            {/* Left Column: Vertical Image Scroll */}
            <div className="w-[50%] h-full overflow-y-auto custom-scrollbar bg-[#fcfbf9]">
              <div className="flex flex-col gap-[2px]">
                {gallery.map((img, i) => (
                  <div key={img + i} className="relative w-full aspect-[4/5] bg-[#f0ece6]">
                    <Image src={img} alt={`${product.name} ${i+1}`} fill sizes="25vw" className="object-cover object-top" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Fixed Details */}
            <div className="w-[50%] flex-shrink-0 h-full flex flex-col bg-white border-l border-gray-100 relative">
              
              <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-10">
                <button onClick={onClose} className="p-2 text-black opacity-50 hover:opacity-100 transition-opacity">
                  <CloseIcon />
                </button>
              </div>

              <div className="px-8 lg:px-10 flex-1 flex flex-col justify-start pb-16 overflow-y-auto hide-scrollbar gap-10 items-center text-center relative">
                
                {/* Spacer to guarantee 0.75 inches (72px) from the top */}
                <div className="w-full h-[72px] min-h-[72px] flex-shrink-0" />
                
                <div className="flex flex-col gap-3 w-full">
                  <h1 className="font-sans text-[1.1rem] lg:text-[1.25rem] font-bold tracking-widest text-[#1a1a18] uppercase leading-tight mb-2">
                    {product.name}
                  </h1>
                  <p className="font-sans text-[0.65rem] font-bold tracking-widest text-[#1a1a18] uppercase">
                    {product.categoryLabel || product.category || "TEZHHOMAYAA"}
                  </p>
                  <p className="font-sans text-[1rem] font-semibold text-[#1a1a18] mt-2 mb-10 flex justify-center items-center gap-3">
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
                      formatPrice(getProductPrice(product))
                    )}
                  </p>
                </div>

                {(product as any).colors && (product as any).colors.length > 0 && (
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center mb-3">
                      <span className="font-sans text-[0.65rem] font-bold tracking-widest uppercase text-[#1a1a18] mr-2">Color:</span>
                      <span className="font-sans text-[0.65rem] tracking-wider text-gray-500">Selected</span>
                    </div>
                    <div className="flex justify-center gap-3">
                      {(product as any).colors.map((c: string, idx: number) => (
                        <button key={c} className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 ${idx === 0 ? 'border-gray-800 p-[2px]' : 'border-gray-200'}`}>
                           <div className="w-full h-full rounded-full" style={{ backgroundColor: c }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="flex flex-col items-center w-full">
                    <div className="flex justify-center items-center mb-4">
                      <span className={`font-sans text-[0.65rem] font-bold tracking-widest uppercase ${sizeError ? 'text-red-600' : 'text-[#1a1a18]'}`}>
                        {sizeError ? "Please select a size" : "Size:"}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSelectedSize(s); setSizeError(false); }}
                          className={`min-w-[50px] px-2 py-2 font-sans text-[0.7rem] uppercase transition-all border ${
                            selectedSize === s
                              ? 'border-[#1a1a18] text-[#1a1a18] bg-gray-50 font-medium shadow-inner'
                              : `border-gray-300 text-gray-600 bg-white hover:border-gray-500 ${sizeError && !selectedSize ? 'border-red-400' : ''}`
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-4 w-[85%] mx-auto">
                  <div className="flex items-stretch gap-2 h-[52px]">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-brand text-white font-sans text-[0.75rem] uppercase tracking-widest hover:bg-brand-light transition-colors"
                    >
                      Add To Bag
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="w-[52px] flex-shrink-0 flex items-center justify-center bg-brand text-white hover:bg-brand-light transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted(product.slug) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-center w-full">
                    <Link href={product.href || `/product/${product.slug}`} onClick={onClose} className="inline-block font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-[#1a1a18] border-b border-[#1a1a18] pb-[2px] hover:text-gray-500 hover:border-gray-500 transition-colors">
                      Full Details
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </motion.aside>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e8e4df;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #ccc9c4;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </AnimatePresence>
  );
}

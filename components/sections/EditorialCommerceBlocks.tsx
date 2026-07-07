"use client";

import React, { useState, useEffect } from "react";
import { UniversalSectionData } from "@/lib/types/homepage";
import { LuxuryProductCard, Product } from "./LuxuryProductCard";
import Link from "next/link";

interface BlockProps {
  section: UniversalSectionData;
}

const useEditorialStyle = (section: UniversalSectionData) => {
  const d = section.layout?.desktop || {};
  return {
    padding: d.padding || "0px",
    margin: d.margin || "0px",
    textAlign: d.align as any || "left",
    maxWidth: d.textWidth ? `${d.textWidth}%` : "100%",
    backgroundColor: section.style?.backgroundColor || "transparent",
    color: section.style?.textColor || "inherit",
    width: "100%",
  };
};

// Mock product generator for preview
const getMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-${i}`,
    name: `Luxury Item ${i + 1}`,
    slug: `luxury-item-${i + 1}`,
    price: 1250,
    category: "Ready To Wear",
    image: `https://images.unsplash.com/photo-1515347619362-74917537b03a?auto=format&fit=crop&q=80&w=800&h=1067`,
    hoverImage: `https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&h=1067`,
    badge: i === 0 ? "NEW" : null,
    sizes: ["XS", "S", "M", "L"]
  }));
};

export const EditorialShopTheStory = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  // Using 4 items to display Shop The Story gracefully
  const products = getMockProducts(4);

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "8rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", padding: "0 2rem" }}>
        
        <div style={{ textAlign: section.style?.heading?.align as any || "center", marginBottom: "4rem" }}>
          <h2 style={{ 
            fontSize: `${section.style?.heading?.fontSize || 1.5}rem`,
            fontWeight: section.style?.heading?.fontWeight || 300,
            letterSpacing: `${section.style?.heading?.letterSpacing || 0.2}em`,
            lineHeight: section.style?.heading?.lineHeight || 1.2,
            color: section.style?.heading?.textColor || style.color,
            textTransform: "uppercase" 
          }}>
            {section.content?.heading || "Shop The Story"}
          </h2>
          {section.content?.description && (
            <p style={{ 
              marginTop: "1rem", 
              fontSize: `${section.style?.description?.fontSize || 0.85}rem`,
              fontWeight: section.style?.description?.fontWeight || 300,
              letterSpacing: `${section.style?.description?.letterSpacing || 0}em`,
              lineHeight: section.style?.description?.lineHeight || 1.6,
              color: section.style?.description?.textColor || "#6b6865",
              textAlign: section.style?.description?.align as any || "center"
            }}>
              {section.content.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {products.map((p, idx) => (
            <div key={p.id} className={idx % 2 !== 0 ? "lg:mt-16" : ""}>
              <LuxuryProductCard product={p} />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export const EditorialProductCarousel = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const products = getMockProducts(8); // Overflow array

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "6rem 0", margin: style.margin, overflow: "hidden" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingLeft: "2rem" }}>
        
        {section.content?.heading && (
          <h2 style={{ 
            fontSize: `${section.style?.heading?.fontSize || 1.25}rem`,
            fontWeight: section.style?.heading?.fontWeight || 300,
            letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
            lineHeight: section.style?.heading?.lineHeight || 1.2,
            color: section.style?.heading?.textColor || style.color,
            textAlign: section.style?.heading?.align as any || "left",
            marginBottom: "3rem" 
          }}>
            {section.content.heading}
          </h2>
        )}

        <div 
          className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory pb-12 cursor-grab active:cursor-grabbing" 
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Injecting CSS to hide scrollbar for webkit directly via style tag since we can't guarantee hide-scrollbar class exists */}
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          
          {products.map(p => (
            <div key={p.id} className="min-w-[75vw] sm:min-w-[320px] lg:min-w-[400px] snap-center shrink-0">
              <LuxuryProductCard product={p} />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export const EditorialRelatedProducts = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const products = getMockProducts(3);

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "6rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", padding: "0 2rem" }}>
        {section.content?.heading && (
          <h2 style={{ 
            fontSize: `${section.style?.heading?.fontSize || 1.5}rem`,
            fontWeight: section.style?.heading?.fontWeight || 300,
            letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
            lineHeight: section.style?.heading?.lineHeight || 1.2,
            color: section.style?.heading?.textColor || style.color,
            textAlign: section.style?.heading?.align as any || style.textAlign,
            marginBottom: "4rem" 
          }}>
            {section.content.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {products.map(p => (
            <LuxuryProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const EditorialCompleteTheLook = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const primaryProduct = getMockProducts(1)[0];
  const accessories = getMockProducts(3);

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "6rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1200px", width: "100%", padding: "0 2rem" }}>
        
        <h2 style={{ 
          fontSize: `${section.style?.heading?.fontSize || 1.5}rem`,
          fontWeight: section.style?.heading?.fontWeight || 300,
          letterSpacing: `${section.style?.heading?.letterSpacing || 0.2}em`,
          lineHeight: section.style?.heading?.lineHeight || 1.2,
          color: section.style?.heading?.textColor || style.color,
          textAlign: section.style?.heading?.align as any || "center",
          marginBottom: "4rem", 
          textTransform: "uppercase" 
        }}>
          {section.content?.heading || "Complete The Look"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Primary Look */}
          <div className="md:col-span-5">
            <LuxuryProductCard product={primaryProduct} />
          </div>
          
          {/* Accessories */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-6">Styled With</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {accessories.map(p => (
                <LuxuryProductCard key={p.id} product={p} />
              ))}
            </div>
            
            <button className="mt-12 self-start text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
              Add Look To Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export const EditorialFeaturedCollection = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const img = section.desktopImage || "https://images.unsplash.com/photo-1515347619362-74917537b03a?auto=format&fit=crop&q=80&w=1600";

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, position: "relative", height: "80vh", minHeight: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="absolute inset-0 z-0">
        <img src={img} alt="Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="relative z-10 text-white px-4" style={{ textAlign: section.style?.heading?.align as any || "center" }}>
        <h2 style={{ 
          fontSize: `${section.style?.heading?.fontSize || 4}rem`,
          fontWeight: section.style?.heading?.fontWeight || 300,
          letterSpacing: `${section.style?.heading?.letterSpacing || -0.02}em`,
          lineHeight: section.style?.heading?.lineHeight || 1.1,
          color: section.style?.heading?.textColor || "white",
          marginBottom: "1.5rem" 
        }}>
          {section.content?.heading || "The New Collection"}
        </h2>
        {section.content?.description && (
          <p style={{ 
            fontSize: `${section.style?.description?.fontSize || 0.75}rem`,
            fontWeight: section.style?.description?.fontWeight || 400,
            letterSpacing: `${section.style?.description?.letterSpacing || 0.2}em`,
            lineHeight: section.style?.description?.lineHeight || 1.6,
            color: section.style?.description?.textColor || "white",
            textTransform: "uppercase",
            marginBottom: "3rem", 
            maxWidth: "32rem", 
            marginLeft: "auto", 
            marginRight: "auto", 
            opacity: 0.9 
          }}>
            {section.content.description}
          </p>
        )}
        <Link href={section.content?.primaryButton?.url || "/collections"} className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-12 py-5 hover:bg-black hover:text-white transition-colors duration-500">
          {section.content?.primaryButton?.label || "Explore Collection"}
        </Link>
      </div>
    </div>
  );
};

export const EditorialNewsletter = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  
  return (
    <div style={{ backgroundColor: style.backgroundColor || "#fcfbf9", padding: style.padding || "8rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", width: "100%", padding: "0 2rem", textAlign: "center" }}>
        <h2 style={{ 
          fontSize: `${section.style?.heading?.fontSize || 2}rem`,
          fontWeight: section.style?.heading?.fontWeight || 300,
          letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
          lineHeight: section.style?.heading?.lineHeight || 1.2,
          color: section.style?.heading?.textColor || style.color,
          marginBottom: "1rem" 
        }}>
          {section.content?.heading || "The Journal"}
        </h2>
        <p style={{ 
          fontSize: `${section.style?.description?.fontSize || 0.9}rem`,
          fontWeight: section.style?.description?.fontWeight || 300,
          letterSpacing: `${section.style?.description?.letterSpacing || 0}em`,
          lineHeight: section.style?.description?.lineHeight || 1.6,
          color: section.style?.description?.textColor || "#6b6865",
          marginBottom: "3rem" 
        }}>
          {section.content?.description || "Sign up to receive exclusive editorials, collection previews, and intimate stories from the Tezhhomayaa house."}
        </p>
        
        <form className="flex border-b border-black pb-2" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
            required
          />
          <button type="submit" className="text-xs uppercase tracking-widest hover:text-gray-500 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export const EditorialRelatedStories = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "8rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", padding: "0 2rem" }}>
        
        {section.content?.heading && (
          <h2 style={{ 
            fontSize: `${section.style?.heading?.fontSize || 1.25}rem`,
            fontWeight: section.style?.heading?.fontWeight || 300,
            letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
            lineHeight: section.style?.heading?.lineHeight || 1.2,
            color: section.style?.heading?.textColor || style.color,
            textAlign: section.style?.heading?.align as any || style.textAlign,
            marginBottom: "4rem" 
          }}>
            {section.content.heading}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {[1, 2].map(i => (
            <Link href="#" key={i} className="group block cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-6">
                <img 
                  src={`https://images.unsplash.com/photo-1515347619362-74917537b03a?auto=format&fit=crop&q=80&w=800`} 
                  alt="Story" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Craftsmanship</p>
              <h3 className="text-2xl font-light mb-3 group-hover:text-gray-600 transition-colors">The Art of the Drape</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest border-b border-transparent group-hover:border-black inline-block pb-1 transition-all">Read Story</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export const EditorialCTA = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "12rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%", textAlign: "center", padding: "0 2rem" }}>
        {section.content?.heading && (
          <h2 style={{ 
            fontSize: `${section.style?.heading?.fontSize || 3}rem`,
            fontWeight: section.style?.heading?.fontWeight || 300,
            letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
            lineHeight: section.style?.heading?.lineHeight || 1.2,
            color: section.style?.heading?.textColor || style.color,
            textAlign: section.style?.heading?.align as any || "center",
            marginBottom: "3rem" 
          }}>
            {section.content.heading}
          </h2>
        )}
        {section.content?.primaryButton?.enabled && (
          <Link href={section.content.primaryButton.url} className="text-xs uppercase tracking-widest border-b border-black pb-2 hover:text-gray-500 hover:border-gray-500 transition-colors">
            {section.content.primaryButton.label}
          </Link>
        )}
      </div>
    </div>
  );
};

export const EditorialRecentlyViewed = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  // Placeholder for local storage logic
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "6rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", padding: "0 2rem" }}>
        <h2 style={{ 
          fontSize: `${section.style?.heading?.fontSize || 1.25}rem`,
          fontWeight: section.style?.heading?.fontWeight || 300,
          letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
          lineHeight: section.style?.heading?.lineHeight || 1.2,
          color: section.style?.heading?.textColor || style.color,
          textAlign: section.style?.heading?.align as any || style.textAlign,
          marginBottom: "4rem" 
        }}>
          {section.content?.heading || "Recently Viewed"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {getMockProducts(4).map(p => <LuxuryProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export const EditorialYouMayAlsoLike = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "6rem 0", margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", padding: "0 2rem" }}>
        <h2 style={{ 
          fontSize: `${section.style?.heading?.fontSize || 1.25}rem`,
          fontWeight: section.style?.heading?.fontWeight || 300,
          letterSpacing: `${section.style?.heading?.letterSpacing || 0}em`,
          lineHeight: section.style?.heading?.lineHeight || 1.2,
          color: section.style?.heading?.textColor || style.color,
          textAlign: section.style?.heading?.align as any || style.textAlign,
          marginBottom: "4rem" 
        }}>
          {section.content?.heading || "You May Also Like"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {getMockProducts(4).map(p => <LuxuryProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export const EditorialStickyPurchaseBar = ({ section }: BlockProps) => {
  // Usually this would be a fixed overlay tied to scroll position, hidden inside the editor preview
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-50 flex justify-between items-center hidden">
      <div className="flex items-center gap-4">
        <img src="https://images.unsplash.com/photo-1515347619362-74917537b03a?w=100" className="w-12 h-16 object-cover" />
        <div>
          <p className="text-sm font-medium">Signature Piece</p>
          <p className="text-xs text-gray-500">$1,250</p>
        </div>
      </div>
      <button className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest">
        Add To Bag
      </button>
    </div>
  );
};

export const EditorialFloatingWishlist = ({ section }: BlockProps) => {
  // Usually triggered by state
  return null;
};

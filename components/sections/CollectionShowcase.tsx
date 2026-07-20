"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { normalizeSectionData } from "@/lib/types/homepage";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";
import { Observability } from "@/lib/infrastructure/observability";

const shadowMap: any = {
  none: "none",
  soft: "0 4px 20px rgba(0,0,0,0.5)",
  medium: "0 2px 10px rgba(0,0,0,0.6)",
  strong: "0 2px 4px rgba(0,0,0,0.8)",
  luxury: "0 0 20px rgba(255,255,255,0.4)"
};

function CollectionCard({ item, sectionId, isEdgeToEdge = false, delay = 0, className = "", aspectRatio = "3/4" }: any) {
  const norm = normalizeSectionData(item);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isPreviewMode = mounted && window.location.pathname.includes("/admin");

  const { containerRef, localPos, isDragging, handlePointerDown } = useWysiwygDrag({
    sectionId: sectionId || "",
    slideId: item.id,
    defaultDesktop: { x: norm.layout.desktop.x, y: norm.layout.desktop.y },
    defaultMobile: { x: norm.layout.mobile.x, y: norm.layout.mobile.y }
  });

  const cardTitle = norm.content?.heading || "";
  const buttonUrl = norm.content?.primaryButton?.url || item.url || item.collectionId || "";
  
  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Card URL", { cardTitle, buttonUrl });

  const href = buttonUrl && buttonUrl !== "#" ? buttonUrl.startsWith('/') || buttonUrl.startsWith('http') ? buttonUrl : `/${buttonUrl}` : "";

  return (
    <ScrollReveal delay={delay} className={`w-full relative group/card block overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/list:brightness-95 hover:!brightness-100 ${className}`}>
      {href ? (
        <Link 
          href={href} 
          className={`block w-full h-full cursor-pointer flex flex-col`}
        >
          <CardInner norm={norm} isEdgeToEdge={isEdgeToEdge} aspectRatio={aspectRatio} containerRef={containerRef} handlePointerDown={handlePointerDown} isDragging={isDragging} localPos={localPos} isPreviewMode={isPreviewMode} mounted={mounted} />
        </Link>
      ) : (
        <div className={`block w-full h-full flex flex-col`}>
          <CardInner norm={norm} isEdgeToEdge={isEdgeToEdge} aspectRatio={aspectRatio} containerRef={containerRef} handlePointerDown={handlePointerDown} isDragging={isDragging} localPos={localPos} isPreviewMode={isPreviewMode} mounted={mounted} />
        </div>
      )}
    </ScrollReveal>
  );
}

function CardInner({ norm, isEdgeToEdge, aspectRatio, containerRef, handlePointerDown, isDragging, localPos, isPreviewMode, mounted }: any) {
  const isMasonry = aspectRatio === "auto";
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);
  const hotspots = norm.hotspots || [];

  return (
    <>
      <div className={`w-full relative overflow-hidden flex-none ${isEdgeToEdge ? "h-[60vh] md:h-[75vh]" : ""}`} style={{ aspectRatio: isEdgeToEdge ? "auto" : aspectRatio, background: "var(--stone)" }}>
          <UniversalMediaRenderer 
            media={norm.media}
            fill={!isMasonry}
            // Use scale-[1.03] statically so translate3d doesn't reveal edges, and apply translation on hover. 
            // motion-safe uses translate3d(0, -2px, 0) for luxury film feel (reduced by 50%).
            // default duration is 1000ms for slow return.
            className={`object-cover ${isMasonry ? 'block w-full h-auto' : 'absolute inset-0 w-full h-full'} scale-[1.03] transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-safe:group-hover/card:-translate-y-0.5 group-hover/card:delay-[75ms]`}
            style={{ filter: "brightness(0.92) contrast(1.02)" }}
          />
          {/* Overlay reduction on hover */}
          <div 
            className="absolute inset-0 transition-opacity duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] opacity-100 group-hover/card:opacity-40 group-hover/card:delay-[75ms]" 
            style={{ backgroundColor: `rgba(0,0,0,${(norm.style.darkOverlay || 0) / 100})` }} 
          />
          {norm.style.gradientOverlay && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-100 transition-opacity duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:opacity-40 group-hover/card:delay-[75ms]" />
          )}

          {/* Hotspots Overlay */}
          {hotspots.map((hs: any, idx: number) => (
            <div 
              key={idx}
              className="absolute group/hotspot z-20"
              style={{ top: `${hs.y}%`, left: `${hs.x}%`, transform: "translate(-50%, -50%)" }}
              onMouseEnter={(e) => { e.preventDefault(); setHoveredHotspot(idx); }}
              onMouseLeave={(e) => { e.preventDefault(); setHoveredHotspot(null); }}
              onClick={(e) => {
                if (hs.url) {
                  window.location.href = hs.url;
                } else {
                  e.preventDefault();
                }
              }}
            >
              {/* Luxury Ring Style */}
              <div className="w-4 h-4 rounded-full bg-white/80 backdrop-blur-sm border border-black/20 flex items-center justify-center cursor-pointer shadow-sm">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              
              {/* Tooltip */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white px-4 py-3 shadow-xl border border-gray-100 min-w-[200px] transition-all duration-300 pointer-events-none ${hoveredHotspot === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Shop Product</p>
                <p className="text-sm text-black whitespace-nowrap">{hs.label || "Product Name"}</p>
                <p className="text-xs text-gray-500 mt-1">{hs.price || "$0"}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Text Container Below the Card */}
        <div 
          className="flex flex-col mt-5 w-full"
          style={{
            alignItems: norm.layout.desktop.align === "left" ? "flex-start" : norm.layout.desktop.align === "right" ? "flex-end" : "center",
            textAlign: norm.layout.desktop.align as any,
          }}
        >
          {norm.content.heading && (
            <span
              style={{
                fontFamily: norm.style.fontFamily,
                fontSize: `${norm.style.heading.fontSize}rem`,
                fontWeight: norm.style.heading.fontWeight,
                letterSpacing: `${norm.style.heading.letterSpacing}em`,
                lineHeight: norm.style.heading.lineHeight,
                color: "var(--obsidian)",
                textAlign: norm.style.heading.align as any,
                width: "100%",
                position: "relative",
                display: "inline-block",
                paddingBottom: "4px",
                textTransform: "capitalize",
              }}
              className="transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-safe:group-hover/card:-translate-y-1 group-hover/card:delay-[75ms]"
            >
              {norm.content.heading}
              <span
                style={{ 
                  position: "absolute", bottom: 0, left: norm.layout.desktop.align === 'left' ? 0 : norm.layout.desktop.align === 'right' ? 'auto' : "50%", 
                  right: norm.layout.desktop.align === 'right' ? 0 : 'auto', 
                  transform: norm.layout.desktop.align === 'center' ? "translateX(-50%)" : "none", 
                  height: "1px", background: "currentColor" 
                }}
                className="w-0 transition-all duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:w-full group-hover/card:delay-[75ms]"
              />
            </span>
          )}
          {norm.content.subheading && (
            <span style={{ 
              display: "block", 
              fontSize: `${norm.style.subheading.fontSize}rem`,
              fontWeight: norm.style.subheading.fontWeight,
              letterSpacing: `${norm.style.subheading.letterSpacing}em`,
              lineHeight: norm.style.subheading.lineHeight,
              color: "var(--obsidian)",
              textAlign: norm.style.subheading.align as any,
              marginTop: "0.5rem",
              textTransform: "uppercase" 
            }}>
              {norm.content.subheading}
            </span>
          )}
          {norm.content.description && (
              <p 
                className="font-light opacity-80 whitespace-pre-wrap"
                style={{ 
                  fontSize: `${norm.style.description.fontSize}rem`,
                  fontWeight: norm.style.description.fontWeight,
                  color: "var(--obsidian)",
                  textAlign: norm.style.description.align as any,
                  maxWidth: `${norm.style.description.maxWidth}px`,
                  marginLeft: norm.style.description.align === "center" ? "auto" : "0", 
                  marginRight: norm.style.description.align === "center" ? "auto" : "0",
                  marginTop: "0.5rem"
                }}
              >
                {norm.content.description}
              </p>
          )}
          {norm.content.primaryButton.enabled && norm.content.primaryButton.label && (
            <span 
              className="inline-block mt-2 tracking-[0.1em] uppercase opacity-0 translate-y-1.5 transition-all duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:delay-[75ms]"
              style={{
                fontSize: `${norm.style.button.fontSize}rem`,
                fontWeight: norm.style.button.fontWeight,
                color: "var(--obsidian)",
                borderBottom: "1px solid currentColor",
                paddingBottom: "2px"
              }}
            >
              {norm.content.primaryButton.label}
            </span>
          )}
        </div>
    </>
  );
}

export default function CollectionShowcase({ cmsData, sectionId }: { cmsData?: any, sectionId?: string }) {
  if (!cmsData) return null;

  const norm = normalizeSectionData(cmsData);
  const layout = norm.collectionShowcase?.layoutType || "grid";
  const maxWidth = norm.collectionShowcase?.maxWidth || "boxed";
  const items = norm.collectionShowcase?.items || [];

  if (items.length === 0) return null;

  const containerClass = maxWidth === "boxed" 
    ? "w-full max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 py-16" 
    : "w-full";

  const paddingClass = maxWidth === "boxed" ? "" : "px-0";

  const renderGrid = (colsClass: string, isEdgeToEdge: boolean = false) => {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 ${colsClass} ${isEdgeToEdge ? "gap-0" : "gap-x-6 gap-y-16"} w-full group/list`}>
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} isEdgeToEdge={isEdgeToEdge} delay={i * 0.15} aspectRatio={isEdgeToEdge ? "auto" : "3/4"} className={isEdgeToEdge ? "h-[60vh] md:h-[80vh]" : "h-full"} />
        ))}
      </div>
    );
  };

  const renderEditorialGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center group/list">
        {items.map((item: any, i: number) => {
          const isLarge = i % 4 === 0 || i % 4 === 3;
          const colSpan = isLarge ? "md:col-span-8" : "md:col-span-4";
          const aspectRatio = isLarge ? "16/9" : "3/4";

          return (
            <CollectionCard key={item.id || i} item={item} sectionId={sectionId} delay={i * 0.1} aspectRatio={aspectRatio} className={colSpan} />
          );
        })}
      </div>
    );
  };

  const renderFullWidthTiles = () => {
    return (
      <div className="flex flex-col md:flex-row w-full mb-16 group/list">
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} isEdgeToEdge={true} className="flex-1" />
        ))}
      </div>
    );
  };

  const renderMasonry = () => {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 w-full group/list">
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} delay={i * 0.1} className="mb-8 break-inside-avoid" aspectRatio="auto" />
        ))}
      </div>
    );
  };

  const renderCarousel = () => {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 w-full hide-scrollbar group/list" style={{ scrollBehavior: "smooth" }}>
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} delay={i * 0.1} className="flex-none w-[85vw] md:w-[40vw] lg:w-[30vw] snap-center" />
        ))}
      </div>
    );
  };

  return (
    <section aria-label="Collection Showcase" className={`${containerClass} ${paddingClass}`}>
      {layout === "grid" && renderGrid("lg:grid-cols-4")}
      {layout === "grid-2" && renderGrid("lg:grid-cols-2")}
      {layout === "grid-3" && renderGrid("lg:grid-cols-3")}
      {layout === "grid-4" && renderGrid("lg:grid-cols-4", true)}
      {layout === "full-width-tiles" && renderFullWidthTiles()}
      {layout === "masonry" && renderMasonry()}
      {layout === "carousel" && renderCarousel()}
      {layout === "editorial" && renderEditorialGrid()}
      
      {/* Legacy support */}
      {["2-columns", "3-columns", "4-columns"].includes(layout) && renderGrid("lg:grid-cols-4")}
      {layout === "full-width" && renderFullWidthTiles()}
    </section>
  );
}

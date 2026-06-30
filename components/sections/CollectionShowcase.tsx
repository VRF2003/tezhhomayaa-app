"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { normalizeSectionData } from "@/lib/types/homepage";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";

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
  
  console.log("Card URL", cardTitle, buttonUrl);

  const href = buttonUrl && buttonUrl !== "#" ? buttonUrl.startsWith('/') || buttonUrl.startsWith('http') ? buttonUrl : `/${buttonUrl}` : "";

  return (
    <ScrollReveal delay={delay} className={`w-full relative group block overflow-hidden ${className}`}>
      {href ? (
        <Link 
          href={href} 
          className={`block w-full h-full ${isEdgeToEdge ? "absolute inset-0" : ""} cursor-pointer`}
        >
          <CardInner norm={norm} isEdgeToEdge={isEdgeToEdge} aspectRatio={aspectRatio} containerRef={containerRef} handlePointerDown={handlePointerDown} isDragging={isDragging} localPos={localPos} isPreviewMode={isPreviewMode} mounted={mounted} />
        </Link>
      ) : (
        <div className={`block w-full h-full ${isEdgeToEdge ? "absolute inset-0" : ""}`}>
          <CardInner norm={norm} isEdgeToEdge={isEdgeToEdge} aspectRatio={aspectRatio} containerRef={containerRef} handlePointerDown={handlePointerDown} isDragging={isDragging} localPos={localPos} isPreviewMode={isPreviewMode} mounted={mounted} />
        </div>
      )}
    </ScrollReveal>
  );
}

function CardInner({ norm, isEdgeToEdge, aspectRatio, containerRef, handlePointerDown, isDragging, localPos, isPreviewMode, mounted }: any) {
  return (
    <>
      <div className={`w-full relative overflow-hidden ${isEdgeToEdge ? "h-full min-h-[60vh]" : ""}`} style={{ aspectRatio: isEdgeToEdge ? "auto" : aspectRatio, background: "var(--stone)" }}>
          <UniversalMediaRenderer 
            media={norm.media}
            className="object-cover absolute inset-0 w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ filter: "brightness(0.9) contrast(1.02)" }}
          />
          <div className="absolute inset-0 transition-colors duration-1000 ease-out group-hover:bg-black/20" style={{ backgroundColor: `rgba(0,0,0,${(norm.style.darkOverlay || 0) / 100})` }} />
          {norm.style.gradientOverlay && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          )}
        </div>
        
        {/* Draggable Text Container inside the Card */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          className={`hero-text-pos absolute flex flex-col justify-center text-center`}
          style={(isDragging ? {
            left: `${localPos.x}%`,
            top: `${localPos.y}%`,
            width: `calc(${norm.layout.desktop.textWidth}% - 2rem)`,
            color: norm.style.textColor,
            textShadow: shadowMap[norm.style.textShadow || "none"],
            cursor: "move",
            border: "1px dashed rgba(255,255,255,0.8)",
            padding: "20px",
            touchAction: "none",
            transform: "translate(-50%, -50%)",
            alignItems: norm.layout.desktop.align === "left" ? "flex-start" : norm.layout.desktop.align === "right" ? "flex-end" : "center",
            textAlign: norm.layout.desktop.align as any,
            zIndex: 10,
          } : {
            "--desktop-x": `${norm.layout.desktop.x}%`,
            "--desktop-y": `${norm.layout.desktop.y}%`,
            "--mobile-x": `${norm.layout.mobile.x}%`,
            "--mobile-y": `${norm.layout.mobile.y}%`,
            width: `calc(${norm.layout.desktop.textWidth}% - 2rem)`,
            color: norm.style.textColor,
            textShadow: shadowMap[norm.style.textShadow || "none"],
            cursor: (mounted && isPreviewMode) ? "move" : "default",
            transform: "translate(-50%, -50%)",
            alignItems: norm.layout.desktop.align === "left" ? "flex-start" : norm.layout.desktop.align === "right" ? "flex-end" : "center",
            textAlign: norm.layout.desktop.align as any,
            zIndex: 10,
          }) as React.CSSProperties}
        >
          {norm.content.heading && (
            <span
              style={{
                fontFamily: norm.style.fontFamily,
                fontSize: `${norm.style.heading.fontSize}rem`,
                fontWeight: norm.style.heading.fontWeight,
                letterSpacing: `${norm.style.heading.letterSpacing}em`,
                lineHeight: norm.style.heading.lineHeight,
                color: norm.style.heading.textColor,
                textAlign: norm.style.heading.align as any,
                textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
                width: "100%",
                position: "relative",
                display: "inline-block",
                paddingBottom: "4px",
                textTransform: "capitalize",
                transition: "opacity 0.5s ease",
              }}
              className="group-hover:opacity-80"
            >
              {norm.content.heading}
              {(!isEdgeToEdge && norm.style.heading.textColor === "#1a1a18") && (
                <span
                  style={{ position: "absolute", bottom: 0, left: norm.layout.desktop.align === 'left' ? 0 : norm.layout.desktop.align === 'right' ? 'auto' : "50%", right: norm.layout.desktop.align === 'right' ? 0 : 'auto', transform: norm.layout.desktop.align === 'center' ? "translateX(-50%)" : "none", height: "1px", width: "0%", background: "currentColor", transition: "width 0.65s cubic-bezier(0.22, 1, 0.36, 1)" }}
                  className="group-hover:w-full"
                />
              )}
            </span>
          )}
          {norm.content.subheading && (
            <span style={{ 
              display: "block", 
              fontSize: `${norm.style.subheading.fontSize}rem`,
              fontWeight: norm.style.subheading.fontWeight,
              letterSpacing: `${norm.style.subheading.letterSpacing}em`,
              lineHeight: norm.style.subheading.lineHeight,
              color: norm.style.subheading.textColor,
              textAlign: norm.style.subheading.align as any,
              textShadow: norm.style.subheading.textShadow === "none" ? "none" : "0 4px 20px rgba(0,0,0,0.3)",
              marginTop: "1rem",
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
                  color: norm.style.description.textColor,
                  textAlign: norm.style.description.align as any,
                  maxWidth: `${norm.style.description.maxWidth}px`,
                  marginLeft: norm.style.description.align === "center" ? "auto" : "0", 
                  marginRight: norm.style.description.align === "center" ? "auto" : "0",
                  textShadow: norm.style.description.textShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.8)",
                  marginTop: "1rem"
                }}
              >
                {norm.content.description}
              </p>
          )}
          {norm.content.primaryButton.enabled && norm.content.primaryButton.label && (
            <span className={`inline-block mt-4 text-xs tracking-widest uppercase border-b pb-1 transition-colors border-current opacity-80 hover:opacity-100`}>
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
      <div className={`grid grid-cols-1 md:grid-cols-2 ${colsClass} ${isEdgeToEdge ? "gap-0" : "gap-x-6 gap-y-16"} w-full`}>
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} isEdgeToEdge={isEdgeToEdge} delay={i * 0.15} aspectRatio={isEdgeToEdge ? "auto" : "3/4"} className={isEdgeToEdge ? "h-[60vh] md:h-[80vh]" : "h-full"} />
        ))}
      </div>
    );
  };

  const renderEditorialGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
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
      <div className="flex flex-col md:flex-row w-full h-[80vh] min-h-[600px]">
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} isEdgeToEdge={true} className="flex-1 h-full hover:flex-[1.2] transition-all duration-700" />
        ))}
      </div>
    );
  };

  const renderMasonry = () => {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 w-full">
        {items.map((item: any, i: number) => (
          <CollectionCard key={item.id || i} item={item} sectionId={sectionId} delay={i * 0.1} className="mb-8 break-inside-avoid" aspectRatio="auto" />
        ))}
      </div>
    );
  };

  const renderCarousel = () => {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 w-full hide-scrollbar" style={{ scrollBehavior: "smooth" }}>
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

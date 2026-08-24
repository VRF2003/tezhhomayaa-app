"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { normalizeSectionData, UniversalSectionData } from "@/lib/types/homepage";
import { getResponsiveTypographyClass, injectTypographyOverrides } from "@/lib/typography";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";

type CollectionBannerProps = {
  categoryKey: string;
  data?: UniversalSectionData; // The loaded universal section data
  sectionId?: string; // Only provided when in admin preview mode
  presentation?: any; // The Smart Collection presentation settings
};

export default function CollectionBanner({ categoryKey, data, sectionId, presentation }: CollectionBannerProps) {
  if (!data) return null;

  const norm = normalizeSectionData(data);
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const layout = isMobile ? norm.layout.mobile : norm.layout.desktop;

  // Drag logic for Admin Preview
  const { handlePointerDown, localPos, isDragging } = useWysiwygDrag({
    sectionId: sectionId || "",
    slideId: "", // Not a slider
    defaultDesktop: { x: norm.layout.desktop.x, y: norm.layout.desktop.y },
    defaultMobile: { x: norm.layout.mobile.x, y: norm.layout.mobile.y }
  });

  const displayX = localPos?.x ?? layout.x;
  const displayY = localPos?.y ?? layout.y;

  const buttonStyleMap: any = {
    filled: "bg-black text-white px-8 py-3 hover:bg-black/80 border border-black",
    outline: "border border-white px-8 py-3 hover:bg-white hover:text-black",
    ghost: "px-8 py-3 hover:bg-white/10",
    luxury: "border-b border-current pb-1 hover:opacity-70 transition-opacity"
  };

  let bannerHeightStyle = "calc(clamp(52vh, 65vh, 78vh) + 80px)";
  if (presentation?.bannerHeight) {
    if (presentation.bannerHeight === "small") bannerHeightStyle = "calc(35vh + 80px)";
    if (presentation.bannerHeight === "medium") bannerHeightStyle = "calc(50vh + 80px)";
    if (presentation.bannerHeight === "large") bannerHeightStyle = "calc(75vh + 80px)";
    if (presentation.bannerHeight === "cinematic") bannerHeightStyle = "100vh";
  }

  return (
    <section 
      ref={containerRef} 
      aria-label={norm.content.heading || ""} 
      className="relative w-full overflow-hidden bg-[#1a1a18]"
      style={{ height: bannerHeightStyle, ...injectTypographyOverrides(norm.typographyOverrides) }}
    >
      {(!norm.media?.desktop?.url && !norm.media?.mobile?.url) && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2a2a28] text-[#9a9690] text-xs uppercase tracking-[0.2em] z-0">
          Upload image or video to preview banner
        </div>
      )}
      
      <UniversalMediaRenderer 
        media={norm.media}
        fallbackDesktopUrl={norm.media.desktop.url}
        fallbackMobileUrl={norm.media.mobile.url}
        className="object-cover object-center absolute inset-0 w-full h-full"
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${norm.style.darkOverlay / 100})` }} />
      {norm.style.gradientOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      )}

      {/* Content */}
      <div 
        onPointerDown={handlePointerDown}
        style={{
          position: "absolute",
          left: `${displayX}%`,
          top: `${displayY}%`,
          transform: `translate(-${displayX}%, -${displayY}%)`,
          width: `${layout.textWidth}%`,
          cursor: isDragging ? "grabbing" : (sectionId && mounted ? "grab" : "default"),
          userSelect: sectionId ? "none" : "auto",
        }}
        className="flex flex-col p-6 z-10"
      >
        {norm.content.subheading && (
          <p 
            className={`tracking-[0.2em] uppercase mb-4 opacity-90 font-medium ${getResponsiveTypographyClass(norm.style.subheading.fontSize)}`}
            style={{ 
              fontWeight: norm.style.subheading.fontWeight,
              fontSize: `${norm.style.subheading.fontSize}rem`,
              letterSpacing: `${norm.style.subheading.letterSpacing}em`,
              lineHeight: norm.style.subheading.lineHeight,
              color: norm.style.subheading.textColor,
              textAlign: norm.style.subheading.align as any,
              textShadow: norm.style.subheading.textShadow === "none" ? "none" : "0 4px 20px rgba(0,0,0,0.3)",
              width: "100%"
            }}
          >
            {norm.content.subheading}
          </p>
        )}
        {norm.content.heading && (
          <h2 style={{ 
            fontFamily: norm.style.fontFamily,
            fontWeight: norm.style.heading.fontWeight,
            fontSize: `${norm.style.heading.fontSize}rem`,
            letterSpacing: `${norm.style.heading.letterSpacing}em`,
            lineHeight: norm.style.heading.lineHeight,
            color: norm.style.heading.textColor,
            textAlign: norm.style.heading.align as any,
            textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
            width: "100%"
          }} className={`mb-4 ${getResponsiveTypographyClass(norm.style.heading.fontSize)}`}>
            {norm.content.heading}
          </h2>
        )}
        {norm.content.description && (
          <p 
            className={`text-editorial whitespace-pre-wrap ${getResponsiveTypographyClass(norm.style.description.fontSize)}`}
            style={{ 
              fontWeight: norm.style.description.fontWeight,
              fontSize: `${norm.style.description.fontSize}rem`,
              letterSpacing: `${norm.style.description.letterSpacing}em`,
              lineHeight: norm.style.description.lineHeight,
              color: norm.style.description.textColor,
              textAlign: norm.style.description.align as any,
              maxWidth: `${norm.style.description.maxWidth}px`,
              marginLeft: norm.style.description.align === "center" ? "auto" : "0", 
              marginRight: norm.style.description.align === "center" ? "auto" : "0",
              textShadow: norm.style.description.textShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            {norm.content.description}
          </p>
        )}
        
        <div className={`flex flex-wrap gap-4 ${layout.align === "left" ? "justify-start" : layout.align === "right" ? "justify-end" : "justify-center"}`}>
          {norm.content.primaryButton.enabled && norm.content.primaryButton.label && (() => {
            const btnUrl = norm.content.primaryButton.url;
            const href = btnUrl && btnUrl !== "#" ? (btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}`) : "";
            
            if (!href) return null;
            
            return (
              <Link 
                href={href} 
                className="hover:opacity-80 transition-opacity"
                style={{
                  fontSize: `${norm.style.button.fontSize}rem`,
                  fontWeight: norm.style.button.fontWeight,
                  padding: norm.style.button.padding,
                  borderRadius: `${norm.style.button.borderRadius}px`,
                  color: norm.style.button.textColor,
                  backgroundColor: norm.style.button.backgroundColor,
                  display: "inline-block",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
                draggable={false}
              >
                {norm.content.primaryButton.label}
              </Link>
            );
          })()}
          {norm.content.secondaryButton.enabled && norm.content.secondaryButton.label && (() => {
            const btnUrl = norm.content.secondaryButton.url;
            const href = btnUrl && btnUrl !== "#" ? (btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}`) : "";
            
            if (!href) return null;
            
            return (
              <Link 
                href={href} 
                className="hover:opacity-80 transition-opacity"
                style={{
                  fontSize: `${norm.style.button.fontSize}rem`,
                  fontWeight: norm.style.button.fontWeight,
                  padding: norm.style.button.padding,
                  borderRadius: `${norm.style.button.borderRadius}px`,
                  color: norm.style.button.textColor,
                  backgroundColor: norm.style.button.backgroundColor,
                  display: "inline-block",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
                draggable={false}
              >
                {norm.content.secondaryButton.label}
              </Link>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

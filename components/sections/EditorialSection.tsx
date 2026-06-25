"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { normalizeSectionData } from "@/lib/types/homepage";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";

export default function EditorialSection({ cmsData, sectionId }: { cmsData?: any, sectionId?: string }) {
  if (!cmsData) return null;

  const norm = normalizeSectionData(cmsData);
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

  // Drag logic
  const { handlePointerDown, localPos, isDragging } = useWysiwygDrag({
    sectionId: sectionId || "",
    slideId: "", // Not a slider
    defaultDesktop: { x: norm.layout.desktop.x, y: norm.layout.desktop.y },
    defaultMobile: { x: norm.layout.mobile.x, y: norm.layout.mobile.y }
  });

  const displayX = localPos?.x ?? layout.x;
  const displayY = localPos?.y ?? layout.y;

  const buttonStyleMap: any = {
    filled: "bg-black text-white px-8 py-3 hover:bg-black/80",
    outline: "border border-white px-8 py-3 hover:bg-white hover:text-black",
    ghost: "px-8 py-3 hover:bg-black/5",
    luxury: "border-b border-white pb-1 hover:text-gray-200 hover:border-gray-200"
  };

  return (
    <section ref={containerRef} aria-label={norm.content.heading || ""} className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
      <UniversalMediaRenderer 
        media={norm.media}
        fallbackDesktopUrl={cmsData.desktopImage || ""}
        fallbackMobileUrl={cmsData.mobileImage || ""}
        fallbackVideoUrl={cmsData.video}
        className="object-cover object-center absolute inset-0 w-full h-full"
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${norm.style.darkOverlay / 100})` }} />
      {norm.style.gradientOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
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
        className="flex flex-col p-6"
      >
        {norm.content.subheading && (
          <p 
            style={{ 
              fontSize: `${norm.style.subheading.fontSize}rem`,
              fontWeight: norm.style.subheading.fontWeight,
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
            fontSize: `${norm.style.heading.fontSize}rem`,
            fontWeight: norm.style.heading.fontWeight,
            letterSpacing: `${norm.style.heading.letterSpacing}em`,
            lineHeight: norm.style.heading.lineHeight,
            color: norm.style.heading.textColor,
            textAlign: norm.style.heading.align as any,
            textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
            width: "100%"
          }} className="mb-4">
            {norm.content.heading}
          </h2>
        )}
        {norm.content.description && (
          <p 
            className="font-light opacity-80"
            style={{ 
              fontSize: `${norm.style.description.fontSize}rem`,
              fontWeight: norm.style.description.fontWeight,
              letterSpacing: `${norm.style.description.letterSpacing}em`,
              lineHeight: norm.style.description.lineHeight,
              color: norm.style.description.textColor,
              textAlign: norm.style.description.align as any,
              maxWidth: `${norm.style.description.maxWidth}px`,
              marginLeft: norm.style.description.align === "center" ? "auto" : "0", 
              marginRight: norm.style.description.align === "center" ? "auto" : "0",
              whiteSpace: "pre-wrap",
              textShadow: norm.style.description.textShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.8)"
            }}
          >
            {norm.content.description}
          </p>
        )}
        
        <div className={`flex flex-wrap gap-4 ${layout.align === "left" ? "justify-start" : layout.align === "right" ? "justify-end" : "justify-center"}`}>
          {norm.content.primaryButton.enabled && norm.content.primaryButton.label && (() => {
            const btnUrl = norm.content.primaryButton.url;
            const href = btnUrl && btnUrl !== "#" ? (btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}`) : "";
            
            if (!href) {
              return null;
            }
            
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
            
            if (!href) {
              return null;
            }
            
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
          {norm.content.tertiaryButton?.enabled && norm.content.tertiaryButton.label && (() => {
            const btnUrl = norm.content.tertiaryButton.url;
            const href = btnUrl && btnUrl !== "#" ? (btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}`) : "";
            
            if (!href) {
              return null;
            }
            
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
                {norm.content.tertiaryButton.label}
              </Link>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { normalizeSectionData } from "@/lib/types/homepage";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";

export default function SplitLayout({ cmsData, sectionId }: { cmsData?: any, sectionId?: string }) {
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

  // Drag logic relative to text block
  const { handlePointerDown, localPos, isDragging } = useWysiwygDrag({
    sectionId: sectionId || "",
    slideId: "", // Not a slider
    defaultDesktop: { x: norm.layout.desktop.x, y: norm.layout.desktop.y },
    defaultMobile: { x: norm.layout.mobile.x, y: norm.layout.mobile.y }
  });

  const displayX = localPos?.x ?? layout.x;
  const displayY = localPos?.y ?? layout.y;

  const ratio = norm.splitLayout?.ratio || "50-50";
  const isImageRight = norm.splitLayout?.layout === "image-right";

  const getGridClasses = () => {
    switch(ratio) {
      case "60-40": return "lg:grid-cols-[60%_40%]";
      case "40-60": return "lg:grid-cols-[40%_60%]";
      case "50-50":
      default: return "lg:grid-cols-2";
    }
  };

  const buttonStyleMap: any = {
    filled: "bg-black text-white px-8 py-3 hover:bg-black/80",
    outline: "border border-black px-8 py-3 hover:bg-black hover:text-white",
    ghost: "px-8 py-3 hover:bg-black/5",
    luxury: "border-b border-black pb-1 hover:text-brand hover:border-brand"
  };

  return (
    <section aria-label={norm.content.heading || ""} className="w-full bg-[#fafaf8]">
      <div className={`grid grid-cols-1 ${getGridClasses()} min-h-[600px] lg:min-h-[80vh]`}>
        
        {/* Media Block */}
        <div className={`relative w-full h-[50vh] lg:h-full ${isImageRight ? "lg:order-last" : ""}`}>
          <UniversalMediaRenderer 
            media={norm.media}
            fallbackDesktopUrl={cmsData.desktopImage || ""}
            fallbackMobileUrl={cmsData.mobileImage || ""}
            fallbackVideoUrl={cmsData.video}
            className="object-cover absolute inset-0 w-full h-full"
          />
        </div>

        {/* Text Block - Absolute positioning bounds */}
        <div ref={containerRef as any} className="relative w-full h-[50vh] lg:h-full bg-[#fafaf8] overflow-hidden">
          <div 
            onPointerDown={handlePointerDown}
            style={{
              position: "absolute",
              left: `${displayX}%`,
              top: `${displayY}%`,
              transform: `translate(-${displayX}%, -${displayY}%)`,
              width: `${layout.textWidth}%`,
              textAlign: layout.align as any,
              color: norm.style.textColor === "#ffffff" ? "#1a1a18" : norm.style.textColor, // Auto adjust if defaulting to white on white bg
              textShadow: norm.style.textShadow === "soft" ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
              cursor: isDragging ? "grabbing" : (sectionId && mounted ? "grab" : "default"),
              userSelect: sectionId ? "none" : "auto",
            }}
            className="flex flex-col p-6 lg:p-12"
          >
            {norm.content.subheading && (
              <p 
                className="tracking-[0.2em] uppercase mb-4 opacity-70 font-medium text-gray-500"
                style={{ 
                  fontSize: `${norm.style.subheading.fontSize}rem`,
                  fontWeight: norm.style.subheading.fontWeight,
                  letterSpacing: `${norm.style.subheading.letterSpacing}em`,
                  lineHeight: norm.style.subheading.lineHeight,
                  color: norm.style.subheading.textColor,
                  textAlign: norm.style.subheading.align as any,
                  textShadow: norm.style.subheading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
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
                textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
                width: "100%"
              }} className="mb-4">
                {norm.content.heading}
              </h2>
            )}
            {norm.content.italicHeading && (
              <h3 style={{ 
                fontFamily: "var(--font-serif), serif",
                fontStyle: "italic",
                fontSize: `${norm.style.heading.fontSize * 1.25}rem`,
                fontWeight: 300,
                letterSpacing: `0.02em`,
                lineHeight: 1.2,
                color: norm.style.heading.textColor,
                textAlign: norm.style.heading.align as any,
                textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
                width: "100%"
              }} className="mb-6">
                {norm.content.italicHeading}
              </h3>
            )}
            {norm.content.description && (
              <div 
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
                  textShadow: norm.style.description.textShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                {norm.content.description.includes("<") && norm.content.description.includes(">") ? (
                  <div dangerouslySetInnerHTML={{ __html: norm.content.description }} className="prose prose-sm prose-p:my-2 prose-table:my-4 prose-th:bg-gray-100 prose-td:border prose-th:border prose-th:p-2 prose-td:p-2 w-full max-w-none" />
                ) : (
                  <p className="whitespace-pre-wrap m-0">{norm.content.description}</p>
                )}
              </div>
            )}
            
            <div className={`flex flex-wrap gap-4 ${layout.align === "left" ? "justify-start" : layout.align === "right" ? "justify-end" : "justify-center"}`}>
              {norm.content.primaryButton.enabled && norm.content.primaryButton.label && (() => {
                const btnUrl = norm.content.primaryButton.url;
                console.log("SplitLayout Primary URL", norm.content.heading, btnUrl);
                const href = btnUrl && btnUrl !== "#" ? btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}` : "";
                
                if (!href) return null;
                
                return (
                  <Link 
                    href={href} 
                    className={`inline-block text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${buttonStyleMap[norm.content.primaryButton.style]}`}
                    draggable={false}
                  >
                    {norm.content.primaryButton.label}
                  </Link>
                );
              })()}
              {norm.content.secondaryButton.enabled && norm.content.secondaryButton.label && (() => {
                const btnUrl = norm.content.secondaryButton.url;
                console.log("SplitLayout Secondary URL", norm.content.heading, btnUrl);
                const href = btnUrl && btnUrl !== "#" ? btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}` : "";
                
                if (!href) return null;
                
                return (
                  <Link 
                    href={href} 
                    className={`inline-block text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${buttonStyleMap[norm.content.secondaryButton.style]}`}
                    draggable={false}
                  >
                    {norm.content.secondaryButton.label}
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

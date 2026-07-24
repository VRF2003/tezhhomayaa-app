"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { normalizeSectionData } from "@/lib/types/homepage";
import { getResponsiveTypographyClass, injectTypographyOverrides } from "@/lib/typography";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";
import { Observability } from "@/lib/infrastructure/observability";

export default function SingleCampaignBanner({ cmsData, sectionId }: { cmsData?: any, sectionId?: string }) {
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

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
    outline: "border border-black px-8 py-3 hover:bg-black hover:text-white",
    ghost: "px-8 py-3 hover:bg-black/5",
    luxury: "border-b border-black pb-1 hover:text-brand hover:border-brand"
  };

  const mAuto = norm.layout.mobile.height === 0;
  const dAuto = norm.layout.desktop.height === 0;
  const safeId = sectionId || `banner-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <section 
      ref={containerRef}
      id={`banner-${safeId}`}
      className="relative w-full bg-[#1a1a18] flex flex-col"
      style={injectTypographyOverrides(norm.typographyOverrides)}
    >
      <style>{`
        #banner-${safeId} {
          height: ${mAuto ? 'auto' : `${norm.layout.mobile.height}dvh`};
          min-height: ${mAuto ? 'auto' : '300px'};
        }
        #banner-${safeId} .banner-media-container > div {
          position: ${mAuto ? 'relative' : 'absolute'} !important;
          height: ${mAuto ? 'auto' : '100%'} !important;
        }
        #banner-${safeId} .banner-media-container video, 
        #banner-${safeId} .banner-media-container img {
          object-fit: ${mAuto ? 'contain' : 'cover'} !important;
          height: ${mAuto ? 'auto' : '100%'} !important;
          position: ${mAuto ? 'relative' : 'absolute'} !important;
        }
        @media (min-width: 768px) {
          #banner-${safeId} {
            height: ${dAuto ? 'auto' : `${norm.layout.desktop.height}dvh`};
            min-height: ${dAuto ? 'auto' : '500px'};
          }
          #banner-${safeId} .banner-media-container > div {
            position: ${dAuto ? 'relative' : 'absolute'} !important;
            height: ${dAuto ? 'auto' : '100%'} !important;
          }
          #banner-${safeId} .banner-media-container video, 
          #banner-${safeId} .banner-media-container img {
            object-fit: ${dAuto ? 'contain' : 'cover'} !important;
            height: ${dAuto ? 'auto' : '100%'} !important;
            position: ${dAuto ? 'relative' : 'absolute'} !important;
          }
        }
      `}</style>

      <div className="banner-media-container w-full h-full absolute inset-0">
        <UniversalMediaRenderer 
          media={norm.media}
          fallbackDesktopUrl={cmsData.image || ""}
          fallbackMobileUrl={cmsData.image || ""}
          fill={true}
        />
      </div>
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${norm.style.darkOverlay / 100})` }} />
      {norm.style.gradientOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      )}

      {/* Content */}
      <div 
        onPointerDown={handlePointerDown}
        style={{
          position: "sticky",
          bottom: "2rem", // Sticky to the bottom of the viewport
          width: `${layout.textWidth}%`,
          marginTop: "auto", 
          paddingBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Force contents to be centered
          textAlign: "center",
          alignSelf: "center", // Center this container inside the parent flex section
          zIndex: 10
        }}
        className="p-6"
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
            Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("SingleCampaignBanner Primary URL", { heading: norm.content.heading, btnUrl });
            const href = btnUrl && btnUrl !== "#" ? btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}` : "";
            
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
                  backgroundColor: (() => {
                    const hex = norm.style.button.backgroundColor.replace('#', '');
                    if (hex.length !== 6 && hex.length !== 3) return norm.style.button.backgroundColor;
                    const fullHex = hex.length === 3 ? hex.split('').map(x => x + x).join('') : hex;
                    const r = parseInt(fullHex.substring(0, 2), 16);
                    const g = parseInt(fullHex.substring(2, 4), 16);
                    const b = parseInt(fullHex.substring(4, 6), 16);
                    const opacity = (norm.style.button.backgroundOpacity ?? 100) / 100;
                    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                  })(),
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid currentColor",
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
            Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("SingleCampaignBanner Secondary URL", { heading: norm.content.heading, btnUrl });
            const href = btnUrl && btnUrl !== "#" ? btnUrl.startsWith('/') || btnUrl.startsWith('http') ? btnUrl : `/${btnUrl}` : "";
            
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
                  backgroundColor: (() => {
                    const hex = norm.style.button.backgroundColor.replace('#', '');
                    if (hex.length !== 6 && hex.length !== 3) return norm.style.button.backgroundColor;
                    const fullHex = hex.length === 3 ? hex.split('').map(x => x + x).join('') : hex;
                    const r = parseInt(fullHex.substring(0, 2), 16);
                    const g = parseInt(fullHex.substring(2, 4), 16);
                    const b = parseInt(fullHex.substring(4, 6), 16);
                    const opacity = (norm.style.button.backgroundOpacity ?? 100) / 100;
                    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                  })(),
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid currentColor",
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

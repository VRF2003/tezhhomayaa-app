"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UniversalMediaRenderer from "@/components/sections/UniversalMediaRenderer";
import { getResponsiveTypographyClass, injectTypographyOverrides } from "@/lib/typography";
import { useWysiwygDrag } from "@/components/ui/useWysiwygDrag";
import { normalizeSectionData } from "@/lib/types/homepage";

const slides: any[] = [];

const INTERVAL = 6200;

const shadowMap: any = {
  none: "none",
  soft: "0 4px 20px rgba(0,0,0,0.5)",
  hard: "0 2px 4px rgba(0,0,0,0.8)",
};

export default function HeroFilm({ cmsData, sectionId }: { cmsData?: any, sectionId?: string }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const displaySlides = React.useMemo(() => {
    if (!cmsData) return slides;
    if (cmsData.video) {
      return [{
        id: "video-slide",
        image: "",
        video: cmsData.video,
        media: cmsData.media,
        preLabel: "",
        title: "",
        titleItalic: "",
        sub: "",
        cta: "",
        ctaUrl: "",
        position: "object-center",
        filter: "brightness(0.98) contrast(1.05) saturate(0.85)",
        x: 8, y: 70, mobileX: 8, mobileY: 70, width: 100, textColor: "#ffffff", fontSize: 4, fontWeight: 300, letterSpacing: 0, lineHeight: 1.1, shadow: "none", gradientOverlay: false, overlayStrength: 0, buttonStyle: "luxury", animation: "slide-up",
        norm: normalizeSectionData({})
      }];
    }
    if (cmsData.slides && cmsData.slides.length > 0) {
      return cmsData.slides.map((s: any, idx: number) => {
        const norm = normalizeSectionData(s);
        return {
          id: s.id || `s-${idx}`,
          norm: norm,
          image: norm.media.desktop.url || "",
          mobileImage: norm.media.mobile.url || norm.media.desktop.url || "",
          video: null,
          media: norm.media,
          preLabel: norm.content.subheading || "",
          title: norm.content.heading || "",
          titleItalic: norm.content.italicHeading || "",
          sub: norm.content.description || "",
          cta: norm.content.primaryButton.label || "",
          ctaUrl: norm.content.primaryButton.url || "#collection",
          ctaEnabled: norm.content.primaryButton.enabled !== false,
          secondaryCta: norm.content.secondaryButton.label || "",
          secondaryCtaUrl: norm.content.secondaryButton.url || "",
          secondaryCtaEnabled: norm.content.secondaryButton.enabled === true,
          position: "object-center",
          filter: "brightness(0.98) contrast(1.05) saturate(0.85)",
          x: norm.layout.desktop.x,
          y: norm.layout.desktop.y,
          mobileX: norm.layout.mobile.x,
          mobileY: norm.layout.mobile.y,
          width: norm.layout.desktop.textWidth,
          textColor: norm.style.textColor,
          fontSize: norm.style.fontSize,
          fontWeight: norm.style.fontWeight,
          letterSpacing: norm.style.letterSpacing,
          lineHeight: norm.style.lineHeight,
          shadow: norm.style.textShadow,
          gradientOverlay: norm.style.gradientOverlay,
          overlayStrength: norm.style.darkOverlay || norm.style.lightOverlay || (s.overlayStrength ?? 15),
          buttonStyle: norm.content.primaryButton.style || "luxury",
          animation: norm.animation?.type || s.animation || "slide-up"
        };
      });
    }
    return slides;
  }, [cmsData]);

  const next = useCallback(() => {
    const n = (current + 1) % displaySlides.length;
    setDirection(1);
    setCurrent(n);
  }, [current, displaySlides.length]);

  useEffect(() => {
    timerRef.current = setInterval(next, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, INTERVAL);
  };

  const slide = displaySlides.length > 0 ? (displaySlides[current] || displaySlides[0]) : null;

  if (!slide) return null;

  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const getTextVariants = (anim: string) => {
    switch(anim) {
      case "fade": return { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };
      case "slide-left": return { enter: { opacity: 0, x: 30 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };
      case "slide-right": return { enter: { opacity: 0, x: -30 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 30 } };
      case "none": return { enter: { opacity: 1 }, center: { opacity: 1 }, exit: { opacity: 1 } };
      case "slide-up":
      default: return { enter: { opacity: 0, y: 18 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
    }
  };

  const textVariants = getTextVariants(slide.animation);

  const getButtonStyle = (styleType: string, color: string) => {
    const isWhiteText = color === "#ffffff" || color.toLowerCase() === "#fff";
    const contrastColor = isWhiteText ? "#1a1a18" : "#ffffff";
    
    switch(styleType) {
      case "filled": return { background: color, color: contrastColor, padding: "0.6rem 1.4rem", textDecoration: "none", transition: "opacity 0.2s ease" };
      case "outline": return { background: "transparent", color: color, border: `1px solid ${color}`, padding: "0.6rem 1.4rem", textDecoration: "none", transition: "opacity 0.2s ease" };
      case "ghost": return { background: "transparent", color: color, padding: "0.6rem 1.4rem", textDecoration: "none", transition: "opacity 0.2s ease" };
      case "luxury":
      default: return { borderBottom: `1px solid ${color}`, paddingBottom: "3px", textDecoration: "none", color: color, transition: "opacity 0.2s ease" };
    }
  };

  const { containerRef, localPos, isDragging, handlePointerDown, isPreviewMode, mounted } = useWysiwygDrag({
    sectionId,
    slideId: slide.id,
    defaultDesktop: { x: slide.x, y: slide.y },
    defaultMobile: { x: slide.mobileX, y: slide.mobileY }
  });

  return (
    <section
      id="hero"
      aria-label="Tezhhomayaa hero showcase"
      className="relative w-full overflow-hidden bg-black"
      style={injectTypographyOverrides(slide.norm?.typographyOverrides)}
    >
      <style>{`
        #hero {
          height: var(--mobile-hero-height, 75dvh);
        }
        @media (min-width: 768px) {
          #hero {
            height: 100dvh;
          }
        }
        .hero-text-pos {
          left: var(--mobile-x, 50%);
          top: var(--mobile-y, 50%);
          transform: translate(-50%, -50%);
        }
        @media (min-width: 768px) {
          .hero-text-pos {
            left: var(--desktop-x, 50%);
            top: var(--desktop-y, 50%);
          }
        }
      `}</style>

      {/* ── Slides ─────────────────────────────────────────── */}
      {displaySlides.map((slide: any, idx: number) => {
          if (idx !== current) return null;
          const norm = slide.norm || normalizeSectionData({});

          return (
            <motion.div
              key={`media-${slide.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
            >
              <UniversalMediaRenderer 
                media={slide.media}
                fallbackDesktopUrl={slide.image}
                fallbackMobileUrl={slide.mobileImage || slide.image}
                fallbackVideoUrl={slide.video}
                priority={slide.id === "s1" || current === 0}
                className={`object-cover ${slide.position}`}
                style={{ filter: slide.filter }}
              />

          {/* Dynamic Image Overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${(slide.overlayStrength || 0) / 100})` }} />
          {slide.gradientOverlay && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          )}
          
      {/* ── Text Content ───────────────────────────────────── */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="hero-text-pos absolute flex flex-col items-center justify-center text-center px-4 md:px-0 pb-0"
        style={(isDragging ? {
          left: `${localPos.x}%`,
          top: `${localPos.y}%`,
          width: `calc(${slide.width}% - 2rem)`,
          maxWidth: "72rem",
          color: slide.textColor,
          textShadow: shadowMap[slide.shadow || "none"],
          cursor: "move",
          border: "1px dashed rgba(255,255,255,0.8)",
          padding: "20px",
          touchAction: "none"
        } : {
          "--desktop-x": `${slide.x}%`,
          "--desktop-y": `${slide.y}%`,
          "--mobile-x": `${slide.mobileX}%`,
          "--mobile-y": `${slide.mobileY}%`,
          width: `calc(${slide.width}% - 2rem)`,
          maxWidth: "72rem",
          color: slide.textColor,
          textShadow: shadowMap[slide.shadow || "none"],
          cursor: (mounted && isPreviewMode) ? "move" : "default"
        }) as React.CSSProperties}
      >
            <AnimatePresence mode="wait" key={`text-wrap-${slide.id}`}>
              <motion.div
                key={`text-${slide.id}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ pointerEvents: isDragging ? "none" : "auto" }}
              >
            {/* Subheading */}
            {norm.content.subheading && (
              <p 
                  className={`tracking-[0.2em] uppercase mb-4 opacity-90 font-medium drop-shadow-sm ${getResponsiveTypographyClass(norm.style.subheading.fontSize)}`}
                  style={{ 
                    fontWeight: norm.style.subheading.fontWeight,
                    letterSpacing: `${norm.style.subheading.letterSpacing}em`,
                    lineHeight: norm.style.subheading.lineHeight,
                    color: norm.style.subheading.textColor,
                    textAlign: norm.style.subheading.align as any,
                    textShadow: norm.style.subheading.textShadow === "none" ? "none" : "0 1px 4px rgba(0,0,0,0.4)"
                  }}
              >
                {norm.content.subheading}
              </p>
            )}

            {/* Headline */}
            {(norm.content.heading) && (
              <h2 
                style={{ 
                  fontFamily: norm.style.fontFamily,
                  fontWeight: norm.style.heading.fontWeight,
                  letterSpacing: `${norm.style.heading.letterSpacing}em`,
                  lineHeight: norm.style.heading.lineHeight,
                  color: norm.style.heading.textColor,
                  textAlign: norm.style.heading.align as any,
                  textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
                  width: "100%"
                }}
                className={`mb-6 ${getResponsiveTypographyClass(norm.style.heading.fontSize)}`}
              >{norm.content.heading}
              </h2>
            )}

            {/* Description */}
            {norm.content.description && (
              <p 
                className={`text-editorial whitespace-pre-wrap max-w-[800px] drop-shadow-md ${getResponsiveTypographyClass(norm.style.description.fontSize)}`}
                style={{ 
                  fontWeight: norm.style.description.fontWeight,
                  letterSpacing: `${norm.style.description.letterSpacing}em`,
                  lineHeight: norm.style.description.lineHeight,
                  color: norm.style.description.textColor,
                  textAlign: norm.style.description.align as any,
                  maxWidth: `${norm.style.description.maxWidth}px`,
                  marginLeft: norm.style.description.align === "center" ? "auto" : "0", 
                  marginRight: norm.style.description.align === "center" ? "auto" : "0",
                  textShadow: norm.style.description.textShadow === "none" ? "none" : "0 1px 4px rgba(0,0,0,0.4)"
                }}
              >
                {norm.content.description}
              </p>
            )}

            {/* CTA */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {slide.ctaEnabled && slide.cta && (() => {
                const href = slide.ctaUrl && slide.ctaUrl !== "#" ? slide.ctaUrl.startsWith('/') || slide.ctaUrl.startsWith('http') ? slide.ctaUrl : `/${slide.ctaUrl}` : "";
                if (!href) {
                  return null;
                }
                return (
                  <Link 
                    href={href}
                    className={`inline-block text-xs tracking-[0.2em] uppercase mt-2 md:mt-0 hover:opacity-70`}
                    style={{ ...getButtonStyle(slide.buttonStyle || "luxury", slide.textColor), pointerEvents: "auto" }}
                    draggable={false}
                    onClick={e => isPreviewMode && e.preventDefault()}
                  >
                    {slide.cta}
                  </Link>
                );
              })()}
              {slide.secondaryCtaEnabled && slide.secondaryCta && (() => {
                const href = slide.secondaryCtaUrl && slide.secondaryCtaUrl !== "#" ? slide.secondaryCtaUrl.startsWith('/') || slide.secondaryCtaUrl.startsWith('http') ? slide.secondaryCtaUrl : `/${slide.secondaryCtaUrl}` : "";
                if (!href) {
                  return null;
                }
                return (
                  <Link 
                    href={href}
                    className={`inline-block text-xs tracking-[0.2em] uppercase mt-2 md:mt-0 hover:opacity-70`}
                    style={{ 
                      ...getButtonStyle(slide.buttonStyle || "luxury", slide.textColor), 
                      pointerEvents: "auto",
                      opacity: slide.buttonStyle === "luxury" ? 0.6 : 1 
                    }}
                    draggable={false}
                    onClick={e => isPreviewMode && e.preventDefault()}
                  >
                    {slide.secondaryCta}
                  </Link>
                );
              })()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
            </motion.div>
          );
        })}

      {/* ── Progress Indicators ─────────────────────────────── */}
      <div
        className="absolute bottom-8 md:bottom-10 right-8 md:right-16 flex flex-col items-end gap-2.5 z-10"
        role="tablist"
        aria-label="Slide selector"
      >
        {displaySlides.map((s: any, i: number) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            id={`hero-slide-btn-${i}`}
            onClick={() => { goTo(i); resetTimer(); }}
            style={{
              background: "none",
              border: "none",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              className="text-label"
              style={{
                color: i === current ? "var(--brand)" : "transparent",
                fontSize: "0.45rem",
                letterSpacing: "0.15em",
                transition: "color 0.3s ease",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                display: "block",
                height: "1px",
                width: i === current ? "32px" : "16px",
                background: i === current ? "var(--brand)" : "rgba(255,255,255,0.4)",
                transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.3s ease",
              }}
            />
          </button>
        ))}
      </div>

      {/* Auto-progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ height: "1px", background: "rgba(255,255,255,0.1)" }}
        aria-hidden="true"
      >
        <motion.div
          key={current}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: INTERVAL / 1000, ease: "linear" }}
          style={{
            height: "100%",
            background: "var(--brand)",
            transformOrigin: "left center",
          }}
        />
      </div>
    </section>
  );
}

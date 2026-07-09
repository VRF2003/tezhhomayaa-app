"use client";

import React, { useState, useEffect, useRef } from "react";
import { UniversalSectionData } from "@/lib/types/homepage";
import Link from "next/link";

interface BlockProps {
  section: UniversalSectionData;
}

const useUniversalStyle = (section: UniversalSectionData) => {
  const [isVisible, setIsVisible] = useState(!section.animation?.scrollTrigger);
  const d = section.layout?.desktop || {};
  const s = section.style || {};
  const a = section.animation || { type: "none" as const, duration: 0, delay: 0, easing: "ease", scrollTrigger: false };
  const adv = section.advanced || {};

  useEffect(() => {
    if (a.scrollTrigger) {
      setTimeout(() => setIsVisible(true), a.delay || 100);
    }
  }, [a]);

  let transform = "none";
  let opacity = 1;

  if (a.type !== "none" && !isVisible) {
    opacity = 0;
    if (a.type === "slide-up") transform = "translateY(40px)";
    if (a.type === "slide-left") transform = "translateX(40px)";
    if (a.type === "scale") transform = "scale(0.95)";
  }

  return {
    wrapper: {
      padding: d.padding || "6rem 0",
      margin: d.margin || "0px",
      backgroundColor: s.backgroundColor || "transparent",
      position: adv.sticky ? "sticky" : "relative",
      top: adv.sticky ? "0px" : "auto",
      zIndex: adv.zIndex || 1,
    } as React.CSSProperties,
    id: adv.anchorId as string | undefined,
    className: adv.customCssClass as string | undefined,
    
    content: {
      maxWidth: d.textWidth ? `${d.textWidth}%` : "100%",
      textAlign: (d.align || "left") as any,
      color: s.textColor || "inherit",
      opacity,
      transform,
      transition: `all ${a.duration || 700}ms ${a.easing || "cubic-bezier(0.25, 1, 0.5, 1)"} ${a.delay || 0}ms`,
    } as React.CSSProperties
  };
};

export const AdvBeforeAfter = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-5xl text-center">
        {section.content?.heading && <h2 className="mb-8" style={{ 
          fontSize: `${section.style?.heading?.fontSize}rem`,
          fontWeight: section.style?.heading?.fontWeight,
          color: section.style?.heading?.textColor,
          letterSpacing: `${section.style?.heading?.letterSpacing}em`,
          textAlign: section.style?.heading?.align as any
        }}>{section.content.heading}</h2>}
        
        <div 
          ref={containerRef}
          className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden cursor-ew-resize select-none"
          onMouseMove={(e) => handleMove(e.clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        >
          {/* After Image (Background) */}
          <img src="https://images.unsplash.com/photo-1515347619362-74917537b03a?auto=format&fit=crop&q=80&w=1200" alt="After" className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Before Image (Clipped) */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200" alt="Before" className="absolute inset-0 w-full h-full object-cover min-w-max" style={{ width: containerRef.current?.clientWidth || '100vw' }} />
          </div>

          {/* Slider Line */}
          <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] transform -translate-x-1/2 flex items-center justify-center pointer-events-none" style={{ left: `${sliderPos}%` }}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="flex gap-1">
                <div className="w-0.5 h-3 bg-gray-400" />
                <div className="w-0.5 h-3 bg-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdvAudioBlock = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-md bg-white border border-gray-200 p-6 shadow-sm flex items-center gap-6">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>
        <div>
          <h3 className="text-sm font-medium tracking-wide">Campaign Soundtrack</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">FW26 Collection</p>
        </div>
      </div>
    </div>
  );
};

export const AdvStoreLocator = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const stores = [
    { city: "Paris", address: "Rue Saint-Honoré", hours: "10:00 - 19:00" },
    { city: "London", address: "Bond Street", hours: "10:00 - 18:30" },
    { city: "Tokyo", address: "Ginza", hours: "11:00 - 20:00" }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="mb-8" style={{ 
            fontSize: `${section.style?.heading?.fontSize}rem`,
            fontWeight: section.style?.heading?.fontWeight,
            color: section.style?.heading?.textColor,
            letterSpacing: `${section.style?.heading?.letterSpacing}em`,
            textAlign: section.style?.heading?.align as any
          }}>{section.content?.heading || "Flagship Boutiques"}</h2>
          <div className="space-y-6">
            {stores.map((s, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 group cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium group-hover:text-gray-600 transition-colors">{s.city}</h3>
                  <span className="text-xs uppercase tracking-widest text-gray-400">View Map</span>
                </div>
                <p className="text-sm text-gray-500 font-light">{s.address}</p>
                <p className="text-xs text-gray-400 mt-2">Open today: {s.hours}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#f0ece6] aspect-square flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest">
          [ Map Integration Placeholder ]
        </div>
      </div>
    </div>
  );
};

export const AdvEventCountdown = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">{section.content?.subheading || "Upcoming Event"}</p>
        <h2 className="mb-12" style={{ 
          fontSize: `${section.style?.heading?.fontSize}rem`,
          fontWeight: section.style?.heading?.fontWeight,
          color: section.style?.heading?.textColor,
          letterSpacing: `${section.style?.heading?.letterSpacing}em`,
          textAlign: section.style?.heading?.align as any
        }}>{section.content?.heading || "The FW26 Runway Show"}</h2>
        
        <div className="flex justify-center gap-8 md:gap-16 text-center">
          {[
            { label: "Days", val: "14" },
            { label: "Hours", val: "08" },
            { label: "Minutes", val: "45" },
            { label: "Seconds", val: "22" }
          ].map((t, i) => (
            <div key={i}>
              <p className="text-5xl md:text-7xl font-light mb-2">{t.val}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{t.label}</p>
            </div>
          ))}
        </div>
        
        {section.content?.primaryButton?.enabled && (
          <Link href={section.content.primaryButton.url} className="inline-block mt-16 text-xs uppercase tracking-[0.2em] bg-black text-white px-10 py-4 hover:bg-gray-800 transition-colors duration-500">
            {section.content.primaryButton.label}
          </Link>
        )}
      </div>
    </div>
  );
};

export const AdvBentoGrid = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-[800px]">
          
          <div className="md:col-span-2 md:row-span-2 bg-[#f0ece6] relative group overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1515347619362-74917537b03a?w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs uppercase tracking-widest mb-2 opacity-90">Editorial</p>
              <h3 className="text-3xl font-light">The New Standard</h3>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-gray-100 relative group overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute bottom-6 left-6 bg-white px-4 py-2">
              <p className="text-[10px] uppercase tracking-widest">Shop Collection</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8 flex flex-col justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <h3 className="text-xl font-light mb-4">Values</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Sustainability Report</p>
          </div>

          <div className="bg-[#1a1a18] text-white p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-black transition-colors">
            <h3 className="text-2xl font-light mb-6">Join The House</h3>
            <button className="text-xs uppercase tracking-widest border-b border-white pb-1">Subscribe</button>
          </div>

        </div>
      </div>
    </div>
  );
};

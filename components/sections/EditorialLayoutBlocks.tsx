"use client";

import React, { useState, useEffect } from "react";
import { UniversalSectionData } from "@/lib/types/homepage";
import Link from "next/link";

interface BlockProps {
  section: UniversalSectionData;
}

// Reuse the universal style hook
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

export const AdvAwards = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const awards = ["LVMH Prize Nominee", "CFDA Emerging Designer", "Vogue Fashion Fund", "Green Carpet Challenge"];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-5xl text-center">
        <h2 className="mb-12 uppercase" style={{ 
          fontSize: `${section.style?.heading?.fontSize}rem`,
          fontWeight: section.style?.heading?.fontWeight,
          color: section.style?.heading?.textColor,
          letterSpacing: `${section.style?.heading?.letterSpacing}em`,
          textAlign: section.style?.heading?.align as any
        }}>{section.content?.heading || "Awards & Recognition"}</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {awards.map((a, i) => (
            <p key={i} className="text-sm font-medium tracking-[0.1em] uppercase whitespace-nowrap">{a}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvPressLogos = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const logos = ["VOGUE", "HARPER'S BAZAAR", "WALLPAPER*", "GQ", "MONOCLE", "DAZED"];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-6xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-10">{section.content?.heading || "As featured in"}</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale">
          {logos.map((logo, i) => (
            <span key={i} className="text-xl md:text-2xl font-serif tracking-widest">{logo}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvSustainability = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[3/4] bg-[#f0ece6] overflow-hidden">
            <img src={section.desktopImage || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"} alt="Sustainability" className="w-full h-full object-cover" />
          </div>
          <div className="p-4 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">{section.content?.subheading || "Conscious Craftsmanship"}</p>
            <h2 className="mb-8 leading-tight" style={{ 
              fontSize: `${section.style?.heading?.fontSize}rem`,
              fontWeight: section.style?.heading?.fontWeight,
              color: section.style?.heading?.textColor,
              letterSpacing: `${section.style?.heading?.letterSpacing}em`,
              textAlign: section.style?.heading?.align as any
            }}>{section.content?.heading || "Designing for Tomorrow"}</h2>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-8">
              {section.content?.description || "We are committed to reducing our environmental impact without compromising the structural integrity and aesthetic purity of our garments. By 2030, all our collections will be crafted entirely from circular materials."}
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-2xl font-light mb-2">100%</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Organic Cotton</p>
              </div>
              <div>
                <p className="text-2xl font-light mb-2">Zero</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Single-use Plastic</p>
              </div>
            </div>
            <Link href="#" className="inline-block border-b border-black pb-1 text-xs uppercase tracking-widest hover:text-gray-500 transition-colors">
              Read Our Impact Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdvBrandValues = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const values = [
    { title: "Purity", desc: "Minimalism is not a lack of something, it is the perfect amount of something." },
    { title: "Craft", desc: "Every seam, stitch, and fold is executed with uncompromising precision." },
    { title: "Longevity", desc: "Designing outside of the seasonal trend cycle to create permanent staples." }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-6xl text-center">
        <h2 className="mb-16" style={{ 
          fontSize: `${section.style?.heading?.fontSize}rem`,
          fontWeight: section.style?.heading?.fontWeight,
          color: section.style?.heading?.textColor,
          letterSpacing: `${section.style?.heading?.letterSpacing}em`,
          textAlign: section.style?.heading?.align as any
        }}>{section.content?.heading || "The Philosophy"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((v, i) => (
            <div key={i} className="p-8 border border-gray-100 bg-[#fcfbf9] hover:bg-white transition-colors duration-500 shadow-sm">
              <h3 className="text-lg font-light tracking-widest uppercase mb-4">{v.title}</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

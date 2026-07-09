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
      padding: d.padding || "4rem 0",
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

export const AdvTimeline = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const milestones = section.items?.length ? section.items : [
    { subtitle: "1982", title: "The Foundation", description: "The house was established." },
    { subtitle: "1995", title: "Global Expansion", description: "Opened the first flagship in Paris." },
    { subtitle: "2010", title: "Creative Direction", description: "A new era of design began." }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-5xl">
        <h2 className="mb-16" style={{ 
          fontSize: `${section.style?.heading?.fontSize}rem`,
          fontWeight: section.style?.heading?.fontWeight,
          color: section.style?.heading?.textColor,
          letterSpacing: `${section.style?.heading?.letterSpacing}em`,
          textAlign: section.style?.heading?.align as any
        }}>{section.content?.heading || "Our Heritage"}</h2>
        <div className="relative border-l border-gray-200 ml-4 md:ml-1/2">
          {milestones.map((m: any, i: number) => (
            <div key={i} className="mb-16 ml-8 relative group cursor-default">
              <div className="absolute -left-[37px] top-1 w-3 h-3 bg-black rounded-full group-hover:scale-150 transition-transform duration-500" />
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{m.subtitle}</p>
              <h3 className="text-xl font-light mb-2">{m.title}</h3>
              <p className="text-sm text-gray-600 font-light max-w-md" dangerouslySetInnerHTML={{ __html: m.description || "" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvStatistics = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const stats = section.items?.length ? section.items : [
    { title: "45+", subtitle: "Flagship Boutiques" },
    { title: "1982", subtitle: "Year Established" },
    { title: "100%", subtitle: "Traceable Materials" }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {stats.map((s: any, i: number) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-6xl font-light mb-4">{s.title}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvFAQ = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = section.items?.length ? section.items : [
    { title: "What is your return policy?", description: "Returns are accepted within 30 days of purchase in original condition." },
    { title: "Do you offer international shipping?", description: "Yes, we ship to over 100 countries globally via priority courier." },
    { title: "How can I book a styling appointment?", description: "You can book directly through our Contact page or by emailing our concierge." }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-3xl">
        <h2 className="mb-12" style={{ 
          fontSize: `${section.style?.heading?.fontSize}rem`,
          fontWeight: section.style?.heading?.fontWeight,
          color: section.style?.heading?.textColor,
          letterSpacing: `${section.style?.heading?.letterSpacing}em`,
          textAlign: section.style?.heading?.align as any
        }}>{section.content?.heading || "Frequently Asked Questions"}</h2>
        <div className="border-t border-gray-200">
          {faqs.map((faq: any, i: number) => (
            <div key={i} className="border-b border-gray-200 py-6">
              <button 
                className="w-full flex justify-between items-center text-left hover:text-gray-600 transition-colors focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg font-light tracking-wide">{faq.title}</span>
                <span className="text-2xl font-light ml-4">{openIndex === i ? "−" : "+"}</span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${openIndex === i ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
              >
                <div className="text-sm font-light text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.description || "" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvTabs = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const [activeTab, setActiveTab] = useState(0);
  const items = section.items?.length ? section.items : [
    { title: "Details", description: "Expertly tailored for a flawless fit, featuring signature minimalist hardware." },
    { title: "Materials", description: "100% Traceable organic cotton and recycled silk lining." },
    { title: "Shipping", description: "Complimentary express shipping on all orders over $500." }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-3xl flex flex-col items-center text-center">
        <div className="flex gap-8 border-b border-gray-200 mb-8 w-full justify-center">
          {items.map((t: any, i: number) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(i)}
              className={`pb-4 text-xs uppercase tracking-widest transition-colors relative ${activeTab === i ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t.title}
              {activeTab === i && <div className="absolute bottom-0 left-0 w-full h-px bg-black" />}
            </button>
          ))}
        </div>
        <div className="text-sm font-light text-gray-600 leading-relaxed min-h-[100px] flex items-center justify-center transition-opacity duration-500">
          <div dangerouslySetInnerHTML={{ __html: items[activeTab]?.description || "" }} />
        </div>
      </div>
    </div>
  );
};

export const AdvTable = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const headers = section.items?.length ? section.items[0] : { title: "Size", subtitle: "Chest (cm)", description: "Waist (cm)", subtitle2: "Hip (cm)" };
  const rows = section.items?.length > 1 ? section.items.slice(1) : [
    { title: "XS", subtitle: "80", description: "60", subtitle2: "88" },
    { title: "S", subtitle: "84", description: "64", subtitle2: "92" },
    { title: "M", subtitle: "88", description: "68", subtitle2: "96" },
    { title: "L", subtitle: "92", description: "72", subtitle2: "100" },
    { title: "XL", subtitle: "96", description: "76", subtitle2: "104" }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center overflow-x-auto ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <th className="py-4 font-normal">{headers.title}</th>
              <th className="py-4 font-normal">{headers.subtitle}</th>
              <th className="py-4 font-normal">{headers.description}</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {rows.map((r: any, i: number) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4">{r.title}</td>
                <td className="py-4 text-gray-500">{r.subtitle}</td>
                <td className="py-4 text-gray-500">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

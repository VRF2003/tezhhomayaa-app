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
  // Mock timeline data
  const milestones = [
    { year: "1982", title: "The Foundation", desc: "The house was established." },
    { year: "1995", title: "Global Expansion", desc: "Opened the first flagship in Paris." },
    { year: "2010", title: "Creative Direction", desc: "A new era of design began." }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-5xl">
        <h2 className="text-3xl font-light mb-16 text-center">{section.content?.heading || "Our Heritage"}</h2>
        <div className="relative border-l border-gray-200 ml-4 md:ml-1/2">
          {milestones.map((m, i) => (
            <div key={i} className="mb-16 ml-8 relative group cursor-default">
              <div className="absolute -left-[37px] top-1 w-3 h-3 bg-black rounded-full group-hover:scale-150 transition-transform duration-500" />
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{m.year}</p>
              <h3 className="text-xl font-light mb-2">{m.title}</h3>
              <p className="text-sm text-gray-600 font-light max-w-md">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvStatistics = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const stats = [
    { value: "45+", label: "Flagship Boutiques" },
    { value: "1982", label: "Year Established" },
    { value: "100%", label: "Traceable Materials" }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-6xl font-light mb-4">{s.value}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{s.label}</p>
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

  const faqs = [
    { q: "What is your return policy?", a: "Returns are accepted within 30 days of purchase in original condition." },
    { q: "Do you offer international shipping?", a: "Yes, we ship to over 100 countries globally via priority courier." },
    { q: "How can I book a styling appointment?", a: "You can book directly through our Contact page or by emailing our concierge." }
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-3xl">
        <h2 className="text-2xl font-light mb-12">{section.content?.heading || "Frequently Asked Questions"}</h2>
        <div className="border-t border-gray-200">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 py-6">
              <button 
                className="w-full flex justify-between items-center text-left hover:text-gray-600 transition-colors focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg font-light tracking-wide">{faq.q}</span>
                <span className="text-2xl font-light ml-4">{openIndex === i ? "−" : "+"}</span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${openIndex === i ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
              >
                <p className="text-sm font-light text-gray-500 leading-relaxed">{faq.a}</p>
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
  const tabs = ["Details", "Materials", "Shipping"];
  const content = [
    "Expertly tailored for a flawless fit, featuring signature minimalist hardware.",
    "100% Traceable organic cotton and recycled silk lining.",
    "Complimentary express shipping on all orders over $500."
  ];

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-3xl flex flex-col items-center text-center">
        <div className="flex gap-8 border-b border-gray-200 mb-8 w-full justify-center">
          {tabs.map((t, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(i)}
              className={`pb-4 text-xs uppercase tracking-widest transition-colors relative ${activeTab === i ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t}
              {activeTab === i && <div className="absolute bottom-0 left-0 w-full h-px bg-black" />}
            </button>
          ))}
        </div>
        <div className="text-sm font-light text-gray-600 leading-relaxed min-h-[100px] flex items-center justify-center transition-opacity duration-500">
          {content[activeTab]}
        </div>
      </div>
    </div>
  );
};

export const AdvTable = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center overflow-x-auto ${style.className || ""}`}>
      <div style={style.content} className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <th className="py-4 font-normal">Size</th>
              <th className="py-4 font-normal">Chest (cm)</th>
              <th className="py-4 font-normal">Waist (cm)</th>
              <th className="py-4 font-normal">Hip (cm)</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {["XS", "S", "M", "L", "XL"].map((s, i) => (
              <tr key={s} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4">{s}</td>
                <td className="py-4 text-gray-500">{80 + i*4}</td>
                <td className="py-4 text-gray-500">{60 + i*4}</td>
                <td className="py-4 text-gray-500">{88 + i*4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

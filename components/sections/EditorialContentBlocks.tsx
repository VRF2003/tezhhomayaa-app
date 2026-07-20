"use client";

import React, { useEffect, useState } from "react";
import { UniversalSectionData } from "@/lib/types/homepage";
import Link from "next/link";
import { Observability } from "@/lib/infrastructure/observability";

interface BlockProps {
  section: UniversalSectionData;
}

// ----------------------------------------------------------------------
// THE UNIVERSAL STYLE HOOK (Upgraded for 2E)
// ----------------------------------------------------------------------
const useUniversalStyle = (section: UniversalSectionData) => {
  const [isVisible, setIsVisible] = useState(!section.animation?.scrollTrigger);
  const d = section.layout?.desktop || {};
  const s = section.style || {};
  const a = section.animation || { type: "none" as const, duration: 0, delay: 0, easing: "ease", scrollTrigger: false };
  const adv = section.advanced || {};

  useEffect(() => {
    if (a.scrollTrigger) {
      // Typically IntersectionObserver logic goes here.
      // For this frontend milestone, we trigger visible after mount.
      setTimeout(() => setIsVisible(true), a.delay || 100);
    }
  }, [a]);

  // Compute Animation Styles
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
      padding: d.padding || "0px",
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

// ----------------------------------------------------------------------
// 2E.1: ADVANCED CONTENT BLOCKS
// ----------------------------------------------------------------------

export const AdvRichTextBlock = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="prose prose-stone prose-lg md:prose-xl font-light">
        {/* We use dangerouslySetInnerHTML for CMS rich text */}
        <div dangerouslySetInnerHTML={{ __html: section.content?.description || "<p>Advanced Rich Text Content</p>" }} />
      </div>
    </div>
  );
};

export const AdvRawHTMLBlock = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center w-full ${style.className || ""}`}>
      <div style={{ ...style.content, maxWidth: "100%", width: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: section.content?.description || "<div>Raw HTML</div>" }} />
      </div>
    </div>
  );
};

export const AdvCodeBlock = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(section.content?.description || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={{ ...style.content, backgroundColor: "#1a1a18", color: "#e5e5e5", padding: "2rem", borderRadius: "8px", position: "relative" }} className="w-full max-w-4xl font-mono text-sm shadow-2xl">
        <button onClick={handleCopy} className="absolute top-4 right-4 text-xs text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
          {copied ? "Copied" : "Copy"}
        </button>
        <pre className="overflow-x-auto">
          <code>{section.content?.description || "Observability.getLogger('System').info('Hello Luxury Code');"}</code>
        </pre>
      </div>
    </div>
  );
};

export const AdvFounderQuote = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={{ ...style.content, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {section.desktopImage && (
          <div className="w-24 h-24 rounded-full overflow-hidden mb-8">
            <img src={section.desktopImage} alt="Founder" className="w-full h-full object-cover grayscale" />
          </div>
        )}

        <blockquote className="text-3xl md:text-5xl font-light text-center leading-tight mb-8 max-w-3xl">
          "{section.content?.description || "Luxury is the balance of design, in the sense of beauty and highest quality."}"
        </blockquote>

        <div className="flex flex-col items-center">
          {section.content?.heading && <p className="font-medium text-sm tracking-widest uppercase">{section.content.heading}</p>}
          {section.content?.subheading && <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{section.content.subheading}</p>}
        </div>

      </div>
    </div>
  );
};

export const AdvDownloadBlock = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={{ ...style.content, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem" }} className="w-full max-w-3xl group">
        <div>
          <h3 className="text-lg font-light group-hover:text-gray-600 transition-colors">{section.content?.heading || "Brand Lookbook FW26"}</h3>
          {section.content?.description && <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{section.content.description}</p>}
        </div>
        <a href={section.content?.primaryButton?.url || "#"} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-gray-500 transition-colors">
          Download
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export const AdvContactBlock = ({ section }: BlockProps) => {
  const style = useUniversalStyle(section);
  return (
    <div style={style.wrapper} id={style.id} className={`flex justify-center ${style.className || ""}`}>
      <div style={style.content} className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl">
        
        <div>
          <h2 className="text-3xl font-light mb-8">{section.content?.heading || "Contact The House"}</h2>
          <div className="prose prose-stone font-light text-gray-600 leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: section.content?.description || "<p>For VIP inquiries and styling appointments.</p>" }} />
          
          <div className="space-y-6 text-sm">
            <div>
              <p className="uppercase tracking-widest text-xs text-gray-400 mb-1">Email</p>
              <a href="mailto:concierge@tezhhomayaa.com" className="hover:text-gray-500 transition-colors">concierge@tezhhomayaa.com</a>
            </div>
            <div>
              <p className="uppercase tracking-widest text-xs text-gray-400 mb-1">Phone</p>
              <p>+33 1 40 20 50 50</p>
            </div>
            <div>
              <p className="uppercase tracking-widest text-xs text-gray-400 mb-1">Hours</p>
              <p>Monday - Saturday, 10am - 7pm CET</p>
            </div>
          </div>
        </div>

        <div className="bg-[#fcfbf9] p-8 md:p-12">
          <form className="space-y-8" onSubmit={e => e.preventDefault()}>
            <div>
              <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <input type="text" placeholder="Subject (Optional)" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <textarea placeholder="Message" rows={4} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"></textarea>
            </div>
            <button className="bg-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] w-full hover:bg-gray-800 transition-colors duration-500">
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

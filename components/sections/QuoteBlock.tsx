import React from "react";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function QuoteBlock({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style } = data;

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex flex-col items-center justify-center bg-white text-center"
      style={{ padding: layout.desktop.padding || "6rem 2rem" }}
    >
      <div 
        className="w-full relative z-10 flex flex-col items-center"
        style={{ width: `${layout.desktop.textWidth || 60}%`, maxWidth: "800px" }}
      >
        {content.description && (
          <p 
            className="font-serif italic leading-relaxed mb-6"
            style={{ 
              color: style.description.textColor || "#1a1a18",
              fontSize: `${style.description.fontSize}rem`,
              fontWeight: style.description.fontWeight,
              letterSpacing: `${style.description.letterSpacing}em`,
              lineHeight: style.description.lineHeight
            }}
          >
            "{content.description}"
          </p>
        )}
        
        {content.heading && (
          <span 
            className="uppercase tracking-[0.2em] font-mono"
            style={{ 
              color: style.heading.textColor || "#1a1a18", 
              opacity: 0.6,
              fontSize: `${style.heading.fontSize}rem`,
              fontWeight: style.heading.fontWeight,
              letterSpacing: `${style.heading.letterSpacing}em`,
              lineHeight: style.heading.lineHeight
            }}
          >
            — {content.heading}
          </span>
        )}
      </div>
    </section>
  );
}

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
            className="font-serif italic text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-6"
            style={{ color: style.description.textColor || "#1a1a18" }}
          >
            "{content.description}"
          </p>
        )}
        
        {content.heading && (
          <span 
            className="uppercase tracking-[0.2em] text-xs font-mono"
            style={{ color: style.heading.textColor || "#1a1a18", opacity: 0.6 }}
          >
            — {content.heading}
          </span>
        )}
      </div>
    </section>
  );
}

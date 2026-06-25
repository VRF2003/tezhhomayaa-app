import React from "react";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function NewsletterBlock({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style } = data;

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex flex-col items-center justify-center bg-[#1a1a18] text-white text-center"
      style={{ padding: layout.desktop.padding || "6rem 2rem" }}
    >
      <div 
        className="w-full relative z-10 flex flex-col items-center"
        style={{ width: `${layout.desktop.textWidth || 60}%`, maxWidth: "600px" }}
      >
        {content.heading && (
          <h2 
            className="tracking-[0.2em] uppercase font-serif mb-4"
            style={{ fontSize: `${style.heading.fontSize}rem` }}
          >
            {content.heading}
          </h2>
        )}
        {content.description && (
          <p 
            className="font-light mb-8 opacity-80"
            style={{ fontSize: `${style.description.fontSize}rem` }}
          >
            {content.description}
          </p>
        )}
        <form className="w-full flex flex-col md:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="flex-1 bg-transparent border-b border-white/30 p-3 outline-none focus:border-white transition-colors"
            required 
          />
          {content.primaryButton?.label && (
            <button 
              type="submit"
              className="uppercase tracking-[0.1em] text-xs border border-white px-8 py-3 hover:bg-white hover:text-[#1a1a18] transition-colors"
            >
              {content.primaryButton.label}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}

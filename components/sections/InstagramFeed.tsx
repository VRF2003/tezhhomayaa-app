import React from "react";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function InstagramFeed({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style } = data;

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex flex-col items-center justify-center bg-white"
      style={{ padding: layout.desktop.padding || "4rem 2rem" }}
    >
      <div 
        className="w-full relative z-10 flex flex-col items-center"
        style={{ maxWidth: "1200px" }}
      >
        {content.heading && (
          <h2 
            className="tracking-widest uppercase font-serif mb-8 text-center"
            style={{ 
              fontSize: `${style.heading.fontSize}rem`,
              color: style.heading.textColor || "#000000"
            }}
          >
            {content.heading}
          </h2>
        )}
        
        {/* Placeholder for Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-gray-100 flex items-center justify-center">
              <span className="opacity-30 text-xs uppercase tracking-widest">Post {item}</span>
            </div>
          ))}
        </div>

        {content.primaryButton?.enabled && content.primaryButton.label && (
          <a 
            href={content.primaryButton.url || "#"} 
            className="mt-8 uppercase tracking-widest hover:opacity-70 transition-opacity"
            style={{
              fontSize: `${style.button.fontSize}rem`,
              fontWeight: style.button.fontWeight,
              borderBottom: "1px solid currentColor",
              paddingBottom: "2px"
            }}
            target="_blank"
            rel="noreferrer"
          >
            {content.primaryButton.label}
          </a>
        )}
      </div>
    </section>
  );
}

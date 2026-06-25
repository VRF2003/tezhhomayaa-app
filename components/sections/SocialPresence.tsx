import React from "react";
import Link from "next/link";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function SocialPresence({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style, socialPresence } = data;

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex flex-col items-center justify-center bg-[#1a1a18]"
      style={{ 
        padding: layout.desktop.padding || "6rem 2rem",
      }}
    >
      <div 
        className="w-full relative z-10 flex flex-col items-center justify-center text-center"
        style={{
          width: `${layout.desktop.textWidth || 80}%`,
          maxWidth: "1000px"
        }}
      >
        {content.heading && (
          <h2 
            className="tracking-widest uppercase font-serif mb-4"
            style={{ 
              fontSize: `${style.heading.fontSize}rem`,
              fontWeight: style.heading.fontWeight,
              letterSpacing: `${style.heading.letterSpacing}em`,
              color: "#ffffff"
            }}
          >
            {content.heading}
          </h2>
        )}
        
        {content.description && (
          <p 
            className="font-light mb-12"
            style={{ 
              fontSize: `${style.description.fontSize}rem`,
              fontWeight: style.description.fontWeight,
              color: "#ffffff",
              opacity: 0.7,
              maxWidth: "600px"
            }}
          >
            {content.description}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {(socialPresence?.links || []).map((link: any, idx: number) => (
            <Link 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-4 hover:opacity-70 transition-opacity"
            >
              <span 
                className="uppercase tracking-widest text-sm"
                style={{ color: "#ffffff" }}
              >
                {link.platform}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

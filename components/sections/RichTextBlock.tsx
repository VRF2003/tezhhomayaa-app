import React from "react";
import Link from "next/link";
import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";

export default function RichTextBlock({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style } = data;

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex items-center justify-center bg-white"
      style={{ 
        padding: layout.desktop.padding || "4rem 2rem",
      }}
    >
      <div 
        className="relative z-10 flex flex-col"
        style={{
          width: `${layout.desktop.textWidth || 60}%`,
          minWidth: "300px"
        }}
      >
        {content.subheading && (
          <h3 
            className="tracking-[0.2em] uppercase font-mono"
            style={{ 
              fontSize: `${style.subheading.fontSize}rem`,
              fontWeight: style.subheading.fontWeight,
              letterSpacing: `${style.subheading.letterSpacing}em`,
              lineHeight: style.subheading.lineHeight,
              color: style.subheading.textColor,
              textAlign: style.subheading.align as any,
              textShadow: style.subheading.textShadow === "none" ? "none" : "0 4px 20px rgba(0,0,0,0.1)",
              marginBottom: `${style.subheading.lineHeight * 0.5}rem`,
              width: "100%"
            }}
          >
            {content.subheading}
          </h3>
        )}

        {content.heading && (
          <h2 
            className="tracking-wider uppercase font-serif"
            style={{ 
              fontSize: `${style.heading.fontSize}rem`,
              fontWeight: style.heading.fontWeight,
              letterSpacing: `${style.heading.letterSpacing}em`,
              lineHeight: style.heading.lineHeight,
              color: style.heading.textColor,
              textAlign: style.heading.align as any,
              textShadow: style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.2)",
              marginBottom: `${style.heading.lineHeight * 0.8}rem`,
              width: "100%"
            }}
          >
            {content.heading}
          </h2>
        )}

        {content.description && (
          <p 
            className="font-light opacity-80 whitespace-pre-wrap"
            style={{ 
              fontSize: `${style.description.fontSize}rem`,
              fontWeight: style.description.fontWeight,
              letterSpacing: `${style.description.letterSpacing}em`,
              lineHeight: style.description.lineHeight,
              color: style.description.textColor,
              textAlign: style.description.align as any,
              maxWidth: `${style.description.maxWidth}px`,
              marginLeft: style.description.align === "center" ? "auto" : "0", 
              marginRight: style.description.align === "center" ? "auto" : "0"
            }}
          >
            {content.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {content.primaryButton.enabled && content.primaryButton.label && (
            <Link 
              href={content.primaryButton.url || "#"}
              className="hover:opacity-70 transition-opacity"
              style={{
                fontSize: `${style.button.fontSize}rem`,
                fontWeight: style.button.fontWeight,
                padding: style.button.padding,
                borderRadius: `${style.button.borderRadius}px`,
                color: style.button.textColor,
                backgroundColor: style.button.backgroundColor,
                display: "inline-block",
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}
            >
              {content.primaryButton.label}
            </Link>
          )}
          {content.secondaryButton.enabled && content.secondaryButton.label && (
            <Link 
              href={content.secondaryButton.url || "#"}
              className="text-[0.75rem] tracking-[0.1em] uppercase hover:opacity-70 transition-opacity"
              style={{
                borderBottom: "1px solid currentColor",
                paddingBottom: "0.2rem"
              }}
            >
              {content.secondaryButton.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import { normalizeSectionData } from "@/lib/types/homepage";
import { getResponsiveTypographyClass, injectTypographyOverrides, getButtonStyles } from "@/lib/typography";

export default function RichTextBlock({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const norm = normalizeSectionData(cmsData);

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex items-center justify-center max-md:[padding:var(--local-pad-mob)] md:[padding:var(--local-pad-desk)] max-md:[margin:var(--local-mar-mob)] md:[margin:var(--local-mar-desk)]"
      style={{ 
        "--local-pad-mob": norm.layout.mobile.padding,
        "--local-pad-desk": norm.layout.desktop.padding,
        "--local-mar-mob": norm.layout.mobile.margin,
        "--local-mar-desk": norm.layout.desktop.margin,
        backgroundColor: norm.style.backgroundColor,
        ...injectTypographyOverrides(norm.typographyOverrides)
      } as React.CSSProperties}
    >
      <div 
        className="relative z-10 flex flex-col"
        style={{
          width: `${norm.layout.desktop.textWidth || 60}%`,
          minWidth: "300px"
        }}
      >
        {norm.content.subheading && (
          <p 
            className={`tracking-[0.2em] uppercase mb-4 opacity-90 font-medium ${getResponsiveTypographyClass(norm.style.subheading.fontSize)}`}
            style={{ 
              fontWeight: norm.style.subheading.fontWeight,
              fontSize: `${norm.style.subheading.fontSize}rem`,
              letterSpacing: `${norm.style.subheading.letterSpacing}em`,
              lineHeight: norm.style.subheading.lineHeight,
              color: norm.style.subheading.textColor,
              textAlign: norm.style.subheading.align as any,
              textShadow: norm.style.subheading.textShadow === "none" ? "none" : "0 4px 20px rgba(0,0,0,0.1)",
              width: "100%"
            }}
          >
            {norm.content.subheading}
          </p>
        )}

        {norm.content.heading && (
          <h2 
            className={`mb-6 ${getResponsiveTypographyClass(norm.style.heading.fontSize)}`}
            style={{ 
              fontFamily: norm.style.fontFamily,
              fontWeight: norm.style.heading.fontWeight,
              fontSize: `${norm.style.heading.fontSize}rem`,
              letterSpacing: `${norm.style.heading.letterSpacing}em`,
              lineHeight: norm.style.heading.lineHeight,
              color: norm.style.heading.textColor,
              textAlign: norm.style.heading.align as any,
              textShadow: norm.style.heading.textShadow === "none" ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
              width: "100%"
            }}
          >
            {norm.content.heading}
          </h2>
        )}
        {norm.content.description && (
          <p 
            className={`text-editorial whitespace-pre-wrap ${getResponsiveTypographyClass(norm.style.description.fontSize)}`}
            style={{ 
              fontWeight: norm.style.description.fontWeight,
              fontSize: `${norm.style.description.fontSize}rem`,
              letterSpacing: `${norm.style.description.letterSpacing}em`,
              lineHeight: norm.style.description.lineHeight,
              color: norm.style.description.textColor,
              textAlign: norm.style.description.align as any,
              maxWidth: `${norm.style.description.maxWidth}px`,
              marginLeft: norm.style.description.align === "center" ? "auto" : "0", 
              marginRight: norm.style.description.align === "center" ? "auto" : "0"
            }}
          >
            {norm.content.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {norm.content.primaryButton.enabled && norm.content.primaryButton.label && (
            <Link 
              href={norm.content.primaryButton.url || "#"}
              className="hover:opacity-70 transition-opacity fluid-button"
              style={getButtonStyles(norm.content.primaryButton, norm.style.button)}
            >
              {norm.content.primaryButton.label}
            </Link>
          )}
          {norm.content.secondaryButton.enabled && norm.content.secondaryButton.label && (
            <Link 
              href={norm.content.secondaryButton.url || "#"}
              className="hover:opacity-70 transition-opacity fluid-button"
              style={getButtonStyles(norm.content.secondaryButton, norm.style.button)}
            >
              {norm.content.secondaryButton.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

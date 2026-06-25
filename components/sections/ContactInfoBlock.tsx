import React from "react";
import Link from "next/link";
import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";

export default function ContactInfoBlock({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style, contactInfo } = data;

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex flex-col items-center justify-center bg-white"
      style={{ 
        padding: layout.desktop.padding || "6rem 2rem",
      }}
    >
      <div 
        className="w-full relative z-10 flex flex-col"
        style={{
          width: `${layout.desktop.textWidth || 80}%`,
          maxWidth: "1200px"
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full">
          {/* Left Column: Heading & Description */}
          <div className="flex flex-col">
            {content.heading && (
              <h2 
                className="tracking-widest uppercase font-serif"
                style={{ 
                  fontSize: `${style.heading.fontSize}rem`,
                  fontWeight: style.heading.fontWeight,
                  letterSpacing: `${style.heading.letterSpacing}em`,
                  lineHeight: style.heading.lineHeight,
                  color: style.heading.textColor,
                  marginBottom: "1.5rem"
                }}
              >
                {content.heading}
              </h2>
            )}
            
            {content.description && (
              <p 
                className="font-light whitespace-pre-wrap"
                style={{ 
                  fontSize: `${style.description.fontSize}rem`,
                  fontWeight: style.description.fontWeight,
                  letterSpacing: `${style.description.letterSpacing}em`,
                  lineHeight: style.description.lineHeight,
                  color: style.description.textColor,
                  opacity: 0.8,
                  marginBottom: "2rem"
                }}
              >
                {content.description}
              </p>
            )}

            {content.primaryButton?.enabled && (
              <div className="mt-4">
                <Link 
                  href={content.primaryButton.url}
                  className="hover:opacity-70 transition-opacity border-b pb-1"
                  style={{
                    fontSize: `${style.button.fontSize}rem`,
                    fontWeight: style.button.fontWeight,
                    color: style.button.textColor,
                    borderColor: style.button.textColor,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase"
                  }}
                >
                  {content.primaryButton.label}
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Fields */}
          <div className="flex flex-col gap-8 md:pt-4">
            {contactInfo?.fields?.map((field: any, idx: number) => (
              <div key={idx} className="flex flex-col">
                <span 
                  className="uppercase tracking-widest font-mono mb-2"
                  style={{ 
                    fontSize: "0.75rem", 
                    color: style.heading.textColor,
                    opacity: 0.6
                  }}
                >
                  {field.label}
                </span>
                
                {field.link ? (
                  <Link 
                    href={field.link} 
                    className="hover:opacity-70 transition-opacity whitespace-pre-wrap"
                    style={{ 
                      fontSize: "1.1rem", 
                      color: style.description.textColor,
                      fontWeight: 300
                    }}
                  >
                    {field.value}
                  </Link>
                ) : (
                  <span 
                    className="whitespace-pre-wrap"
                    style={{ 
                      fontSize: "1.1rem", 
                      color: style.description.textColor,
                      fontWeight: 300
                    }}
                  >
                    {field.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

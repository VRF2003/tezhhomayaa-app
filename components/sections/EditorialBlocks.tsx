"use client";

import React from "react";
import { UniversalSectionData } from "@/lib/types/homepage";

interface BlockProps {
  section: UniversalSectionData;
}

// Helper to extract margins/paddings from layout
const useEditorialStyle = (section: UniversalSectionData) => {
  const d = section.layout?.desktop || {};
  return {
    padding: d.padding || "0px",
    margin: d.margin || "0px",
    textAlign: d.align as any || "left",
    maxWidth: d.textWidth ? `${d.textWidth}%` : "100%",
    backgroundColor: section.style?.backgroundColor || "transparent",
    color: section.style?.textColor || "inherit",
    width: "100%",
  };
};

export const EditorialHeading = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  // Default to a medium-large size if not overridden
  const fontSize = section.style?.fontSize ? `${section.style.fontSize}rem` : "3rem";
  const fontWeight = section.style?.fontWeight || 300;
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: style.textAlign === "center" ? "center" : style.textAlign === "right" ? "flex-end" : "flex-start" }}>
      <h2 style={{ color: style.color, fontSize, fontWeight, maxWidth: style.maxWidth, lineHeight: 1.2, margin: 0, textAlign: style.textAlign }}>
        {section.content?.heading}
      </h2>
    </div>
  );
};

export const EditorialParagraph = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: style.textAlign === "center" ? "center" : style.textAlign === "right" ? "flex-end" : "flex-start" }}>
      <div 
        style={{ color: style.color, maxWidth: style.maxWidth, textAlign: style.textAlign }}
        className="prose prose-stone prose-lg max-w-none prose-p:font-light prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: section.content?.description || "" }}
      />
    </div>
  );
};

export const EditorialDivider = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ padding: style.padding, margin: style.margin }}>
      <div style={{ borderTop: `1px solid ${section.style?.textColor || "#e8e4df"}`, width: "100%" }} />
    </div>
  );
};

export const EditorialSpacer = ({ section }: BlockProps) => {
  const heightDesktop = section.heightDesktop || 120;
  return (
    <div style={{ height: `${heightDesktop}px`, width: "100%" }} aria-hidden="true" />
  );
};

export const EditorialSingleImage = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  if (!section.desktopImage) return null;
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: style.maxWidth, width: "100%" }}>
        <img 
          src={section.desktopImage} 
          alt={section.content?.heading || "Editorial Image"} 
          style={{ width: "100%", height: "auto", display: "block" }} 
        />
        {section.content?.description && (
          <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#9a9690", textAlign: style.textAlign }}>
            {section.content.description}
          </p>
        )}
      </div>
    </div>
  );
};

export const EditorialButtonGroup = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const btn1 = section.content?.primaryButton;
  const btn2 = section.content?.secondaryButton;
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: style.textAlign === "center" ? "center" : style.textAlign === "right" ? "flex-end" : "flex-start", gap: "1.5rem" }}>
      {btn1?.enabled && (
        <a href={btn1.url} className={`btn-${btn1.style || "luxury"} text-xs uppercase tracking-widest px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors`}>
          {btn1.label}
        </a>
      )}
      {btn2?.enabled && (
        <a href={btn2.url} className={`btn-${btn2.style || "outline"} text-xs uppercase tracking-widest px-8 py-4 border border-black text-black hover:bg-gray-100 transition-colors`}>
          {btn2.label}
        </a>
      )}
    </div>
  );
};

// Simplified Editorial Hero mapping to user's spec:
// CATEGORY -> Whitespace -> HEADLINE -> METADATA -> Whitespace -> HERO IMAGE
export const EditorialHero = ({ section, articleMetadata }: { section: UniversalSectionData, articleMetadata?: any }) => {
  const style = useEditorialStyle(section);
  const title = section.content?.heading || articleMetadata?.title || "Untitled";
  const cat = section.content?.subheading || articleMetadata?.category || "Editorial";
  const meta = section.content?.description || articleMetadata?.publishDate || "July 2026 • 5 Min Read";
  const img = section.desktopImage || articleMetadata?.heroImage?.url;
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, paddingTop: "140px", paddingBottom: "80px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Category */}
      <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#6b6865", marginBottom: "4rem" }}>
        {cat}
      </span>
      
      {/* Headline (Max 850px) */}
      <h1 style={{ fontSize: "4.5rem", fontWeight: 300, color: "#1a1a18", maxWidth: "850px", lineHeight: 1.1, margin: "0 0 3rem 0" }}>
        {title}
      </h1>
      
      {/* Metadata */}
      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#9a9690", marginBottom: "6rem" }}>
        {meta}
      </div>
      
      {/* Framed Image */}
      {img && (
        <div style={{ width: "90%", maxWidth: "1600px", aspectRatio: "21/9", backgroundColor: "#f0ece6", overflow: "hidden" }}>
          <img src={img} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// PHASE 2B: EDITORIAL BLOCKS
// ==========================================

export const EditorialPullQuote = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: style.textAlign === "center" ? "center" : style.textAlign === "right" ? "flex-end" : "flex-start" }}>
      <blockquote style={{ maxWidth: style.maxWidth, borderLeft: style.textAlign === "left" ? "2px solid #1a1a18" : "none", borderRight: style.textAlign === "right" ? "2px solid #1a1a18" : "none", padding: style.textAlign === "left" ? "0 0 0 2rem" : style.textAlign === "right" ? "0 2rem 0 0" : "0", margin: 0, textAlign: style.textAlign }}>
        <p style={{ fontSize: "1.75rem", fontWeight: 300, color: style.color || "#1a1a18", lineHeight: 1.4, margin: "0 0 1rem 0", fontStyle: "italic" }}>
          "{section.content?.description}"
        </p>
        {(section.content?.heading || section.content?.subheading) && (
          <footer style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#6b6865", marginTop: "1.5rem" }}>
            <span style={{ fontWeight: 500 }}>{section.content?.heading}</span>
            {section.content?.subheading && <span style={{ marginLeft: "0.5rem" }}>— {section.content?.subheading}</span>}
          </footer>
        )}
      </blockquote>
    </div>
  );
};

export const EditorialLargeQuote = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const fontSize = section.style?.fontSize ? `${section.style.fontSize}rem` : "6rem";
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "8rem 0", margin: style.margin, display: "flex", justifyContent: "center", textAlign: "center" }}>
      <div style={{ maxWidth: style.maxWidth || "1200px" }}>
        <h2 style={{ fontSize, fontWeight: 300, color: style.color || "#1a1a18", lineHeight: 1, letterSpacing: "-0.02em", whiteSpace: "pre-line", margin: 0 }}>
          {section.content?.heading}
        </h2>
        {section.content?.subheading && (
          <p style={{ marginTop: "4rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#6b6865" }}>
            — {section.content.subheading}
          </p>
        )}
      </div>
    </div>
  );
};

export const EditorialSplitImageText = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const layout = section.layout?.desktop?.align || "left"; // "left" means image left
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
        
        {layout === "left" && section.desktopImage && (
          <div style={{ width: "100%", aspectRatio: "3/4", backgroundColor: "#f0ece6" }}>
            <img src={section.desktopImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: style.textAlign as any }}>
          {section.content?.heading && <h3 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "1.5rem" }}>{section.content.heading}</h3>}
          {section.content?.description && (
            <div 
              style={{ color: "#6b6865", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: section.content.description }}
            />
          )}
        </div>
        
        {layout === "right" && section.desktopImage && (
          <div style={{ width: "100%", aspectRatio: "3/4", backgroundColor: "#f0ece6" }}>
            <img src={section.desktopImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export const EditorialTwoColumn = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: style.maxWidth || "1200px", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
        <div style={{ color: style.color, lineHeight: 1.8, textAlign: style.textAlign }} dangerouslySetInnerHTML={{ __html: section.content?.description || "" }} />
        <div style={{ color: style.color, lineHeight: 1.8, textAlign: style.textAlign }} dangerouslySetInnerHTML={{ __html: section.content?.description2 || "" }} />
      </div>
    </div>
  );
};

export const EditorialThreeColumn = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: style.maxWidth || "1600px", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
        <div style={{ color: style.color, lineHeight: 1.8, textAlign: style.textAlign }} dangerouslySetInnerHTML={{ __html: section.content?.description || "" }} />
        <div style={{ color: style.color, lineHeight: 1.8, textAlign: style.textAlign }} dangerouslySetInnerHTML={{ __html: section.content?.description2 || "" }} />
        <div style={{ color: style.color, lineHeight: 1.8, textAlign: style.textAlign }} dangerouslySetInnerHTML={{ __html: section.content?.description3 || "" }} />
      </div>
    </div>
  );
};

export const EditorialStickyImage = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const layout = section.layout?.desktop?.align || "left"; // Image side
  
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", flexDirection: layout === "right" ? "row-reverse" : "row", gap: "6rem", alignItems: "flex-start" }}>
        
        {/* Sticky Image Column */}
        <div style={{ flex: 1, position: "sticky", top: "120px", height: "calc(100dvh - 240px)", minHeight: "600px" }}>
          {section.desktopImage ? (
            <img src={section.desktopImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#f0ece6" }} />
          )}
        </div>
        
        {/* Scrolling Text Column */}
        <div style={{ flex: 1, paddingTop: "20vh", paddingBottom: "20vh" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: style.textAlign }}>
             {section.content?.heading && <h3 style={{ fontSize: "2.5rem", fontWeight: 300, marginBottom: "2rem" }}>{section.content.heading}</h3>}
             <div 
               style={{ color: "#6b6865", lineHeight: 1.8, fontSize: "1.1rem" }}
               dangerouslySetInnerHTML={{ __html: section.content?.description || "" }}
             />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export const EditorialCaption = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding || "1rem 0", margin: style.margin, display: "flex", justifyContent: style.textAlign === "center" ? "center" : style.textAlign === "right" ? "flex-end" : "flex-start" }}>
      <p style={{ color: style.color || "#9a9690", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", maxWidth: style.maxWidth, textAlign: style.textAlign, margin: 0 }}>
        {section.content?.description}
        {section.content?.subheading && <span style={{ marginLeft: "1rem", color: "#6b6865" }}>© {section.content.subheading}</span>}
      </p>
    </div>
  );
};

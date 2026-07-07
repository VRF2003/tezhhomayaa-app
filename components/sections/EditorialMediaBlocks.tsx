"use client";

import React, { useState } from "react";
import { UniversalSectionData } from "@/lib/types/homepage";

// Placeholder for a Luxury Lightbox Context that would wrap the app.
// For now, we simulate the lightbox trigger.
const useLightbox = () => {
  return (src: string) => {
    console.log("Opening Lightbox for:", src);
    // In full implementation, this opens a global cinematic lightbox overlay.
  };
};

interface BlockProps {
  section: UniversalSectionData;
}

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

export const EditorialImageGallery = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const openLightbox = useLightbox();
  // We'd expect section.items to hold the images, or section.galleryItems
  const items = section.items || [];
  
  // Grid layout presets
  const gridClass = "grid gap-4 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%" }} className={gridClass}>
        {items.map((item: any, idx: number) => (
          <div key={idx} className="group relative cursor-zoom-in" onClick={() => openLightbox(item.overrideImage || "")}>
            <div className="aspect-[4/5] bg-[#f0ece6] overflow-hidden">
              <img 
                src={item.overrideImage} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {item.overrideHeading && (
              <div className="mt-4 text-xs uppercase tracking-[0.15em] text-gray-500">
                {item.overrideHeading}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const EditorialMasonryGallery = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const openLightbox = useLightbox();
  const items = section.items || [];

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", columns: "1 300px", columnGap: "2rem" }}>
        {items.map((item: any, idx: number) => (
          <div key={idx} className="mb-8 inline-block w-full group relative cursor-zoom-in" onClick={() => openLightbox(item.overrideImage || "")}>
            <div className="bg-[#f0ece6] overflow-hidden">
              <img 
                src={item.overrideImage} 
                alt="" 
                className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {item.overrideHeading && (
              <div className="mt-4 text-xs uppercase tracking-[0.15em] text-gray-500">
                {item.overrideHeading}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const EditorialVideo = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const videoSrc = section.video;
  const poster = section.desktopImage;

  if (!videoSrc) return null;

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: style.maxWidth || "1600px", width: "100%", position: "relative" }}>
        <video 
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto object-cover"
        />
        {section.content?.description && (
          <div className="mt-4 text-xs uppercase tracking-[0.15em] text-gray-500 text-center">
            {section.content.description}
          </div>
        )}
      </div>
    </div>
  );
};

export const EditorialYouTube = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  // Extract video ID from URL
  const url = section.video || "";
  let videoId = "";
  if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
  else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];

  if (!videoId) return null;

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: style.maxWidth || "1200px", width: "100%" }}>
        <div className="relative w-full aspect-video bg-[#1a1a18]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
            loading="lazy"
          />
        </div>
        {section.content?.description && (
          <div className="mt-4 text-xs uppercase tracking-[0.15em] text-gray-500 text-center">
            {section.content.description}
          </div>
        )}
      </div>
    </div>
  );
};

export const EditorialImageHotspots = ({ section }: BlockProps) => {
  const style = useEditorialStyle(section);
  const openLightbox = useLightbox();
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);

  const hotspots = section.hotspots || [];

  return (
    <div style={{ backgroundColor: style.backgroundColor, padding: style.padding, margin: style.margin, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1600px", width: "100%", position: "relative" }}>
        
        {/* Base Image */}
        <div className="bg-[#f0ece6] overflow-hidden relative cursor-zoom-in" onClick={() => openLightbox(section.desktopImage || "")}>
          {section.desktopImage && (
            <img 
              src={section.desktopImage} 
              alt="Shoppable Image" 
              className="w-full h-auto block"
              loading="lazy"
            />
          )}

          {/* Hotspots Overlay */}
          {hotspots.map((hs: any, idx: number) => (
            <div 
              key={idx}
              className="absolute group z-10"
              style={{ top: `${hs.y}%`, left: `${hs.x}%`, transform: "translate(-50%, -50%)" }}
              onMouseEnter={() => setHoveredHotspot(idx)}
              onMouseLeave={() => setHoveredHotspot(null)}
            >
              {/* Luxury Ring Style */}
              <div className="w-4 h-4 rounded-full bg-white/80 backdrop-blur-sm border border-black/20 flex items-center justify-center cursor-pointer shadow-sm">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              
              {/* Tooltip */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white px-4 py-3 shadow-xl border border-gray-100 min-w-[200px] transition-all duration-300 pointer-events-none ${hoveredHotspot === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Shop Product</p>
                <p className="text-sm text-black whitespace-nowrap">{hs.label || "Product Name"}</p>
                <p className="text-xs text-gray-500 mt-1">{hs.price || "$0"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

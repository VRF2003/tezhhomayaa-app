"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";

export default function MotionAtelier({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const items = data.collectionShowcase?.items || [];
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section 
      id={sectionId} 
      ref={containerRef}
      className="relative w-full"
      style={{ 
        backgroundColor: data.style.backgroundColor,
        height: `${items.length * 100}vh` // 100vh per image
      }}
    >
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden bg-black">
        {items.map((item: any, idx: number) => {
          // Normalize item just in case
          const nItem = normalizeSectionData(item);
          
          const start = idx / items.length;
          const end = (idx + 1) / items.length;
          
          // Next item fades in over the current one
          // We don't fade out the current one so it blends smoothly beneath
          const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
          const scale = useTransform(scrollYProgress, [start, 1], [1.1, 1]); // Slow settle

          // The very first item should always be visible at the start
          const isFirst = idx === 0;

          return (
            <motion.div
              key={(nItem as any).id || idx}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: isFirst ? 1 : opacity,
                scale,
                zIndex: idx
              }}
            >
              <UniversalMediaRenderer 
                media={nItem.media} 
                className="w-full h-full object-cover" 
              />
              
              {/* Optional Text Overlay per slide */}
              {(nItem.content.heading || nItem.content.description) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                  <h3 
                    className="uppercase"
                    style={{
                      color: nItem.style.heading.textColor || "#ffffff",
                      fontSize: `clamp(1rem, ${nItem.style.heading.fontSize}vw, 2rem)`,
                      fontWeight: nItem.style.heading.fontWeight,
                      letterSpacing: "0.2em",
                      fontFamily: nItem.style.fontFamily
                    }}
                  >
                    {nItem.content.heading}
                  </h3>
                  <p 
                    className="mt-4"
                    style={{
                      color: nItem.style.description.textColor || "#ffffff",
                      fontSize: `clamp(0.8rem, ${nItem.style.description.fontSize}vw, 1.2rem)`,
                      fontWeight: nItem.style.description.fontWeight,
                      fontFamily: nItem.style.fontFamily
                    }}
                  >
                    {nItem.content.description}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

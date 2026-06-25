"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";

export default function MotionStorytelling({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rawText = data.content.description || "";
  const thoughts = rawText.split("\n").filter((l: string) => l.trim() !== "");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Very slow background pan
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      id={sectionId} 
      ref={containerRef}
      className="relative w-full"
      style={{ 
        backgroundColor: data.style.backgroundColor,
        height: `${thoughts.length * 100}vh`
      }}
    >
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden">
        {/* Cinematic Background Media */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <UniversalMediaRenderer media={data.media} className="w-full h-full object-cover opacity-60" />
        </motion.div>
        
        {/* Optional overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          {thoughts.map((thought: string, idx: number) => {
            const start = idx / thoughts.length;
            const end = (idx + 1) / thoughts.length;
            const peak = (start + end) / 2;

            const opacity = useTransform(scrollYProgress, [start, peak, end], [0, 1, 0]);
            const y = useTransform(scrollYProgress, [start, peak, end], [40, 0, -40]);

            return (
              <motion.div
                key={idx}
                className="absolute text-center max-w-4xl mx-auto"
                style={{ opacity, y }}
              >
                <p
                  style={{
                    color: data.style.description.textColor,
                    fontSize: `clamp(1.5rem, ${data.style.description.fontSize}vw, 3.5rem)`,
                    fontWeight: data.style.description.fontWeight,
                    letterSpacing: `${data.style.description.letterSpacing}em`,
                    lineHeight: data.style.description.lineHeight,
                    fontFamily: data.style.fontFamily,
                  }}
                >
                  {thought}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

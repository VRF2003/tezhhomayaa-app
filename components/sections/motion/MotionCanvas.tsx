"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";

export default function MotionCanvas({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Extremely subtle, elegant scale effect on scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section 
      id={sectionId} 
      ref={containerRef}
      className="relative w-full h-[120svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: data.style.backgroundColor }}
    >
      {/* Sticky wrapper to create a natural overlap effect with adjacent sections */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div 
          className="w-full h-full"
          style={{ scale, y }}
        >
          <UniversalMediaRenderer 
            media={data.media}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Optional Overlay Text */}
      {data.content.heading && (
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
            y: useTransform(scrollYProgress, [0, 1], [50, -50])
          }}
          className="relative z-10 px-6 text-center"
        >
          <h2 
            className="uppercase"
            style={{
              color: data.style.heading.textColor,
              fontSize: `clamp(1.5rem, ${data.style.heading.fontSize}vw, 4rem)`,
              fontWeight: data.style.heading.fontWeight,
              letterSpacing: `${data.style.heading.letterSpacing}em`,
              lineHeight: data.style.heading.lineHeight,
              fontFamily: data.style.fontFamily,
              textShadow: data.style.heading.textShadow
            }}
          >
            {data.content.heading}
          </h2>
        </motion.div>
      )}
    </section>
  );
}

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";

export default function MotionValues({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Massive heading scales out
  const headingScale = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 20]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);
  
  // Description fades in after heading scales past the camera
  const descOpacity = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [0, 1, 1]);
  const descY = useTransform(scrollYProgress, [0.5, 0.7], [50, 0]);
  
  // Optional background image evolves (scales and fades)
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.2, 0]);

  return (
    <section 
      id={sectionId} 
      ref={containerRef}
      className="relative w-full h-[200svh]"
      style={{ backgroundColor: data.style.backgroundColor }}
    >
      <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Media */}
        {(data.media.desktop?.url || data.media.mobile?.url) && (
          <motion.div 
            style={{ scale: bgScale, opacity: bgOpacity }} 
            className="absolute inset-0 w-full h-full"
          >
            <UniversalMediaRenderer media={data.media} className="w-full h-full object-cover" />
          </motion.div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <motion.h2
            style={{ 
              scale: headingScale, 
              opacity: headingOpacity,
              color: data.style.heading.textColor,
              fontSize: `clamp(3rem, ${data.style.heading.fontSize}vw, 12rem)`,
              fontWeight: data.style.heading.fontWeight,
              letterSpacing: `${data.style.heading.letterSpacing}em`,
              lineHeight: 1,
              fontFamily: data.style.fontFamily,
              textShadow: data.style.heading.textShadow
            }}
            className="text-center uppercase origin-center whitespace-pre-wrap"
          >
            {data.content.heading}
          </motion.h2>

          <motion.div
            style={{ opacity: descOpacity, y: descY }}
            className="absolute text-center max-w-5xl mx-auto px-6"
          >
            <p
              style={{
                color: data.style.description.textColor,
                fontSize: `clamp(1.2rem, ${data.style.description.fontSize}vw, 3rem)`,
                fontWeight: data.style.description.fontWeight,
                letterSpacing: `${data.style.description.letterSpacing}em`,
                lineHeight: data.style.description.lineHeight,
                fontFamily: data.style.fontFamily,
              }}
              className="whitespace-pre-wrap"
            >
              {data.content.description}
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function MotionManifesto({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rawText = data.content.description || "";
  const lines = rawText.split("\n").filter((l: string) => l.trim() !== "");

  return (
    <section 
      id={sectionId} 
      ref={containerRef}
      className="relative w-full"
      style={{ 
        backgroundColor: data.style.backgroundColor,
        height: `${lines.length * 100}vh` // 100vh per line to give plenty of scroll space
      }}
    >
      <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {lines.map((line: string, index: number) => {
          // Calculate when this line should appear
          const start = index / lines.length;
          const end = (index + 1) / lines.length;
          const peak = (start + end) / 2;

          // Fade in and out
          const opacity = useTransform(
            scrollYProgress, 
            [start, peak, end], 
            [0, 1, 0]
          );

          // Subtle upward movement
          const y = useTransform(
            scrollYProgress,
            [start, peak, end],
            [50, 0, -50]
          );
          
          // Subtle blur effect
          const filter = useTransform(
            scrollYProgress,
            [start, peak, end],
            ["blur(10px)", "blur(0px)", "blur(10px)"]
          );

          return (
            <motion.p
              key={index}
              className="absolute text-center"
              style={{
                opacity,
                y,
                filter,
                color: data.style.description.textColor,
                fontSize: `clamp(1.5rem, ${data.style.description.fontSize}vw, 4rem)`,
                fontWeight: data.style.description.fontWeight,
                letterSpacing: `${data.style.description.letterSpacing}em`,
                lineHeight: data.style.description.lineHeight,
                fontFamily: data.style.fontFamily,
              }}
            >
              {line}
            </motion.p>
          );
        })}
      </div>
    </section>
  );
}

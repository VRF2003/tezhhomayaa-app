"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function MotionFuture({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
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
        height: `${lines.length * 80}vh` // Lots of scroll room for whitespace
      }}
    >
      <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {lines.map((line: string, index: number) => {
          const start = index / lines.length;
          const end = (index + 1) / lines.length;
          const peak = (start + end) / 2;

          // Gentle fade in and fade out
          const opacity = useTransform(
            scrollYProgress, 
            [start, peak, end], 
            [0, 1, 0]
          );

          return (
            <motion.p
              key={index}
              className="absolute text-center max-w-4xl"
              style={{
                opacity,
                color: data.style.description.textColor,
                fontSize: `clamp(1.2rem, ${data.style.description.fontSize}vw, 3rem)`,
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

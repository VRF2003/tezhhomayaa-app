"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import Link from "next/link";

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
        height: `${lines.length * 80 + 50}vh` // Lots of scroll room for whitespace, plus 50vh for buttons
      }}
    >
      <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Persistent Heading / Subheading */}
        {(data.content.heading || data.content.subheading) && (
          <motion.div 
            className="absolute top-12 left-0 right-0 text-center flex flex-col items-center z-10 pointer-events-none"
            style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [1, 0]) }}
          >
            {data.content.subheading && (
              <h3 
                className="uppercase tracking-[0.2em] mb-2"
                style={{
                  color: data.style.subheading.textColor,
                  fontSize: `${data.style.subheading.fontSize * 0.8}rem`,
                  fontWeight: data.style.subheading.fontWeight,
                  letterSpacing: `${data.style.subheading.letterSpacing}em`,
                  fontFamily: data.style.fontFamily,
                  textShadow: data.style.subheading.textShadow
                }}
              >
                {data.content.subheading}
              </h3>
            )}
            {data.content.heading && (
              <h2 
                className="uppercase"
                style={{
                  color: data.style.heading.textColor,
                  fontSize: `clamp(1.2rem, ${data.style.heading.fontSize * 0.8}vw, 2.5rem)`,
                  fontWeight: data.style.heading.fontWeight,
                  letterSpacing: `${data.style.heading.letterSpacing}em`,
                  fontFamily: data.style.fontFamily,
                  textShadow: data.style.heading.textShadow
                }}
              >
                {data.content.heading}
              </h2>
            )}
          </motion.div>
        )}
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

        {/* Buttons at the end */}
        {(data.content.primaryButton.enabled || data.content.secondaryButton.enabled || data.content.tertiaryButton?.enabled) && (
          <motion.div
            className="absolute bottom-1/4 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-6"
            style={{ 
              opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]),
              y: useTransform(scrollYProgress, [0.9, 1], [50, 0]),
              pointerEvents: useTransform(scrollYProgress, v => v > 0.95 ? "auto" : "none") as any
            }}
          >
            {data.content.primaryButton.enabled && (
              <Link 
                href={data.content.primaryButton.url}
                className={`inline-block border uppercase tracking-[0.1em] transition-all duration-500 hover:bg-white hover:text-black ${
                  data.content.primaryButton.style === "luxury" ? "bg-[#1a1a18] text-white border-transparent" : "border-current"
                }`}
                style={{
                  color: data.style.button.textColor,
                  padding: data.style.button.padding,
                  fontSize: `${data.style.button.fontSize}rem`,
                }}
              >
                {data.content.primaryButton.label}
              </Link>
            )}
            
            {data.content.secondaryButton.enabled && (
              <Link 
                href={data.content.secondaryButton.url}
                className={`inline-block border uppercase tracking-[0.1em] transition-all duration-500 hover:bg-[#1a1a18] hover:text-white ${
                  data.content.secondaryButton.style === "luxury" ? "bg-white text-black border-transparent" : "border-current"
                }`}
                style={{
                  color: data.style.button.textColor,
                  padding: data.style.button.padding,
                  fontSize: `${data.style.button.fontSize}rem`,
                }}
              >
                {data.content.secondaryButton.label}
              </Link>
            )}

            {data.content.tertiaryButton?.enabled && (
              <Link 
                href={data.content.tertiaryButton.url}
                className="inline-block uppercase tracking-[0.1em] transition-all duration-500 opacity-70 hover:opacity-100 underline underline-offset-4"
                style={{
                  color: data.style.button.textColor,
                  fontSize: `${data.style.button.fontSize * 0.9}rem`,
                }}
              >
                {data.content.tertiaryButton.label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

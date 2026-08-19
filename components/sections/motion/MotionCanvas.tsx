"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";
import Link from "next/link";

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
      {(data.content.heading || data.content.subheading || data.content.description || data.content.primaryButton.enabled) && (
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
            y: useTransform(scrollYProgress, [0, 1], [50, -50])
          }}
          className="relative z-10 px-6 text-center flex flex-col items-center"
        >
          {data.content.subheading && (
            <h3 
              className="uppercase tracking-[0.2em] mb-4"
              style={{
                color: data.style.subheading.textColor,
                fontSize: `${data.style.subheading.fontSize}rem`,
                fontWeight: data.style.subheading.fontWeight,
                letterSpacing: `${data.style.subheading.letterSpacing}em`,
                lineHeight: data.style.subheading.lineHeight,
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
          )}

          {data.content.description && (
            <p
              className="mt-6 max-w-2xl whitespace-pre-wrap"
              style={{
                color: data.style.description.textColor,
                fontSize: `${data.style.description.fontSize}rem`,
                fontWeight: data.style.description.fontWeight,
                letterSpacing: `${data.style.description.letterSpacing}em`,
                lineHeight: data.style.description.lineHeight,
                fontFamily: data.style.fontFamily,
                textShadow: data.style.description.textShadow
              }}
            >
              {data.content.description}
            </p>
          )}

          {(data.content.primaryButton.enabled || data.content.secondaryButton.enabled || data.content.tertiaryButton?.enabled) && (
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
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
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

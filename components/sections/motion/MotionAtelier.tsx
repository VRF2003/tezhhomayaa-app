"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";
import Link from "next/link";
import { getResponsiveTypographyClass, injectTypographyOverrides } from "@/lib/typography";

export default function MotionAtelier({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const items = data.collectionShowcase?.items || [];
  
  const customTypo = data.typographyOverrides?.enabled;

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
        height: `${items.length * 100 + 50}vh`, // Extra 50vh for the buttons
        ...injectTypographyOverrides(data.typographyOverrides)
      }}
    >
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden bg-black">
        
        {/* Persistent Section Heading / Subheading */}
        {(data.content.heading || data.content.subheading || data.content.description) && (
          <motion.div 
            className="absolute top-12 left-0 right-0 text-center flex flex-col items-center z-10 pointer-events-none px-6"
            style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [1, 0]) }}
          >
            {data.content.subheading && (
              <h3 
                className={`uppercase tracking-[0.2em] mb-2 ${customTypo ? getResponsiveTypographyClass(data.style.subheading.fontSize) : ''}`}
                style={{
                  color: data.style.subheading.textColor,
                  fontSize: customTypo ? undefined : `${data.style.subheading.fontSize * 0.8}rem`,
                  fontWeight: data.style.subheading.fontWeight,
                  letterSpacing: `${data.style.subheading.letterSpacing}em`,
                  fontFamily: data.style.fontFamily,
                  textShadow: data.style.subheading.textShadow || "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                {data.content.subheading}
              </h3>
            )}
            {data.content.heading && (
              <h2 
                className={`uppercase ${customTypo ? getResponsiveTypographyClass(data.style.heading.fontSize) : ''}`}
                style={{
                  color: data.style.heading.textColor,
                  fontSize: customTypo ? undefined : `clamp(1.2rem, ${data.style.heading.fontSize * 0.8}vw, 2.5rem)`,
                  fontWeight: data.style.heading.fontWeight,
                  letterSpacing: `${data.style.heading.letterSpacing}em`,
                  fontFamily: data.style.fontFamily,
                  textShadow: data.style.heading.textShadow || "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                {data.content.heading}
              </h2>
            )}
            {data.content.description && (
              <p 
                className={`mt-4 max-w-2xl mx-auto ${customTypo ? getResponsiveTypographyClass(data.style.description.fontSize) : ''}`}
                style={{
                  color: data.style.description.textColor,
                  fontSize: customTypo ? undefined : `${data.style.description.fontSize * 0.8}rem`,
                  fontWeight: data.style.description.fontWeight,
                  letterSpacing: `${data.style.description.letterSpacing}em`,
                  fontFamily: data.style.fontFamily,
                  textShadow: data.style.description.textShadow || "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                {data.content.description}
              </p>
            )}
          </motion.div>
        )}
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

        {/* Buttons at the end */}
        {(data.content.primaryButton.enabled || data.content.secondaryButton.enabled || data.content.tertiaryButton?.enabled) && (
          <motion.div
            className="absolute bottom-1/4 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-6 z-20"
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

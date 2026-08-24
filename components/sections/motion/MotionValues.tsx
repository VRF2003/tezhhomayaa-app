"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import UniversalMediaRenderer from "../UniversalMediaRenderer";
import Link from "next/link";
import { getResponsiveTypographyClass, injectTypographyOverrides } from "@/lib/typography";

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

  const customTypo = data.typographyOverrides?.enabled;

  return (
    <section 
      id={sectionId} 
      ref={containerRef}
      className="relative w-full h-[200svh]"
      style={{ backgroundColor: data.style.backgroundColor, ...injectTypographyOverrides(data.typographyOverrides) }}
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
          <motion.div
            style={{ 
              scale: headingScale, 
              opacity: headingOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem"
            }}
            className="text-center origin-center"
          >
            {data.content.subheading && (
              <h3 
                className={`uppercase tracking-[0.2em] ${customTypo ? getResponsiveTypographyClass(data.style.subheading.fontSize) : ''}`}
                style={{
                  color: data.style.subheading.textColor,
                  fontSize: customTypo ? undefined : `${data.style.subheading.fontSize}rem`,
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
                className={`uppercase whitespace-pre-wrap ${customTypo ? getResponsiveTypographyClass(data.style.heading.fontSize) : ''}`}
                style={{ 
                  color: data.style.heading.textColor,
                  fontSize: customTypo ? undefined : `clamp(3rem, ${data.style.heading.fontSize}vw, 12rem)`,
                  fontWeight: data.style.heading.fontWeight,
                  letterSpacing: `${data.style.heading.letterSpacing}em`,
                  lineHeight: 1,
                  fontFamily: data.style.fontFamily,
                  textShadow: data.style.heading.textShadow
                }}
              >
                {data.content.heading}
              </h2>
            )}
          </motion.div>

          <motion.div
            style={{ opacity: descOpacity, y: descY }}
            className="absolute text-center max-w-5xl mx-auto px-6"
          >
            {data.content.description && (
              <p
                className={`whitespace-pre-wrap ${customTypo ? getResponsiveTypographyClass(data.style.description.fontSize) : ''}`}
                style={{
                  color: data.style.description.textColor,
                  fontSize: customTypo ? undefined : `clamp(1.2rem, ${data.style.description.fontSize}vw, 3rem)`,
                  fontWeight: data.style.description.fontWeight,
                  letterSpacing: `${data.style.description.letterSpacing}em`,
                  lineHeight: data.style.description.lineHeight,
                  fontFamily: data.style.fontFamily,
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
        </div>

      </div>
    </section>
  );
}

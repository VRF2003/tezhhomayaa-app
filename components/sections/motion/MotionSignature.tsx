"use client";

import React from "react";
import { motion } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import Link from "next/link";
import UniversalMediaRenderer from "../UniversalMediaRenderer";
import { getResponsiveTypographyClass, injectTypographyOverrides } from "@/lib/typography";

export default function MotionSignature({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);

  const customTypo = data.typographyOverrides?.enabled;

  return (
    <section 
      id={sectionId} 
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: data.style.backgroundColor, ...injectTypographyOverrides(data.typographyOverrides) }}
    >
      {/* Background Media */}
      {(data.media.desktop?.url || data.media.mobile?.url) && (
        <div className="absolute inset-0 w-full h-full">
          <UniversalMediaRenderer 
            media={data.media}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      )}
      
      {/* Optional Gradient Overlay for Readability */}
      {(data.media.desktop?.url || data.media.mobile?.url) && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex flex-col items-center justify-center space-y-12 text-center px-6"
      >
        <h1 
          className={`font-light tracking-[0.2em] ${customTypo ? getResponsiveTypographyClass(data.style.subheading.fontSize) : ''}`}
          style={{ 
            color: data.style.subheading.textColor || data.style.textColor,
            fontSize: customTypo ? undefined : "clamp(1.5rem, 4vw, 3rem)",
            fontFamily: data.style.fontFamily 
          }}
        >
          {data.content.subheading || "TEZHHOMAYAA"}
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
          className={`uppercase ${customTypo ? getResponsiveTypographyClass(data.style.heading.fontSize) : ''}`}
          style={{
            color: data.style.heading.textColor,
            fontSize: customTypo ? undefined : `${data.style.heading.fontSize}rem`,
            fontWeight: data.style.heading.fontWeight,
            letterSpacing: `${data.style.heading.letterSpacing}em`,
            lineHeight: data.style.heading.lineHeight,
            fontFamily: data.style.fontFamily,
          }}
        >
          {data.content.heading}
        </motion.h2>

        {data.content.description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
            className={`max-w-2xl mx-auto whitespace-pre-wrap ${customTypo ? getResponsiveTypographyClass(data.style.description.fontSize) : ''}`}
            style={{
              color: data.style.description.textColor,
              fontSize: customTypo ? undefined : `${data.style.description.fontSize}rem`,
              fontWeight: data.style.description.fontWeight,
              letterSpacing: `${data.style.description.letterSpacing}em`,
              lineHeight: data.style.description.lineHeight,
              fontFamily: data.style.fontFamily,
            }}
          >
            {data.content.description}
          </motion.p>
        )}

        {(data.content.primaryButton.enabled || data.content.secondaryButton.enabled || data.content.tertiaryButton?.enabled) && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 2, delay: 2, ease: "easeOut" }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
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
      </motion.div>
    </section>
  );
}

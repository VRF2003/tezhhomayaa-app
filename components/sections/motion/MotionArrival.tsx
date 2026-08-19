"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";
import Link from "next/link";

export default function MotionArrival({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const [phase, setPhase] = useState<"logo" | "text">("logo");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("text");
    }, 4000); // Logo stays for 4s then switches
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id={sectionId} 
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: data.style.backgroundColor }}
    >
      <AnimatePresence mode="wait">
        {phase === "logo" && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center"
          >
            <h1 
              className="font-light tracking-[0.2em] text-center"
              style={{ 
                color: data.style.subheading.textColor || data.style.textColor,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontFamily: data.style.fontFamily 
              }}
            >
              {data.content.subheading || "TEZHHOMAYAA"}
            </h1>
          </motion.div>
        )}

        {phase === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center px-6"
          >
            <motion.h2
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="uppercase"
              style={{
                color: data.style.heading.textColor,
                fontSize: `${data.style.heading.fontSize}rem`,
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                className="max-w-2xl mx-auto whitespace-pre-wrap mt-8"
                style={{
                  color: data.style.description.textColor,
                  fontSize: `${data.style.description.fontSize}rem`,
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
                animate={{ opacity: 1 }}
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
        )}
      </AnimatePresence>
    </section>
  );
}

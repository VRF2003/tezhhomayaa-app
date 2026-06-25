"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";

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
                color: data.style.textColor,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontFamily: data.style.fontFamily 
              }}
            >
              TEZHHOMAYAA
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

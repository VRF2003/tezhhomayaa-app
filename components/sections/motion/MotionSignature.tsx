"use client";

import React from "react";
import { motion } from "framer-motion";
import { normalizeSectionData } from "@/lib/types/homepage";
import Link from "next/link";

export default function MotionSignature({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);

  return (
    <section 
      id={sectionId} 
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: data.style.backgroundColor }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex flex-col items-center justify-center space-y-12 text-center px-6"
      >
        <h1 
          className="font-light tracking-[0.2em]"
          style={{ 
            color: data.style.textColor,
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
            fontFamily: data.style.fontFamily 
          }}
        >
          TEZHHOMAYAA
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
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

        {data.content.primaryButton.enabled && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 2, delay: 2, ease: "easeOut" }}
            className="pt-8"
          >
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
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

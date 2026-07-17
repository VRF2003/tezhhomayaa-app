import React from "react";
import { motion } from "framer-motion";
import { ARRIVAL_CONFIG } from "../lib/arrival/config";
import { mapFadeVariants } from "../lib/arrival/animations";

export function ArrivalFooter() {
  return (
    <motion.footer 
      variants={mapFadeVariants}
      initial="hidden"
      animate="visible"
      className="w-full py-8 px-6 flex justify-center text-[#FDFBF7]"
    >
      <ul className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-[10px] md:text-xs tracking-widest text-gray-400 uppercase" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
        {ARRIVAL_CONFIG.footerLinks.map((link, idx) => (
          <li key={idx}>
            <a 
              href={link.href} 
              className={`hover:text-white transition-colors duration-300 ${link.label.includes("Language") ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={(e) => link.label.includes("Language") && e.preventDefault()}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.footer>
  );
}

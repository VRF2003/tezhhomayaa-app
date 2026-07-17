import React from "react";
import { motion } from "framer-motion";
import { useArrival } from "../hooks/useArrival";
import { ARRIVAL_CONFIG } from "../lib/arrival/config";
import { mapFadeUpVariants, mapStaggerContainer } from "../lib/arrival/animations";

export function MarketRegionScreen() {
  const { setRegion } = useArrival();

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <motion.div 
        variants={mapStaggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg flex flex-col items-center"
      >
        {/* Region List */}
        <motion.ul variants={mapFadeUpVariants} className="w-full space-y-4 px-4">
          {ARRIVAL_CONFIG.regions.map((region) => (
            <li key={region.id} className="w-full">
              <button
                onClick={() => setRegion(region.id)}
                className="group w-full flex items-center justify-between text-left transition-all duration-400 py-4 hover:opacity-70"
              >
                <div className="flex items-center space-x-6 transition-transform duration-400 group-hover:translate-x-[4px]">
                  <span 
                    className="text-2xl md:text-3xl font-light text-white transition-colors duration-400"
                    style={{ fontFamily: "var(--font-cormorant, serif)" }}
                  >
                    {region.label}
                  </span>
                </div>
                <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { useArrival } from "../hooks/useArrival";
import { mapFadeUpVariants, mapStaggerContainer } from "../lib/arrival/animations";

export function ArrivalSequenceScreen() {
  const { setStep } = useArrival();

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center text-center px-4">
      <motion.div 
        variants={mapStaggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-md"
      >
        <motion.h3 
          variants={mapFadeUpVariants}
          className="text-2xl font-light mb-4 text-white"
          style={{ fontFamily: "var(--font-cormorant, serif)" }}
        >
          Arrival Sequence
        </motion.h3>
        
        <motion.p 
          variants={mapFadeUpVariants}
          className="text-gray-400 font-light mb-12"
          style={{ fontFamily: "var(--font-inter, sans-serif)" }}
        >
          Placeholder for Phase 2.6.x
        </motion.p>
        
        <motion.div variants={mapFadeUpVariants} className="flex gap-4 justify-center">
          <button
            onClick={() => setStep("LANGUAGE")}
            className="px-8 py-3 text-xs tracking-widest uppercase border border-gray-700 text-gray-300 hover:text-white hover:border-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

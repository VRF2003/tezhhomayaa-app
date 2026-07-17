import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ARRIVAL_CONFIG } from "../lib/arrival/config";
import { mapFadeUpVariants, mapStaggerContainer } from "../lib/arrival/animations";
import { useArrival } from "../hooks/useArrival";
import Image from "next/image";

export function ArrivalHeader() {
  const { currentStep, selectedRegion } = useArrival();

  const regionLabel = selectedRegion 
    ? ARRIVAL_CONFIG.regions.find(r => r.id === selectedRegion)?.label 
    : null;

  return (
    <header className="w-full pb-8 flex flex-col items-center text-center text-[#FDFBF7]">
      <motion.div
        variants={mapStaggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full"
      >


        <AnimatePresence mode="wait">
          {currentStep === "REGION" ? (
            <motion.div 
              key="region-header"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p 
                className="text-xs md:text-sm text-gray-400 font-light mb-4 tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                Welcome
              </p>
              <h2 
                className="text-3xl md:text-4xl font-light tracking-wide"
                style={{ fontFamily: "var(--font-cormorant, serif)" }}
              >
                Select your Region
              </h2>
            </motion.div>
          ) : currentStep === "COUNTRY" ? (
            <motion.div
              key="country-header"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p 
                className="text-[10px] md:text-xs text-gray-400 font-light mb-4 tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {regionLabel || "Region"}
              </p>
              <h2 
                className="text-3xl md:text-4xl font-light tracking-wide"
                style={{ fontFamily: "var(--font-cormorant, serif)" }}
              >
                Choose your Country
              </h2>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

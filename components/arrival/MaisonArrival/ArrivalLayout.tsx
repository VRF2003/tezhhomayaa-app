import React, { ReactNode, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrivalBackground } from "./ArrivalBackground";
import { ArrivalHeader } from "./ArrivalHeader";
import { ArrivalFooter } from "./ArrivalFooter";
import { useArrival } from "../hooks/useArrival";
import { useMarketSelector } from "@/hooks/useMarketSelector";

export function ArrivalLayout({ children }: { children: ReactNode }) {
  const { isArrivalComplete, resetArrival } = useArrival();
  const { isOpen } = useMarketSelector();

  useEffect(() => {
    // If the market selector is triggered to open (e.g. from the footer button)
    // we must reset the internal arrival state so it starts from the Region screen again.
    if (isOpen) {
      resetArrival();
    }
  }, [isOpen]); // Only depend on isOpen so we don't accidentally reset infinitely

  // Only show if the market selector is triggered AND arrival is not internally complete
  const shouldRender = isOpen && !isArrivalComplete;

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="maison-arrival"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden selection:bg-white/20 selection:text-white bg-[#111111]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
        >
          <ArrivalBackground />
          
          {/* Logo Header (Fixed at top, matching website header layout exactly) */}
          <div 
            className="absolute top-0 left-0 right-0 z-20 pointer-events-none" 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr auto 1fr", 
              alignItems: "center", 
              padding: "0 clamp(1rem, 4vw, 3rem)", 
              height: "80px" 
            }}
          >
            <div />
            <div className="flex items-center justify-center" style={{ paddingTop: "0.4rem" }}>
              <div className="relative w-[280px] md:w-[420px] h-[38px] md:h-[50px]">
                <Image 
                  src="/branding/tezhhomayaa-logo-v3.png" 
                  alt="Tezhhomayaa"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div />
          </div>

          {/* Main Content Area */}
          <main className="w-full flex-1 flex flex-col items-center justify-center relative z-10 py-12 pt-[100px]">
            <ArrivalHeader />
            {children}
          </main>

          <ArrivalFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

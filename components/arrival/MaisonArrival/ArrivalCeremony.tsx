import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CEREMONY_THEMES } from "../lib/arrival/CeremonyTheme";
import { CEREMONY_TIMELINE } from "../lib/arrival/CeremonyTimeline";
import { ceremonyFade, ceremonyFadeUp, CEREMONY_EASING } from "../lib/arrival/MotionConfig";
import { useArrival } from "../hooks/useArrival";
import { ARRIVAL_CONFIG } from "../lib/arrival/config";

interface ArrivalCeremonyProps {
  onCeremonyComplete: () => void;
}

export function ArrivalCeremony({ onCeremonyComplete }: ArrivalCeremonyProps) {
  const { selectedRegion, selectedCountry } = useArrival();
  
  // Pick theme (e.g. Golden Dusk)
  const theme = CEREMONY_THEMES["golden-dusk"];
  
  // State for choreography
  const [stage, setStage] = useState(0);

  // Resolve country label
  const countryObj = selectedRegion && selectedCountry 
    ? ARRIVAL_CONFIG.countries[selectedRegion]?.find(c => c.id === selectedCountry)
    : null;
    
  // Prepare dynamic text
  const headline = theme.headline.replace("{country}", countryObj?.label || "the World");

  // Choreography Timeline execution
  useEffect(() => {
    // 0.4s: Headline
    const t1 = setTimeout(() => setStage(1), CEREMONY_TIMELINE.FADE_IN_HEADLINE * 1000);
    // 0.9s: Closing Message
    const t2 = setTimeout(() => setStage(2), CEREMONY_TIMELINE.FADE_IN_CLOSING * 1000);
    // 1.4s: Shared Element Transition Begins
    const t3 = setTimeout(() => setStage(3), CEREMONY_TIMELINE.START_SHARED_TRANSITION * 1000);
    
    // 2.0s: Handoff to Orchestrator
    const t4 = setTimeout(() => {
      onCeremonyComplete();
    }, CEREMONY_TIMELINE.TOTAL_DURATION_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onCeremonyComplete]);

  // If we are at stage 3, we begin fading the background and moving the logo
  const isTransitioning = stage >= 3;

  return (
    <motion.div 
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.8, ease: CEREMONY_EASING }}
      style={{
        background: `radial-gradient(circle at center, ${theme.backgroundColors[0]} 0%, ${theme.backgroundColors[1]} 50%, ${theme.backgroundColors[2]} 100%)`
      }}
    >
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.webp')" }}
      />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center text-center px-6 space-y-12">
        


        {/* TYPOGRAPHY CASCADE */}
        <div className="flex flex-col items-center justify-center w-full space-y-8">
          {/* Headline */}
          <motion.div
            initial="hidden"
            animate={stage >= 1 && !isTransitioning ? "visible" : "hidden"}
            variants={ceremonyFadeUp}
            className="flex flex-col items-center"
          >
            <h2 
              className="text-4xl md:text-5xl font-light tracking-wide text-[#FDFBF7]"
              style={{ fontFamily: "var(--font-cormorant, serif)" }}
            >
              {headline}
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Closing Message */}
      <motion.div
        initial="hidden"
        animate={stage >= 2 && !isTransitioning ? "visible" : "hidden"}
        variants={ceremonyFade}
        className="absolute bottom-12 md:bottom-24"
      >
        <p 
          className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-400 font-light"
          style={{ fontFamily: "var(--font-inter, sans-serif)" }}
        >
          Enter Tezhhomayaa
        </p>
      </motion.div>
    </motion.div>
  );
}

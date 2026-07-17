import React from "react";
import { useArrival } from "../hooks/useArrival";
import { ArrivalLayout } from "./ArrivalLayout";
import { MarketRegionScreen } from "./MarketRegionScreen";
import { MarketCountryScreen } from "./MarketCountryScreen";
import { ArrivalCeremony } from "./ArrivalCeremony";
import { useArrivalOrchestrator } from "../lib/arrival/ArrivalOrchestrator";
import { AnimatePresence, motion } from "framer-motion";

export function MaisonArrival() {
  const { currentStep } = useArrival();
  const { onCeremonyComplete } = useArrivalOrchestrator();

  const renderStep = () => {
    switch (currentStep) {
      case "REGION":
        return <MarketRegionScreen key="REGION" />;
      case "COUNTRY":
        return <MarketCountryScreen key="COUNTRY" />;
      case "SEQUENCE":
        return <ArrivalCeremony key="SEQUENCE" onCeremonyComplete={onCeremonyComplete} />;
      default:
        return null;
    }
  };

  return (
    <ArrivalLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full flex flex-col items-center justify-center"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </ArrivalLayout>
  );
}

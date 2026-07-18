"use client";

import { useMarket } from "@/lib/market/MarketContext";
import { useArrival } from "../../hooks/useArrival";
import { createMarketFromArrival } from "./MarketBridge";
import { useMarketSelector } from "@/hooks/useMarketSelector";
import { useGlobalExperience } from "@/lib/global-experience/hooks/useGlobalExperience";
import { MarketBridge } from "@/lib/global-experience/MarketBridge";

import { startTransition } from "react";

/**
 * ArrivalOrchestrator
 *
 * The single point of coordination between:
 *   - Maison Arrival Platform (Presentation Layer)
 *   - Commerce Market Engine (existing commerce system)
 *   - Global Experience Engine (new GEE)
 *
 * Architecture principle:
 *   - The Arrival Platform does NOT know about Commerce or GEE.
 *   - The Homepage does NOT know how the user selected their market.
 *   - The Orchestrator is the ONLY object that knows about both systems.
 *   - The GEE MarketBridge is the ONLY object that resolves Arrival inputs
 *     into a validated GEE Market.
 */
export function useArrivalOrchestrator() {
  const { setMarket: setCommerceMarket } = useMarket();
  const { selectedRegion, selectedCountry, selectedLanguage, completeArrival } = useArrival();
  const { closeSelector } = useMarketSelector();
  const { setMarket: setGlobalExperienceMarket } = useGlobalExperience();

  const handleCeremonyComplete = () => {
    // Wrap the state updates in a React Transition.
    // This allows Next.js to suspend the unmounting of the Arrival modal
    // until the new Server Components (the updated banner) have been fetched.
    // This entirely prevents the "flicker" of the old market banner.
    startTransition(() => {
      // ── STEP 1: Bridge to Global Experience Engine ─────────────────────────
      const bridgeResult = MarketBridge.resolve(
        selectedRegion,
        selectedCountry,
        selectedLanguage
      );

      if (bridgeResult.success) {
        setGlobalExperienceMarket(bridgeResult.market.id);
      } else {
        console.error(
          `[ArrivalOrchestrator] GEE MarketBridge failed (${bridgeResult.code}): ${bridgeResult.error}`
        );
      }

      // ── STEP 2: Bridge to existing Commerce Market Engine ──────────────────
      const commerceMarketCode = createMarketFromArrival(
        selectedRegion,
        selectedCountry,
        selectedLanguage
      );
      
      setCommerceMarket(commerceMarketCode);

      // ── STEP 3: Finalize the Arrival Platform ──────────────────────────────
      completeArrival();

      // ── STEP 4: Close the MarketUI Selector ────────────────────────────────
      closeSelector();
    });
  };

  return {
    onCeremonyComplete: handleCeremonyComplete,
  };
}

"use client";

import { useMarket } from "@/lib/market/MarketContext";
import { useArrival } from "../../hooks/useArrival";
import { createMarketFromArrival } from "./MarketBridge";
import { useMarketSelector } from "@/hooks/useMarketSelector";
import { useGlobalExperience } from "@/lib/global-experience/hooks/useGlobalExperience";
import { MarketBridge } from "@/lib/global-experience/MarketBridge";

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

  const handleCeremonyComplete = async () => {
    // ── STEP 1: Bridge to Global Experience Engine ─────────────────────────
    // The GEE MarketBridge receives raw Arrival selections and resolves a
    // validated Market from the Global Experience Registry.
    // It never throws — any failure returns a structured error object.
    const bridgeResult = MarketBridge.resolve(
      selectedRegion,
      selectedCountry,
      selectedLanguage
    );

    if (bridgeResult.success) {
      // Commit the validated Market to the Global Experience Context.
      // This initializes the active experience (locale, currency, timezone, etc.)
      // before the Homepage renders.
      setGlobalExperienceMarket(bridgeResult.market.id);
    } else {
      // Log the structured error but do NOT crash or block navigation.
      // The GEE will gracefully remain on its global default market.
      console.error(
        `[ArrivalOrchestrator] GEE MarketBridge failed (${bridgeResult.code}): ${bridgeResult.error}`
      );
    }

    // ── STEP 2: Bridge to existing Commerce Market Engine ──────────────────
    // The legacy MarketBridge continues to handle the commerce layer
    // (currency context, pricing, etc.) exactly as before.
    // No changes were made to this system.
    const commerceMarketCode = createMarketFromArrival(
      selectedRegion,
      selectedCountry,
      selectedLanguage
    );
    await setCommerceMarket(commerceMarketCode);

    // ── STEP 3: Finalize the Arrival Platform ──────────────────────────────
    // Signal the Arrival Platform that selection is complete.
    // This unmounts the MAP overlay and reveals the Homepage.
    completeArrival();

    // ── STEP 4: Close the MarketUI Selector ────────────────────────────────
    // Ensures the market selector overlay does not re-mount after dismissal.
    closeSelector();
  };

  return {
    onCeremonyComplete: handleCeremonyComplete,
  };
}

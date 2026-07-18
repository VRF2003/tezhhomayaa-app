import { useMemo } from "react";
import { useExperienceServices } from "../services";
import { ExperienceUtilities } from "./ExperienceUtilities";

/**
 * useExperienceUtilities
 *
 * The primary hook for accessing business logic utilities in the GEE.
 *
 * Usage:
 * const experience = useExperienceUtilities();
 * experience.locale.getLocale();
 * experience.currency.getCurrencyCode();
 */
export function useExperienceUtilities(): ExperienceUtilities {
  const services = useExperienceServices();

  return useMemo(() => {
    return new ExperienceUtilities(services);
  }, [services]);
}

export { ExperienceUtilities } from "./ExperienceUtilities";
export { MarketResolver } from "./MarketResolver";
export { LocaleResolver } from "./LocaleResolver";
export { CurrencyResolver } from "./CurrencyResolver";
export { TimezoneResolver } from "./TimezoneResolver";
export { RegionResolver } from "./RegionResolver";

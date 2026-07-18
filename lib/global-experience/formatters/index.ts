import { useMemo } from "react";
import { useExperienceUtilities } from "../utilities";
import { CurrencyFormatter } from "./CurrencyFormatter";
import { DateFormatter } from "./DateFormatter";
import { TimeFormatter } from "./TimeFormatter";
import { NumberFormatter } from "./NumberFormatter";

/**
 * useCurrencyFormatter
 * 
 * The primary hook for accessing locale-aware currency formatting in the presentation layer.
 */
export function useCurrencyFormatter(): CurrencyFormatter {
  const utilities = useExperienceUtilities();
  
  return useMemo(() => {
    return new CurrencyFormatter(utilities);
  }, [utilities]);
}

export function useDateFormatter(): DateFormatter {
  const utilities = useExperienceUtilities();
  return useMemo(() => new DateFormatter(utilities), [utilities]);
}

export function useTimeFormatter(): TimeFormatter {
  const utilities = useExperienceUtilities();
  return useMemo(() => new TimeFormatter(utilities), [utilities]);
}

export function useNumberFormatter(): NumberFormatter {
  const utilities = useExperienceUtilities();
  return useMemo(() => new NumberFormatter(utilities), [utilities]);
}

export { CurrencyFormatter } from "./CurrencyFormatter";
export { DateFormatter } from "./DateFormatter";
export { TimeFormatter } from "./TimeFormatter";
export { NumberFormatter } from "./NumberFormatter";

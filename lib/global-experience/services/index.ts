/**
 * Experience Services — Public API Barrel
 *
 * This is the ONLY import path components should use to interact
 * with the Global Experience Engine services layer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PRIMARY EXPORT — the hook every component should call
 * ─────────────────────────────────────────────────────────────────────────
 *
 *   import { useExperienceServices } from "@/lib/global-experience/services";
 *
 *   const services = useExperienceServices();
 *   services.getLocale()         // "en-IN"
 *   services.getCurrencyCode()   // "INR"
 *   services.getTimezone()       // "Asia/Kolkata"
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TYPE EXPORTS — for typing props, callbacks, and service consumers
 * ─────────────────────────────────────────────────────────────────────────
 *
 *   ExperienceServices   — the full services interface
 *   CurrencySnapshot     — { code, symbol }
 *   LocaleSnapshot       — { locale, language, country, countryCode, region, marketId }
 *   TimezoneSnapshot     — { ianaTimezone }
 *   DateSnapshot         — { dateLocale }
 *   NumberSnapshot       — { numberLocale }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DO NOT import individual service classes (CurrencyService, LocaleService,
 * etc.) outside of the services/ directory. They are internal implementation
 * details. Only ExperienceServices and its types are public.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Primary hook ─────────────────────────────────────────────────────────────
export { useExperienceServices } from "./ExperienceServices";
export type { ExperienceServices } from "./ExperienceServices";

// ── Snapshot types ────────────────────────────────────────────────────────────
export type { CurrencySnapshot } from "./CurrencyService";
export type { LocaleSnapshot } from "./LocaleService";
export type { TimezoneSnapshot } from "./TimezoneService";
export type { DateSnapshot } from "./DateService";
export type { NumberSnapshot } from "./NumberService";

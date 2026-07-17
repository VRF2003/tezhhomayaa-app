"use client";

import { useMemo } from "react";
import { useGlobalExperience } from "../hooks/useGlobalExperience";
import { CurrencyService, CurrencySnapshot } from "./CurrencyService";
import { LocaleService, LocaleSnapshot } from "./LocaleService";
import { TimezoneService, TimezoneSnapshot } from "./TimezoneService";
import { DateService, DateSnapshot } from "./DateService";
import { NumberService, NumberSnapshot } from "./NumberService";

/**
 * ExperienceServices
 *
 * The public API surface for the Global Experience Engine.
 *
 * This is the ONLY object that UI components should import from the GEE.
 * Components must never import from:
 *   - GlobalExperienceContext directly
 *   - GlobalExperienceRegistry
 *   - Individual service files (CurrencyService, LocaleService, etc.)
 *   - Market or Region types
 *
 * ─────────────────────────────────────────────────────────────
 * ARCHITECTURE PRINCIPLE
 * ─────────────────────────────────────────────────────────────
 *
 *   Component
 *       ↓
 *   useExperienceServices()   ← single import
 *       ↓
 *   ExperienceServices        ← this aggregator
 *       ↓
 *   Individual Services       ← CurrencyService, LocaleService…
 *       ↓
 *   GlobalExperienceContext   ← single context read
 *       ↓
 *   GlobalExperienceRegistry  ← single source of truth
 *
 * ─────────────────────────────────────────────────────────────
 * WHAT IS EXPOSED
 * ─────────────────────────────────────────────────────────────
 *
 * Snapshots — lightweight value objects per domain:
 *   currency  → CurrencySnapshot  { code, symbol }
 *   locale    → LocaleSnapshot    { locale, language, country, … }
 *   timezone  → TimezoneSnapshot  { ianaTimezone }
 *   date      → DateSnapshot      { dateLocale }
 *   number    → NumberSnapshot    { numberLocale }
 *
 * Named accessors — individual primitives for convenience:
 *   getCurrencyCode()
 *   getCurrencySymbol()
 *   getLocale()
 *   getLanguage()
 *   getCountry()
 *   getCountryCode()
 *   getRegion()
 *   getMarketId()
 *   getTimezone()
 *   getDateLocale()
 *   getNumberLocale()
 *
 * ─────────────────────────────────────────────────────────────
 * WHAT IS NOT EXPOSED
 * ─────────────────────────────────────────────────────────────
 *
 *   × Price formatting        (future CurrencyFormattingService)
 *   × Date formatting         (future DateFormattingService)
 *   × Number formatting       (future NumberFormattingService)
 *   × Translations            (future TranslationService)
 *   × CMS queries             (future CMSLocalizationService)
 *   × Timezone conversion     (future DateFormattingService)
 *   × Route localization      (future LocalizationRouter)
 */
export interface ExperienceServices {
  // ── Snapshots ────────────────────────────────────────────────────────────
  /** Currency identity for the active market. */
  readonly currency: CurrencySnapshot;
  /** Full locale identity for the active market. */
  readonly locale: LocaleSnapshot;
  /** Timezone identity for the active market. */
  readonly timezone: TimezoneSnapshot;
  /** Date format configuration for the active market. */
  readonly date: DateSnapshot;
  /** Number format configuration for the active market. */
  readonly number: NumberSnapshot;

  // ── Currency Accessors ───────────────────────────────────────────────────
  /** ISO 4217 currency code. e.g. "INR", "AED", "CAD" */
  getCurrencyCode(): string;
  /** Currency symbol. e.g. "₹", "د.إ", "CA$" */
  getCurrencySymbol(): string;

  // ── Locale Accessors ────────────────────────────────────────────────────
  /** BCP 47 locale tag. e.g. "en-IN", "ar-AE", "fr-CA" */
  getLocale(): string;
  /** Human-readable language name. e.g. "English", "Arabic" */
  getLanguage(): string;
  /** Human-readable country name. e.g. "India", "United Arab Emirates" */
  getCountry(): string;
  /** ISO 3166-1 alpha-2 country code. e.g. "IN", "AE", "CA" */
  getCountryCode(): string;
  /** Strongly-typed Region ID. e.g. "asia-pacific", "middle-east" */
  getRegion(): string;
  /** Canonical Market ID. e.g. "in-en", "ae-ar", "ca-fr" */
  getMarketId(): string;

  // ── Timezone Accessor ────────────────────────────────────────────────────
  /** IANA timezone identifier. e.g. "Asia/Kolkata", "Asia/Dubai" */
  getTimezone(): string;

  // ── Date Accessor ────────────────────────────────────────────────────────
  /** BCP 47 locale for Intl.DateTimeFormat. e.g. "en-IN", "ar-AE" */
  getDateLocale(): string;

  // ── Number Accessor ──────────────────────────────────────────────────────
  /** BCP 47 locale for Intl.NumberFormat. e.g. "en-IN", "ar-AE" */
  getNumberLocale(): string;
}

/**
 * useExperienceServices
 *
 * The primary React hook for consuming the Global Experience Engine.
 * This is the ONLY entry point components should use.
 *
 * All returned values are memoized against the active market — if the
 * market has not changed, no downstream re-renders are triggered.
 *
 * Usage:
 * ```ts
 * const services = useExperienceServices();
 *
 * services.getCurrencyCode()   // "INR"
 * services.getLocale()         // "en-IN"
 * services.getTimezone()       // "Asia/Kolkata"
 * services.currency.symbol     // "₹"
 * services.locale.region       // "asia-pacific"
 * ```
 *
 * Must be used within a component tree wrapped by <GlobalExperienceProvider>.
 */
export function useExperienceServices(): ExperienceServices {
  const { activeMarket } = useGlobalExperience();

  return useMemo<ExperienceServices>(() => {
    // Build all snapshots once per market change.
    // Individual service classes perform the field extraction —
    // ExperienceServices only aggregates and exposes them.
    const currencySnapshot = CurrencyService.fromMarket(activeMarket);
    const localeSnapshot = LocaleService.fromMarket(activeMarket);
    const timezoneSnapshot = TimezoneService.fromMarket(activeMarket);
    const dateSnapshot = DateService.fromMarket(activeMarket);
    const numberSnapshot = NumberService.fromMarket(activeMarket);

    return {
      // ── Snapshots ────────────────────────────────────────────────────────
      currency: currencySnapshot,
      locale: localeSnapshot,
      timezone: timezoneSnapshot,
      date: dateSnapshot,
      number: numberSnapshot,

      // ── Currency Accessors ───────────────────────────────────────────────
      getCurrencyCode: () => currencySnapshot.code,
      getCurrencySymbol: () => currencySnapshot.symbol,

      // ── Locale Accessors ─────────────────────────────────────────────────
      getLocale: () => localeSnapshot.locale,
      getLanguage: () => localeSnapshot.language,
      getCountry: () => localeSnapshot.country,
      getCountryCode: () => localeSnapshot.countryCode,
      getRegion: () => localeSnapshot.region,
      getMarketId: () => localeSnapshot.marketId,

      // ── Timezone Accessor ────────────────────────────────────────────────
      getTimezone: () => timezoneSnapshot.ianaTimezone,

      // ── Date Accessor ────────────────────────────────────────────────────
      getDateLocale: () => dateSnapshot.dateLocale,

      // ── Number Accessor ──────────────────────────────────────────────────
      getNumberLocale: () => numberSnapshot.numberLocale,
    };
  }, [activeMarket]);
}

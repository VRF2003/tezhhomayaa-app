import { Market } from "../types/market";
import { RegionId } from "../types/region";

/**
 * LocaleSnapshot
 *
 * A read-only value object containing all locale-identity primitives
 * for the active market. Contains NO translation logic or string lookups.
 *
 * Every future localization feature (CMS queries, Intl adapters, route
 * generation, SEO hreflang tags) will read from this snapshot rather than
 * from the raw Market or GlobalExperienceContext directly.
 */
export interface LocaleSnapshot {
  /** BCP 47 locale tag. e.g. "en-IN", "ar-AE", "fr-CA" */
  readonly locale: string;
  /** Human-readable language name. e.g. "English", "Arabic", "French" */
  readonly language: string;
  /** Human-readable country name. e.g. "India", "United Arab Emirates" */
  readonly country: string;
  /** ISO 3166-1 alpha-2 country code. e.g. "IN", "AE", "CA" */
  readonly countryCode: string;
  /** Strongly-typed Region ID. e.g. "asia-pacific", "middle-east" */
  readonly region: RegionId;
  /** Canonical Market ID. e.g. "in-en", "ae-ar", "ca-fr" */
  readonly marketId: string;
}

/**
 * LocaleService
 *
 * Responsibility: Expose locale identity primitives from the active market.
 *
 * This service does NOT:
 * - Translate strings
 * - Look up dictionaries
 * - Generate localized routes
 * - Produce hreflang tags
 * - Use Intl.DisplayNames or similar APIs
 *
 * Those responsibilities belong to a dedicated TranslationService and
 * LocalizationRouter in future phases.
 */
export class LocaleService {
  /**
   * Extract a LocaleSnapshot from a Market.
   * Called by ExperienceServices with the active market from context.
   */
  static fromMarket(market: Market): LocaleSnapshot {
    return {
      locale: market.locale,
      language: market.language,
      country: market.country,
      countryCode: market.countryCode,
      region: market.region,
      marketId: market.id,
    };
  }

  /**
   * Returns the BCP 47 locale tag for the active market.
   * e.g. "en-IN", "ar-AE", "fr-CA"
   */
  static getLocale(market: Market): string {
    return market.locale;
  }

  /**
   * Returns the human-readable language name.
   * e.g. "English", "Arabic", "French"
   */
  static getLanguage(market: Market): string {
    return market.language;
  }

  /**
   * Returns the human-readable country name.
   * e.g. "India", "United Arab Emirates"
   */
  static getCountry(market: Market): string {
    return market.country;
  }

  /**
   * Returns the ISO 3166-1 alpha-2 country code.
   * e.g. "IN", "AE", "CA"
   */
  static getCountryCode(market: Market): string {
    return market.countryCode;
  }

  /**
   * Returns the strongly-typed Region ID.
   * e.g. "asia-pacific", "middle-east", "europe", "north-america"
   */
  static getRegion(market: Market): RegionId {
    return market.region;
  }

  /**
   * Returns the canonical Market ID.
   * e.g. "in-en", "ae-ar", "ca-fr"
   */
  static getMarketId(market: Market): string {
    return market.id;
  }
}

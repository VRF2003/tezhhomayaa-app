import { Market } from "../types/market";

/**
 * NumberSnapshot
 *
 * A read-only value object containing number format configuration
 * for the active market. Contains NO formatting or parsing logic.
 *
 * The `numberLocale` value is a BCP 47 tag suitable for use as the
 * first argument to `Intl.NumberFormat` when that phase arrives.
 * Storing it here ensures number formatting configuration is always
 * aligned with the active market without components needing to know
 * about the Market interface or the registry.
 */
export interface NumberSnapshot {
  /**
   * BCP 47 locale tag to use for number formatting.
   * e.g. "en-IN", "ar-AE", "fr-CA"
   *
   * This is intentionally the same as `Market.numberFormat` — a market-level
   * configuration primitive. Future phases will pass this directly to
   * Intl.NumberFormat as the locale argument.
   */
  readonly numberLocale: string;
}

/**
 * NumberService
 *
 * Responsibility: Expose number format configuration from the active market.
 *
 * This service does NOT:
 * - Format numbers, prices, or percentages
 * - Parse number strings
 * - Use Intl.NumberFormat
 * - Determine grouping separators ("," vs ".")
 * - Determine decimal separators
 *
 * Those responsibilities belong to a dedicated NumberFormattingService
 * and CurrencyFormattingService in a future phase, both of which will
 * depend on this service as their locale data source.
 */
export class NumberService {
  /**
   * Extract a NumberSnapshot from a Market.
   * Called by ExperienceServices with the active market from context.
   */
  static fromMarket(market: Market): NumberSnapshot {
    return {
      numberLocale: market.numberFormat,
    };
  }

  /**
   * Returns the BCP 47 locale tag to use for number formatting.
   * e.g. "en-IN", "ar-AE", "fr-CA"
   */
  static getNumberLocale(market: Market): string {
    return market.numberFormat;
  }
}

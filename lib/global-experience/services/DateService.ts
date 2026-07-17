import { Market } from "../types/market";

/**
 * DateSnapshot
 *
 * A read-only value object containing date format configuration
 * for the active market. Contains NO formatting or parsing logic.
 *
 * The `dateLocale` value is a BCP 47 tag suitable for use as the
 * first argument to `Intl.DateTimeFormat` when that phase arrives.
 * Storing it here means the format configuration is always aligned
 * with the active market, regardless of how the market was resolved.
 */
export interface DateSnapshot {
  /**
   * BCP 47 locale tag to use for date formatting.
   * e.g. "en-IN", "ar-AE", "fr-CA"
   *
   * This is intentionally the same as `Market.dateFormat` — a market-level
   * configuration primitive, not a computed value. Future phases will pass
   * this directly to Intl.DateTimeFormat as the locale argument.
   */
  readonly dateLocale: string;
}

/**
 * DateService
 *
 * Responsibility: Expose date format configuration from the active market.
 *
 * This service does NOT:
 * - Format dates or timestamps
 * - Parse date strings
 * - Use Intl.DateTimeFormat
 * - Compute relative time ("3 days ago")
 * - Handle calendar systems (Hijri, Japanese Imperial, etc.)
 *
 * Those responsibilities belong to a dedicated DateFormattingService
 * in a future phase, which will depend on this service as its data source.
 */
export class DateService {
  /**
   * Extract a DateSnapshot from a Market.
   * Called by ExperienceServices with the active market from context.
   */
  static fromMarket(market: Market): DateSnapshot {
    return {
      dateLocale: market.dateFormat,
    };
  }

  /**
   * Returns the BCP 47 locale tag to use for date formatting.
   * e.g. "en-IN", "ar-AE", "fr-CA"
   */
  static getDateLocale(market: Market): string {
    return market.dateFormat;
  }
}

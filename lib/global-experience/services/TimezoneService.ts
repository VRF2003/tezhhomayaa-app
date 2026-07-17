import { Market } from "../types/market";

/**
 * TimezoneSnapshot
 *
 * A read-only value object containing the IANA timezone identifier
 * for the active market. Contains NO date computation logic.
 *
 * Future phases (DateService formatting, order timestamps, shipping
 * cut-off displays, event scheduling) will read from this snapshot.
 */
export interface TimezoneSnapshot {
  /**
   * IANA timezone identifier.
   * e.g. "Asia/Kolkata", "Asia/Dubai", "America/Toronto"
   * See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  readonly ianaTimezone: string;
}

/**
 * TimezoneService
 *
 * Responsibility: Expose the IANA timezone identifier for the active market.
 *
 * This service does NOT:
 * - Convert timestamps between timezones
 * - Format dates in local time
 * - Use Intl.DateTimeFormat
 * - Compute offsets (UTC+N)
 * - Determine DST transitions
 *
 * Those responsibilities belong to a dedicated DateFormattingService
 * in a future phase, which will depend on this service as its data source.
 */
export class TimezoneService {
  /**
   * Extract a TimezoneSnapshot from a Market.
   * Called by ExperienceServices with the active market from context.
   */
  static fromMarket(market: Market): TimezoneSnapshot {
    return {
      ianaTimezone: market.timezone,
    };
  }

  /**
   * Returns the IANA timezone string for the active market.
   * e.g. "Asia/Kolkata", "Asia/Dubai", "Europe/Paris"
   */
  static getTimezone(market: Market): string {
    return market.timezone;
  }
}

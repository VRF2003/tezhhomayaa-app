import { Market } from "../types/market";

/**
 * CurrencySnapshot
 *
 * A read-only value object containing currency primitives for the active market.
 * Deliberately contains NO formatting logic — that belongs to a future phase.
 *
 * Consumers receive stable references and never need to understand
 * the internal structure of the Market or the GlobalExperienceRegistry.
 */
export interface CurrencySnapshot {
  /** ISO 4217 currency code. e.g. "INR", "AED", "CAD" */
  readonly code: string;
  /** Localized currency symbol. e.g. "₹", "د.إ", "CA$" */
  readonly symbol: string;
}

/**
 * CurrencyService
 *
 * Responsibility: Expose currency identity primitives from the active market.
 *
 * This service does NOT:
 * - Format prices
 * - Use Intl.NumberFormat
 * - Convert between currencies
 * - Store exchange rates
 *
 * Those responsibilities belong to a dedicated CurrencyFormattingService
 * in a future phase, which will depend on this service as its data source.
 */
export class CurrencyService {
  /**
   * Extract a CurrencySnapshot from a Market.
   * Called by ExperienceServices with the active market from context.
   */
  static fromMarket(market: Market): CurrencySnapshot {
    return {
      code: market.currency,
      symbol: market.currencySymbol,
    };
  }

  /**
   * Returns the ISO 4217 currency code for the active market.
   * e.g. "INR", "AED", "GBP"
   */
  static getCurrencyCode(market: Market): string {
    return market.currency;
  }

  /**
   * Returns the currency symbol for the active market.
   * e.g. "₹", "£", "€"
   */
  static getCurrencySymbol(market: Market): string {
    return market.currencySymbol;
  }
}

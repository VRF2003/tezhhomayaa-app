import { GlobalExperienceRegistry } from "./GlobalExperienceRegistry";
import { Market } from "./types/market";

/**
 * MarketBridgeResult
 * A structured result type that prevents runtime crashes on invalid inputs.
 * On success, the resolved Market is returned.
 * On failure, a descriptive error is returned and the bridge remains idle.
 */
export type MarketBridgeResult =
  | { success: true; market: Market }
  | { success: false; error: string; code: MarketBridgeErrorCode };

export type MarketBridgeErrorCode =
  | "MISSING_INPUTS"
  | "MARKET_NOT_FOUND"
  | "REGISTRY_ERROR";

/**
 * MarketBridge
 *
 * The ONLY object responsible for connecting the Maison Arrival Platform
 * to the Global Experience Engine. Neither system knows about the other.
 *
 * Responsibilities:
 * 1. Receive Region, Country, and Language from the Arrival Context.
 * 2. Construct the canonical Market ID from the registry (no hardcoding).
 * 3. Validate the Market exists in the Global Experience Registry.
 * 4. Return a structured result — never throws, never crashes.
 *
 * This module contains NO React. It is pure TypeScript.
 * It does NOT read from or write to any persistence layer.
 */
export class MarketBridge {
  /**
   * Resolves the canonical Market ID from three raw arrival selections.
   *
   * The Market ID format is: `{countryCode}-{languageCode}`
   * Example: "in-en", "ae-ar", "ca-fr"
   *
   * Both countryCode and languageCode are normalized to lowercase
   * so the registry lookup is always consistent regardless of how
   * the Arrival Platform stores its internal IDs.
   */
  private static resolveMarketId(
    countryCode: string,
    languageCode: string
  ): string {
    return `${countryCode.toLowerCase()}-${languageCode.toLowerCase()}`;
  }

  /**
   * Primary bridge method.
   *
   * @param region - The region ID from ArrivalContext (e.g., "asia-pacific")
   * @param country - The country code from ArrivalContext (e.g., "IN", "AE")
   * @param language - The language code from ArrivalContext (e.g., "en", "ar")
   * @returns A MarketBridgeResult — always structured, never throws.
   */
  static resolve(
    region: string | null,
    country: string | null,
    language: string | null
  ): MarketBridgeResult {
    // 1. Validate that all inputs are present
    if (!region || !country || !language) {
      return {
        success: false,
        error: `MarketBridge: Missing required inputs. Received region="${region}", country="${country}", language="${language}".`,
        code: "MISSING_INPUTS",
      };
    }

    // 2. Construct the canonical Market ID from the registry format
    const marketId = MarketBridge.resolveMarketId(country, language);

    // 3. Validate the Market exists in the Global Experience Registry
    try {
      const market = GlobalExperienceRegistry.getMarketById(marketId);

      if (!market) {
        // Attempt a graceful fallback to the country's default language market
        const fallbackMarket =
          GlobalExperienceRegistry.getDefaultMarketForCountry(
            country.toUpperCase()
          );

        if (fallbackMarket) {
          console.warn(
            `MarketBridge: Market "${marketId}" not found. Falling back to default market "${fallbackMarket.id}" for country "${country}".`
          );
          return { success: true, market: fallbackMarket };
        }

        return {
          success: false,
          error: `MarketBridge: Market "${marketId}" not found in GlobalExperienceRegistry and no fallback exists for country "${country}".`,
          code: "MARKET_NOT_FOUND",
        };
      }

      return { success: true, market };
    } catch (err) {
      return {
        success: false,
        error: `MarketBridge: Registry lookup failed. ${err instanceof Error ? err.message : String(err)}`,
        code: "REGISTRY_ERROR",
      };
    }
  }
}

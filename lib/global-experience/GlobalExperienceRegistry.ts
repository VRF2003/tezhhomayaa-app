import { REGIONS } from "./RegionRegistry";
import { MARKETS } from "./MarketRegistry";
import { Market } from "./types/market";
import { Region } from "./types/region";

export class GlobalExperienceRegistry {
  /**
   * Retrieves a market by its unique ID (e.g., "in-en").
   */
  static getMarketById(id: string): Market | undefined {
    return MARKETS.find(market => market.id === id);
  }

  /**
   * Retrieves the default market for a given country code (e.g., "IN").
   */
  static getDefaultMarketForCountry(countryCode: string): Market | undefined {
    return MARKETS.find(market => market.countryCode === countryCode && market.defaultLanguage);
  }

  /**
   * Retrieves all available markets for a given country code.
   */
  static getMarketsForCountry(countryCode: string): Market[] {
    return MARKETS.filter(market => market.countryCode === countryCode);
  }

  /**
   * Retrieves a region by its unique ID.
   */
  static getRegionById(id: string): Region | undefined {
    return REGIONS.find(region => region.id === id);
  }

  /**
   * Retrieves all regions.
   */
  static getAllRegions(): Region[] {
    return REGIONS;
  }

  /**
   * Retrieves the overall default market for the entire platform (e.g., "in-en").
   */
  static getGlobalDefaultMarket(): Market {
    const defaultMarket = MARKETS.find(market => market.isDefault);
    if (!defaultMarket) {
      // Fallback to the first available market if none is explicitly marked as default
      return MARKETS[0];
    }
    return defaultMarket;
  }
}

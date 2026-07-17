import { PricingRequest, PricingResult } from "./types";
import { MarketService } from "../market/MarketService";

export class PricingService {
  /**
   * Stub for Phase 5.2 to allow Checkout Engine orchestration.
   * In a future phase, this will implement the full logic from docs/PRICING_ENGINE.md.
   */
  static resolvePricing(request: PricingRequest): PricingResult {
    const market = MarketService.getMarketByCode(request.marketCode);
    if (!market || !market.enabled) {
      return {
        isSupported: false,
        currency: "USD",
        subtotal: 0,
        discountTotal: 0,
        grandTotal: 0,
        error: `Market ${request.marketCode} is not recognized.`,
      };
    }

    // Stub: Calculate basic sum of unitPrice * quantity
    const subtotal = request.cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity, 
      0
    );

    return {
      isSupported: true,
      currency: market.currencyCode,
      subtotal,
      discountTotal: 0,
      grandTotal: subtotal,
      appliedPriceListId: market.priceListId,
    };
  }
}

import { CheckoutRequest, MarketSnapshot, PricingSnapshot, ShippingSnapshot, TaxSnapshot } from "./types";
import { MarketService } from "../market/MarketService";
import { PricingService } from "../pricing/PricingService";
import { ShippingService } from "../shipping/ShippingService";
import { TaxService } from "../tax/TaxService";

export class SnapshotResolver {
  /**
   * Safely collects immutable snapshots from all domain engines.
   * Does NOT perform checkout validation, merely gathers the facts.
   * Returns null for a snapshot if the domain engine fails to resolve it.
   */
  static resolveSnapshots(request: CheckoutRequest): {
    marketSnapshot?: MarketSnapshot;
    pricingSnapshot?: PricingSnapshot;
    shippingSnapshot?: ShippingSnapshot;
    taxSnapshot?: TaxSnapshot;
  } {
    // 1. Market Resolution
    const market = MarketService.getMarketByCode(request.marketCode);
    const marketSnapshot = market && market.enabled 
      ? { marketCode: market.marketCode, currencyCode: market.currencyCode }
      : undefined;

    // 2. Pricing Resolution
    const pricing = PricingService.resolvePricing({
      marketCode: request.marketCode,
      cartItems: request.cart,
    });
    const pricingSnapshot = pricing.isSupported 
      ? { subtotal: pricing.subtotal, discountTotal: pricing.discountTotal, grandTotal: pricing.grandTotal }
      : undefined;

    // 3. Shipping Resolution
    // Provide 0 for subtotal if pricing failed, as ShippingEngine needs a number for free shipping thresholds.
    const cartSubtotal = pricingSnapshot ? pricingSnapshot.subtotal : 0;
    const shipping = ShippingService.resolveShipping({
      marketCode: request.marketCode,
      cartSubtotal: cartSubtotal,
    });
    
    // Find the requested method from the available methods
    const selectedMethod = shipping.availableMethods?.find(m => m.id === request.shippingMethodId);
    const shippingSnapshot = (shipping.isSupported && selectedMethod)
      ? { methodId: selectedMethod.id, price: selectedMethod.price, estimatedDelivery: selectedMethod.estimatedDelivery }
      : undefined;

    // 4. Tax Resolution
    const shippingAmount = shippingSnapshot ? shippingSnapshot.price : 0;
    const tax = TaxService.resolveTax({
      marketCode: request.marketCode,
      cartSubtotal: cartSubtotal,
      shippingAmount: shippingAmount,
    });
    const taxSnapshot = (tax.isSupported && tax.totalTaxAmount !== undefined)
      ? { 
          totalTaxAmount: tax.totalTaxAmount, 
          merchandiseTaxAmount: tax.merchandiseTaxAmount || 0,
          shippingTaxAmount: tax.shippingTaxAmount || 0,
          calculationMode: tax.calculationMode || "UNKNOWN",
        }
      : undefined;

    return {
      marketSnapshot,
      pricingSnapshot,
      shippingSnapshot,
      taxSnapshot,
    };
  }
}

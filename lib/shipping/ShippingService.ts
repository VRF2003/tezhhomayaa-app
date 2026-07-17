import { 
  ShippingRequest, 
  ShippingResult, 
  ShippingProfile, 
  Warehouse, 
  DeliveryMethod 
} from "./types";
import { WAREHOUSES, DELIVERY_METHODS, SHIPPING_PROFILES } from "./seed";
import { MarketService } from "../market/MarketService";

export class ShippingService {
  /**
   * Resolves the complete shipping parameters for a given checkout request.
   * This is the single source of truth for fulfillment logic.
   */
  static resolveShipping(request: ShippingRequest): ShippingResult {
    // 1. Verify Market
    const market = MarketService.getMarketByCode(request.marketCode);
    if (!market || !market.enabled) {
      return {
        isSupported: false,
        error: `Market ${request.marketCode} is not recognized or not enabled.`,
      };
    }

    // 2. Resolve Shipping Profile
    const profile = this.getShippingProfileForMarket(request.marketCode);
    if (!profile || profile.status !== "ACTIVE") {
      return {
        isSupported: false,
        marketCode: request.marketCode,
        error: `Fulfillment is currently unsupported for ${market.marketName}.`,
      };
    }

    // 3. Resolve Warehouse
    const warehouse = Object.values(WAREHOUSES).find(w => w.id === profile.warehouseId);
    if (!warehouse || warehouse.status !== "ACTIVE") {
      return {
        isSupported: false,
        marketCode: request.marketCode,
        zone: profile.zone,
        error: `The assigned warehouse for ${market.marketName} is currently unavailable.`,
      };
    }

    // 4. Resolve Delivery Methods
    const availableMethods = this.resolveDeliveryMethods(profile, request.cartSubtotal);

    // 5. Build Final Payload
    return {
      isSupported: true,
      marketCode: request.marketCode,
      zone: profile.zone,
      warehouse,
      availableMethods,
    };
  }

  /**
   * Internal: Finds the active profile with the highest priority for a market.
   */
  private static getShippingProfileForMarket(marketCode: string): ShippingProfile | null {
    const normalizedCode = marketCode.toUpperCase();
    const matchingProfiles = SHIPPING_PROFILES.filter(
      (p) => p.status === "ACTIVE" && p.marketCodes.includes(normalizedCode)
    );

    if (matchingProfiles.length === 0) return null;

    // Sort descending by priority to find the best match
    matchingProfiles.sort((a, b) => b.priority - a.priority);
    return matchingProfiles[0];
  }

  /**
   * Internal: Constructs the delivery methods available, applying Free Shipping logic.
   */
  private static resolveDeliveryMethods(profile: ShippingProfile, cartSubtotal: number): DeliveryMethod[] {
    const methods: DeliveryMethod[] = [];
    const isFreeShippingUnlocked = cartSubtotal >= profile.freeShippingThreshold;

    for (const methodId of profile.availableDeliveryMethodIds) {
      // Find the template method
      const templateMethod = Object.values(DELIVERY_METHODS).find(m => m.id === methodId);
      if (!templateMethod) continue;

      // Clone to avoid mutating seed data
      const method = { ...templateMethod };

      // Apply free shipping rule to the DEFAULT method only (or specific methods later)
      // For now, if free shipping is unlocked, we make the default method free.
      if (isFreeShippingUnlocked && method.id === profile.defaultDeliveryMethodId) {
        method.price = 0;
        method.name = `Free ${method.name}`;
      }

      methods.push(method);
    }

    return methods;
  }
}

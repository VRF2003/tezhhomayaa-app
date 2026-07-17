export type ShippingZone = "DOMESTIC" | "GCC" | "ASIA_PACIFIC" | "EUROPE" | "NORTH_AMERICA" | "REST_OF_WORLD";
export type WarehouseStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type ProfileStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface Warehouse {
  id: string;
  code: string;           // e.g., "WH_MUMBAI"
  name: string;           // e.g., "Mumbai Hub"
  locationCountry: string;
  status: WarehouseStatus;
}

export interface DeliveryMethod {
  id: string;
  code: string;           // e.g., "MTH_STANDARD"
  name: string;           // e.g., "Standard Shipping"
  price: number;          // Cost of shipping (if applicable)
  currency: string;       // Currency code of the price
  estimatedDelivery: string; // e.g., "3-5 Business Days"
}

export interface ShippingProfile {
  id: string;
  code: string;           // e.g., "SP_IN_DOMESTIC"
  name: string;           // e.g., "India Domestic Fulfillment"
  marketCodes: string[];  // e.g., ["IN"]
  zone: ShippingZone;
  warehouseId: string;
  
  // Commercial threshold in the exact currency of the target market
  freeShippingThreshold: number; 
  currency: string;       // Currency context for the threshold
  
  defaultDeliveryMethodId: string;
  availableDeliveryMethodIds: string[];
  
  status: ProfileStatus;
  priority: number;       // For resolving overlapping profiles (highest wins)
}

// ─────────────────────────────────────────────────────────────────
// API Contract Types

export interface ShippingRequest {
  marketCode: string;
  cartSubtotal: number;
  // Future expansions:
  // weight?: number;
  // dimensions?: { l: number; w: number; h: number };
  // destinationPostalCode?: string;
  // customerTier?: string;
  // items?: any[];
}

export interface ShippingResult {
  isSupported: boolean;
  marketCode?: string;
  zone?: ShippingZone;
  warehouse?: Warehouse;
  availableMethods?: DeliveryMethod[];
  error?: string; // Reason for unsupported state
}

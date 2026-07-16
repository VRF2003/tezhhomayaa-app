export type MarketStatus = "active" | "inactive" | "coming_soon";

export interface Market {
  // Core Identification
  id: string;
  marketCode: string; // e.g., "IN", "UAE", "SG"
  marketName: string; // e.g., "India", "United Arab Emirates"
  country: string;
  countryCode: string;
  region: string; // e.g., "Asia Pacific", "Europe", "North America", "Middle East"
  
  // Currency & Locale
  currencyCode: string;
  currencySymbol: string;
  language: string;
  locale: string; // e.g., "en-IN", "ar-AE"
  timezone: string; // e.g., "Asia/Kolkata", "Asia/Dubai"
  
  // Future-Ready Engine Fields
  taxProfileId: string;
  taxProfile: string; // Legacy/Display fallback
  shippingProfile: string; // Legacy/Display fallback
  shippingZones: string[]; // e.g., ["domestic", "international"]
  shippingOrigin: string; // e.g., "Ships from Dubai"
  estimatedDelivery: string; // e.g., "Estimated Delivery: 1–3 Business Days"
  warehouseId: string;
  warehouse: string; // Legacy/Display fallback
  description?: string; // Optional descriptive line beneath market
  priceListId: string;
  paymentMethods: string[]; // e.g., ["stripe", "paypal", "cod"]
  
  // System State
  status: MarketStatus;
  enabled: boolean;
  defaultMarket: boolean;
  displayOrder: number;
}

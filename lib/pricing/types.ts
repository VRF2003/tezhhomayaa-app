export interface PricingRequest {
  marketCode: string;
  cartItems: Array<{ sku: string; quantity: number; unitPrice: number }>;
}

export interface PricingResult {
  isSupported: boolean;
  currency: string;
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  appliedPriceListId?: string;
  error?: string;
}

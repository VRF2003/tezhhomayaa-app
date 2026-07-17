export type CheckoutStatus = 
  | "DRAFT"
  | "VALIDATED"
  | "READY_FOR_PAYMENT"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "PAYMENT_SUCCESSFUL"
  | "EXPIRED"
  | "CANCELLED";

export type ValidationStep = 
  | "MARKET"
  | "PRICING"
  | "SHIPPING"
  | "TAX"
  | "CUSTOMER"
  | "CHECKOUT_READY";

export interface ValidationError {
  code: string;
  message: string;
  step: ValidationStep;
}

export interface ValidationWarning {
  code: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// ─────────────────────────────────────────────────────────────────
// SNAPSHOTS (Immutable Domain State)
// ─────────────────────────────────────────────────────────────────

export interface MarketSnapshot {
  marketCode: string;
  currencyCode: string;
}

export interface PricingSnapshot {
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
}

export interface ShippingSnapshot {
  methodId: string;
  price: number;
  estimatedDelivery: string;
}

export interface TaxSnapshot {
  totalTaxAmount: number;
  merchandiseTaxAmount: number;
  shippingTaxAmount: number;
  calculationMode: string;
}

// ─────────────────────────────────────────────────────────────────
// API CONTRACTS
// ─────────────────────────────────────────────────────────────────

export interface CheckoutRequest {
  marketCode: string;
  customer: {
    email: string;
    isAuthenticated: boolean;
  };
  cart: Array<{ sku: string; quantity: number; unitPrice: number }>;
  shippingAddress: any; // Omitted for brevity in Phase 5.2
  billingAddress: any;  // Omitted for brevity in Phase 5.2
  shippingMethodId: string;
}

export interface CheckoutSession {
  sessionId: string;
  version: number;
  status: CheckoutStatus;
  createdDate: string;  // ISO string
  expiryDate: string;   // ISO string
  
  customer: {
    email: string;
    isAuthenticated: boolean;
  };
  
  // Immutable snapshots from the resolver
  marketSnapshot?: MarketSnapshot;
  pricingSnapshot?: PricingSnapshot;
  shippingSnapshot?: ShippingSnapshot;
  taxSnapshot?: TaxSnapshot;

  validationResult?: ValidationResult;
}

export interface CheckoutResult {
  sessionId: string;
  status: CheckoutStatus;
  grandTotal?: number;
  currency?: string;
  validationResult: ValidationResult;
}

export interface PaymentIntentPayload {
  sessionId: string;
  grandTotal: number;
  currency: string;
  marketCode: string;
  customerEmail: string;
  metadata: {
    checkoutVersion: number;
    platform: string;     // e.g. "Tezhhomayaa_Checkout_Engine"
    timestamp: string;
  };
}

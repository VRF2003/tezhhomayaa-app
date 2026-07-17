import { 
  MarketSnapshot, 
  PricingSnapshot, 
  ShippingSnapshot, 
  TaxSnapshot 
} from "../checkout/types";

// ─────────────────────────────────────────────────────────────────
// STATE MACHINE
// ─────────────────────────────────────────────────────────────────

export type OrderStatus = 
  | "CREATED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export interface TimelineEvent {
  timestamp: string;          // ISO string
  actor: string;              // "System", "Admin: Jane", "Carrier: FedEx"
  action: OrderStatus | string;
  metadata?: Record<string, any>;
  source: string;             // e.g. "CheckoutEngine", "WarehouseAPI"
  correlationId?: string;     // Ties back to specific webhooks or intents
}

// ─────────────────────────────────────────────────────────────────
// SNAPSHOTS (Immutable Domain State)
// ─────────────────────────────────────────────────────────────────

export interface CustomerSnapshot {
  email: string;
  isAuthenticated: boolean;
  customerId?: string;
  // Shipping and Billing addresses would go here in a full implementation
}

export interface PaymentSnapshot {
  gateway: string;            // e.g. "Stripe"
  transactionId: string;
  authorizationCode?: string;
  currency: string;
  amountPaid: number;
  capturedTime: string;       // ISO string
}

export interface FulfillmentSnapshot {
  warehouseId?: string;
  carrier?: string;
  trackingNumber?: string;
  dispatchMethod?: string;
  deliveryPromise?: string;
}

// ─────────────────────────────────────────────────────────────────
// ORDER MASTER MODEL
// ─────────────────────────────────────────────────────────────────

export interface Order {
  orderId: string;
  orderNumber: string;        // e.g. TZ-IN-000001
  status: OrderStatus;
  
  // Snapshots frozen at the moment of creation
  marketSnapshot: MarketSnapshot;
  pricingSnapshot: PricingSnapshot;
  shippingSnapshot: ShippingSnapshot;
  taxSnapshot: TaxSnapshot;
  customerSnapshot: CustomerSnapshot;
  paymentSnapshot: PaymentSnapshot;
  
  // Fulfillment mutates timeline, but the initial snapshot may be empty
  fulfillmentSnapshot?: FulfillmentSnapshot;

  checkoutSessionId: string;  // Traceability to the originating session
  
  timeline: TimelineEvent[];

  createdDate: string;        // ISO string
  updatedDate: string;        // ISO string
  version: number;            // Optimistic lock
}

// ─────────────────────────────────────────────────────────────────
// API CONTRACTS
// ─────────────────────────────────────────────────────────────────

export interface OrderRequest {
  checkoutSessionId: string;
  paymentSnapshot: PaymentSnapshot;
}

export interface OrderFactoryResult {
  isValid: boolean;
  order?: Order;
  error?: string;
}

export interface OrderResult {
  orderId?: string;
  orderNumber?: string;
  status?: OrderStatus;
  order?: Order;
  success: boolean;
  error?: string;
}

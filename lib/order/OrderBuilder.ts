import { CheckoutSession } from "../checkout/types";
import { 
  Order, 
  PaymentSnapshot, 
  OrderFactoryResult, 
  CustomerSnapshot,
  TimelineEvent
} from "./types";
import { OrderNumberGenerator } from "./OrderNumberGenerator";

export class OrderBuilder {
  /**
   * Constructs the complete, immutable Order document.
   * Assumes the CheckoutSession has been retrieved securely and verified.
   */
  static build(session: Readonly<CheckoutSession>, payment: PaymentSnapshot): OrderFactoryResult {
    // 1. Verify Session Completeness
    if (
      !session.marketSnapshot ||
      !session.pricingSnapshot ||
      !session.shippingSnapshot ||
      !session.taxSnapshot
    ) {
      return {
        isValid: false,
        error: "Cannot build order: Checkout session is missing critical domain snapshots.",
      };
    }

    if (session.status !== "READY_FOR_PAYMENT" && session.status !== "PAYMENT_PENDING" && session.status !== "PAYMENT_SUCCESSFUL") {
      return {
        isValid: false,
        error: `Cannot build order from an unapproved checkout state: ${session.status}`,
      };
    }

    // 2. Generate Identifiers
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const orderNumber = OrderNumberGenerator.generate(session.marketSnapshot.marketCode);
    const now = new Date().toISOString();

    // 3. Extract Customer Snapshot
    const customerSnapshot: CustomerSnapshot = {
      email: session.customer.email,
      isAuthenticated: session.customer.isAuthenticated,
    };

    // 4. Initialize Timeline
    const timeline: TimelineEvent[] = [
      {
        timestamp: now,
        actor: "System",
        action: "CREATED",
        source: "OrderEngine",
        correlationId: session.sessionId,
        metadata: {
          note: "Order created from validated checkout session.",
        },
      },
      {
        timestamp: payment.capturedTime,
        actor: "System",
        action: "CONFIRMED",
        source: "PaymentGateway",
        correlationId: payment.transactionId,
        metadata: {
          gateway: payment.gateway,
          amountPaid: payment.amountPaid,
        },
      }
    ];

    // 5. Construct Order Document
    const order: Order = {
      orderId,
      orderNumber,
      status: "CONFIRMED", // Order immediately starts as confirmed if payment is present
      marketSnapshot: session.marketSnapshot,
      pricingSnapshot: session.pricingSnapshot,
      shippingSnapshot: session.shippingSnapshot,
      taxSnapshot: session.taxSnapshot,
      customerSnapshot,
      paymentSnapshot: payment,
      checkoutSessionId: session.sessionId,
      timeline,
      createdDate: now,
      updatedDate: now,
      version: 1,
    };

    return {
      isValid: true,
      order,
    };
  }
}

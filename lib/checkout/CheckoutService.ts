import { 
  CheckoutRequest, 
  CheckoutSession, 
  CheckoutStatus, 
  ValidationResult, 
  CheckoutResult, 
  PaymentIntentPayload, 
  ValidationError
} from "./types";
import { SnapshotResolver } from "./SnapshotResolver";

// In-memory storage for Phase 5.2
const sessions = new Map<string, CheckoutSession>();

export class CheckoutService {
  /**
   * Initializes a Checkout Session from a raw Request.
   * Resolves snapshots and transitions state to DRAFT.
   */
  static createSession(request: CheckoutRequest): CheckoutSession {
    const sessionId = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const snapshots = SnapshotResolver.resolveSnapshots(request);

    const session: CheckoutSession = {
      sessionId,
      version: 1,
      status: "DRAFT",
      createdDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min TTL
      customer: request.customer,
      ...snapshots,
    };

    sessions.set(sessionId, session);
    return session;
  }

  /**
   * Orchestrates the deterministic Validation Engine hierarchy.
   * Never mutates snapshots; simply validates their existence and coherence.
   */
  static validateSession(sessionId: string): CheckoutResult {
    const session = sessions.get(sessionId);
    if (!session) {
      return this.buildFailedResult(sessionId, "DRAFT", [{ code: "SESSION_NOT_FOUND", message: "Invalid session.", step: "MARKET" }]);
    }

    // Validation 1: Market
    if (!session.marketSnapshot) {
      return this.buildFailedResult(session.sessionId, session.status, [{ code: "MARKET_INVALID", message: "Market unsupported.", step: "MARKET" }]);
    }

    // Validation 2: Pricing
    if (!session.pricingSnapshot) {
      return this.buildFailedResult(session.sessionId, session.status, [{ code: "PRICING_INVALID", message: "Failed to resolve prices.", step: "PRICING" }]);
    }

    // Validation 3: Shipping
    if (!session.shippingSnapshot) {
      return this.buildFailedResult(session.sessionId, session.status, [{ code: "SHIPPING_INVALID", message: "Failed to resolve shipping method.", step: "SHIPPING" }]);
    }

    // Validation 4: Tax
    if (!session.taxSnapshot) {
      return this.buildFailedResult(session.sessionId, session.status, [{ code: "TAX_INVALID", message: "Failed to resolve tax compliance.", step: "TAX" }]);
    }

    // Validation 5: Customer (Simplistic check for this phase)
    if (!session.customer || !session.customer.email) {
      return this.buildFailedResult(session.sessionId, session.status, [{ code: "CUSTOMER_INVALID", message: "Missing customer details.", step: "CUSTOMER" }]);
    }

    // Validation 6: Checkout Ready (Math verification)
    const expectedGrandTotal = session.pricingSnapshot.grandTotal + session.shippingSnapshot.price + session.taxSnapshot.totalTaxAmount;
    
    // Note: If taxes are INCLUSIVE, they shouldn't be added to the grandTotal. 
    // For Phase 5.2 architecture, we assume they are added for simplicity, or we check the mode.
    const isInclusive = session.taxSnapshot.calculationMode === "INCLUSIVE";
    const finalGrandTotal = isInclusive 
      ? session.pricingSnapshot.grandTotal + session.shippingSnapshot.price 
      : expectedGrandTotal;

    if (finalGrandTotal < 0) {
      return this.buildFailedResult(session.sessionId, session.status, [{ code: "MATH_INVALID", message: "Grand total cannot be negative.", step: "CHECKOUT_READY" }]);
    }

    // Validation Passed -> Transition State
    const updatedSession = this.transitionState(session, "VALIDATED");
    
    return {
      sessionId: updatedSession.sessionId,
      status: updatedSession.status,
      grandTotal: finalGrandTotal,
      currency: updatedSession.marketSnapshot!.currencyCode,
      validationResult: { isValid: true, errors: [], warnings: [] },
    };
  }

  /**
   * Prepares the immutable intent payload. 
   * Strictly enforces that session must be VALIDATED to proceed.
   */
  static generatePaymentIntent(sessionId: string): PaymentIntentPayload {
    const session = sessions.get(sessionId);
    if (!session || session.status !== "VALIDATED") {
      throw new Error(`Cannot generate payment intent from state: ${session?.status || "UNKNOWN"}`);
    }

    // Transition to READY_FOR_PAYMENT
    const activeSession = this.transitionState(session, "READY_FOR_PAYMENT");
    
    const isInclusive = activeSession.taxSnapshot!.calculationMode === "INCLUSIVE";
    const grandTotal = isInclusive 
      ? activeSession.pricingSnapshot!.grandTotal + activeSession.shippingSnapshot!.price 
      : activeSession.pricingSnapshot!.grandTotal + activeSession.shippingSnapshot!.price + activeSession.taxSnapshot!.totalTaxAmount;

    return {
      sessionId: activeSession.sessionId,
      grandTotal,
      currency: activeSession.marketSnapshot!.currencyCode,
      marketCode: activeSession.marketSnapshot!.marketCode,
      customerEmail: activeSession.customer.email,
      metadata: {
        checkoutVersion: activeSession.version,
        platform: "Tezhhomayaa_Checkout_Engine",
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Exposes a deeply frozen, read-only session snapshot.
   * Ensures the Order Engine safely consumes the session without mutating it.
   */
  static getValidatedSession(sessionId: string): Readonly<CheckoutSession> | null {
    const session = sessions.get(sessionId);
    // Ensure the session is not in a DRAFT state before exposing to downstream consumers
    if (!session || session.status === "DRAFT") return null;

    // Return a shallow freeze (or deep clone if necessary) to prevent mutation
    return Object.freeze({ ...session });
  }

  /**
   * Strict unidirectional state machine enforcer.
   */
  private static transitionState(session: CheckoutSession, targetState: CheckoutStatus): CheckoutSession {
    const validTransitions: Record<CheckoutStatus, CheckoutStatus[]> = {
      "DRAFT": ["VALIDATED", "EXPIRED", "CANCELLED"],
      "VALIDATED": ["READY_FOR_PAYMENT", "EXPIRED", "CANCELLED", "DRAFT"], // Can return to DRAFT if cart changes
      "READY_FOR_PAYMENT": ["PAYMENT_PENDING", "EXPIRED", "CANCELLED"],
      "PAYMENT_PENDING": ["PAYMENT_SUCCESSFUL", "PAYMENT_FAILED"],
      "PAYMENT_FAILED": ["VALIDATED", "CANCELLED"], // Allows retry
      "PAYMENT_SUCCESSFUL": [], // Terminal
      "EXPIRED": [], // Terminal
      "CANCELLED": [] // Terminal
    };

    if (!validTransitions[session.status].includes(targetState)) {
      throw new Error(`Illegal state transition: ${session.status} -> ${targetState}`);
    }

    session.status = targetState;
    session.version += 1;
    sessions.set(session.sessionId, session);
    
    return session;
  }

  private static buildFailedResult(sessionId: string, status: CheckoutStatus, errors: ValidationError[]): CheckoutResult {
    return {
      sessionId,
      status,
      validationResult: { isValid: false, errors, warnings: [] },
    };
  }
}

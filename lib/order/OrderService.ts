import { 
  OrderRequest, 
  OrderResult, 
  OrderStatus, 
  TimelineEvent, 
  Order 
} from "./types";
import { OrderBuilder } from "./OrderBuilder";
import { OrderRepository } from "./OrderRepository";
import { CheckoutService } from "../checkout/CheckoutService";

export class OrderService {
  /**
   * Finalizes the purchase by converting a checkout session and payment into an Order.
   */
  static async createOrder(request: OrderRequest): Promise<OrderResult> {
    // 1. Retrieve the immutable Checkout Session
    const session = CheckoutService.getValidatedSession(request.checkoutSessionId);
    if (!session) {
      return {
        success: false,
        error: `Checkout session ${request.checkoutSessionId} is invalid, missing, or still in draft.`,
      };
    }

    // 2. Build the Order
    const builderResult = OrderBuilder.build(session, request.paymentSnapshot);
    if (!builderResult.isValid || !builderResult.order) {
      return {
        success: false,
        error: builderResult.error || "Failed to assemble order.",
      };
    }

    const order = builderResult.order;

    // 3. Persist the Order
    try {
      await OrderRepository.save(order);
    } catch (err: any) {
      return {
        success: false,
        error: `Persistence failure: ${err.message}`,
      };
    }

    return {
      success: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      status: order.status,
      order: order,
    };
  }

  /**
   * Advances the order lifecycle while enforcing the state machine.
   */
  static async transitionState(
    identifier: string, 
    targetState: OrderStatus, 
    actor: string, 
    source: string,
    metadata?: Record<string, any>
  ): Promise<OrderResult> {
    const order = await OrderRepository.findById(identifier);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // Strict State Machine Verification
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      "CREATED": ["CONFIRMED", "CANCELLED"],
      "CONFIRMED": ["PACKED", "CANCELLED", "REFUNDED"],
      "PACKED": ["SHIPPED", "CANCELLED"],
      "SHIPPED": ["DELIVERED", "RETURNED"],
      "DELIVERED": ["RETURNED"],
      "CANCELLED": [],
      "RETURNED": ["REFUNDED"],
      "REFUNDED": [],
    };

    if (!validTransitions[order.status].includes(targetState)) {
      return {
        success: false,
        error: `Illegal state transition: Cannot move from ${order.status} to ${targetState}.`,
      };
    }

    // Build the Timeline Event
    const event: TimelineEvent = {
      timestamp: new Date().toISOString(),
      actor,
      action: targetState,
      source,
      metadata,
    };

    // Mutate and Save
    order.status = targetState;
    order.timeline.push(event);

    await OrderRepository.save(order);

    return {
      success: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      status: order.status,
      order: order,
    };
  }

  /**
   * Retrieves the full immutable order history for a customer CRM dashboard.
   */
  static async getOrderHistory(customerId: string): Promise<Order[]> {
    return await OrderRepository.findByCustomerId(customerId);
  }
}

import { Order } from "./types";

/**
 * Abstraction layer for Order persistence.
 * For Phase 6.2, this is an in-memory stub.
 * Future phases will implement Prisma/PostgreSQL or MongoDB here.
 */
export class OrderRepository {
  private static store = new Map<string, Order>();

  static async save(order: Order): Promise<void> {
    // In a real database, we would check the 'version' field for optimistic locking
    const existing = this.store.get(order.orderId);
    if (existing && existing.version !== order.version) {
      throw new Error(`Concurrency Exception: Order ${order.orderId} has been modified by another process.`);
    }

    // Increment version for the next save
    const orderToSave = { ...order, version: order.version + 1, updatedDate: new Date().toISOString() };
    this.store.set(order.orderId, orderToSave);
    
    // Also store by orderNumber for easy lookup
    this.store.set(order.orderNumber, orderToSave);
  }

  static async findById(identifier: string): Promise<Order | null> {
    // Allows lookup by internal UUID or public Order Number
    const order = this.store.get(identifier);
    if (!order) return null;

    // Return a deep clone to enforce immutability in memory
    return JSON.parse(JSON.stringify(order));
  }

  static async findByCustomerId(customerId: string): Promise<Order[]> {
    // Inefficient map scan for stub purposes. Database will use an indexed query.
    const orders: Order[] = [];
    for (const order of this.store.values()) {
      if (order.customerSnapshot.customerId === customerId || order.customerSnapshot.email === customerId) {
        orders.push(JSON.parse(JSON.stringify(order)));
      }
    }
    return orders;
  }
}

# Order Engine Core

This domain (`lib/order`) contains the foundational architecture for Phase 6.2 of the Tezhhomayaa Enterprise Order Management Platform.

## Architecture & Purpose

The Order Engine is the ultimate system of record for all completed transactions.
Unlike the Checkout Engine (which coordinates active carts), the Order Engine owns **immutable historical documents**.

### Core Concepts

### 1. Immutable Snapshots
When an Order is constructed by the `OrderBuilder`, it freezes the exact state of the Market, Pricing, Shipping, and Tax outputs that existed at the moment of checkout. If a tax law changes tomorrow or a bag's price increases, the Order Engine explicitly ignores it. It must **never** recalculate prices or taxes post-purchase.

### 2. Timeline
The Order Engine maintains a chronological `TimelineEvent` array. This is an append-only ledger tracking every operational update (e.g., `CREATED`, `CONFIRMED`, `SHIPPED`). Every event logs the exact timestamp, the actor (System vs Admin vs Carrier), and the correlation ID to ensure perfect auditability.

### 3. State Machine
The `OrderService.transitionState` enforces strict unidirectional lifecycle management. 
You cannot move an order backwards (e.g., `DELIVERED` back to `PACKED`). The business rules embedded in this state machine map directly to physical warehouse operations.

### 4. Order Number Generation
Order numbers (`TZ-IN-000001`) are legally distinct from database IDs. They are designed to aid warehouse sorting and financial auditing.

## AI Development Rules
> [!CAUTION]
> 1. **Never** modify historical snapshots (Pricing, Tax, Shipping) after an order is built.
> 2. **Never** attempt to recalculate an order's value post-purchase.
> 3. **Always** consume snapshots when displaying order history to the frontend.
> 4. **Never** bypass the `transitionState` method to forcefully update an order status.

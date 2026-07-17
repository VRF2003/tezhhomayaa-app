# Checkout Engine Core

This domain (`lib/checkout`) contains the foundational orchestration layer for Phase 5.2 of the Tezhhomayaa Enterprise Checkout Platform.

## Architecture & Purpose

The Checkout Engine is strictly an **orchestration layer**. It contains **zero business logic**. It never calculates prices, taxes, or shipping. Instead, it deterministically consumes the downstream engines:
`Market Engine` → `Pricing Engine` → `Shipping Engine` → `Tax Engine`

## Core Concepts

### 1. Snapshots
To prevent race conditions during checkout, the `SnapshotResolver` gathers immutable snapshots from the domain engines (`MarketSnapshot`, `PricingSnapshot`, `ShippingSnapshot`, `TaxSnapshot`). Once collected, they represent the absolute truth for that session version. The Checkout Engine never mutates these snapshots.

### 2. Validation Engine
The `CheckoutService` enforces a strict validation hierarchy:
1. **Market**: Is the market supported?
2. **Pricing**: Did the cart successfully price out?
3. **Shipping**: Is the shipping method legally and logistically valid?
4. **Tax**: Did compliance logic pass?
5. **Customer**: Are addresses present?
6. **Checkout Ready**: Does the grand total math perfectly align?

If any step fails, it halts immediately and returns a structured `ValidationResult`.

### 3. State Machine
A `CheckoutSession` strictly adheres to a unidirectional state machine to prevent double-charges or unauthorized edits.
**Transitions:**
- `DRAFT` → `VALIDATED`
- `VALIDATED` → `READY_FOR_PAYMENT`
- `READY_FOR_PAYMENT` → `PAYMENT_PENDING`
- `PAYMENT_PENDING` → `PAYMENT_SUCCESSFUL` (or `PAYMENT_FAILED`)

### 4. Payment Intent
Instead of integrating with Stripe/Razorpay directly, the Checkout Engine builds an abstract `PaymentIntentPayload`. This payload acts as the secure handoff between Checkout Validation and the future Payment Gateway modules.

## AI Development Rules
> [!CAUTION]
> 1. **Never** calculate prices, taxes, or shipping inside Checkout.
> 2. **Never** bypass the Validation Engine.
> 3. **Never** manipulate the `CheckoutStatus` manually without using `transitionState`.
> 4. **Never** add UI components to this folder. It is purely an API orchestrator.

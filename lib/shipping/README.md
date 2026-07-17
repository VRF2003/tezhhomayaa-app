# Shipping Engine Core

This domain (`lib/shipping`) contains the core backend implementation of Phase 3.2 of the Tezhhomayaa Enterprise Shipping & Fulfillment Platform.

## Architecture

This module implements the specifications from `docs/SHIPPING_ENGINE.md`.
It acts as the single source of truth for routing orders to warehouses and calculating delivery logic.

### Core Models (`types.ts`)
1. **ShippingRequest:** The primary input contract. Designed to expand beyond `marketCode` and `cartSubtotal` in future phases (e.g., to include weight, dimensions, and customer tier).
2. **ShippingProfile:** The connective tissue linking a Zone, Market, Warehouse, and free shipping logic.
3. **DeliveryMethod:** The resolved shipping method presented to the user.
4. **ShippingResult:** The consolidated return object containing the resolved Zone, Warehouse, and DeliveryMethods, or an explicit rejection state.

### Seeding (`seed.ts`)
- **Warehouses:** Currently seeded with active hubs in Mumbai, Dubai, and Singapore. Inactive hubs (London, New York) are seeded to validate that future routing expansion does not require schema changes.
- **Profiles:** We resolve profiles dynamically using a `priority` integer, allowing us to easily override logic for VIPs or temporal promotions in the future.

### Service (`ShippingService.ts`)
The `ShippingService` evaluates the `ShippingRequest`.
**Assumptions Made:**
1. **Currency Matching:** The `freeShippingThreshold` defined in a `ShippingProfile` represents the numerical value in the target market's base currency (e.g., `5000` = `₹5000`). It implicitly assumes the cart subtotal passed via `ShippingRequest` is already localized by the Pricing Engine.
2. **Unsupported Markets:** If an unsupported market code is provided, the service returns an explicit `isSupported: false` payload with a descriptive error string rather than silently defaulting to a generic Rest of World warehouse. This ensures strict checkout validation.

## Usage Rule
**Never** calculate shipping logic in the frontend. Always POST to a server action/API that invokes `ShippingService.resolveShipping(request)`.

# Global Market Engine

The Global Market Engine is the foundational architecture designed to scale Tezhhomayaa's international presence. It centralizes market resolution, enabling localized pricing, taxes, shipping, payment methods, and language delivery without duplicating logic across the application.

## Core Concepts

The engine is built around the concept of a `Market` — a single source of truth that dictates the shopping experience for a specific region.

### Market Model
The expanded `Market` model resides in `lib/market/types.ts` and includes:
- **Core Identification**: `id`, `marketCode`, `marketName`, `country`, `countryCode`
- **Currency & Locale**: `currencyCode`, `currencySymbol`, `language`, `locale`, `timezone`
- **Engine Rules**: `taxProfileId`, `shippingZones`, `warehouseId`, `priceListId`, `paymentMethods`
- **System State**: `status`, `enabled`, `defaultMarket`, `displayOrder`

## Architecture & Data Flow

### Resolution Priority
When a user visits the site, their market is resolved in the following priority (highest to lowest):
1. **Logged-in User Profile**: If the user has a saved default market in their profile.
2. **Explicit Cookie**: `tz_market_code` — set when the user manually changes their region via a UI selector.
3. **Geolocation**: IP-based resolution (future enhancement via Next.js Middleware or Edge functions).
4. **Default Market**: The fallback market configured in the system (e.g., India).

### Components

#### 1. MarketService (`lib/market/MarketService.ts`)
A server/client isomorphic class that holds the seeded markets and exposes pure functions to resolve and retrieve markets by code.

#### 2. MarketContext (`lib/market/MarketContext.tsx`)
A React Context provider wrapping the application (`StoreProviders`), exposing `market` and `setMarket()` globally to client components. 
- **Note**: Local storage is intentionally avoided as the primary source of truth to ensure server-side rendering (SSR) consistency and caching compatibility.

#### 3. Server Actions (`lib/market/actions.ts`)
A secure Next.js Server Action (`setMarketCookie`) used by `setMarket()` to write the `tz_market_code` cookie. This ensures that when the market changes, the server immediately knows about it on the next request, enabling proper localized SSR (pricing, translations).

## Future Expansion & Guidelines

### 1. Pricing Engine
Do not implement standalone currency conversion on the frontend. The Pricing service should consume `market.priceListId` or `market.currencyCode` to fetch the correct localized price book.

### 2. Tax & Shipping Engine
Checkout features must read `market.taxProfileId` and `market.shippingZones` to calculate region-specific taxes (e.g., GST vs VAT) and shipping rates.

### 3. Payment Gateways
The checkout flow should filter available payment methods based on `market.paymentMethods`. For example, allowing "Stripe" globally but restricting "Razorpay" to `marketCode: "IN"`.

### 4. Language & Localization
The app should utilize `market.locale` and `market.timezone` to format dates, times, and load the correct dictionary (e.g., `en-AE` for UAE).

### Modifying Markets
To add a new market (e.g., US or UK), simply add a new object to the `MARKETS` array in `MarketService.ts`. Ensure `status` is set to `active`. The rest of the engine will dynamically adapt to the new region.

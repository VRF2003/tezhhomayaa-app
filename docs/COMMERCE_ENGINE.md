# Commerce Engine

## Vision

The Tezhhomayaa Commerce Engine is designed to completely obfuscate the transactional nature of eCommerce behind a veil of high-end editorial storytelling. It abandons the traditional "grid of squares with aggressive Buy buttons" approach in favor of contextual, deeply integrated product placements.

## Philosophy

### Editorial Commerce vs Traditional eCommerce
Traditional eCommerce (Shopify, Magento) treats products as rows in a database, prioritizing conversion funnels above all else. Tezhhomayaa's **Editorial Commerce** treats products as extensions of the brand's narrative. A product is rarely presented in isolation; it is discovered via Lookbooks, Journal articles, and curated Collections.

### Luxury Commerce Principles
- **Frictionless, Not Aggressive**: "Quick Add" interactions are hidden until hovered. "Buy Now" buttons are replaced with "Explore" or "Discover".
- **Focus on Imagery**: The UI chrome is stripped away. Images occupy maximum screen real-estate.
- **Silent Curation**: Cross-selling ("Complete The Look") feels like a stylist's recommendation, not an algorithmic upsell.

==================================================

## High-Level Architecture

```mermaid
flowchart TD
    subgraph DataStore ["JSON File Database (/lib)"]
        Products[(products.json)]
        Categories[(categories.json)]
        Tags[(tags.json)]
    end

    subgraph LogicLayer ["Commerce API & Context (/app/api & /lib)"]
        API_Comm[/api/commerce]
        API_Prod[/api/products]
        Ctx_Cart(Cart Provider)
        Ctx_Wish(Wishlist Provider)
        Ctx_Search(Search Provider)
    end

    subgraph Presentation ["Storefront Components"]
        Card[Luxury Product Card]
        PDP[Product Detail Page]
        Editorial[Shop The Story Blocks]
    end

    Products --> API_Prod
    Categories --> API_Prod
    
    API_Prod --> Presentation
    
    Presentation --> Ctx_Cart
    Presentation --> Ctx_Wish
    Presentation --> Ctx_Search
    
    Ctx_Cart <--> |Hydrates| LocalStorage(localStorage: tz_cart)
    Ctx_Wish <--> |Hydrates| LocalStorage(localStorage: tz_wishlist)
```

==================================================

## Product Architecture

- **Products**: The core model stored in `products.json`. Contains `slug`, `price`, `image`, `hoverImage`, `gallery`, `colors`, and `sizes`.
- **Variants**: Represented internally via the `sizes` and `colors` arrays on the base product object, rather than disjointed parent/child rows.
- **Collections**: Curated arrays of Product IDs mapped to specific landing pages.
- **Categories**: The top-level taxonomy (Men, Women, Bags, Ready-to-Wear).
- **Tags**: Invisible metadata used heavily by the Search Tokenizer and Recommendation Engines.
- **Smart Collections**: Dynamic collections (e.g., "New Arrivals") generated at runtime by filtering `products.json` based on timestamps or specific tags.
- **Inventory**: *Needs Verification* (Currently not strictly tracked in the JSON mockup layer; assumes unlimited stock unless manually tagged as "SOLD OUT").
- **Pricing**: Stored as a raw number. Formatted dynamically via `useCurrency()` into localized strings (e.g., `₹15,000`).
- **Media**: High-res images served via Cloudinary.
- **Hover Images**: Secondary images swapped automatically via CSS transitions on mouse enter.
- **Product Gallery**: Supported via an array of images; powers the inline swipeable carousel on the Product Card.

==================================================

## Luxury Product Card

The `<LuxuryProductCard>` (`components/sections/LuxuryProductCard.tsx`) is the workhorse of the storefront.

- **Image Behaviour**: Renders an explicit `aspect-[3/4]` container with a `#f0ece6` background acting as a loading state. Uses Next.js `next/image` for responsive SrcSets.
- **Hover Interactions**: Image slightly scales (`1.02`), and the secondary image fades in (or gallery controls appear).
- **Secondary Images**: Fades the `activeIndex` image using a slow 1000ms `cubic-bezier`.
- **Touch & Swipe**: Implements native `onTouchStart/Move/End` listeners for mobile users to swipe through the gallery without opening the PDP.
- **Quick Add**: A drawer that slides up from the *inside* bottom edge of the image upon hover, revealing size selection buttons instantly.
- **Wishlist**: A minimalist heart icon that only appears on hover (or remains persistent if active).
- **Badges**: Hardcoded aesthetic labels (NEW, PREORDER, EXCLUSIVE) rendered as frosted-glass pills over the image.
- **Swatches**: Color variants dynamically map to hex codes and render as small circular div buttons under the price.
- **Animations**: Entirely CSS-driven (`transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`) to avoid JS thread blocking.

==================================================

## Product Detail Page (PDP)

- **Gallery**: A masonry or split-grid layout depending on the VXP configuration.
- **Zoom**: *Needs Verification* (Native high-res image expansion).
- **Recommendations**: Dynamic injection of "You May Also Like" blocks.
- **Sticky Purchase**: *Needs Verification* (A mobile-specific bar that anchors the "Add to Cart" button to the bottom of the viewport when scrolling past the main CTA).
- **Complete The Look**: Editorial blocks linking complementary items (e.g., linking a specific bag to a specific dress).

==================================================

## Cart

The cart system (`CartProvider` in `lib/store.tsx`) is entirely client-side optimized.

- **Architecture**: Context API + `useReducer`. 
- **State**: The `CartState` maintains an array of `CartItem` objects (Product + Quantity + Selected Size).
- **Synchronization**: An empty state mounts first to prevent SSR hydration mismatches, then a `useEffect` reads `tz_cart` from `localStorage` and dispatches a `HYDRATE` action.
- **Drawer**: `miniCartOpen` state controls a slide-out overlay avoiding full-page reloads.
- **Checkout**: *Needs Verification* (Integration with a payment gateway like Stripe or Razorpay is pending).

==================================================

## Wishlist

- **Architecture**: Context API storing an array of product `slugs`.
- **Persistence**: Saved via `localStorage` as `tz_wishlist`.
- **Guest Support**: Currently functions entirely anonymously without requiring login.
- **Future Account Support**: Will migrate from `localStorage` to a user database table upon implementation of NextAuth/Firebase Auth.

==================================================

## Shop The Story

Editorial Commerce is realized through "Shop The Story" VXP blocks. These blocks are embedded directly inside Journal Articles (via Tiptap) or Lookbook Slides. They intercept the reader's attention by offering direct purchase paths to items currently being worn by the model in the adjacent photograph, bypassing the traditional catalog entirely.

==================================================

## Complete The Look & Recommendation Engine

- **Manual Curation (Complete The Look)**: Editors explicitly link Product A to Product B in the CMS to guarantee styling accuracy.
- **Algorithmic (Related Products / You May Also Like)**: Driven by the Search Context tokenizer. It scores products based on shared strings across Tags, Categories, and Titles.
- **Recently Viewed**: *Needs Verification* (Currently not tracked in `store.tsx`).

==================================================

## Commerce APIs

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/products` | GET | Fetches the master product catalog. |
| `/api/commerce` | GET/POST | Manages global storefront configuration (currency, taxes). |
| `/api/smart-collections`| GET | Evaluates algorithmic collection rules dynamically. |

==================================================

## Commerce State Management

All state is managed locally via React Context (`store.tsx`).

- **Reducers**: Used for complex state (Cart) where actions like `ADD`, `REMOVE`, and `UPDATE_QTY` require calculating existence keys (`slug::size`).
- **Memoization**: Heavy calculations like `cartTotalRaw` and `results` (Search Tokenizer) are wrapped in `useMemo` to prevent recalculation on every render.
- **Search Tokenizer**: An in-memory, highly aggressive tokenizing search function. It strips punctuation, splits queries, and scores every product against a compiled string of its title, handle, tags, and SKUs. 

==================================================

## Performance

- **React.memo**: Used extensively in product grids to prevent identical product cards from re-rendering when Cart state changes.
- **Image Loading**: `next/image` handles WebP conversion and `sizes` attributes (`(max-width: 768px) 100vw, 33vw`) to prevent massive image downloads on mobile.
- **GPU Animations**: The `<LuxuryProductCard>` hover interactions use `transform` and `opacity` exclusively.

==================================================

## Accessibility

- The Quick Add drawer provides immediate keyboard focus paths.
- Wishlist and navigation arrows utilize `aria-label` tags.
- Price formatting handles standard localization.

==================================================

## Current Limitations

1. **Guest-Only State**: Cart and Wishlist are bound to `localStorage`. If a user clears their browser cache or switches devices, their data is lost.
2. **Inventory Tracking**: Static JSON cannot handle live stock deduction. Concurrent checkouts will result in overselling.
3. **In-Memory Search**: The client-side search tokenizer is blazing fast for < 500 products but will crash the browser memory if the catalog scales to 10,000+ items.

==================================================

## Future Improvements

1. **Persistent Carts**: Integrate Firebase/Supabase to sync Cart and Wishlist state to an authenticated user ID across devices.
2. **Headless Checkout**: Wire the Cart state directly into the Stripe Elements SDK or Shopify Storefront API for secure, PCI-compliant transaction processing.
3. **Algorithmic Search (Algolia/Typesense)**: Move the search tokenizer to an edge-hosted search provider to support typo-tolerance and infinite catalog scaling.

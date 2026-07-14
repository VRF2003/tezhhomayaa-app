# Performance Platform

## Vision

The Performance Platform ensures that the Tezhhomayaa digital storefront responds instantly, regardless of the customer's device or network conditions. In the context of a global luxury brand, speed is not merely a technical metric; it is an aesthetic requirement. A slow-loading site instantly degrades the perception of the brand.

## Performance Philosophy

### Performance as a Luxury Feature
Just as a luxury physical boutique ensures doors open smoothly and lighting is perfect, a luxury digital boutique must have zero layout shifts, instantaneous page transitions, and buttery-smooth 60fps animations. A slow website breaks the illusion of exclusivity. 

Therefore, performance is treated as a foundational design constraint rather than a post-launch optimization step. If an animation drops below 60fps, the design is altered to accommodate the hardware.

==================================================

## High Level Architecture

```mermaid
flowchart TD
    subgraph Browser ["Client Browser"]
        ClientReact[Client Components]
        Motion[Motion Engine (GPU)]
    end

    subgraph NextJS ["Next.js App Router"]
        ServerRender[Server Components (SSR)]
        DynamicImport[Dynamic Chunk Loading]
        APIRoutes[/api/*]
    end

    subgraph CDN ["Edge Delivery"]
        Cloudinary[(Cloudinary Media CDN)]
        VercelEdge[(Vercel Edge Network)]
    end

    Browser -->|Requests Page| VercelEdge
    VercelEdge --> ServerRender
    ServerRender -->|Reads Local JSON| APIRoutes
    ServerRender -->|Streams HTML| Browser
    
    Browser -->|Dynamic Import Request| DynamicImport
    DynamicImport --> ClientReact
    
    Browser -->|Image Request (AVIF/WebP)| Cloudinary
```

==================================================

## Documented Strategies

### Image Pipeline

Tezhhomayaa relies heavily on high-resolution imagery. Unoptimized media is the primary cause of poor Web Vitals.
- **EditorialImage**: A custom wrapper around `next/image` ensures strict aspect ratios are maintained before the image loads, completely eliminating Cumulative Layout Shift (CLS).
- **Cloudinary Integration**: Images uploaded via the CMS are piped to Cloudinary. The frontend requests them using automatic format selection (`f_auto`), ensuring browsers receive modern formats (AVIF/WebP) instead of heavy JPEGs.
- **Blur Placeholders**: *Needs Verification* (Base64 placeholder strings generated at build time or via an API to display a blurred preview while the high-res asset downloads).
- **Responsive Images**: Next.js `sizes` attributes (e.g., `(max-width: 768px) 100vw, 33vw`) force mobile devices to download drastically smaller image files.

### Video Strategy
- **Hover Playback**: Product videos and Lookbook slides utilize native DOM intersection logic (`useRef`) to pause off-screen videos, drastically reducing CPU/RAM overhead on mobile devices.
- **Auto-compression**: Cloudinary's `q_auto` parameter ensures video streams are highly compressed without visible artifacting.

### Dynamic Imports (Code Splitting)

The VXP Block Registry (`DynamicBlocks.tsx`) utilizes heavy code splitting via `next/dynamic`.
- If a Homepage does not use an `<AdvStoreLocator>` or `<EditorialYouTube>` block, the JavaScript for those components is **never** sent to the client.
- This keeps the initial main thread completely unblocked, resulting in a near-instant Time to Interactive (TTI).
- **Client-Side Loading**: Interactive blocks (like `EditorialStickyPurchaseBar` or `AdvBeforeAfter`) are explicitly flagged with `{ ssr: false }` to prevent server hydration mismatches and save server CPU cycles.

### Memoization

- **React.memo**: Used in the VXP Canvas (`MemoizedRenderBlock`) to wrap complex blocks. 
- **Deep Comparison**: The memoization function utilizes a strict `JSON.stringify` comparison. This guarantees that dragging a slider or typing in the Inspector only triggers a re-render for the specific block being edited, allowing the Canvas to maintain 60fps during rapid content assembly.

### Lazy Loading

- **Intersection Observer**: Rather than using multiple scroll listeners, the Motion Engine utilizes a singleton `IntersectionObserver` to trigger entrance animations.
- **Below the Fold**: Any block rendered beneath the Hero section defers its heavy asset loading until it crosses a threshold slightly outside the viewport (`rootMargin: "0px 0px -10% 0px"`).

### Motion Performance

- **GPU Acceleration**: The `<MotionWrapper>` strictly injects `willChange: "opacity, transform"` onto DOM nodes before animation starts. This forces the browser to create a composite layer, preventing dropped frames.
- **Property Restriction**: JavaScript animations (via `requestAnimationFrame`) are abandoned in favor of pure CSS transitions (`transitionDuration`, `transitionTimingFunction`).

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: Hero images bypass lazy loading (e.g., `loading="eager"` or `priority={true}` in `next/image`) to paint instantly.
- **CLS (Cumulative Layout Shift)**: Achieved via strict CSS aspect-ratio bounding boxes on all media containers.
- **INP (Interaction to Next Paint)**: Click events (like opening the Cart Drawer) utilize lightweight CSS transforms (`translate-y`) rather than expensive React re-mounts.

### Hydration Strategy

- Storefront Contexts (`CartProvider`, `WishlistProvider`) mount with empty state to match the Server Render perfectly.
- A `useEffect` immediately hydrates the state from `localStorage`, preventing the infamous Next.js "Text content did not match server-rendered HTML" error.

### API & Data Performance

- **JSON Performance**: Data is retrieved via direct Node.js `fs.readFile` instead of a remote database call. For a static build, this results in ~0ms latency data fetching.
- **Caching**: *Needs Verification* (Usage of Next.js `unstable_cache` or standard fetch caching).

==================================================

## Current Limitations

- **File-System Database**: While `fs.readFile` is incredibly fast locally, it does not persist writes across serverless functions (e.g., Vercel).
- **Client-Side Search**: The `SearchProvider` tokenizes and scores the entire catalog in-memory. This is instantaneous for 500 products but will crash a mobile browser's memory if the catalog scales past 10,000 items.

## Future Improvements

- **Edge Database Migration**: Move from `.json` files to an Edge-compatible database (e.g., Turso, Neon, or Firebase) to maintain low-latency reads while enabling global writes.
- **Algolia / Typesense Integration**: Offload the heavy search tokenization to a dedicated, typo-tolerant search API.
- **Service Worker / PWA**: Cache static assets offline to make page transitions instantaneous even on spotty 3G networks.

==================================================

## Performance Rules

> [!IMPORTANT]
> **Permanent Architecture Rules for Tezhhomayaa**
> 1. **Never animate layout properties**: NEVER transition `width`, `height`, `margin`, `top`, or `left`. This causes layout thrashing.
> 2. **Only animate composite properties**: ALWAYS restrict animations to `transform` (translate/scale), `opacity`, and `clip-path`.
> 3. **Always lazy load below the fold**: Any media outside the initial viewport MUST use `loading="lazy"`.
> 4. **Never block the main thread**: Heavy calculations (like filtering large catalogs) must be wrapped in `useMemo` or moved to Web Workers.
> 5. **Strict Aspect Ratios**: Every image container must have a defined CSS aspect ratio or explicit width/height to prevent text reflow as the image loads.

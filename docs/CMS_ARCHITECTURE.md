# CMS Architecture

## Overview

The Tezhhomayaa CMS is a bespoke, headless-inspired Content Management System integrated directly into the Next.js frontend. It was engineered specifically to break free from the constraints of traditional platforms like Shopify or WordPress, which often enforce rigid grids and generic layouts that compromise luxury brand identity.

This architecture enables an "editorial-first" experience. It merges high-end Visual Experience Platform (VXP) drag-and-drop mechanics with a lightning-fast, file-based JSON data layer. It provides complete creative control to editors to craft rich narratives, museum-inspired Lookbook galleries, and immersive Journal entries without writing a single line of code, while maintaining the performance standards required for modern luxury eCommerce.

==================================================

## CMS Architecture Diagram

```mermaid
flowchart TD
    %% Admin Layer
    subgraph Admin ["Admin Dashboard (React / VXP)"]
        UI_Pages[Page Builder]
        UI_Lookbook[Lookbook Editor]
        UI_Journal[Journal CMS]
        UI_Products[Product Management]
        UI_Media[Media Library]
    end

    %% API Layer
    subgraph APILayer ["Next.js API Routes (/api/*)"]
        API_Content[Content APIs]
        API_Upload[Upload API (Cloudinary)]
        API_Commerce[Commerce APIs]
    end

    %% Storage Layer
    subgraph DataStore ["JSON Data Layer (lib/*.json)"]
        DB_Pages[(pages.json)]
        DB_Lookbook[(lookbook.json)]
        DB_Journal[(journal.json)]
        DB_Products[(products.json)]
    end

    %% Frontend Layer
    subgraph Storefront ["Storefront (Server/Client Components)"]
        Front_Lookbook(Lookbook Gallery)
        Front_Editorial(Journal & Articles)
        Front_PDP(Product Detail Pages)
        Front_Collections(Smart Collections)
    end

    %% Data Flow
    UI_Pages <--> API_Content
    UI_Lookbook <--> API_Content
    UI_Journal <--> API_Content
    UI_Products <--> API_Commerce
    UI_Media --> API_Upload

    API_Content <--> DB_Pages
    API_Content <--> DB_Lookbook
    API_Content <--> DB_Journal
    API_Commerce <--> DB_Products

    DB_Pages --> Front_Editorial
    DB_Lookbook --> Front_Lookbook
    DB_Journal --> Front_Editorial
    DB_Products --> Front_PDP
    DB_Products --> Front_Collections
```

==================================================

## Module Overview

| Module | Purpose | Location |
| :--- | :--- | :--- |
| **Homepage** | VXP editor for assembling the core homepage layout using the Block System. | `/admin/(protected)/content/homepage` |
| **Journal** | Editorial blogging engine. Manages articles, tags, authors, and publish dates. | `/admin/(protected)/content/journal` |
| **Collections** | Curated groupings of products (e.g., SS26, Ready-To-Wear). | `/admin/(protected)/products/collections` |
| **Products** | Inventory management, variant creation, metadata, and commerce logic. | `/admin/(protected)/products` |
| **Categories** | Core taxonomy system establishing the primary site hierarchy (Men, Women, Bags). | `/admin/(protected)/categories` |
| **Lookbook** | Advanced media gallery CMS supporting full-screen scroll-aware videos and images. | `/admin/(protected)/lookbook` |
| **Media Library** | Centralized asset management integrating directly with Cloudinary. | `/admin/(protected)/content/media` |
| **Header / Footer**| Global navigation and layout management. | `/admin/(protected)/content/header` |
| **Menus** | Link routing and dropdown management for the global navigation. | `/admin/(protected)/content/menus` |
| **Commerce** | Storefront configuration, checkout integrations, and payment gateways. | `/admin/(protected)/content/commerce` |
| **Appearance** | Global design token management (Mobile layout rules, Typography sizing). | `/admin/(protected)/appearance` |
| **Settings** | Base platform configuration and environment variables. | `/admin/(protected)/settings` |
| **Customers** | CRM management for registered user accounts. | `/admin/(protected)/customers` |
| **Orders** | Transaction history, fulfillment status, and order management. | `/admin/(protected)/orders` |
| **Subscribers** | Newsletter opt-in lists and export capabilities. | `/admin/(protected)/subscribers` |
| **Inventory** | Stock level tracking and low-stock alerts. | `/admin/(protected)/inventory` |

==================================================

## Block System

The Block System is the foundation of the Tezhhomayaa VXP. Rather than hardcoding layouts, the UI is constructed by stacking customizable blocks.

- **Editorial Blocks**: `rich-text-block`, `spacer`. Handled via the Tiptap integration to allow inline styling, headings, and precise typography.
- **Commerce Blocks**: `collection-showcase`, `product-grid`. Dynamically fetch data from `products.json` based on assigned tags or Collection IDs.
- **Media Blocks**: `image-section`, `hero-slider`. Manage visual assets with options for parallax, gradient overlays, and device-specific rendering (Desktop vs Mobile media swapping).
- **Advanced Blocks**: Split-layout modules allowing text/image side-by-side configurations.
- **Reusable Blocks**: Content configured once in the Global settings (e.g., Size Guide, Footer) and dynamically injected into templates.

**Rendering Execution**: 
Blocks are parsed iteratively in a React Server Component. Each block has a `type` string (e.g., `"hero-slider"`) which maps to a specific React Component. The `data` object attached to the block supplies the props.

==================================================

## Page Builder

The VXP (Visual Experience Platform) utilizes `CanvasEngine.tsx` to provide a drag-and-drop page assembly experience.

1. **Assembly**: Admins select blocks from the Block Registry and drop them onto the Canvas.
2. **Context Provider**: `CanvasEngine.tsx` acts as the global state wrapper, managing `selectedId`, `hoveredId`, history (`undo`/`redo`), and device preview states (`desktop`, `mobile`).
3. **Inspector Panel**: Clicking a block loads its schema into the right-hand Inspector, providing form fields mapped to the block's `data` object.
4. **Rendering**: The Canvas dynamically loops over the current state array, rendering a 1:1 Live Preview of how the Storefront will interpret the JSON array.

==================================================

## Media Library

All visual assets pass through a unified Upload API route.

- **Image Upload**: Supports `.jpg`, `.png`, `.webp`. Uploads are immediately streamed to Cloudinary for cloud processing.
- **Video Upload**: Supports `.mp4`, `.mov`. Processed via Cloudinary's `{ resource_type: "auto" }` flag to handle large stream transfers.
- **Cloudinary Integration**: Used to automatically serve responsive WebP/AVIF formats based on the client browser.
- **Current Limitations**: The VXP lacks a dedicated Media Gallery interface to browse previously uploaded assets. Currently, assets must be uploaded per-block or URLs must be copied manually. 

==================================================

## Product Management

The Commerce Engine manages inventory via `products.json`.

- **Products**: Core entities possessing titles, prices, descriptions, and SKUs.
- **Variants**: Sub-configurations for a product (e.g., Size: S/M/L, Color: Black/White). 
- **Collections**: Manual curation groups that dictate how products appear on the storefront.
- **Tags**: Invisible metadata used for search indexing, filtering, and automated relations.
- **Categories**: Top-level taxonomy (Men, Women) linked to the primary navigation.
- **Smart Collections**: Algorithmic groupings (e.g., "New Arrivals") dynamically populated based on rules (e.g., Date Created < 30 days).
- **Hover Images**: Supported via secondary image array fields for dynamic Storefront interactions.

==================================================

## Journal CMS

The Journal serves as the brand's editorial storytelling engine, managed via `lib/journal.json` and edited in `/admin/content/journal`.

- Integrates a Rich Text Editor (Tiptap).
- Supports featured images, secondary gallery insertions, and author attribution.
- Articles are mapped to bespoke URL slugs for SEO.
- Allows embedding Commerce Blocks directly into articles (Shop The Story).

==================================================

## Lookbook CMS

A bespoke engine built specifically for museum-inspired, full-screen visual campaigns (`lib/lookbook.json`).

- **Architecture**: Employs a responsive two-column grid in the Admin interface (Media left, Settings right).
- **Slides**: Each campaign entry is a distinct slide in the array.
- **Desktop vs Mobile**: Admins upload explicit, unique assets for wide (desktop) and portrait (mobile) aspect ratios.
- **Video Implementation**: Employs scroll-aware DOM tracking via `useRef`. If a slide is active, `video.play()` is triggered. If inactive, `video.pause()` occurs, and `video.currentTime = 0` guarantees a fresh start upon return.

==================================================

## API Layer

| Route | Purpose | Input (Method) | Output |
| :--- | :--- | :--- | :--- |
| `/api/upload` | Processes media to Cloudinary. | `FormData (file)` (POST) | `{ success: true, url: string }` |
| `/api/lookbook` | CRUD operations for the Lookbook gallery. | JSON Array (POST) | `200 OK` or Lookbook JSON (GET) |
| `/api/homepage` | Saves the VXP Canvas block array. | JSON Array (POST) | `200 OK` or Homepage JSON (GET) |
| `/api/products` | Synchronizes inventory state. | JSON Array (POST) | `200 OK` or Products JSON (GET) |
| `/api/journal` | Manages editorial articles. | JSON Array (POST) | `200 OK` or Journal JSON (GET) |

==================================================

## Data Flow

The CMS operates on a direct, file-based synchronization loop:

1. **Admin**: An editor makes a change in a VXP block or form. The state updates in the React Context (`CanvasEngine.tsx`).
2. **Storage**: Upon clicking "Save", an asynchronous `POST` request is fired to the corresponding Next.js API route. The API leverages Node's `fs` to overwrite the target `.json` file in `/lib`.
3. **API / Retrieval**: The Storefront pages (Server Components) read directly from the `.json` files during rendering. 
4. **Frontend**: The Client Components receive the parsed JSON as props, rendering the high-performance UI immediately.

==================================================

## Permissions

The CMS utilizes a role-based access control (RBAC) abstraction (`AdminGuard` in `lib/admin-auth.tsx`).

- **Super Admin / Full Access**: Can read/write to all VXP modules, product engines, and platform settings.
- **Editor**: (Future Implementation) Restricted to Editorial modules (`Journal`, `Pages`) with no access to Settings or Customers.
- **Orders / Fulfillment**: Restricted to Commerce logs and Customer data.

==================================================

## Current Limitations

1. **Database Scalability**: Node `fs` writing to local `.json` files is exceptionally fast for development, but fails on stateless deployments (e.g., Vercel Serverless Functions) where the file system is read-only or ephemeral.
2. **Media Library Browsing**: Cannot visually browse past Cloudinary uploads directly inside the CMS block inspector.
3. **Concurrent Edits**: The JSON overwrite method will result in race conditions if two Admins save the `homepage.json` simultaneously.

==================================================

## Future Improvements

1. **Database Migration**: Swap the `fs.readFile` and `fs.writeFile` logic inside the API layer for an ORM (Prisma/PostgreSQL) or a document store (MongoDB/Firebase). This will instantly resolve the Vercel deployment limitations while preserving the exact same JSON schema and Frontend code.
2. **Cloudinary Asset Browser**: Build a Modal in the VXP that hits the Cloudinary Admin API, allowing editors to select existing media rather than re-uploading files.
3. **Draft / Publish States**: Add a `status: "draft" | "published"` flag to all VXP pages, allowing safe previewing of layouts before they go live on the storefront.
4. **Content Versioning**: Store historical snapshots of the `.json` models in the database to allow one-click rollbacks if an editor breaks a layout.

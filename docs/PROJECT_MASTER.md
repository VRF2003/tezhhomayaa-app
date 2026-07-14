# Tezhhomayaa OS

## Executive Summary

Tezhhomayaa is a next-generation luxury fashion platform engineered to deliver an uncompromising editorial-first experience. More than a standard eCommerce storefront, it functions as a highly bespoke, headless Enterprise Content Management System (CMS) paired with a high-performance storefront. It is designed to blur the lines between a high-fashion editorial magazine and a transactional shopping experience.

## Vision

The long-term vision of Tezhhomayaa is to establish a **Global Luxury Brand** digital presence. 
The platform is built to deliver a "museum-inspired experience", treating each product as a piece of art rather than a mere commodity. 
By integrating an Enterprise CMS and a Visual Experience Platform (VXP), Tezhhomayaa empowers administrators to craft visually stunning narratives without writing code, achieving true Quiet Luxury in both design and functionality.

## Brand Philosophy

- **Luxury**: Every interaction, animation, and layout decision must evoke premium exclusivity.
- **Minimalism**: Ruthless reduction of noise. If an element doesn't serve the story, it is removed.
- **Editorial**: Layouts should resemble high-end fashion magazines (e.g., Vogue, Kinfolk) rather than standard grid-based stores.
- **Quiet Luxury**: No flashy, aggressive marketing banners. Subtle elegance over loud promotional tactics.
- **Museum-inspired Experience**: Generous whitespace, precise typography, and slow, deliberate pacing.
- **Design Principles**: Form beyond motion. Content dictates the container.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript / JavaScript (React 19)
- **Database / Storage**: File-based JSON Data Store (`lib/*.json`) for CMS architecture
- **Styling**: Inline Styles / Custom CSS (Moving away from Tailwind dependencies for bespoke control)
- **Media**: Cloudinary (Image & Video hosting via `/api/upload`)
- **Animations**: Framer Motion (v12)
- **Rich Text / Editorial**: Tiptap Engine
- **Hosting / Deployment**: Vercel (target deployment)
- **State Management**: React Context (`store.tsx`, `commerce-context.tsx`)

## Folder Structure

- `/app` - The core Next.js 16 App Router containing all frontend routes, API endpoints (`/api`), and the secure Administration Dashboard (`/admin`).
- `/components` - Modular React components split between Storefront elements and Admin interface builders (e.g., `CanvasEngine.tsx`, `CommerceBuilder.tsx`).
- `/lib` - The central nervous system containing business logic, data models, state management, and the JSON file database (e.g., `products.json`, `lookbook.json`, `homepage.json`).
- `/public` - Static assets, fonts, and local placeholder images.
- `/docs` - Permanent knowledge base and project documentation (Source of Truth).
- `/scripts` - Automation and build scripts.

## CMS Architecture

The custom Enterprise CMS allows complete control over the platform's content without developer intervention.
- **Page Builder**: A dynamic system to construct pages using modular components.
- **Block System**: Interchangeable UI blocks (Text, Media, Commerce) for rapid layout generation.
- **Journal**: A dedicated editorial blogging engine for brand storytelling.
- **Collections & Products**: Full taxonomy management (Tags, Smart Collections, Categories).
- **Lookbook**: A highly visual, full-screen campaign gallery with scroll-aware video playback.
- **Media Library**: Universal media management integrated with Cloudinary.
- **Reusable Components**: Global components (Header, Footer, Menus) managed from a single source of truth.

## Visual Experience Platform (VXP)

The VXP is the visual engine powering the Admin CMS, allowing drag-and-drop page construction.
- **Canvas Engine**: The interactive workspace where layouts are assembled.
- **Layers Panel**: A structural tree view of the page hierarchy.
- **Inspector**: Context-aware settings panel for the currently selected block.
- **Device Simulator**: Real-time previews across Desktop, Tablet, and Mobile viewports.
- **Undo / Redo**: State history management for safe editing.
- **Live Preview**: Immediate visual feedback bridging the gap between Admin and Storefront.

## Motion Engine

Animations are standardized to ensure consistent brand pacing.
- **Motion Wrapper**: A universal component applying standard entrance and exit animations.
- **Timeline Engine**: Orchestrates complex, multi-step animation sequences (e.g., loading screens).
- **Preset Registry**: A library of approved luxury animations (fade up, slow scale, blur reveal).
- **Reduced Motion**: Respects OS-level accessibility preferences by gracefully degrading animations.
- **Replay Motion**: Scroll-aware triggers that can replay animations when elements re-enter the viewport.

## Commerce Engine

The transactional layer, seamlessly integrated into the editorial experience.
- **Luxury Product Cards**: Minimalist product representations focusing on high-quality imagery.
- **Shop The Story**: Contextual product linking within Journal articles and Lookbook slides.
- **Complete The Look**: Algorithmic and manual cross-selling modules.
- **Related Products**: Dynamic recommendations based on tags and categories.
- **Wishlist**: Persistent user curation capability.
- **Quick Add**: Frictionless cart additions without leaving the current editorial context.
- **Product Gallery**: High-resolution, immersive product inspection views.

## Performance Platform

Performance is treated as a luxury feature.
- **Dynamic Imports**: Heavy components (like the Canvas Engine) are loaded only when necessary.
- **Code Splitting**: Next.js route-based splitting ensures fast initial page loads.
- **EditorialImage**: A custom image component optimized for Next/Image and Cloudinary.
- **Blur Placeholder**: Base64 blurred image placeholders for instantaneous perceived loading.
- **Image Optimization**: Automatic WebP/AVIF formatting and responsive sizing via Cloudinary.
- **Caching**: Aggressive data caching for the JSON database to ensure immediate API responses.
- **Core Web Vitals**: Strict adherence to LCP, CLS, and INP metrics.

## Current Features

- [x] Full App Router Architecture (Next.js 16)
- [x] Custom File-based JSON Database
- [x] Visual Experience Platform (VXP) Core
- [x] Cloudinary Media Upload Integration
- [x] Lookbook CMS with Responsive Media & Video
- [x] Global Layout Management (Header/Footer CMS)
- [x] Journal Editorial Engine
- [x] Advanced Product Taxonomy Engine
- [x] Interactive Cart & Wishlist State Management

## Completed Development Phases

- **Phase 1**: Initial scaffolding, Next.js 16 setup, and baseline routing architecture.
- **Phase 2A**: Data layer implementation (JSON-based architecture) and API route creation.
- **Phase 2B**: Admin Dashboard scaffolding and secure routing (`/admin/(protected)`).
- **Phase 2C**: Visual Experience Platform (VXP) prototype and component registry.
- **Phase 2D**: Commerce Engine integration (Products, Cart, Wishlist logic).
- **Phase 2E**: Lookbook CMS module with advanced media (Desktop/Mobile Video mapping).
- **Phase 3**: Global styling normalization and luxury brand aesthetic application.
- **Phase 4**: Performance optimizations (Cloudinary integration, image placeholders).
- **Phase 5**: (In Progress) Refining the editorial block system and expanding the VXP capabilities.

## Coding Standards

- **TypeScript**: Strict typing required for all data models and component props.
- **Component Structure**: Functional components using React Hooks. Avoid deeply nested ternary operators in JSX.
- **Naming Conventions**: PascalCase for components (`SlideMedia.tsx`), camelCase for utilities and hooks, kebab-case for URLs and IDs.
- **Folder Organization**: Co-locate related logic. Keep Admin components strictly separated from public Storefront components.
- **Performance Rules**: Never import heavy libraries globally. Use `next/dynamic` for heavy client-side features.
- **Accessibility Rules**: Maintain semantic HTML. Ensure all interactive elements have focus states and `aria-labels` where appropriate.

## UI / UX Rules

- **Never feel like Shopify**: Avoid standard e-commerce tropes (e.g., aggressive "BUY NOW" buttons, clutter, countdown timers).
- **Never use aggressive animations**: Animations must be slow, deliberate, and elegant (e.g., 0.8s durations, cubic-bezier easing).
- **Prioritize whitespace**: Let elements breathe. Dense information is antithetical to luxury.
- **Editorial layouts**: Prefer asymmetrical grids, large typography, and unexpected, beautiful alignment.
- **Luxury typography**: Use the established brand fonts (Cormorant for headings, Jost/Inter for utility).
- **Minimal interfaces**: Hide complexity. The UI should fade away, leaving the content in focus.

## Future Roadmap

- **Database Migration**: Transition from file-based `.json` storage to a robust relational/NoSQL database (e.g., PostgreSQL via Prisma or Firebase) for production scalability.
- **Internationalization (i18n)**: Multi-currency and multi-language support for the global brand vision.
- **Advanced Authentication**: User accounts, order history, and bespoke VIP tiers.
- **Algorithmic Curation**: AI-driven "Complete The Look" recommendations based on browsing history.

## Project Statistics

- **Pages**: ~15 Core Routes
- **Database Models**: ~12 JSON Data Files (Products, Lookbook, Homepage, Journal, etc.)
- **Major Modules**: Admin CMS, VXP Engine, Storefront, Motion Engine.
- **Framework**: Next.js 16.2.6

## Known Issues

- **Data Persistence**: The current architecture uses local `.json` files via the `fs` module. This is excellent for rapid prototyping and local CMS usage, but it will not persist correctly on serverless edge environments (like Vercel) across deployments. A persistent database strategy is required before a production launch.
- **Concurrent Editing**: The file-based JSON system does not elegantly handle concurrent edits by multiple administrators.

## Changelog Summary

- **v0.1.0**: Project initialization.
- **v0.2.0**: Implementation of the custom Admin CMS and Authentication.
- **v0.3.0**: Cloudinary Media integration.
- **v0.4.0**: Lookbook Advanced Media Engine (Responsive Images & Scroll-Aware Videos).
- **v0.4.1**: Lookbook CMS UI Redesign (Two-column layout, Enterprise settings).

## Final Notes

> [!IMPORTANT]
> **This document is the permanent source of project knowledge.**
> 
> Future developers or AI assistants must read this `PROJECT_MASTER.md` file before proposing architecture changes, adding features, or debugging major systems. Adherence to the Brand Philosophy and UI/UX Rules is non-negotiable.

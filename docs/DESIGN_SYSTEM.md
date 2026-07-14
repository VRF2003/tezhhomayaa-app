# Design System

## Vision

The Tezhhomayaa Design System codifies the brand's aesthetic into a reproducible digital framework. It guarantees that every component, block, and interaction reflects the "Quiet Luxury" ethos. The system prioritizes content and editorial narrative over UI chrome, ensuring the interface feels like an elegant physical gallery rather than a transactional software application.

## Design Philosophy

- **Quiet Luxury**: Minimalist, deliberate, and unhurried. 
- **Editorial First**: Interfaces should resemble high-end fashion magazine spreads (like Vogue or Harper's Bazaar).
- **Whitespace is Structure**: We do not use borders or heavy shadows to separate content. Whitespace (negative space) defines the grid.
- **Typography First**: Because UI elements are stripped away, the typography carries the weight of the interface.

==================================================

## Color System

The color system is intentionally restricted. It relies on an "Architectural/Gallery" neutral palette to allow full-color photography to pop.

### Neutral Palette (Gallery Space)
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **White** | `#FAFAF8` | Primary background. |
| **Paper** | `#F5F2EC` | Secondary background / Subtle contrast. |
| **Parchment**| `#EDE8DF` | Card backgrounds / Image placeholders. |
| **Linen** | `#E2DDD5` | Dividers / Soft borders. |
| **Warm Gray**| `#C8C2B8` | Disabled text / Inactive states. |
| **Mid Gray** | `#9A9590` | Secondary text / Captions. |
| **Stone** | `#6B6560` | Icons / Meta text. |
| **Slate** | `#3A3530` | Tertiary text. |
| **Charcoal** | `#1E1A16` | Standard body text. |
| **Obsidian** | `#0C0A08` | High-contrast headings / Active states. |

### Brand Accents
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Brand (Burgundy)**| `#5D0017` | Logo (Devasia) and critical accent moments. |
| **Brand Light**| `#7A1028` | Hover states for primary accents. |
| **Gold** | `#A07840` | Secondary luxury accent. |
| **Gold Light**| `#C49A60` | Gold hover states. |

==================================================

## Typography

Tezhhomayaa uses a three-tier typography system wrapped in a custom CSS fluid-scaling engine (`app/globals.css`).

### Font Families
- **Logo**: `Devasia` (Custom WOFF2) — Brand identity only.
- **Serif (Display & Editorial)**: `Cormorant Garamond` (or Georgia fallback). Used for all headings and editorial journal text.
- **Sans-serif (UI & Body)**: `Jost`. Used for functional UI (navigation, buttons, product titles).
- **Mono (Labels)**: `DM Mono`. Used for micro-copy, SKU numbers, and strict technical data.

### Fluid Typography Engine
Instead of rigid Tailwind classes (like `text-2xl`), the project utilizes custom `.fluid-*` classes that interpolate perfectly between breakpoints.

| Class | Desktop | Tablet | Mobile | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `.fluid-hero` | `6rem` | `4rem` | `2.5rem` | Giant splash text. |
| `.fluid-h1` | `4rem` | `3rem` | `2.5rem` | Page Titles. |
| `.fluid-h2` | `3rem` | `2.25rem`| `1.75rem`| Section Headers. |
| `.fluid-h3` | `2rem` | `1.5rem` | `1.25rem`| Product Titles / Subsections. |
| `.fluid-body` | `1rem` | `1rem` | `1rem` | Standard reading text. |
| `.fluid-caption`| `0.75rem`| `0.75rem`| `0.75rem`| Metadata / Small print. |
| `.text-label` | `0.62rem`| `0.62rem`| `0.62rem`| All-caps `DM Mono` tracking `0.2em`. |

==================================================

## Spacing System

Spacing defines the "Luxury" feel. 
- **Section Spacing**: Large vertical margins separate conceptual blocks (min `4rem` mobile, up to `8rem` desktop).
- **Component Spacing**: Driven by Tailwind's base-4 scale (`gap-4`, `p-8`).
- **Product Gap**: E-commerce grids utilize generous padding (`gap-x-4 gap-y-12`) rather than tightly packing product cards.

==================================================

## Grid System

- **Desktop (1024px+)**: Operates on a loose 12-column or Asymmetrical CSS Grid, allowing text and images to intentionally misalign for editorial flair.
- **Tablet (768px - 1023px)**: Transitions to a stricter 2-column or 3-column layout.
- **Mobile (< 768px)**: Primarily single-column, with horizontal scroll-snapping carousels used to prevent extreme vertical page length.

==================================================

## Components

### Buttons
- **Primary**: Solid background (`var(--obsidian)`), white text. Sharp corners (`rounded-none`).
- **Ghost/Outline**: Transparent background, 1px `obsidian` border.
- **Hover States**: No aggressive scaling. Buttons utilize slow background/color fades or an animated underline (`.tz-sub-line`).

### Luxury Product Card
- **Background**: `bg-[#f0ece6]` providing a warm, museum-wall tone before the image loads.
- **Badges**: Frosted glass (`bg-white/90 backdrop-blur-sm`), sharp corners, uppercase mono text.
- **Hover**: 
  - Image scales `1.02` (slow 1000ms transition).
  - Secondary image fades in.
  - "Quick Add" drawer smoothly slides up from the inside-bottom edge.
- **Swatches**: Circular divs with a delicate `border-gray-200/50`.

### Forms & Inputs
- **Inputs**: Underline-only inputs (`border-b border-gray-300`) or severely flattened rectangles. No heavy focus rings; a simple `border-black` transition on focus.
- **Labels**: Rendered as uppercase `.text-label` floating above or inside the input.

### Navigation / Menus
- **Submenus**: Link hovers trigger a `.tz-sub-line` that scales from `transform: scaleX(0)` to `scaleX(1)` originating from the left.

==================================================

## Motion Guidelines

Motion must utilize the pre-defined Easing Variables from `globals.css`:
- `--ease-luxury`: `cubic-bezier(0.16, 1, 0.3, 1)` (Very slow deceleration, perfect for image reveals).
- `--ease-cinematic`: `cubic-bezier(0.77, 0, 0.175, 1)` (Dramatic ease-in-out).

**Motion Rules**:
- Never use "bouncy" or elastic easings.
- Entrance animations (like `.tz-fade-up`) should take at least `700ms`.
- Image hovers should take `850ms - 1000ms`.

==================================================

## Accessibility

- **Contrast**: `var(--obsidian)` on `var(--white)` ensures WCAG AAA compliance for text.
- **Reduced Motion**: `globals.css` forces `animation-duration: 0.01ms !important` system-wide if `@media (prefers-reduced-motion: reduce)` is detected.
- **Typography**: `.fluid-heading` contains `overflow-wrap: break-word` to prevent broken layouts for users relying on translation tools (i18n).

==================================================

## Design Rules

> [!CAUTION]
> **Permanent UI Rules**
> 1. **Never use heavy shadows**: Drop shadows should be imperceptible (e.g., `--shadow-soft`).
> 2. **Never use aggressive gradients**: Flat colors only, unless explicitly part of a full-screen Lookbook overlay.
> 3. **Never use rounded pill buttons**: Corners should be sharp (`0px` border-radius) to reflect high-fashion editorial severity.
> 4. **Always prioritize whitespace**: If a layout feels cramped, reduce the element size or increase the gap. Never fill the screen simply because space exists.
> 5. **Borders are a last resort**: Separate content using whitespace or typography hierarchy first. Use `var(--border-soft)` only if absolutely necessary.

==================================================

## Current Limitations

- **Dark Mode**: The CSS variables are entirely mapped to a Light/Gallery aesthetic. True Dark Mode inversion (`@media (prefers-color-scheme: dark)`) is not currently implemented in the token system.
- **Color Consistency**: The VXP inspector relies on raw Hex codes rather than mapping directly to the CSS variable tokens, allowing admins to accidentally use non-brand colors.

## Future Improvements

- **Design Token API**: Export the `globals.css` variables into a JSON token dictionary so the VXP Inspector can force administrators to pick from the curated `--color-*` list rather than an open color wheel.
- **Dark Mode Variants**: Implement an `.obsidian-mode` data-theme toggle that inverts the variables for specific high-drama Lookbook campaigns.

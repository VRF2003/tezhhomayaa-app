# Visual Experience Platform

## Vision

The Visual Experience Platform (VXP) is the creative heart of the Tezhhomayaa OS. It is engineered to empower administrators, designers, and editors to construct, manipulate, and publish high-end editorial commerce experiences visually, with zero code deployment required. It aims to bridge the gap between static design tools (like Figma) and live Next.js production code.

## Philosophy

Tezhhomayaa utilizes a bespoke VXP rather than relying on a traditional headless CMS (like Contentful or Sanity) or standard eCommerce editors (like Shopify). Traditional CMSs force content into rigid structural silos and predefined templates, severely limiting the "editorial-first" aesthetic required by a global luxury brand. 

By deeply integrating the VXP into the Next.js frontend, Tezhhomayaa achieves true "What You See Is What You Get" (WYSIWYG) editing. The exact React components running on the live storefront are the identical components rendered within the VXP Canvas, guaranteeing 100% visual fidelity and immediate feedback without intermediate preview environments.

==================================================

## High Level Architecture

The VXP operates on a unified React state loop wrapping four primary modules: the Toolbar, the Layers Panel, the Canvas, and the Inspector.

```mermaid
flowchart TD
    subgraph VXP_Editor ["VXP Editor (/admin)"]
        Admin(Admin User)
        
        Admin -->|Drags / Drops| Layers(Layers Panel)
        Admin -->|Clicks Block| Canvas(Device Canvas)
        Admin -->|Edits Props| Inspector(Inspector Panel)
        
        Layers <--> State
        Canvas <--> State
        Inspector <--> State
        
        State[CanvasEngine Context]
        State -->|Renders Array| Renderer(Block Renderer)
        Renderer --> Canvas
    end
    
    State -->|JSON.stringify| API[/api/homepage]
    API --> FileDB[(JSON Data Layer)]
    
    FileDB -->|Reads| Storefront(Storefront Pages)
```

==================================================

## Canvas Engine

The `CanvasEngine.tsx` is the core React Context Provider managing the entire VXP state.

- **State Management**: It holds the master `sections` array representing the page structure.
- **Selection**: Tracks `selectedId` to determine which block populates the Inspector.
- **Hover**: Tracks `hoveredId` to draw contextual blue outlines around blocks in the Canvas.
- **History**: Maintains an array of previous states allowing safe experimentation.
- **Device Preview**: Scales and resizes the central iframe/container based on the chosen device mode.
- **Live Rendering**: Directly renders the Storefront React components (e.g., `EditorialHero`) using the current state data.
- **Deep Merge Updates**: The `updateBlock` function accepts nested path arrays (e.g., `["data", "content", "heading"]`) and dynamically mutates a deep clone of the block to prevent state corruption.

==================================================

## Layers Panel

The Layers panel (`<LayersPanel />`) provides a structural tree view of the DOM.

- **Hierarchy**: Renders a vertical list of all blocks in the `sections` array.
- **Drag & Drop**: Powered by `@dnd-kit/core` and `@dnd-kit/sortable`, allowing seamless reordering via `arrayMove`.
- **Duplicate**: Clones a block and its settings, injecting a new UUID via `uuidv4()`.
- **Delete**: Splices the block out of the array and clears `selectedId`.
- **Hide**: Toggles a `hidden` boolean on the block schema, fading it out (`opacity-30 grayscale`) in the Canvas and preventing rendering on the Storefront.
- **Selection Sync**: Clicking a layer instantly syncs with the Canvas highlighting and opens the Inspector.

==================================================

## Inspector

The Inspector (`<InspectorPanel />`) is a context-aware properties panel that dynamically adapts based on the currently selected block.

- **Property Panels**: Updates are dispatched via `handleUpdate(["path", "to", "prop"], value)`.
- **Content**: Manages textual data (Headings, Descriptions, Button Labels).
- **Layout & Spacing**: Provides direct CSS controls (e.g., explicit Desktop Padding strings like `4rem 0`) and alignment toggles (Left/Center/Right).
- **Animation**: Exposes the Motion Engine presets. Admins can select `fade`, `slide-up`, or `scale` which automatically pass to the `Framer Motion` wrappers on the storefront.
- **Responsive Controls**: While not fully expanded in the UI yet, the schema structure natively supports split values (e.g., `layout.desktop.align` vs `layout.mobile.align`).

==================================================

## Device Simulator

The simulator provides instantaneous responsive previewing without resizing the browser window.

- **Desktop**: 100% width fluid container.
- **Laptop**: Constrained to `1024px`.
- **Tablet**: Constrained to `768px`.
- **Mobile**: Constrained to `390px` (standard iPhone sizing).
- **Scaling**: A zoom slider manipulates a CSS `transform: scale(zoom / 100)` on the Canvas origin, allowing administrators to zoom out and view an entire Desktop layout on a smaller laptop screen.

==================================================

## Live Preview

- **Real-time updates**: Keystrokes in the Inspector instantly mutate the Context state.
- **Rendering Synchronization**: Because the VXP uses the exact same `RenderBlock` component as the public Storefront, there is zero translation layer. If it works in the Canvas, it is guaranteed to work for the customer.
- **Performance Preservation**: Interactive overlays (like selection boxes) are rendered as `absolute` elements *on top* of the block, ensuring the underlying block's DOM structure remains untouched.

==================================================

## History Engine

The VXP implements a robust linear undo/redo stack to protect against destructive edits.

- **Snapshots**: Every time `saveHistory` is called (via dragging, editing, or deleting), a deep copy of the `sections` array is pushed into a `history` array.
- **State Stack**: `historyIndex` tracks the current position.
- **Undo / Redo**: Calling `undo()` decrements the pointer and restores the previous array; `redo()` increments it.
- **Clipboard**: A standalone state object holds deep copies of blocks for Copy/Paste operations across the canvas.

==================================================

## Block Registry

Blocks are registered centrally in the `RenderBlock` component.

- **Registration**: A massive `switch(section.type)` statement maps string identifiers (e.g., `"hero-slider"`) to specific React components (e.g., `<EditorialHero section={section.data} />`).
- **Extensibility**: To add a new block, a developer simply creates the Storefront component, adds it to the `switch` statement in the registry, and creates an initial JSON seed object in the "Add Block" menu.

==================================================

## Rendering Pipeline

1. The Admin selects a property in the **Inspector**.
2. `handleUpdate` deeply clones the targeted block, mutates the specific key, and calls `updateBlock`.
3. `CanvasEngine` deep clones the entire `sections` array, replaces the updated block, pushes it to the **History Stack**, and sets the new React state.
4. The **Device Canvas** maps over the new `sections` array.
5. `MemoizedRenderBlock` detects the prop change and triggers a React reconciliation specifically for that single block.
6. The updated Storefront component renders inside the scaled Canvas container.

==================================================

## Performance

To maintain 60fps editing while managing massive JSON payloads, the VXP employs strict performance barriers.

- **React.memo**: The `MemoizedRenderBlock` wraps the core renderer.
- **Deep Comparison**: A custom equality check (`JSON.stringify(prev) === JSON.stringify(next)`) prevents identical blocks from thrashing or re-rendering when sibling blocks are updated.
- **Motion Engine Forcing**: A specialized `forceReplayKey` from the `useMotionEngine` context is applied to the wrapper `div`. When an admin clicks "Replay Motion", this key increments, forcefully remounting the DOM node and re-triggering all Framer Motion entrance animations.

==================================================

## Current Limitations

1. **State Mutation Overhead**: The reliance on `JSON.parse(JSON.stringify())` for deep cloning state and history snapshots is safe but computationally expensive. If a page grows to hundreds of complex blocks, this serialization may cause perceptible input lag.
2. **Schema Rigidity**: The Inspector requires manual mapping to the JSON schema paths. If the block component requires a deeply nested property that the Inspector UI lacks an input for, it cannot be edited visually.
3. **Collaboration**: State is local to the client's React instance until "Publish" is clicked. Multiple editors working on the same page will overwrite each other's changes based on whoever hits save last.

==================================================

## Future Improvements

1. **Immer.js Integration**: Replace the `JSON.parse` deep cloning mechanism in the History Engine and `updateBlock` functions with `immer.js`. This will drastically reduce memory overhead by using structural sharing for immutable state updates.
2. **Dynamic Inspector Schema**: Instead of hardcoding inputs in `InspectorPanel.tsx`, implement a schema-driven form generator (e.g., defining a `schema.json` alongside each block component) that automatically renders the correct text/color/select inputs.
3. **Optimistic Locking**: Implement a simple lock mechanism in the API layer that warns a user if another administrator is currently editing the same JSON file.

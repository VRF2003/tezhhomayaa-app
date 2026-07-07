"use client";

import React, { useState } from "react";
import { useCanvas } from "./CanvasEngine";
import { MotionEngineProvider, useMotionEngine } from "../motion/MotionEngine";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sub-components (To be fully implemented in subsequent sub-phases) ---
const TopToolbar = () => {
  const { deviceMode, setDeviceMode, zoom, setZoom, undo, redo, canUndo, canRedo } = useCanvas();
  const { triggerReplay, prefersReducedMotion } = useMotionEngine();
  
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 select-none shrink-0">
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium tracking-wide flex items-center gap-2">
          Tezhhomayaa VXP
          {prefersReducedMotion && (
            <span className="bg-red-50 text-red-500 border border-red-200 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
              Reduced Motion
            </span>
          )}
        </div>
        <div className="h-4 w-px bg-gray-300 mx-2" />
        <div className="flex gap-1">
          <button disabled={!canUndo} onClick={undo} className={`p-1.5 rounded ${canUndo ? "hover:bg-gray-100 text-black" : "text-gray-300"} transition-colors`} aria-label="Undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
          </button>
          <button disabled={!canRedo} onClick={redo} className={`p-1.5 rounded ${canRedo ? "hover:bg-gray-100 text-black" : "text-gray-300"} transition-colors`} aria-label="Redo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={triggerReplay} className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Replay Motion
        </button>

        <div className="flex items-center bg-gray-100 p-1 rounded-md">
          {(["desktop", "laptop", "tablet", "mobile"] as const).map(mode => (
            <button 
              key={mode}
              onClick={() => setDeviceMode(mode)}
              className={`px-3 py-1 text-xs capitalize rounded transition-all duration-300 ${deviceMode === mode ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.max(25, zoom - 10))} className="text-gray-400 hover:text-black">-</button>
          <span className="text-xs w-10 text-center font-mono">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="text-gray-400 hover:text-black">+</button>
        </div>
        <button className="bg-black text-white text-xs px-4 py-2 uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Publish
        </button>
      </div>
    </div>
  );
};

const SortableLayerItem = ({ id, type, selected }: { id: string, type: string, selected: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { setSelectedId, updateBlock, deleteBlock, duplicateBlock } = useCanvas();
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between px-3 py-2 text-xs cursor-pointer rounded mb-1 transition-colors ${selected ? "bg-blue-50 text-blue-600 border border-blue-200" : "hover:bg-gray-100 text-gray-700 border border-transparent"} ${isDragging ? "opacity-50 shadow-lg" : ""}`}
      onClick={() => setSelectedId(id)}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
        <span className="truncate w-32 font-medium tracking-wide">{type.replace("adv-", "").replace("-block", "").replace("-", " ")}</span>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(id); }} className="text-gray-400 hover:text-blue-600 p-1" title="Duplicate">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); deleteBlock(id); }} className="text-gray-400 hover:text-red-600 p-1" title="Delete">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
};

const LayersPanel = () => {
  const { sections, setSections, selectedId } = useCanvas();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-72 bg-[#fcfbf9] border-r border-gray-200 flex flex-col shrink-0 select-none overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Layers</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map(s => (
              <SortableLayerItem key={s.id} id={s.id} type={s.type} selected={selectedId === s.id} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

const InspectorPanel = () => {
  const { sections, selectedId, updateBlock } = useCanvas();
  const block = sections.find(s => s.id === selectedId);

  if (!block) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500">Inspector</div>
        <div className="flex-1 p-4 flex items-center justify-center text-xs text-gray-400">Select a block to edit</div>
      </div>
    );
  }

  const handleUpdate = (path: string[], value: any) => {
    // Deep clone block
    const newBlock = JSON.parse(JSON.stringify(block));
    let target = newBlock;
    for (let i = 0; i < path.length - 1; i++) {
      if (!target[path[i]]) target[path[i]] = {};
      target = target[path[i]];
    }
    target[path[path.length - 1]] = value;
    updateBlock(block.id, newBlock);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden select-none">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Properties</span>
        <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]">{block.type}</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        
        {/* Content Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Content</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Heading</label>
              <input 
                type="text" 
                value={block.data?.content?.heading || ""} 
                onChange={(e) => handleUpdate(["data", "content", "heading"], e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Description</label>
              <textarea 
                value={block.data?.content?.description || ""} 
                onChange={(e) => handleUpdate(["data", "content", "description"], e.target.value)}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Layout Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Layout</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Padding (CSS)</label>
              <input 
                type="text" 
                value={block.data?.layout?.desktop?.padding || ""} 
                placeholder="e.g. 4rem 0"
                onChange={(e) => handleUpdate(["data", "layout", "desktop", "padding"], e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-black transition-all" 
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest">Alignment</label>
              <select 
                value={block.data?.layout?.desktop?.align || "left"} 
                onChange={(e) => handleUpdate(["data", "layout", "desktop", "align"], e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-black"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>

        {/* Animation Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Animation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest">Preset</label>
              <select 
                value={block.data?.animation?.type || "none"} 
                onChange={(e) => handleUpdate(["data", "animation", "type"], e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-black"
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slide-up">Slide Up</option>
                <option value="scale">Scale Reveal</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import {
  EditorialImageGallery,
  EditorialMasonryGallery,
  EditorialVideo,
  EditorialYouTube,
  EditorialImageHotspots,
  EditorialHero,
  EditorialShopTheStory,
  EditorialProductCarousel,
  EditorialRelatedProducts,
  EditorialCompleteTheLook,
  EditorialFeaturedCollection,
  EditorialNewsletter,
  EditorialRelatedStories,
  EditorialCTA,
  EditorialRecentlyViewed,
  EditorialYouMayAlsoLike,
  EditorialStickyPurchaseBar,
  EditorialFloatingWishlist,
  AdvRichTextBlock,
  AdvRawHTMLBlock,
  AdvCodeBlock,
  AdvFounderQuote,
  AdvDownloadBlock,
  AdvContactBlock,
  AdvTimeline,
  AdvStatistics,
  AdvFAQ,
  AdvTabs,
  AdvTable,
  AdvAwards,
  AdvPressLogos,
  AdvSustainability,
  AdvBrandValues,
  AdvBeforeAfter,
  AdvAudioBlock,
  AdvStoreLocator,
  AdvEventCountdown,
  AdvBentoGrid
} from "../sections/DynamicBlocks";

// --- Dynamic Block Renderer for VXP ---
const RenderBlock = ({ section }: { section: any }) => {
  switch (section.type) {
    case "hero-slider": return <EditorialHero section={section.data} />;
    case "image-gallery": return <EditorialImageGallery section={section.data} />;
    case "masonry-gallery": return <EditorialMasonryGallery section={section.data} />;
    case "video-block": return <EditorialVideo section={section.data} />;
    case "youtube-embed": return <EditorialYouTube section={section.data} />;
    case "image-hotspots": return <EditorialImageHotspots section={section.data} />;
    case "shop-the-story": return <EditorialShopTheStory section={section.data} />;
    case "product-carousel": return <EditorialProductCarousel section={section.data} />;
    case "related-products": return <EditorialRelatedProducts section={section.data} />;
    case "complete-the-look": return <EditorialCompleteTheLook section={section.data} />;
    case "featured-collection": return <EditorialFeaturedCollection section={section.data} />;
    case "newsletter-block": return <EditorialNewsletter section={section.data} />;
    case "related-stories": return <EditorialRelatedStories section={section.data} />;
    case "editorial-cta": return <EditorialCTA section={section.data} />;
    case "recently-viewed": return <EditorialRecentlyViewed section={section.data} />;
    case "you-may-also-like": return <EditorialYouMayAlsoLike section={section.data} />;
    case "sticky-purchase-bar": return <EditorialStickyPurchaseBar section={section.data} />;
    case "floating-wishlist": return <EditorialFloatingWishlist section={section.data} />;
    case "adv-rich-text": return <AdvRichTextBlock section={section.data} />;
    case "adv-raw-html": return <AdvRawHTMLBlock section={section.data} />;
    case "adv-code-block": return <AdvCodeBlock section={section.data} />;
    case "adv-founder-quote": return <AdvFounderQuote section={section.data} />;
    case "adv-download-block": return <AdvDownloadBlock section={section.data} />;
    case "adv-contact-block": return <AdvContactBlock section={section.data} />;
    case "adv-timeline": return <AdvTimeline section={section.data} />;
    case "adv-statistics": return <AdvStatistics section={section.data} />;
    case "adv-faq": return <AdvFAQ section={section.data} />;
    case "adv-tabs": return <AdvTabs section={section.data} />;
    case "adv-table": return <AdvTable section={section.data} />;
    case "adv-awards": return <AdvAwards section={section.data} />;
    case "adv-press-logos": return <AdvPressLogos section={section.data} />;
    case "adv-sustainability": return <AdvSustainability section={section.data} />;
    case "adv-brand-values": return <AdvBrandValues section={section.data} />;
    case "adv-before-after": return <AdvBeforeAfter section={section.data} />;
    case "adv-audio-block": return <AdvAudioBlock section={section.data} />;
    case "adv-store-locator": return <AdvStoreLocator section={section.data} />;
    case "adv-event-countdown": return <AdvEventCountdown section={section.data} />;
    case "adv-bento-grid": return <AdvBentoGrid section={section.data} />;
    default: return <div className="p-8 text-center border-dashed border-2 border-gray-300">Unknown block: {section.type}</div>;
  }
};

const MemoizedRenderBlock = React.memo(RenderBlock, (prev, next) => {
  // Deep equality check on section data to prevent thrashing
  return JSON.stringify(prev.section) === JSON.stringify(next.section);
});

const DeviceCanvas = () => {
  const { sections, deviceMode, zoom, selectedId, setSelectedId, hoveredId, setHoveredId } = useCanvas();
  const { forceReplayKey } = useMotionEngine(); // Force re-render of canvas on replay
  
  const getDeviceWidth = () => {
    switch(deviceMode) {
      case "desktop": return "100%";
      case "laptop": return "1024px";
      case "tablet": return "768px";
      case "mobile": return "390px";
      default: return "100%";
    }
  };

  return (
    <div className="flex-1 bg-[#e8e6e1] overflow-auto flex items-center justify-center p-8 relative">
      <div 
        className="bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top relative ring-1 ring-gray-900/5 flex flex-col"
        style={{ 
          width: getDeviceWidth(),
          minHeight: "800px",
          transform: `scale(${zoom / 100})`
        }}
      >
        {sections.map(section => (
          <div 
            key={`${section.id}-${forceReplayKey}`} // React remounts when key changes, forcing the block to re-animate!
            onClick={() => setSelectedId(section.id)}
            onMouseEnter={() => setHoveredId(section.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative group transition-all"
          >
            {/* Hover Outline */}
            <div className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 ${hoveredId === section.id && selectedId !== section.id ? 'opacity-100 ring-2 ring-blue-300/50' : 'opacity-0'}`} />
            
            {/* Selected Outline */}
            <div className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 ${selectedId === section.id ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-0'}`} />
            
            {/* Selected Badge */}
            {selectedId === section.id && (
              <div className="absolute top-0 left-0 bg-blue-500 text-white text-[9px] uppercase tracking-widest px-2 py-1 z-50 rounded-br shadow-sm pointer-events-none">
                {section.type}
              </div>
            )}
            
            <div className={`${section.hidden ? "opacity-30 grayscale pointer-events-none" : ""}`}>
              <MemoizedRenderBlock section={section} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function VXPWorkspaceWrapper() {
  return (
    <MotionEngineProvider>
      <VXPWorkspace />
    </MotionEngineProvider>
  );
}

function VXPWorkspace() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 font-sans text-gray-900">
      <TopToolbar />
      <div className="flex-1 flex overflow-hidden">
        <LayersPanel />
        <DeviceCanvas />
        <InspectorPanel />
      </div>
      <div className="h-8 bg-white border-t border-gray-200 flex items-center px-4 justify-between text-[10px] text-gray-500 tracking-wider shrink-0 select-none">
        <div>Path: /homepage</div>
        <div>All changes saved</div>
      </div>
    </div>
  );
}

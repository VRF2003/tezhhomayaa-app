"use client";

import React, { useEffect, useState } from "react";
import { JournalThemeConfig } from "@/lib/journal-theme";

export default function JournalThemePage() {
  const [config, setConfig] = useState<JournalThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/journal-theme")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConfig(data.data);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/journal-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) alert("Global Journal Theme saved successfully!");
    } catch (e) {
      alert("Failed to save theme.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading theme...</div>;
  if (!config) return <div className="p-8">Failed to load theme.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32 flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-[#1a1a18]">Journal Theme</h1>
          <p className="text-gray-500 mt-2">Manage the global design system for your luxury editorials.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a1a18] text-[#f7f5f2] px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-black transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Theme"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Presets */}
        <div className="bg-white border border-gray-200 p-6 flex flex-col gap-6">
          <h2 className="text-sm tracking-[0.15em] uppercase text-gray-400 border-b border-gray-100 pb-2">Global Presets</h2>
          
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2">Typography Preset</label>
            <select 
              value={config.typographyPreset}
              onChange={e => setConfig({...config, typographyPreset: e.target.value as any})}
              className="w-full border border-gray-300 p-2 text-sm outline-none"
            >
              <option value="Editorial XL">Editorial XL</option>
              <option value="Luxury">Luxury</option>
              <option value="Magazine">Magazine</option>
              <option value="Compact">Compact</option>
              <option value="Minimal">Minimal</option>
              <option value="Fashion House">Fashion House</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2">Design Layout Preset</label>
            <select 
              value={config.designPreset}
              onChange={e => setConfig({...config, designPreset: e.target.value as any})}
              className="w-full border border-gray-300 p-2 text-sm outline-none"
            >
              <option value="Classic">Classic</option>
              <option value="Luxury">Luxury</option>
              <option value="Magazine">Magazine</option>
              <option value="Gallery">Gallery</option>
              <option value="Campaign">Campaign</option>
              <option value="Minimal">Minimal</option>
              <option value="Immersive">Immersive</option>
              <option value="Narrative">Narrative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2">Animation Preset</label>
            <select 
              value={config.animationPreset}
              onChange={e => setConfig({...config, animationPreset: e.target.value as any})}
              className="w-full border border-gray-300 p-2 text-sm outline-none"
            >
              <option value="None">None</option>
              <option value="Editorial">Editorial (Subtle fade)</option>
              <option value="Luxury">Luxury (Slow drift)</option>
              <option value="Museum">Museum (Staggered)</option>
              <option value="Campaign">Campaign (Scale)</option>
              <option value="Cinematic">Cinematic (Mask reveals)</option>
            </select>
          </div>
        </div>

        {/* Structural Layouts */}
        <div className="bg-white border border-gray-200 p-6 flex flex-col gap-6">
          <h2 className="text-sm tracking-[0.15em] uppercase text-gray-400 border-b border-gray-100 pb-2">Layout & Behavior</h2>
          
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2">Navbar Behavior</label>
            <select 
              value={config.navbarBehavior}
              onChange={e => setConfig({...config, navbarBehavior: e.target.value as any})}
              className="w-full border border-gray-300 p-2 text-sm outline-none"
            >
              <option value="transparent-to-white">Transparent → White on Scroll</option>
              <option value="solid">Always Solid</option>
              <option value="hidden">Hidden on Scroll Down</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2">Shop The Story Layout</label>
            <select 
              value={config.shopLayout}
              onChange={e => setConfig({...config, shopLayout: e.target.value as any})}
              className="w-full border border-gray-300 p-2 text-sm outline-none"
            >
              <option value="manual">Manual Drag & Drop</option>
              <option value="auto">Automatic (Tags)</option>
              <option value="ai">AI Suggested</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-2">Footer Transition Style</label>
            <select 
              value={config.footerStyle}
              onChange={e => setConfig({...config, footerStyle: e.target.value as any})}
              className="w-full border border-gray-300 p-2 text-sm outline-none"
            >
              <option value="immersive">Immersive (Newsletter → Related → Footer)</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-white border border-gray-200 p-6 flex flex-col gap-6 lg:col-span-2">
          <h2 className="text-sm tracking-[0.15em] uppercase text-gray-400 border-b border-gray-100 pb-2">Measurements & Spacing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Reading Width</label>
              <input 
                value={config.readingWidth}
                onChange={e => setConfig({...config, readingWidth: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm outline-none"
                placeholder="e.g. 680px"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Paragraph Width</label>
              <input 
                value={config.paragraphWidth}
                onChange={e => setConfig({...config, paragraphWidth: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm outline-none"
                placeholder="e.g. 760px"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Line Height</label>
              <input 
                type="number"
                step="0.1"
                value={config.paragraphLineHeight}
                onChange={e => setConfig({...config, paragraphLineHeight: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Hero Width</label>
              <input 
                value={config.defaultHeroWidth}
                onChange={e => setConfig({...config, defaultHeroWidth: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm outline-none"
                placeholder="e.g. 90%"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Hero Height</label>
              <input 
                value={config.defaultHeroHeight}
                onChange={e => setConfig({...config, defaultHeroHeight: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm outline-none"
                placeholder="e.g. 80vh"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Image Spacing</label>
              <input 
                value={config.imageSpacing}
                onChange={e => setConfig({...config, imageSpacing: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm outline-none"
                placeholder="e.g. 120px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

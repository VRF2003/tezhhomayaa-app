"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MobileLayoutBuilder() {
  const [config, setConfig] = useState({
    heroHeight: 75,
    logoSize: 1.05,
    iconSize: 22,
    sectionSpacing: 4,
    productGap: 1,
    headingScale: 85
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/api/appearance")
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data?.mobile) {
          setConfig(res.data.mobile);
        }
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Sync to iframe whenever config changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "SYNC_APPEARANCE", config: { mobile: config } },
        "*"
      );
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { mobile: config };
      await fetch("/api/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("Mobile layout settings saved successfully!");
    } catch(err) {
      alert("Failed to save layout.");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: string, val: number) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-full gap-8 bg-white" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* ─── Controls (Left) ──────────────────────── */}
      <div className="w-[400px] flex-shrink-0 flex flex-col border-r border-[#e8e4df] pr-8" style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-[#1a1a18]">Mobile Refinement</h1>
            <p className="text-sm text-[#9a9690] mt-1">Adjust global mobile aesthetics</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#1a1a18] text-white text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex flex-col gap-8">
          
          <ControlSection title="Header">
            <Slider label="Logo Size" val={config.logoSize} min={0.8} max={1.5} step={0.05} unit="x" onChange={(v: number) => updateConfig("logoSize", v)} />
            <Slider label="Menu Icon Size" val={config.iconSize} min={18} max={32} step={1} unit="px" onChange={(v: number) => updateConfig("iconSize", v)} />
          </ControlSection>

          <ControlSection title="Hero & Banners">
            <Slider label="Main Image Height" val={config.heroHeight} min={50} max={100} step={1} unit="vh" onChange={(v: number) => updateConfig("heroHeight", v)} />
          </ControlSection>

          <ControlSection title="Products">
            <Slider label="Space Between Products" val={config.productGap} min={0.5} max={3} step={0.1} unit="rem" onChange={(v: number) => updateConfig("productGap", v)} />
          </ControlSection>

          <ControlSection title="Typography">
            <Slider label="Heading Scale" val={config.headingScale} min={50} max={120} step={5} unit="%" onChange={(v: number) => updateConfig("headingScale", v)} />
          </ControlSection>

          <ControlSection title="Spacing">
            <Slider label="Space Above & Below Sections" val={config.sectionSpacing} min={2} max={8} step={0.5} unit="rem" onChange={(v: number) => updateConfig("sectionSpacing", v)} />
          </ControlSection>
        </div>
        
        <div className="mt-8 pb-12 text-xs text-[#9a9690] italic">
          Values are injected live into the iframe viewport.
        </div>
      </div>

      {/* ─── Preview Iframe (Right) ──────────────────────── */}
      <div className="flex-1 bg-[#F7F5F2] rounded-md overflow-hidden relative flex flex-col p-8">
        <div className="absolute top-4 left-6 text-xs uppercase tracking-widest text-[#9a9690] z-10">
          Live Preview (390px Viewport)
        </div>
        
        <div className="flex-1 w-full h-full overflow-auto flex flex-col items-center">
          <div className="bg-black rounded-[40px] p-3 shadow-2xl relative shrink-0 mt-auto mb-auto" style={{ width: "390px", height: "844px" }}>
            {/* Top Notch UI Simulation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] bg-black rounded-b-[20px] z-50 pointer-events-none"></div>
            
            <iframe 
              ref={iframeRef}
              src="/?preview=true" 
              className="w-full h-full bg-white rounded-[32px] overflow-hidden"
              onLoad={() => {
                // Initial sync after load
                if (iframeRef.current && iframeRef.current.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(
                    { type: "SYNC_APPEARANCE", config: { mobile: config } },
                    "*"
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI Helpers ─────────────────────────────────────
function ControlSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs uppercase tracking-widest text-[#9a9690] border-b border-[#e8e4df] pb-2">
        {title}
      </div>
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

function Slider({ label, val, min, max, step, unit, onChange }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-[#1a1a18] font-medium">{label}</label>
        <span className="text-xs font-mono text-[#6b6865]">{val}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={val}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-[#e8e4df] rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #1a1a18 ${(val - min)/(max - min) * 100}%, #e8e4df ${(val - min)/(max - min) * 100}%)`
        }}
      />
    </div>
  );
}

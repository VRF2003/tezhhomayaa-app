"use client";

import { useState, useEffect, useRef } from "react";
import { BreakpointConfig, TypographyConfig } from "./AppearanceProvider";
import { Observability } from "@/lib/infrastructure/observability";

export default function TypographyBuilder() {
  const [config, setConfig] = useState<TypographyConfig>({
    desktop: { heroTitleSize: 6, h1Size: 4, h2Size: 3, h3Size: 2, bodySize: 1, captionSize: 0.75, buttonSize: 0.875 },
    tablet: { heroTitleSize: 4, h1Size: 3, h2Size: 2.25, h3Size: 1.5, bodySize: 1, captionSize: 0.75, buttonSize: 0.875 },
    mobile: { heroTitleSize: 2.5, h1Size: 2.5, h2Size: 1.75, h3Size: 1.25, bodySize: 1, captionSize: 0.75, buttonSize: 0.75 },
    letterSpacing: 0.05,
    headingLineHeight: 1.1,
    fontWeight: 400,
    contentWidth: 100,
    headingMaxWidth: 100
  });
  
  const [activeTab, setActiveTab] = useState<"desktop" | "tablet" | "mobile">("mobile");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/api/appearance")
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data?.typography) {
          setConfig(res.data.typography);
        }
        setLoading(false);
      })
      .catch(Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error"));
  }, []);

  // Sync to iframe whenever config changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "SYNC_APPEARANCE", config: { typography: config } },
        "*"
      );
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { typography: config };
      await fetch("/api/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("Typography layout settings saved successfully!");
    } catch(err) {
      alert("Failed to save layout.");
    } finally {
      setSaving(false);
    }
  };

  const updateGlobal = (key: keyof TypographyConfig, val: number) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  const updateBreakpoint = (key: keyof BreakpointConfig, val: number) => {
    setConfig(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: val
      }
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-full gap-8 bg-white" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* ─── Controls (Left) ──────────────────────── */}
      <div className="w-[450px] flex-shrink-0 flex flex-col border-r border-[#e8e4df] pr-8" style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}>
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-[#1a1a18]">Typography Engine</h1>
            <p className="text-sm text-[#9a9690] mt-1">Professional breakpoint visual editor</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#1a1a18] text-white text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Breakpoint Tabs */}
        <div className="flex border-b border-[#e8e4df] mb-8 bg-[#fdfdfa] rounded-t-md overflow-hidden">
          {(["desktop", "tablet", "mobile"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === tab ? "bg-[#1a1a18] text-white" : "text-[#6b6865] hover:bg-[#f0ece6]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          
          <ControlSection title={`Semantic Sizes (${activeTab})`}>
            <Slider label="Hero Title Size" val={config[activeTab].heroTitleSize} min={1} max={12} step={0.25} unit="rem" onChange={(v: number) => updateBreakpoint("heroTitleSize", v)} />
            <Slider label="H1 Size" val={config[activeTab].h1Size} min={1} max={10} step={0.25} unit="rem" onChange={(v: number) => updateBreakpoint("h1Size", v)} />
            <Slider label="H2 Size" val={config[activeTab].h2Size} min={0.5} max={8} step={0.125} unit="rem" onChange={(v: number) => updateBreakpoint("h2Size", v)} />
            <Slider label="H3 Size" val={config[activeTab].h3Size} min={0.5} max={6} step={0.125} unit="rem" onChange={(v: number) => updateBreakpoint("h3Size", v)} />
            <Slider label="Body Size" val={config[activeTab].bodySize} min={0.5} max={3} step={0.05} unit="rem" onChange={(v: number) => updateBreakpoint("bodySize", v)} />
            <Slider label="Caption Size" val={config[activeTab].captionSize} min={0.5} max={2} step={0.05} unit="rem" onChange={(v: number) => updateBreakpoint("captionSize", v)} />
            <Slider label="Button Size" val={config[activeTab].buttonSize} min={0.5} max={2} step={0.05} unit="rem" onChange={(v: number) => updateBreakpoint("buttonSize", v)} />
          </ControlSection>

          <ControlSection title="Global Properties (All Breakpoints)">
            <Slider label="Letter Spacing" val={config.letterSpacing} min={-0.1} max={0.5} step={0.01} unit="em" onChange={(v: number) => updateGlobal("letterSpacing", v)} />
            <Slider label="Line Height" val={config.headingLineHeight} min={0.8} max={2} step={0.05} unit="" onChange={(v: number) => updateGlobal("headingLineHeight", v)} />
            <Slider label="Font Weight" val={config.fontWeight} min={100} max={900} step={100} unit="" onChange={(v: number) => updateGlobal("fontWeight", v)} />
          </ControlSection>

          <ControlSection title="Global Constraints">
            <Slider label="Content Width" val={config.contentWidth} min={20} max={100} step={1} unit="%" onChange={(v: number) => updateGlobal("contentWidth", v)} />
            <Slider label="Heading Max Width" val={config.headingMaxWidth} min={50} max={100} step={1} unit="%" onChange={(v: number) => updateGlobal("headingMaxWidth", v)} />
          </ControlSection>

        </div>
        
        <div className="mt-8 pb-12 text-xs text-[#9a9690] italic">
          Values are injected live into the iframe via cascading CSS variables.
        </div>
      </div>

      {/* ─── Preview Iframe (Right) ──────────────────────── */}
      <div className="flex-1 bg-[#F7F5F2] rounded-md overflow-hidden relative flex flex-col p-8 transition-all">
        <div className="absolute top-4 left-6 flex gap-2 z-10">
          <div className="text-xs uppercase tracking-widest text-[#9a9690] bg-white/80 px-3 py-1 rounded backdrop-blur-sm shadow-sm">
            Preview Mode: {activeTab}
          </div>
        </div>
        
        <div className="flex-1 w-full h-full overflow-auto flex flex-col items-center">
          <div className="bg-black rounded-[40px] p-3 shadow-2xl relative shrink-0 mt-auto mb-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
               style={{ 
                 width: activeTab === "mobile" ? "390px" : activeTab === "tablet" ? "820px" : "100%", 
                 height: activeTab === "desktop" ? "100%" : "844px",
                 borderRadius: activeTab === "desktop" ? "12px" : "40px"
               }}>
            
            {activeTab !== "desktop" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] bg-black rounded-b-[20px] z-50 pointer-events-none"></div>
            )}
            
            <iframe 
              ref={iframeRef}
              src="/?preview=true" 
              className={`w-full h-full bg-white overflow-hidden ${activeTab === "desktop" ? "rounded-lg" : "rounded-[32px]"}`}
              onLoad={() => {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(
                    { type: "SYNC_APPEARANCE", config: { typography: config } },
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
      <div className="text-xs uppercase tracking-widest text-[#9a9690] border-b border-[#e8e4df] pb-2 font-semibold">
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
        <span className="text-xs font-mono text-[#6b6865] bg-[#f0ece6] px-2 py-0.5 rounded">{val}{unit}</span>
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

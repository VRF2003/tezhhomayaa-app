"use client";

import React, { useState } from "react";
import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";
import { UniversalMediaBuilder } from "./UniversalMediaBuilder";
import { UniversalRichEditor } from "./UniversalRichEditor";

type TabType = "CONTENT" | "LAYOUT" | "STYLE" | "TYPOGRAPHY" | "MEDIA" | "MOBILE" | "ADVANCED" | "SHOWCASE" | "SPLIT" | "CONTACT_INFO" | "CONTACT_FORM" | "SOCIAL_LINKS" | "ITEMS";

interface Props {
  data: any;
  onChange: (newData: UniversalSectionData) => void;
  viewMode: "desktop" | "tablet" | "mobile";
  onMediaFilesChange: (key: string, file: File | null) => void;
  mediaFiles: { [key: string]: File | null };
  mediaPrefix: string; // e.g. `${sec.id}_desktop`
  sectionType: string;
}

export function UniversalSectionBuilder({ data, onChange, viewMode, onMediaFilesChange, mediaFiles, mediaPrefix, sectionType }: Props) {
  const norm = normalizeSectionData(data);
  const [activeTab, setActiveTab] = useState<TabType>("CONTENT");
  const [activeStyleTab, setActiveStyleTab] = useState<"HEADING" | "SUBHEADING" | "DESCRIPTION" | "BUTTON" | "EFFECTS">("HEADING");
  const [activeTypoTab, setActiveTypoTab] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const hasMediaTab = true;
  const hasMobileTab = true;
  const hasAdvancedTab = true;
  const hasItemsTab = ["adv-timeline", "timeline", "adv-statistics", "statistics", "adv-faq", "faq", "adv-tabs", "adv-table", "table"].includes(sectionType);

  const update = (layer1: keyof UniversalSectionData, layer2: string, value: any) => {
    onChange({
      ...norm,
      [layer1]: {
        ...(norm[layer1] as any),
        [layer2]: value
      }
    });
  };

  const updateDeep = (layer1: keyof UniversalSectionData, layer2: string, layer3: string, value: any) => {
    onChange({
      ...norm,
      [layer1]: {
        ...(norm[layer1] as any),
        [layer2]: {
          ...(norm[layer1] as any)[layer2],
          [layer3]: value
        }
      }
    });
  };

  const tabStyle = (tab: TabType) => ({
    padding: "0.75rem 1rem",
    background: activeTab === tab ? "#ffffff" : "transparent",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid #1a1a18" : "2px solid transparent",
    color: activeTab === tab ? "#1a1a18" : "#6b6865",
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    cursor: "pointer",
    fontWeight: activeTab === tab ? 600 : 400,
  });

  const isMobile = viewMode === "mobile";
  const activeLayout = isMobile ? norm.layout.mobile : norm.layout.desktop; // we ignore tablet for simplicity unless strictly required

  return (
    <div style={{ background: "#fdfdfa", borderRadius: "4px", border: "1px solid #e8e4df", overflow: "hidden" }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e8e4df", background: "#f0ece6", overflowX: "auto" }}>
        <button style={tabStyle("CONTENT")} onClick={() => setActiveTab("CONTENT")}>Content</button>
        {hasItemsTab && <button style={tabStyle("ITEMS")} onClick={() => setActiveTab("ITEMS")}>Items</button>}
        <button style={tabStyle("LAYOUT")} onClick={() => setActiveTab("LAYOUT")}>Layout</button>
        <button style={tabStyle("STYLE")} onClick={() => setActiveTab("STYLE")}>Style</button>
        <button style={tabStyle("TYPOGRAPHY")} onClick={() => setActiveTab("TYPOGRAPHY")}>Typography</button>
        {hasMediaTab && <button style={tabStyle("MEDIA")} onClick={() => setActiveTab("MEDIA")}>Media</button>}
        {hasMobileTab && <button style={tabStyle("MOBILE")} onClick={() => setActiveTab("MOBILE")}>Mobile</button>}
        {hasAdvancedTab && <button style={tabStyle("ADVANCED")} onClick={() => setActiveTab("ADVANCED")}>Advanced</button>}
        {(sectionType === "collection-showcase" || sectionType === "lookbook-grid") && <button style={tabStyle("SHOWCASE")} onClick={() => setActiveTab("SHOWCASE")}>Showcase Layout</button>}
        {(sectionType === "split-layout" || sectionType === "image-text" || sectionType === "sticky-image") && <button style={tabStyle("SPLIT")} onClick={() => setActiveTab("SPLIT")}>Split Config</button>}
        {(sectionType === "product-carousel" || sectionType === "featured-collection") && <button style={tabStyle("ADVANCED")} onClick={() => setActiveTab("ADVANCED")}>Collection Config</button>}
        {sectionType === "contact-info-block" && <button style={tabStyle("CONTACT_INFO")} onClick={() => setActiveTab("CONTACT_INFO")}>Info Fields</button>}
        {sectionType === "contact-form" && <button style={tabStyle("CONTACT_FORM")} onClick={() => setActiveTab("CONTACT_FORM")}>Form Config</button>}
        {sectionType === "social-presence" && <button style={tabStyle("SOCIAL_LINKS")} onClick={() => setActiveTab("SOCIAL_LINKS")}>Social Links</button>}
      </div>

      <div style={{ padding: "1.5rem" }}>
        
        {/* ── CONTENT TAB ── */}
        {activeTab === "CONTENT" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div><label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Heading</label><input value={norm.content.heading} onChange={e => update("content", "heading", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} /></div>
            <div><label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Italic Heading / Highlight</label><input value={norm.content.italicHeading || ""} onChange={e => update("content", "italicHeading", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} placeholder="Optional italicized text" /></div>
            <div><label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Subheading (Pre-label)</label><input value={norm.content.subheading} onChange={e => update("content", "subheading", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} /></div>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Description</label>
              {sectionType === "split-layout" ? (
                <div style={{ background: "#fff" }}>
                  <UniversalRichEditor 
                    value={norm.content.description} 
                    onChange={val => update("content", "description", val)} 
                  />
                </div>
              ) : (
                <textarea 
                  value={norm.content.description} 
                  onChange={e => update("content", "description", e.target.value)} 
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4", minHeight: "150px", fontFamily: "inherit" }} 
                />
              )}
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
              <div style={{ border: "1px solid #e8e4df", padding: "1rem", background: "#fff" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", marginBottom: "1rem" }}><input type="checkbox" checked={norm.content.primaryButton.enabled} onChange={e => updateDeep("content", "primaryButton", "enabled", e.target.checked)} /> Show Primary Button</label>
                {norm.content.primaryButton.enabled && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div><label style={{ fontSize: "0.7rem", display: "block" }}>Label</label><input value={norm.content.primaryButton.label} onChange={e => updateDeep("content", "primaryButton", "label", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} /></div>
                    <div><label style={{ fontSize: "0.7rem", display: "block" }}>URL</label><input value={norm.content.primaryButton.url} onChange={e => updateDeep("content", "primaryButton", "url", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} /></div>
                    <div>
                      <label style={{ fontSize: "0.7rem", display: "block" }}>Style</label>
                      <select value={norm.content.primaryButton.style} onChange={e => updateDeep("content", "primaryButton", "style", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }}>
                        <option value="luxury">Luxury Underline</option><option value="filled">Filled Block</option><option value="outline">Outline</option><option value="ghost">Ghost</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ border: "1px solid #e8e4df", padding: "1rem", background: "#fff" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", marginBottom: "1rem" }}><input type="checkbox" checked={norm.content.secondaryButton.enabled} onChange={e => updateDeep("content", "secondaryButton", "enabled", e.target.checked)} /> Show Secondary Button</label>
                {norm.content.secondaryButton.enabled && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div><label style={{ fontSize: "0.7rem", display: "block" }}>Label</label><input value={norm.content.secondaryButton.label} onChange={e => updateDeep("content", "secondaryButton", "label", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} /></div>
                    <div><label style={{ fontSize: "0.7rem", display: "block" }}>URL</label><input value={norm.content.secondaryButton.url} onChange={e => updateDeep("content", "secondaryButton", "url", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} /></div>
                    <div>
                      <label style={{ fontSize: "0.7rem", display: "block" }}>Style</label>
                      <select value={norm.content.secondaryButton.style} onChange={e => updateDeep("content", "secondaryButton", "style", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }}>
                        <option value="luxury">Luxury Underline</option><option value="filled">Filled Block</option><option value="outline">Outline</option><option value="ghost">Ghost</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ border: "1px solid #e8e4df", padding: "1rem", background: "#fff" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", marginBottom: "1rem" }}><input type="checkbox" checked={norm.content.tertiaryButton?.enabled || false} onChange={e => updateDeep("content", "tertiaryButton", "enabled", e.target.checked)} /> Show Tertiary Button</label>
                {(norm.content.tertiaryButton?.enabled) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div><label style={{ fontSize: "0.7rem", display: "block" }}>Label</label><input value={norm.content.tertiaryButton?.label || ""} onChange={e => updateDeep("content", "tertiaryButton", "label", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} /></div>
                    <div><label style={{ fontSize: "0.7rem", display: "block" }}>URL</label><input value={norm.content.tertiaryButton?.url || ""} onChange={e => updateDeep("content", "tertiaryButton", "url", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} /></div>
                    <div>
                      <label style={{ fontSize: "0.7rem", display: "block" }}>Style</label>
                      <select value={norm.content.tertiaryButton?.style || "ghost"} onChange={e => updateDeep("content", "tertiaryButton", "style", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }}>
                        <option value="luxury">Luxury Underline</option><option value="filled">Filled Block</option><option value="outline">Outline</option><option value="ghost">Ghost</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ITEMS TAB ── */}
        {activeTab === "ITEMS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ fontSize: "0.7rem", color: "#6b6865", marginBottom: "0.5rem" }}>
              Manage the dynamic list items for this section (e.g. Timeline Events, FAQs, Stats).
            </p>
            
            {(norm.items || []).map((item: any, idx: number) => (
              <div key={idx} style={{ background: "#fdfdfa", border: "1px solid #e8e4df", padding: "1rem", position: "relative" }}>
                <button 
                  onClick={() => {
                    const newItems = [...(norm.items || [])];
                    newItems.splice(idx, 1);
                    onChange({ ...norm, items: newItems });
                  }}
                  style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#a55", cursor: "pointer", fontSize: "0.7rem", textTransform: "uppercase" }}
                >
                  Remove
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingRight: "4rem" }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", display: "block", marginBottom: "0.25rem" }}>Title / Question</label>
                    <input value={item.title || ""} onChange={e => {
                      const newItems = [...(norm.items || [])];
                      newItems[idx] = { ...newItems[idx], title: e.target.value };
                      onChange({ ...norm, items: newItems });
                    }} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", display: "block", marginBottom: "0.25rem" }}>Subtitle (e.g. Year, Stat Value)</label>
                    <input value={item.subtitle || ""} onChange={e => {
                      const newItems = [...(norm.items || [])];
                      newItems[idx] = { ...newItems[idx], subtitle: e.target.value };
                      onChange({ ...norm, items: newItems });
                    }} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", display: "block", marginBottom: "0.25rem" }}>Description / Answer</label>
                    <textarea value={item.description || ""} onChange={e => {
                      const newItems = [...(norm.items || [])];
                      newItems[idx] = { ...newItems[idx], description: e.target.value };
                      onChange({ ...norm, items: newItems });
                    }} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc9c4", minHeight: "80px", fontFamily: "inherit" }} />
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => {
                const newItems = [...(norm.items || []), { title: "New Item", subtitle: "", description: "" }];
                onChange({ ...norm, items: newItems });
              }}
              style={{ padding: "0.75rem", background: "#1a1a18", color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem", cursor: "pointer", border: "none" }}
            >
              + Add Item
            </button>
          </div>
        )}

        {/* ── LAYOUT TAB ── */}
        {activeTab === "LAYOUT" && (
          <div>
            <p style={{ fontSize: "0.7rem", color: "#a55", marginBottom: "1.5rem" }}>Tip: You can manually drag the text in the Live Preview pane to set these values instantly.</p>

            {/* Section Height */}
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f7f5f2", borderRadius: "4px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>Section Height</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                {[0, 30, 50, 70, 80, 90, 100].map(v => {
                  const isActive = (activeLayout.height ?? 80) === v;
                  return (
                    <button
                      key={v}
                      onClick={() => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "height", v)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        fontSize: "0.7rem",
                        border: `1px solid ${isActive ? "#1a1a18" : "#ccc9c4"}`,
                        background: isActive ? "#1a1a18" : "transparent",
                        color: isActive ? "#fff" : "#1a1a18",
                        cursor: "pointer",
                        borderRadius: "2px"
                      }}
                    >
                      {v === 0 ? "Auto" : `${v}vh`}
                    </button>
                  );
                })}
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span>Custom Height (vh)</span>
                  <span style={{ fontWeight: 600 }}>{(activeLayout.height ?? 80) === 0 ? "Auto" : `${activeLayout.height ?? 80}vh`}</span>
                </label>
                <input
                  type="range" min="0" max="100" step="5"
                  value={activeLayout.height ?? 80}
                  onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "height", Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <p style={{ fontSize: "0.65rem", color: "#999", marginTop: "0.5rem" }}>Set to "Auto" (0) for text-only sections with no image — removes the fixed height entirely.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>X Position (%)</span><span>{activeLayout.x}</span></label><input type="range" min="0" max="100" value={activeLayout.x} onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "x", Number(e.target.value))} style={{ width: "100%" }} /></div>
              <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Y Position (%)</span><span>{activeLayout.y}</span></label><input type="range" min="0" max="100" value={activeLayout.y} onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "y", Number(e.target.value))} style={{ width: "100%" }} /></div>
              <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Text Container Width (%)</span><span>{activeLayout.textWidth}</span></label><input type="range" min="20" max="100" value={activeLayout.textWidth} onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "textWidth", Number(e.target.value))} style={{ width: "100%" }} /></div>
              <div>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Alignment</label>
                <select value={activeLayout.align} onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "align", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                  <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Section Padding (e.g., 2rem 0)</label>
                <input value={activeLayout.padding || ""} placeholder="4rem 2rem" onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "padding", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Section Margin (e.g., auto)</label>
                <input value={activeLayout.margin || ""} placeholder="0 auto" onChange={e => updateDeep("layout", viewMode === "mobile" ? "mobile" : "desktop", "margin", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── STYLE TAB ── */}
        {activeTab === "STYLE" && (
          <div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {(["HEADING", "SUBHEADING", "DESCRIPTION", "BUTTON", "EFFECTS"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveStyleTab(t)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    border: activeStyleTab === t ? "1px solid #1a1a18" : "1px solid #e8e4df",
                    background: activeStyleTab === t ? "#1a1a18" : "transparent",
                    color: activeStyleTab === t ? "#ffffff" : "#666",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {activeStyleTab === "HEADING" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Heading Size (rem)</span><span>{norm.style.heading.fontSize}</span></label><input type="range" min="1" max="10" step="0.5" value={norm.style.heading.fontSize} onChange={e => updateDeep("style", "heading", "fontSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Font Weight</span><span>{norm.style.heading.fontWeight}</span></label><input type="range" min="100" max="800" step="100" value={norm.style.heading.fontWeight} onChange={e => updateDeep("style", "heading", "fontWeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Letter Spacing (em)</span><span>{norm.style.heading.letterSpacing}</span></label><input type="range" min="-0.1" max="0.5" step="0.05" value={norm.style.heading.letterSpacing} onChange={e => updateDeep("style", "heading", "letterSpacing", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Line Height</span><span>{norm.style.heading.lineHeight}</span></label><input type="range" min="0.8" max="2" step="0.1" value={norm.style.heading.lineHeight} onChange={e => updateDeep("style", "heading", "lineHeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Color</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}><input type="color" value={/^#[0-9A-Fa-f]{6}$/i.test(norm.style.heading.textColor || "") ? norm.style.heading.textColor : "#000000"} onChange={e => updateDeep("style", "heading", "textColor", e.target.value)} style={{ width: "40px", height: "40px", padding: 0, border: "none" }} /><input type="text" value={norm.style.heading.textColor || ""} onChange={e => updateDeep("style", "heading", "textColor", e.target.value)} style={{ padding: "0.4rem", flex: 1, border: "1px solid #ccc9c4" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Shadow</label>
                  <select value={norm.style.heading.textShadow} onChange={e => updateDeep("style", "heading", "textShadow", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                    <option value="none">None</option><option value="soft">Soft Ambient</option><option value="medium">Medium</option><option value="strong">Strong Hard</option><option value="luxury">Luxury Glow</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Alignment</label>
                  <select value={norm.style.heading.align || "center"} onChange={e => updateDeep("style", "heading", "align", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                    <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {activeStyleTab === "SUBHEADING" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Subheading Size (rem)</span><span>{norm.style.subheading.fontSize}</span></label><input type="range" min="0.5" max="5" step="0.1" value={norm.style.subheading.fontSize} onChange={e => updateDeep("style", "subheading", "fontSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Font Weight</span><span>{norm.style.subheading.fontWeight}</span></label><input type="range" min="100" max="800" step="100" value={norm.style.subheading.fontWeight} onChange={e => updateDeep("style", "subheading", "fontWeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Letter Spacing (em)</span><span>{norm.style.subheading.letterSpacing}</span></label><input type="range" min="-0.1" max="0.5" step="0.05" value={norm.style.subheading.letterSpacing} onChange={e => updateDeep("style", "subheading", "letterSpacing", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Line Height</span><span>{norm.style.subheading.lineHeight}</span></label><input type="range" min="0.8" max="2" step="0.1" value={norm.style.subheading.lineHeight} onChange={e => updateDeep("style", "subheading", "lineHeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Color</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}><input type="color" value={/^#[0-9A-Fa-f]{6}$/i.test(norm.style.subheading.textColor || "") ? norm.style.subheading.textColor : "#000000"} onChange={e => updateDeep("style", "subheading", "textColor", e.target.value)} style={{ width: "40px", height: "40px", padding: 0, border: "none" }} /><input type="text" value={norm.style.subheading.textColor || ""} onChange={e => updateDeep("style", "subheading", "textColor", e.target.value)} style={{ padding: "0.4rem", flex: 1, border: "1px solid #ccc9c4" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Shadow</label>
                  <select value={norm.style.subheading.textShadow} onChange={e => updateDeep("style", "subheading", "textShadow", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                    <option value="none">None</option><option value="soft">Soft Ambient</option><option value="medium">Medium</option><option value="strong">Strong Hard</option><option value="luxury">Luxury Glow</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Alignment</label>
                  <select value={norm.style.subheading.align || "center"} onChange={e => updateDeep("style", "subheading", "align", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                    <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {activeStyleTab === "DESCRIPTION" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Description Size (rem)</span><span>{norm.style.description.fontSize}</span></label><input type="range" min="0.5" max="5" step="0.1" value={norm.style.description.fontSize} onChange={e => updateDeep("style", "description", "fontSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Font Weight</span><span>{norm.style.description.fontWeight}</span></label><input type="range" min="100" max="800" step="100" value={norm.style.description.fontWeight} onChange={e => updateDeep("style", "description", "fontWeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Letter Spacing (em)</span><span>{norm.style.description.letterSpacing}</span></label><input type="range" min="-0.1" max="0.5" step="0.05" value={norm.style.description.letterSpacing} onChange={e => updateDeep("style", "description", "letterSpacing", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Line Height</span><span>{norm.style.description.lineHeight}</span></label><input type="range" min="0.8" max="2" step="0.1" value={norm.style.description.lineHeight} onChange={e => updateDeep("style", "description", "lineHeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Max Width (px)</span><span>{norm.style.description.maxWidth}</span></label><input type="range" min="300" max="1200" step="50" value={norm.style.description.maxWidth} onChange={e => updateDeep("style", "description", "maxWidth", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Color</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}><input type="color" value={/^#[0-9A-Fa-f]{6}$/i.test(norm.style.description.textColor || "") ? norm.style.description.textColor : "#000000"} onChange={e => updateDeep("style", "description", "textColor", e.target.value)} style={{ width: "40px", height: "40px", padding: 0, border: "none" }} /><input type="text" value={norm.style.description.textColor || ""} onChange={e => updateDeep("style", "description", "textColor", e.target.value)} style={{ padding: "0.4rem", flex: 1, border: "1px solid #ccc9c4" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Shadow</label>
                  <select value={norm.style.description.textShadow} onChange={e => updateDeep("style", "description", "textShadow", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                    <option value="none">None</option><option value="soft">Soft Ambient</option><option value="medium">Medium</option><option value="strong">Strong Hard</option><option value="luxury">Luxury Glow</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Alignment</label>
                  <select value={norm.style.description.align || "center"} onChange={e => updateDeep("style", "description", "align", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                    <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {activeStyleTab === "BUTTON" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Font Size (rem)</span><span>{norm.style.button.fontSize}</span></label><input type="range" min="0.5" max="2" step="0.05" value={norm.style.button.fontSize} onChange={e => updateDeep("style", "button", "fontSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Font Weight</span><span>{norm.style.button.fontWeight}</span></label><input type="range" min="100" max="800" step="100" value={norm.style.button.fontWeight} onChange={e => updateDeep("style", "button", "fontWeight", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Border Radius (px)</span><span>{norm.style.button.borderRadius}</span></label><input type="range" min="0" max="50" step="1" value={norm.style.button.borderRadius} onChange={e => updateDeep("style", "button", "borderRadius", Number(e.target.value))} style={{ width: "100%" }} /></div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Padding (e.g. 0.8rem 2rem)</label>
                  <input type="text" value={norm.style.button.padding} onChange={e => updateDeep("style", "button", "padding", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Text Color</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}><input type="color" value={/^#[0-9A-Fa-f]{6}$/i.test(norm.style.button.textColor || "") ? norm.style.button.textColor : "#000000"} onChange={e => updateDeep("style", "button", "textColor", e.target.value)} style={{ width: "40px", height: "40px", padding: 0, border: "none" }} /><input type="text" value={norm.style.button.textColor || ""} onChange={e => updateDeep("style", "button", "textColor", e.target.value)} style={{ padding: "0.4rem", flex: 1, border: "1px solid #ccc9c4" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Background Color</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}><input type="color" value={/^#[0-9A-Fa-f]{6}$/i.test(norm.style.button.backgroundColor || "") ? norm.style.button.backgroundColor : "#000000"} onChange={e => updateDeep("style", "button", "backgroundColor", e.target.value)} style={{ width: "40px", height: "40px", padding: 0, border: "none" }} /><input type="text" value={norm.style.button.backgroundColor || ""} onChange={e => updateDeep("style", "button", "backgroundColor", e.target.value)} style={{ padding: "0.4rem", flex: 1, border: "1px solid #ccc9c4" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Background Opacity (%)</span><span>{norm.style.button.backgroundOpacity ?? 100}</span></label>
                  <input type="range" min="0" max="100" value={norm.style.button.backgroundOpacity ?? 100} onChange={e => updateDeep("style", "button", "backgroundOpacity", Number(e.target.value))} style={{ width: "100%" }} />
                  <p style={{ fontSize: "0.6rem", color: "#666", marginTop: "0.25rem" }}>Lower opacity to 0% to reveal the Gucci glassmorphism blur.</p>
                </div>
              </div>
            )}

            {activeStyleTab === "EFFECTS" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Background Color (Section & Content)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}><input type="color" value={/^#[0-9A-Fa-f]{6}$/i.test(norm.style.backgroundColor || "") ? norm.style.backgroundColor : "#fafaf8"} onChange={e => update("style", "backgroundColor", e.target.value)} style={{ width: "40px", height: "40px", padding: 0, border: "none" }} /><input type="text" value={norm.style.backgroundColor || ""} onChange={e => update("style", "backgroundColor", e.target.value)} style={{ padding: "0.4rem", flex: 1, border: "1px solid #ccc9c4" }} placeholder="#fafaf8" /></div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Dark Overlay (%)</span><span>{norm.style.darkOverlay}</span></label><input type="range" min="0" max="100" value={norm.style.darkOverlay} onChange={e => update("style", "darkOverlay", Number(e.target.value))} style={{ width: "100%", marginBottom: "1rem" }} />
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}><input type="checkbox" checked={norm.style.gradientOverlay} onChange={e => update("style", "gradientOverlay", e.target.checked)} /> Enable Bottom Gradient Overlay</label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TYPOGRAPHY TAB ── */}
        {activeTab === "TYPOGRAPHY" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, paddingBottom: "1rem", borderBottom: "1px solid #e8e4df" }}>
              <input type="checkbox" checked={norm.typographyOverrides?.enabled} onChange={e => update("typographyOverrides", "enabled", e.target.checked)} />
              Use Custom Typography (Overrides Global Settings)
            </label>
            
            {norm.typographyOverrides?.enabled && (
              <div>
                <div style={{ display: "flex", borderBottom: "1px solid #e8e4df", marginBottom: "1.5rem" }}>
                  {(["desktop", "tablet", "mobile"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTypoTab(t)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        background: activeTypoTab === t ? "#1a1a18" : "transparent",
                        color: activeTypoTab === t ? "#ffffff" : "#666",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Hero Title Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.heroTitleSize || ""}</span></label><input type="range" min="1" max="12" step="0.25" value={norm.typographyOverrides?.[activeTypoTab]?.heroTitleSize || 6} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "heroTitleSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>H1 Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.h1Size || ""}</span></label><input type="range" min="1" max="10" step="0.25" value={norm.typographyOverrides?.[activeTypoTab]?.h1Size || 4} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "h1Size", Number(e.target.value))} style={{ width: "100%" }} /></div>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>H2 Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.h2Size || ""}</span></label><input type="range" min="0.5" max="8" step="0.125" value={norm.typographyOverrides?.[activeTypoTab]?.h2Size || 3} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "h2Size", Number(e.target.value))} style={{ width: "100%" }} /></div>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>H3 Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.h3Size || ""}</span></label><input type="range" min="0.5" max="6" step="0.125" value={norm.typographyOverrides?.[activeTypoTab]?.h3Size || 2} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "h3Size", Number(e.target.value))} style={{ width: "100%" }} /></div>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Body Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.bodySize || ""}</span></label><input type="range" min="0.5" max="3" step="0.05" value={norm.typographyOverrides?.[activeTypoTab]?.bodySize || 1} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "bodySize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Caption Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.captionSize || ""}</span></label><input type="range" min="0.5" max="2" step="0.05" value={norm.typographyOverrides?.[activeTypoTab]?.captionSize || 0.75} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "captionSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                  <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Button Size (rem)</span><span>{norm.typographyOverrides?.[activeTypoTab]?.buttonSize || ""}</span></label><input type="range" min="0.5" max="2" step="0.05" value={norm.typographyOverrides?.[activeTypoTab]?.buttonSize || 0.875} onChange={e => updateDeep("typographyOverrides", activeTypoTab, "buttonSize", Number(e.target.value))} style={{ width: "100%" }} /></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MEDIA TAB ── */}
        {activeTab === "MEDIA" && (
          <UniversalMediaBuilder 
            label="Section Media"
            media={norm.media}
            onMediaChange={m => onChange({ ...norm, media: m })}
            pendingDesktopFile={mediaFiles[`${mediaPrefix}_desktop`] || null}
            pendingMobileFile={mediaFiles[`${mediaPrefix}_mobile`] || null}
            onDesktopFileChange={f => onMediaFilesChange(`${mediaPrefix}_desktop`, f)}
            onMobileFileChange={f => onMediaFilesChange(`${mediaPrefix}_mobile`, f)}
          />
        )}

        {/* ── MOBILE TAB ── */}
        {activeTab === "MOBILE" && (
          <div>
            <p style={{ fontSize: "0.75rem", marginBottom: "1rem" }}>Configure mobile-specific typography and layout.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Mobile X Position (%)</span><span>{norm.layout.mobile.x}</span></label><input type="range" min="0" max="100" value={norm.layout.mobile.x} onChange={e => updateDeep("layout", "mobile", "x", Number(e.target.value))} style={{ width: "100%" }} /></div>
              <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Mobile Y Position (%)</span><span>{norm.layout.mobile.y}</span></label><input type="range" min="0" max="100" value={norm.layout.mobile.y} onChange={e => updateDeep("layout", "mobile", "y", Number(e.target.value))} style={{ width: "100%" }} /></div>
              <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Mobile Text Width (%)</span><span>{norm.layout.mobile.textWidth}</span></label><input type="range" min="20" max="100" value={norm.layout.mobile.textWidth} onChange={e => updateDeep("layout", "mobile", "textWidth", Number(e.target.value))} style={{ width: "100%" }} /></div>
            </div>
          </div>
        )}

        {/* ── ADVANCED TAB ── */}
        {activeTab === "ADVANCED" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Entry Animation</label>
              <select value={norm.animation?.type} onChange={e => updateDeep("animation", "", "type", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                <option value="none">None</option><option value="fade">Fade In</option><option value="slide-up">Slide Up</option><option value="slide-left">Slide Left</option><option value="slide-right">Slide Right</option><option value="zoom">Zoom</option>
              </select>
            </div>
            <div><label style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>Duration (s)</span><span>{norm.animation?.duration}</span></label><input type="range" min="0.1" max="3" step="0.1" value={norm.animation?.duration} onChange={e => updateDeep("animation", "", "duration", Number(e.target.value))} style={{ width: "100%" }} /></div>
          </div>
        )}

        {/* ── SHOWCASE LAYOUT OVERRIDES ── */}
        {activeTab === "SHOWCASE" && (sectionType === "collection-showcase" || sectionType === "lookbook-grid") && norm.collectionShowcase && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Layout Style</label>
                <select value={norm.collectionShowcase.layoutType} onChange={e => updateDeep("collectionShowcase", "", "layoutType", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                  <option value="grid-2">Two Columns</option><option value="grid-3">Three Columns</option><option value="grid-4">Four Columns (Edge-to-Edge)</option><option value="full-width-tiles">Full Width Tiles</option><option value="masonry">Masonry</option><option value="carousel">Carousel</option><option value="editorial">Editorial Layout</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Max Width</label>
                <select value={norm.collectionShowcase.maxWidth} onChange={e => updateDeep("collectionShowcase", "", "maxWidth", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                  <option value="boxed">Boxed (Max 1536px)</option><option value="full">Full Bleed Edge-to-Edge</option>
                </select>
              </div>
            </div>
            {sectionType === "lookbook-grid" && (
              <div style={{ marginTop: "1.5rem" }}>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Hotspots Data (JSON Array)</label>
                <textarea 
                  placeholder='[{"x": 50, "y": 50, "label": "Bag", "price": "$1200", "url": "/product/bag"}]'
                  value={JSON.stringify(norm.collectionShowcase.items[0]?.hotspots || [])} 
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      const newItems = [...(norm.collectionShowcase?.items || [])];
                      if (newItems[0]) newItems[0].hotspots = parsed;
                      updateDeep("collectionShowcase", "", "items", newItems);
                    } catch(err) {
                      // ignore parse errors while typing
                    }
                  }}
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4", minHeight: "100px", fontFamily: "monospace", fontSize: "0.7rem" }} 
                />
                <p style={{ fontSize: "0.65rem", color: "#6b6865", marginTop: "0.25rem" }}>Paste JSON array to add shoppable hotspots to the first Lookbook image. E.g. <code>[{`"x":50, "y":50, "label":"Bag", "price":"$1200", "url":"/product/bag"`}]</code></p>
              </div>
            )}
          </div>
        )}
        {/* ── SPLIT LAYOUT OVERRIDES ── */}
        {activeTab === "SPLIT" && (sectionType === "split-layout" || sectionType === "image-text" || sectionType === "sticky-image") && norm.splitLayout && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Layout Direction</label>
              <select value={norm.splitLayout.layout} onChange={e => update("splitLayout", "layout", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                <option value="image-left">Image Left / Text Right</option><option value="image-right">Text Left / Image Right</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Width Ratio (Desktop)</label>
              <select value={norm.splitLayout.ratio} onChange={e => update("splitLayout", "ratio", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                <option value="50-50">50% / 50%</option><option value="60-40">60% Image / 40% Text</option><option value="40-60">40% Image / 60% Text</option>
              </select>
            </div>
          </div>
        )}

        {/* ── CONTACT INFO TAB ── */}
        {activeTab === "CONTACT_INFO" && sectionType === "contact-info-block" && (
          <div>
            <button onClick={() => {
              const currentFields = norm.contactInfo?.fields || [];
              update("contactInfo", "fields", [...currentFields, { label: "New Field", value: "Value", link: "" }]);
            }} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "#1a1a18", color: "#fff" }}>+ Add Info Field</button>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(norm.contactInfo?.fields || []).map((field: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input placeholder="Label (e.g. Email)" value={field.label} onChange={(e) => {
                    const newFields = [...(norm.contactInfo?.fields || [])];
                    newFields[i].label = e.target.value;
                    update("contactInfo", "fields", newFields);
                  }} style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc" }} />
                  <input placeholder="Value" value={field.value} onChange={(e) => {
                    const newFields = [...(norm.contactInfo?.fields || [])];
                    newFields[i].value = e.target.value;
                    update("contactInfo", "fields", newFields);
                  }} style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc" }} />
                  <input placeholder="Link (Optional)" value={field.link || ""} onChange={(e) => {
                    const newFields = [...(norm.contactInfo?.fields || [])];
                    newFields[i].link = e.target.value;
                    update("contactInfo", "fields", newFields);
                  }} style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc" }} />
                  <button onClick={() => {
                    const newFields = [...(norm.contactInfo?.fields || [])];
                    newFields.splice(i, 1);
                    update("contactInfo", "fields", newFields);
                  }} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTACT FORM TAB ── */}
        {activeTab === "CONTACT_FORM" && sectionType === "contact-form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={norm.contactForm?.enabled ?? true} onChange={(e) => update("contactForm", "enabled", e.target.checked)} />
              Enable Contact Form
            </label>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Destination Email</label>
              <input value={norm.contactForm?.destinationEmail || ""} onChange={e => update("contactForm", "destinationEmail", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Success Message</label>
              <input value={norm.contactForm?.successMessage || ""} onChange={e => update("contactForm", "successMessage", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Dropdown Subjects (comma separated)</label>
              <input value={(norm.contactForm?.subjects || []).join(", ")} onChange={e => update("contactForm", "subjects", e.target.value.split(",").map((s: string) => s.trim()))} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
            </div>
          </div>
        )}

        {/* ── SOCIAL LINKS TAB ── */}
        {activeTab === "SOCIAL_LINKS" && sectionType === "social-presence" && (
          <div>
            <button onClick={() => {
              const currentLinks = norm.socialPresence?.links || [];
              update("socialPresence", "links", [...currentLinks, { platform: "New Platform", url: "#" }]);
            }} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "#1a1a18", color: "#fff" }}>+ Add Social Link</button>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(norm.socialPresence?.links || []).map((link: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input placeholder="Platform (e.g. Instagram)" value={link.platform} onChange={(e) => {
                    const newLinks = [...(norm.socialPresence?.links || [])];
                    newLinks[i].platform = e.target.value;
                    update("socialPresence", "links", newLinks);
                  }} style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc" }} />
                  <input placeholder="URL" value={link.url} onChange={(e) => {
                    const newLinks = [...(norm.socialPresence?.links || [])];
                    newLinks[i].url = e.target.value;
                    update("socialPresence", "links", newLinks);
                  }} style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc" }} />
                  <button onClick={() => {
                    const newLinks = [...(norm.socialPresence?.links || [])];
                    newLinks.splice(i, 1);
                    update("socialPresence", "links", newLinks);
                  }} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── JOURNAL TAB ── */}
        {activeTab === ("JOURNAL_CONFIG" as any) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Layout Style</label>
              <select value={norm.journalConfig?.layout || "grid"} onChange={e => updateDeep("journalConfig", "", "layout", e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }}>
                <option value="grid">Grid (Standard)</option><option value="list">List</option><option value="featured">Featured (1 Large, Others Small)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>Articles to Display</label>
              <input type="number" min="1" max="24" value={norm.journalConfig?.articleCount || 3} onChange={e => updateDeep("journalConfig", "", "articleCount", Number(e.target.value))} style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4" }} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FooterData, FooterBlock, FooterBlockType, defaultFooterData } from "@/lib/types/footer";

interface FooterBuilderProps {
  apiEndpoint: string;
  pageTitle: string;
  backUrl: string;
  previewUrl: string;
}

const BLOCK_CATALOG: { type: FooterBlockType; label: string; icon: string; description: string }[] = [
  { type: "brand", label: "Brand Block", icon: "◈", description: "Logo & tagline" },
  { type: "rich-text", label: "Rich Text", icon: "¶", description: "Custom text content" },
  { type: "link-group", label: "Link Group", icon: "≡", description: "Navigation links" },
  { type: "social-links", label: "Social Links", icon: "◎", description: "Social platforms" },
  { type: "newsletter", label: "Newsletter", icon: "✉", description: "Email subscription" },
  { type: "customer-care", label: "Customer Care", icon: "◇", description: "Support info" },
  { type: "currency-region", label: "Currency & Region", icon: "⊕", description: "Region selector" },
  { type: "legal-links", label: "Legal Links", icon: "§", description: "Legal navigation" },
  { type: "image", label: "Image Block", icon: "▣", description: "Image with link" },
  { type: "video", label: "Video Block", icon: "▷", description: "Embedded video" },
  { type: "divider", label: "Divider", icon: "—", description: "Horizontal rule" },
  { type: "spacer", label: "Spacer", icon: "⬜", description: "Empty space" },
  { type: "quote", label: "Quote Block", icon: "❝", description: "Artistic statement" },
  { type: "campaign", label: "Campaign Block", icon: "★", description: "Campaign showcase" },
  { type: "contact", label: "Contact Block", icon: "◈", description: "Contact details" },
];

const DEFAULT_CAMPAIGN = { label: "CAMPAIGN", imageUrl: "", videoUrl: "", link: "#" };
const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "Pinterest", "YouTube", "LinkedIn", "TikTok"];
const LEGAL_PRESETS = [
  { label: "About Us", url: "/about" },
  { label: "Contact Us", url: "/contact" },
  { label: "Privacy Policy", url: "/privacy" },
  { label: "Terms of Service", url: "/terms" },
  { label: "Shipping Policy", url: "/shipping" },
  { label: "Return Policy", url: "/returns" },
  { label: "Cookie Policy", url: "/cookies" },
];

// Default style values — used as fallbacks for any missing settings field.
const DEFAULT_FOOTER_STYLE = {
  backgroundColor: "#f7f5f1",
  textColor: "#1a1a18",
  headingColor: "#7c2a00",
  linkColor: "#1a1a18",
  hoverColor: "#7c2a00",
  borderColor: "#e5e2dc",
  dividerColor: "#e5e2dc",
  paddingTop: "clamp(4rem, 8vw, 6rem)",
  paddingBottom: "clamp(3rem, 6vw, 5rem)",
  columnGap: "2rem",
  maxWidth: "none",
  alignment: "start",
  bottomBarText: "\u00a9 TEZHHOMAYAA MMXXVI \u2014 ALL RIGHTS RESERVED",
  bottomBarAlignment: "space-between",
  bottomBarFontSize: "clamp(0.55rem, 0.8vw, 0.9rem)",
  bottomBarLinks: [] as { label: string; url: string }[],
};

// Ensures every settings key has a valid string value — never undefined or null.
function mergeSettings(raw: any): typeof DEFAULT_FOOTER_STYLE & Record<string, any> {
  const merged: Record<string, any> = { ...DEFAULT_FOOTER_STYLE };
  if (raw && typeof raw === "object") {
    for (const key of Object.keys(merged)) {
      const v = raw[key];
      if (v !== undefined && v !== null) merged[key] = v;
    }
    // Carry over any extra keys not in DEFAULT_FOOTER_STYLE
    for (const key of Object.keys(raw)) {
      if (!(key in merged)) merged[key] = raw[key];
    }
  }
  return merged as any;
}

// Safe string coercion — avoids calling .startsWith / .toUpperCase on non-strings.
function safeStr(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function ColorField({ label, value, onChange, fallback = "#1a1a18" }: { label: string; value: unknown; onChange: (v: string) => void; fallback?: string }) {
  const safeValue = typeof value === "string" && value.length > 0 ? value : fallback;
  const colorPickerValue = safeValue.startsWith("#") ? safeValue : fallback;
  return (
    <div>
      <label style={S.fieldLabel}>{label}</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="color"
          value={colorPickerValue}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "40px", height: "36px", padding: 0, border: "1px solid #e8e4df", borderRadius: "2px", cursor: "pointer" }}
        />
        <input
          type="text"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: "0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px" }}
        />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, multiline = false }: { label: string; value: unknown; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const safeValue = typeof value === "string" ? value : "";
  return (
    <div>
      <label style={S.fieldLabel}>{label}</label>
      {multiline ? (
        <textarea value={safeValue} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...S.input, resize: "vertical", minHeight: "80px" }} />
      ) : (
        <input type="text" value={safeValue} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={S.input} />
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  fieldLabel: { fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", display: "block", marginBottom: "0.4rem" },
  input: { width: "100%", padding: "0.65rem 0.75rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px", boxSizing: "border-box" },
  sectionHeading: { fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#9a9690", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f0ece6" },
  btn: { padding: "0.5rem 1rem", background: "#fafaf8", border: "1px dashed #d0ccc7", cursor: "pointer", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a18", borderRadius: "2px" },
  deleteBtn: { background: "none", border: "none", color: "#c8a0a0", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.05em", padding: "0.25rem 0.5rem" },
};

function tabStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1, padding: "0.85rem", background: active ? "#ffffff" : "transparent", border: "none",
    borderBottom: active ? "2px solid #1a1a18" : "2px solid transparent", fontSize: "0.65rem",
    textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
    color: active ? "#1a1a18" : "#9a9690", fontWeight: active ? 500 : 400,
  };
}

export function FooterBuilder({ apiEndpoint, pageTitle, backUrl, previewUrl }: FooterBuilderProps) {
  const [data, setData] = useState<FooterData>(defaultFooterData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"BLOCKS" | "STYLE" | "BOTTOM">("BLOCKS");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch(`${apiEndpoint}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          // Deep-merge settings with defaults to ensure no field is ever undefined/null
          const normalised: FooterData = {
            blocks: Array.isArray(res.data.blocks) ? res.data.blocks : [],
            settings: mergeSettings(res.data.settings),
          };
          setData(normalised);
        }
      })
      .catch(() => setError("Failed to load footer."))
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "SYNC_FOOTER_PREVIEW", data }, "*");
  }, [data]);

  const syncPreview = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "SYNC_FOOTER_PREVIEW", data }, "*");
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch(apiEndpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const updateSettings = (key: string, value: any) => setData((d) => ({ ...d, settings: { ...d.settings, [key]: value } }));
  const updateBlock = (id: string, updates: Partial<FooterBlock>) => setData((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)) }));
  const updateBlockStyle = (id: string, key: string, value: any) => setData((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? { ...b, style: { ...b.style, [key]: value } } : b)) }));
  const updateBlockLink = (blockId: string, linkIdx: number, label: string, url: string) =>
    setData((d) => ({ ...d, blocks: d.blocks.map((b) => { if (b.id !== blockId) return b; const nl = [...(b.links || [])]; nl[linkIdx] = { label, url }; return { ...b, links: nl }; }) }));
  const addBlockLink = (blockId: string) => setData((d) => ({ ...d, blocks: d.blocks.map((b) => b.id === blockId ? { ...b, links: [...(b.links || []), { label: "New Link", url: "#" }] } : b) }));
  const removeBlockLink = (blockId: string, i: number) => setData((d) => ({ ...d, blocks: d.blocks.map((b) => { if (b.id !== blockId) return b; const nl = [...(b.links || [])]; nl.splice(i, 1); return { ...b, links: nl }; }) }));

  const toggleHidden = (id: string) => setData((d) => ({ ...d, blocks: d.blocks.map((b) => b.id === id ? { ...b, hidden: !b.hidden } : b) }));
  const duplicateBlock = (idx: number) => setData((d) => {
    const clone = JSON.parse(JSON.stringify(d.blocks[idx]));
    clone.id = `blk_${Date.now()}`;
    const nb = [...d.blocks];
    nb.splice(idx + 1, 0, clone);
    return { ...d, blocks: nb };
  });
  const deleteBlock = (id: string) => setData((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));

  const addBlock = (type: FooterBlockType) => {
    const id = `blk_${Date.now()}`;
    const defaults: Partial<FooterBlock> = { style: { colSpan: 3 } };
    if (type === "brand") Object.assign(defaults, { heading: "TEZHHOMAYAA", content: "A luxury house.", style: { colSpan: 5 } });
    if (type === "link-group") Object.assign(defaults, { heading: "Links", links: [{ label: "Link 1", url: "#" }] });
    if (type === "social-links") Object.assign(defaults, { socialPlatforms: SOCIAL_PLATFORMS.map((p) => ({ platform: p, url: "#", enabled: p === "Instagram" })), style: { colSpan: 5 } });
    if (type === "newsletter") Object.assign(defaults, { heading: "JOIN THE REVOLUTION", content: "Rare dispatches from the atelier.", placeholder: "Your email address", buttonText: "Subscribe", style: { colSpan: 4 } });
    if (type === "customer-care") Object.assign(defaults, { heading: "CUSTOMER CARE", email: "support@tezhhomayaa.com", phone: "", address: "", responseTime: "24–48 Hours", style: { colSpan: 3 } });
    if (type === "currency-region") Object.assign(defaults, { heading: "REGION", currencyEnabled: true, showRegionSelector: true, style: { colSpan: 2 } });
    if (type === "legal-links") Object.assign(defaults, { heading: "LEGAL", legalLinks: LEGAL_PRESETS.map((l) => ({ ...l, enabled: true })), style: { colSpan: 3 } });
    if (type === "image") Object.assign(defaults, { imageUrl: "", imageAlt: "", imageLink: "#", style: { colSpan: 3 } });
    if (type === "video") Object.assign(defaults, { videoUrl: "", videoAutoplay: true, videoLoop: true, videoMuted: true, style: { colSpan: 3 } });
    if (type === "divider") Object.assign(defaults, { dividerColor: "var(--border-soft)", dividerThickness: "1px", dividerMargin: "2rem", style: { colSpan: 12 } });
    if (type === "spacer") Object.assign(defaults, { spacerHeight: "3rem", spacerHeightMobile: "1.5rem", style: { colSpan: 12 } });
    if (type === "quote") Object.assign(defaults, { heading: "ARTISTIC REVOLUTION", quoteText: "Where movement becomes art.\nWhere garments become expression.", style: { colSpan: 12 } });
    if (type === "campaign") Object.assign(defaults, { heading: "CAMPAIGNS", campaigns: [{ label: "MONACO 2026", imageUrl: "", videoUrl: "", link: "#" }], style: { colSpan: 12 } });
    if (type === "contact") Object.assign(defaults, { heading: "CONTACT", email: "info@tezhhomayaa.com", phone: "", address: "", style: { colSpan: 3 } });
    if (type === "rich-text") Object.assign(defaults, { content: "Your text here...", style: { colSpan: 4 } });

    const newBlock: FooterBlock = { id, type, ...defaults };
    setData((d) => ({ ...d, blocks: [...d.blocks, newBlock] }));
    setExpandedId(id);
    setShowMenu(false);
  };

  const onDragStart = (e: React.DragEvent, i: number) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (draggedIdx === null) return;
    const nb = [...data.blocks];
    const [item] = nb.splice(draggedIdx, 1);
    nb.splice(i, 0, item);
    setData((d) => ({ ...d, blocks: nb }));
    setDraggedIdx(null);
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#9a9690" }}>Loading builder...</div>;

  const iframeWidths = { desktop: "100%", tablet: "768px", mobile: "390px" };

  const renderBlockEditor = (block: FooterBlock) => (
    <div style={{ padding: "1.5rem", borderTop: "1px solid #f0ece6", display: "flex", flexDirection: "column", gap: "1.25rem" }} onClick={(e) => e.stopPropagation()}>

      {/* Column Span */}
      <div>
        <label style={S.fieldLabel}>Column Span (1–12)</label>
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {[["3/3/3/3", 3], ["4/4/4", 4], ["6/6", 6], ["12", 12]].map(([l, v]) => (
            <button key={String(l)} onClick={() => updateBlockStyle(block.id, "colSpan", Number(v))} style={{ ...S.btn, background: block.style?.colSpan === Number(v) ? "#1a1a18" : "#fafaf8", color: block.style?.colSpan === Number(v) ? "#fff" : "#1a1a18", border: "1px solid #e8e4df" }}>{l}</button>
          ))}
          <input type="number" min={1} max={12} value={block.style?.colSpan || 3} onChange={(e) => updateBlockStyle(block.id, "colSpan", Number(e.target.value))} style={{ width: "60px", padding: "0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px" }} />
        </div>
      </div>

      {/* BRAND */}
      {block.type === "brand" && (<>
        <TextField label="Brand Name / Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <TextField label="Tagline / Description" value={block.content || ""} onChange={(v) => updateBlock(block.id, { content: v })} multiline />
      </>)}

      {/* RICH TEXT */}
      {block.type === "rich-text" && (
        <TextField label="Content (supports HTML tags)" value={block.content || ""} onChange={(v) => updateBlock(block.id, { content: v })} multiline />
      )}

      {/* LINK GROUP */}
      {block.type === "link-group" && (<>
        <TextField label="Group Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <div>
          <p style={S.sectionHeading}>Links</p>
          {block.links?.map((link, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input type="text" value={link.label} placeholder="Label" onChange={(e) => updateBlockLink(block.id, i, e.target.value, link.url)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px" }} />
              <input type="text" value={link.url} placeholder="URL" onChange={(e) => updateBlockLink(block.id, i, link.label, e.target.value)} style={{ flex: 2, padding: "0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px" }} />
              <button onClick={() => removeBlockLink(block.id, i)} style={S.deleteBtn}>✕</button>
            </div>
          ))}
          <button onClick={() => addBlockLink(block.id)} style={S.btn}>+ Add Link</button>
        </div>
      </>)}

      {/* SOCIAL LINKS */}
      {block.type === "social-links" && (
        <div>
          <p style={S.sectionHeading}>Social Platforms</p>
          {SOCIAL_PLATFORMS.map((platform) => {
            const existing = block.socialPlatforms?.find((p) => p.platform === platform) || { platform, url: "#", enabled: false };
            const update = (changes: Partial<typeof existing>) => {
              const updated = (block.socialPlatforms || SOCIAL_PLATFORMS.map((p) => ({ platform: p, url: "#", enabled: false }))).map((p) => p.platform === platform ? { ...p, ...changes } : p);
              updateBlock(block.id, { socialPlatforms: updated });
            };
            return (
              <div key={platform} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "110px", fontSize: "0.8rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={existing.enabled} onChange={(e) => update({ enabled: e.target.checked })} />
                  {platform}
                </label>
                <input type="text" value={existing.url} placeholder="https://..." onChange={(e) => update({ url: e.target.value })} disabled={!existing.enabled} style={{ flex: 1, padding: "0.4rem 0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px", opacity: existing.enabled ? 1 : 0.4 }} />
              </div>
            );
          })}
        </div>
      )}

      {/* NEWSLETTER */}
      {block.type === "newsletter" && (<>
        <TextField label="Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <TextField label="Description" value={block.content || ""} onChange={(v) => updateBlock(block.id, { content: v })} multiline />
        <TextField label="Input Placeholder Text" value={block.placeholder || ""} onChange={(v) => updateBlock(block.id, { placeholder: v })} placeholder="e.g. Your email address" />
        <TextField label="Button Text" value={block.buttonText || ""} onChange={(v) => updateBlock(block.id, { buttonText: v })} placeholder="e.g. Subscribe" />
        <p style={{ fontSize: "0.75rem", color: "#7a7874", fontStyle: "italic", margin: 0 }}>Subscribers are saved and visible in Admin → Subscribers.</p>
      </>)}

      {/* CUSTOMER CARE */}
      {block.type === "customer-care" && (<>
        <TextField label="Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <TextField label="Email Address" value={block.email || ""} onChange={(v) => updateBlock(block.id, { email: v })} placeholder="support@tezhhomayaa.com" />
        <TextField label="Phone (optional)" value={block.phone || ""} onChange={(v) => updateBlock(block.id, { phone: v })} placeholder="+1 (800) ..." />
        <TextField label="Address (optional)" value={block.address || ""} onChange={(v) => updateBlock(block.id, { address: v })} multiline />
        <TextField label="Response Time" value={block.responseTime || ""} onChange={(v) => updateBlock(block.id, { responseTime: v })} placeholder="e.g. 24–48 Hours" />
      </>)}

      {/* CURRENCY & REGION */}
      {block.type === "currency-region" && (<>
        <TextField label="Block Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <label style={{ display: "flex", gap: "0.75rem", alignItems: "center", cursor: "pointer" }}>
          <input type="checkbox" checked={block.currencyEnabled !== false} onChange={(e) => updateBlock(block.id, { currencyEnabled: e.target.checked })} />
          <span style={{ fontSize: "0.8rem" }}>Enable Currency & Region Display</span>
        </label>
        <label style={{ display: "flex", gap: "0.75rem", alignItems: "center", cursor: "pointer" }}>
          <input type="checkbox" checked={block.showRegionSelector !== false} onChange={(e) => updateBlock(block.id, { showRegionSelector: e.target.checked })} />
          <span style={{ fontSize: "0.8rem" }}>Show Region Selector</span>
        </label>
      </>)}

      {/* LEGAL LINKS */}
      {block.type === "legal-links" && (<>
        <TextField label="Block Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <div>
          <p style={S.sectionHeading}>Select & Order Legal Links</p>
          {(block.legalLinks || LEGAL_PRESETS.map((l) => ({ ...l, enabled: true }))).map((link, i) => (
            <div key={link.label} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, cursor: "pointer", fontSize: "0.85rem" }}>
                <input type="checkbox" checked={link.enabled} onChange={(e) => {
                  const nl = [...(block.legalLinks || LEGAL_PRESETS.map((l) => ({ ...l, enabled: true })))];
                  nl[i] = { ...nl[i], enabled: e.target.checked };
                  updateBlock(block.id, { legalLinks: nl });
                }} />
                {link.label}
              </label>
              <input type="text" value={link.url} onChange={(e) => {
                const nl = [...(block.legalLinks || LEGAL_PRESETS.map((l) => ({ ...l, enabled: true })))];
                nl[i] = { ...nl[i], url: e.target.value };
                updateBlock(block.id, { legalLinks: nl });
              }} style={{ width: "160px", padding: "0.3rem 0.5rem", border: "1px solid #e8e4df", fontSize: "0.75rem", borderRadius: "2px" }} />
            </div>
          ))}
        </div>
      </>)}

      {/* IMAGE */}
      {block.type === "image" && (<>
        <TextField label="Image URL" value={block.imageUrl || ""} onChange={(v) => updateBlock(block.id, { imageUrl: v })} placeholder="https://..." />
        <TextField label="Alt Text" value={block.imageAlt || ""} onChange={(v) => updateBlock(block.id, { imageAlt: v })} />
        <TextField label="Link URL (optional)" value={block.imageLink || ""} onChange={(v) => updateBlock(block.id, { imageLink: v })} placeholder="#" />
      </>)}

      {/* VIDEO */}
      {block.type === "video" && (<>
        <TextField label="Video URL (.mp4 or embed URL)" value={block.videoUrl || ""} onChange={(v) => updateBlock(block.id, { videoUrl: v })} placeholder="https://..." />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[["videoAutoplay", "Autoplay"], ["videoLoop", "Loop"], ["videoMuted", "Muted"]].map(([key, label]) => (
            <label key={key} style={{ display: "flex", gap: "0.75rem", alignItems: "center", cursor: "pointer", fontSize: "0.85rem" }}>
              <input type="checkbox" checked={!!(block as any)[key]} onChange={(e) => updateBlock(block.id, { [key]: e.target.checked })} />
              {label}
            </label>
          ))}
        </div>
      </>)}

      {/* DIVIDER */}
      {block.type === "divider" && (<>
        <TextField label="Color (CSS value)" value={block.dividerColor || "var(--border-soft)"} onChange={(v) => updateBlock(block.id, { dividerColor: v })} />
        <TextField label="Thickness (e.g. 1px)" value={block.dividerThickness || "1px"} onChange={(v) => updateBlock(block.id, { dividerThickness: v })} />
        <TextField label="Vertical Margin (e.g. 2rem)" value={block.dividerMargin || "2rem"} onChange={(v) => updateBlock(block.id, { dividerMargin: v })} />
      </>)}

      {/* SPACER */}
      {block.type === "spacer" && (<>
        <TextField label="Desktop Height (e.g. 4rem)" value={block.spacerHeight || "3rem"} onChange={(v) => updateBlock(block.id, { spacerHeight: v })} />
        <TextField label="Mobile Height (e.g. 1.5rem)" value={block.spacerHeightMobile || "1.5rem"} onChange={(v) => updateBlock(block.id, { spacerHeightMobile: v })} />
      </>)}

      {/* QUOTE */}
      {block.type === "quote" && (<>
        <TextField label="Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} placeholder="e.g. ARTISTIC REVOLUTION" />
        <TextField label="Quote Text" value={block.quoteText || ""} onChange={(v) => updateBlock(block.id, { quoteText: v })} multiline placeholder="Where movement becomes art..." />
        <TextField label="Author / Attribution (optional)" value={block.quoteAuthor || ""} onChange={(v) => updateBlock(block.id, { quoteAuthor: v })} />
      </>)}

      {/* CAMPAIGN */}
      {block.type === "campaign" && (<>
        <TextField label="Block Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <div>
          <p style={S.sectionHeading}>Campaigns</p>
          {(block.campaigns || []).map((campaign, i) => (
            <div key={i} style={{ border: "1px solid #f0ece6", padding: "1rem", marginBottom: "0.75rem", borderRadius: "2px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690" }}>Campaign {i + 1}</span>
                <button onClick={() => { const nc = [...(block.campaigns || [])]; nc.splice(i, 1); updateBlock(block.id, { campaigns: nc }); }} style={S.deleteBtn}>Remove</button>
              </div>
              {[["Label", "label", "e.g. MONACO 2026"], ["Image URL", "imageUrl", "https://..."], ["Video URL", "videoUrl", "https://..."], ["Link", "link", "#"]].map(([lbl, key, ph]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  <label style={S.fieldLabel}>{lbl}</label>
                  <input type="text" value={(campaign as any)[key] || ""} placeholder={ph} onChange={(e) => {
                    const nc = [...(block.campaigns || [])];
                    nc[i] = { ...nc[i], [key]: e.target.value };
                    updateBlock(block.id, { campaigns: nc });
                  }} style={{ ...S.input }} />
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => updateBlock(block.id, { campaigns: [...(block.campaigns || []), { ...DEFAULT_CAMPAIGN }] })} style={S.btn}>+ Add Campaign</button>
        </div>
      </>)}

      {/* CONTACT */}
      {block.type === "contact" && (<>
        <TextField label="Heading" value={block.heading || ""} onChange={(v) => updateBlock(block.id, { heading: v })} />
        <TextField label="Email" value={block.email || ""} onChange={(v) => updateBlock(block.id, { email: v })} placeholder="info@tezhhomayaa.com" />
        <TextField label="Phone (optional)" value={block.phone || ""} onChange={(v) => updateBlock(block.id, { phone: v })} />
        <TextField label="Address (optional)" value={block.address || ""} onChange={(v) => updateBlock(block.id, { address: v })} multiline />
        <TextField label="Map Link (optional)" value={block.imageLink || ""} onChange={(v) => updateBlock(block.id, { imageLink: v })} placeholder="https://maps.google.com/..." />
      </>)}

    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(380px, 560px) 1fr", gap: "2rem", alignItems: "start", height: "calc(100vh - 4rem)", overflow: "hidden" }}>

      {/* ── Left Sidebar ── */}
      <div style={{ height: "100%", overflowY: "auto", paddingRight: "1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href={backUrl} style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>← Back</Link>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 300, color: "#1a1a18", margin: 0, letterSpacing: "0.02em" }}>{pageTitle}</h1>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.7rem 1.5rem", background: "#1a1a18", color: "#f7f5f2", border: "none", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", borderRadius: "2px", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && <div style={{ background: "#fdf0f0", border: "1px solid #e0b8b8", padding: "0.75rem 1rem", color: "#6b3a3a", fontSize: "0.8rem", marginBottom: "1rem", borderRadius: "2px" }}>{error}</div>}
        {success && <div style={{ background: "#f0fdf4", border: "1px solid #bce3c5", padding: "0.75rem 1rem", color: "#2d6b3a", fontSize: "0.8rem", marginBottom: "1rem", borderRadius: "2px" }}>✓ Saved successfully.</div>}

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e8e4df", marginBottom: "1.5rem" }}>
          {(["BLOCKS", "STYLE", "BOTTOM"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
              {tab === "BLOCKS" ? "Blocks" : tab === "STYLE" ? "Style" : "Bottom Bar"}
            </button>
          ))}
        </div>

        {/* ── BLOCKS TAB ── */}
        {activeTab === "BLOCKS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingBottom: "3rem" }}>
            {data.blocks.map((block, idx) => {
              const isExpanded = expandedId === block.id;
              const catalog = BLOCK_CATALOG.find((c) => c.type === block.type);
              const prettyType = catalog?.label || block.type;
              const displayName = block.heading || prettyType;

              return (
                <div key={block.id} draggable onDragStart={(e) => onDragStart(e, idx)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, idx)}
                  style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "4px", opacity: draggedIdx === idx ? 0.4 : block.hidden ? 0.5 : 1, overflow: "hidden" }}>

                  {/* Block Header */}
                  <div onClick={() => setExpandedId(isExpanded ? null : block.id)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1rem", cursor: "pointer", background: isExpanded ? "#fafaf8" : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ color: "#c8c4bf", cursor: "grab", fontSize: "1rem" }}>⋮⋮</span>
                      <span style={{ fontSize: "1rem", color: "#6b6865" }}>{catalog?.icon || "◈"}</span>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1a1a18" }}>{displayName}</div>
                        <div style={{ fontSize: "0.65rem", color: "#9a9690", letterSpacing: "0.05em" }}>{prettyType} · col-{block.style?.colSpan || 3}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <button title={block.hidden ? "Show" : "Hide"} onClick={(e) => { e.stopPropagation(); toggleHidden(block.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", color: block.hidden ? "#c8a0a0" : "#9a9690", padding: "0.25rem 0.4rem" }}>
                        {block.hidden ? "○" : "●"}
                      </button>
                      <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.65rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.25rem 0.4rem" }}>Dup</button>
                      <button title="Delete" onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.65rem", color: "#c8a0a0", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.25rem 0.4rem" }}>Del</button>
                      <span style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#9a9690", fontSize: "0.75rem" }}>▼</span>
                    </div>
                  </div>

                  {isExpanded && renderBlockEditor(block)}
                </div>
              );
            })}

            {/* Add Block Menu */}
            <div style={{ marginTop: "1rem" }}>
              {showMenu ? (
                <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #f0ece6", background: "#fafaf8" }}>
                    <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#1a1a18" }}>Add Footer Block</span>
                    <button onClick={() => setShowMenu(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: "#9a9690" }}>✕</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                    {BLOCK_CATALOG.map((item) => (
                      <button key={item.type} onClick={() => addBlock(item.type)}
                        style={{ padding: "1rem", background: "transparent", border: "none", borderRight: "1px solid #f0ece6", borderBottom: "1px solid #f0ece6", cursor: "pointer", textAlign: "left", display: "flex", gap: "0.75rem", alignItems: "flex-start", transition: "background 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <span style={{ fontSize: "1.1rem", color: "#6b6865", minWidth: "20px" }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#1a1a18", marginBottom: "0.15rem" }}>{item.label}</div>
                          <div style={{ fontSize: "0.65rem", color: "#9a9690" }}>{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowMenu(true)} style={{ width: "100%", padding: "1.25rem", background: "transparent", border: "1px dashed #d0ccc7", color: "#1a1a18", cursor: "pointer", borderRadius: "4px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  + Add Footer Block
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STYLE TAB ── */}
        {activeTab === "STYLE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "3rem" }}>
            <div style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px", background: "#fff" }}>
              <p style={S.sectionHeading}>Colors</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <ColorField label="Background" value={data.settings.backgroundColor} fallback={DEFAULT_FOOTER_STYLE.backgroundColor} onChange={(v) => updateSettings("backgroundColor", v)} />
                <ColorField label="Text Color" value={data.settings.textColor} fallback={DEFAULT_FOOTER_STYLE.textColor} onChange={(v) => updateSettings("textColor", v)} />
                <ColorField label="Heading Color" value={data.settings.headingColor} fallback={DEFAULT_FOOTER_STYLE.headingColor} onChange={(v) => updateSettings("headingColor", v)} />
                <ColorField label="Link Color" value={data.settings.linkColor} fallback={DEFAULT_FOOTER_STYLE.linkColor} onChange={(v) => updateSettings("linkColor", v)} />
                <ColorField label="Hover Color" value={data.settings.hoverColor} fallback={DEFAULT_FOOTER_STYLE.hoverColor} onChange={(v) => updateSettings("hoverColor", v)} />
                <ColorField label="Border / Divider" value={data.settings.borderColor} fallback={DEFAULT_FOOTER_STYLE.borderColor} onChange={(v) => updateSettings("borderColor", v)} />
              </div>
            </div>

            <div style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px", background: "#fff" }}>
              <p style={S.sectionHeading}>Spacing & Layout</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <TextField label="Padding Top" value={data.settings.paddingTop} onChange={(v) => updateSettings("paddingTop", v)} placeholder="6rem" />
                <TextField label="Padding Bottom" value={data.settings.paddingBottom} onChange={(v) => updateSettings("paddingBottom", v)} placeholder="5rem" />
                <TextField label="Column Gap" value={data.settings.columnGap} onChange={(v) => updateSettings("columnGap", v)} placeholder="2rem" />
                <TextField label="Max Width" value={data.settings.maxWidth} onChange={(v) => updateSettings("maxWidth", v)} placeholder="none / 1400px" />
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM BAR TAB ── */}
        {activeTab === "BOTTOM" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "3rem" }}>
            <div style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px", background: "#fff" }}>
              <p style={S.sectionHeading}>Copyright</p>
              <TextField label="Copyright Text" value={data.settings.bottomBarText} onChange={(v) => updateSettings("bottomBarText", v)} placeholder="© TEZHHOMAYAA MMXXVI" />
              <div style={{ marginTop: "1rem" }}>
                <label style={S.fieldLabel}>Alignment</label>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {[["space-between", "Between"], ["center", "Center"], ["flex-start", "Left"], ["flex-end", "Right"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => updateSettings("bottomBarAlignment", val)} style={{ ...S.btn, background: data.settings.bottomBarAlignment === val ? "#1a1a18" : "#fafaf8", color: data.settings.bottomBarAlignment === val ? "#fff" : "#1a1a18" }}>{lbl}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <TextField label="Font Size (e.g. 0.75rem)" value={data.settings.bottomBarFontSize} onChange={(v) => updateSettings("bottomBarFontSize", v)} />
              </div>
            </div>

            <div style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px", background: "#fff" }}>
              <p style={S.sectionHeading}>Legal Links (Bottom Bar)</p>
              {data.settings.bottomBarLinks?.map((link, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input type="text" value={link.label} placeholder="Label" onChange={(e) => { const nl = [...data.settings.bottomBarLinks]; nl[i] = { ...nl[i], label: e.target.value }; updateSettings("bottomBarLinks", nl); }} style={{ flex: 1, padding: "0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px" }} />
                  <input type="text" value={link.url} placeholder="URL" onChange={(e) => { const nl = [...data.settings.bottomBarLinks]; nl[i] = { ...nl[i], url: e.target.value }; updateSettings("bottomBarLinks", nl); }} style={{ flex: 2, padding: "0.5rem", border: "1px solid #e8e4df", fontSize: "0.8rem", borderRadius: "2px" }} />
                  <button onClick={() => { const nl = [...data.settings.bottomBarLinks]; nl.splice(i, 1); updateSettings("bottomBarLinks", nl); }} style={S.deleteBtn}>✕</button>
                </div>
              ))}
              <button onClick={() => updateSettings("bottomBarLinks", [...(data.settings.bottomBarLinks || []), { label: "New Link", url: "#" }])} style={S.btn}>+ Add Link</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Preview ── */}
      <div style={{ height: "100%", background: "#f0ece6", borderRadius: "4px", border: "1px solid #e8e4df", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "0.75rem 1rem", background: "#fff", borderBottom: "1px solid #e8e4df", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.6rem", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "8px", height: "8px", background: "#2d6b3a", borderRadius: "50%", display: "inline-block" }}></span>
            Live Preview
          </span>
          <div style={{ display: "flex", gap: "0.25rem", background: "#f0ece6", padding: "0.25rem", borderRadius: "4px" }}>
            {(["desktop", "tablet", "mobile"] as const).map((mode) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: "0.4rem 0.8rem", background: viewMode === mode ? "#fff" : "transparent", border: "none", borderRadius: "2px", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", boxShadow: viewMode === mode ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-end", padding: "2rem", overflow: "auto" }}>
          <div style={{ width: iframeWidths[viewMode], height: "800px", background: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)", borderRadius: "2px", overflow: "hidden", flexShrink: 0 }}>
            <iframe ref={iframeRef} src={previewUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Footer Preview"
              onLoad={(e) => { try { (e.target as HTMLIFrameElement).contentWindow?.scrollTo(0, 9999); } catch {} }} />
          </div>
        </div>
      </div>

    </div>
  );
}

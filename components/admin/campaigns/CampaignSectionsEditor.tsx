"use client";

import React, { useState, useRef } from "react";
import { CampaignSection } from "@/lib/lep/campaigns/types";
import { Observability } from "@/lib/infrastructure/observability";

interface Props {
  campaignId: string;
  initialSections: CampaignSection[];
}

interface CtaField {
  label: string;
  url: string;
}

const emptyCtaFields = (): [CtaField, CtaField, CtaField] => [
  { label: "", url: "" },
  { label: "", url: "" },
  { label: "", url: "" },
];

export function CampaignSectionsEditor({ campaignId, initialSections }: Props) {
  const [sections, setSections] = useState<CampaignSection[]>(initialSections);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [slot, setSlot] = useState("home-hero-banner");
  const [type, setType] = useState("HERO_BANNER");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [ctas, setCtas] = useState<[CtaField, CtaField, CtaField]>(emptyCtaFields());
  const [buttonStyle, setButtonStyle] = useState("luxury");
  const [buttonBgColor, setButtonBgColor] = useState("");
  const [buttonTextColor, setButtonTextColor] = useState("");
  const [bannerTextColor, setBannerTextColor] = useState("#ffffff");
  const [desktopX, setDesktopX] = useState<number | "">(50);
  const [desktopY, setDesktopY] = useState<number | "">(50);
  const [mobileX, setMobileX] = useState<number | "">(50);
  const [mobileY, setMobileY] = useState<number | "">(50);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success && data.url) {
        setImageUrl(data.url);
        setImagePreview(data.url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(err);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateCta = (index: number, field: "label" | "url", value: string) => {
    setCtas(prev => {
      const next = [...prev] as [CtaField, CtaField, CtaField];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setSlot("home-hero-banner");
    setType("HERO_BANNER");
    setImageUrl("");
    setImagePreview("");
    setTitle("");
    setCtas(emptyCtaFields());
    setButtonStyle("luxury");
    setButtonBgColor("");
    setButtonTextColor("");
    setBannerTextColor("#ffffff");
    setDesktopX(50);
    setDesktopY(50);
    setMobileX(50);
    setMobileY(50);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (index: number) => {
    const sec = sections[index] as any;
    const payload = sec._payload || {};
    setSlot(sec.slug || "");
    setType(sec.sectionType || "HERO_BANNER");
    setTitle(payload.title || sec._newContentTitle || "");
    setImageUrl(payload.desktopImage || sec._newContentImageUrl || "");
    setImagePreview(payload.desktopImage || sec._newContentImageUrl || "");
    setCtas([
      { label: payload.cta1Label || sec._newContentCta1Label || "", url: payload.cta1Url || sec._newContentCta1Url || "" },
      { label: payload.cta2Label || sec._newContentCta2Label || "", url: payload.cta2Url || sec._newContentCta2Url || "" },
      { label: payload.cta3Label || sec._newContentCta3Label || "", url: payload.cta3Url || sec._newContentCta3Url || "" },
    ]);
    setButtonStyle(payload.buttonStyle || sec._newContentButtonStyle || "luxury");
    setButtonBgColor(payload.buttonBgColor || sec._newContentButtonBgColor || "");
    setButtonTextColor(payload.buttonTextColor || sec._newContentButtonTextColor || "");
    setBannerTextColor(payload.textColor || sec._newContentTextColor || "#ffffff");
    setDesktopX(payload.desktopX ?? sec._newContentDesktopX ?? 50);
    setDesktopY(payload.desktopY ?? sec._newContentDesktopY ?? 50);
    setMobileX(payload.mobileX ?? sec._newContentMobileX ?? 50);
    setMobileY(payload.mobileY ?? sec._newContentMobileY ?? 50);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleSave = () => {
    const newSection: any = {
      ...(editingIndex !== null ? sections[editingIndex] : { id: `sec-${Date.now()}`, campaignId }),
      slug: slot,
      sectionType: type,
      contentItemId: editingIndex !== null ? sections[editingIndex].contentItemId : `new-content-${Date.now()}`,
      _newContentTitle: title,
      _newContentImageUrl: imageUrl,
      _newContentCta1Label: ctas[0].label,
      _newContentCta1Url: ctas[0].url,
      _newContentCta2Label: ctas[1].label,
      _newContentCta2Url: ctas[1].url,
      _newContentCta3Label: ctas[2].label,
      _newContentCta3Url: ctas[2].url,
      _newContentButtonStyle: buttonStyle,
      _newContentButtonBgColor: buttonBgColor,
      _newContentButtonTextColor: buttonTextColor,
      _newContentTextColor: bannerTextColor,
      _newContentDesktopX: desktopX,
      _newContentDesktopY: desktopY,
      _newContentMobileX: mobileX,
      _newContentMobileY: mobileY,
    };
    if (editingIndex !== null) {
      const updated = [...sections];
      updated[editingIndex] = newSection;
      setSections(updated);
    } else {
      setSections([...sections, newSection]);
    }
    cancelForm();
  };

  const handleDelete = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const LabelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9a9690",
    marginBottom: "0.5rem"
  };

  const InputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem",
    border: "1px solid #e8e4df",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    boxSizing: "border-box"
  };

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Associated Sections</h2>
      
      {sections.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "#9a9690" }}>No sections associated with this campaign.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df" }}>
              <th style={{ paddingBottom: "1rem", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", fontWeight: 400 }}>Slot</th>
              <th style={{ paddingBottom: "1rem", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", fontWeight: 400 }}>Type</th>
              <th style={{ paddingBottom: "1rem", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", fontWeight: 400 }}>Content ID</th>
              <th style={{ paddingBottom: "1rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {sections.map((sec, index) => (
              <tr key={sec.id} style={{ borderBottom: "1px dashed #f0f0f0" }}>
                <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#1a1a18" }}>
                  {sec.slug}
                  <input type="hidden" name={`sections[${index}].id`} value={sec.id} />
                  <input type="hidden" name={`sections[${index}].campaignId`} value={sec.campaignId} />
                  <input type="hidden" name={`sections[${index}].slug`} value={sec.slug} />
                  <input type="hidden" name={`sections[${index}].sectionType`} value={sec.sectionType} />
                  <input type="hidden" name={`sections[${index}].contentItemId`} value={sec.contentItemId} />
                  {(sec as any)._newContentTitle !== undefined && <input type="hidden" name={`sections[${index}].newContentTitle`} value={(sec as any)._newContentTitle} />}
                  {(sec as any)._newContentImageUrl !== undefined && <input type="hidden" name={`sections[${index}].newContentImageUrl`} value={(sec as any)._newContentImageUrl} />}
                  {(sec as any)._newContentCta1Label !== undefined && <input type="hidden" name={`sections[${index}].newContentCta1Label`} value={(sec as any)._newContentCta1Label} />}
                  {(sec as any)._newContentCta1Url !== undefined && <input type="hidden" name={`sections[${index}].newContentCta1Url`} value={(sec as any)._newContentCta1Url} />}
                  {(sec as any)._newContentCta2Label !== undefined && <input type="hidden" name={`sections[${index}].newContentCta2Label`} value={(sec as any)._newContentCta2Label} />}
                  {(sec as any)._newContentCta2Url !== undefined && <input type="hidden" name={`sections[${index}].newContentCta2Url`} value={(sec as any)._newContentCta2Url} />}
                  {(sec as any)._newContentCta3Label !== undefined && <input type="hidden" name={`sections[${index}].newContentCta3Label`} value={(sec as any)._newContentCta3Label} />}
                  {(sec as any)._newContentCta3Url !== undefined && <input type="hidden" name={`sections[${index}].newContentCta3Url`} value={(sec as any)._newContentCta3Url} />}
                  {(sec as any)._newContentButtonStyle !== undefined && <input type="hidden" name={`sections[${index}].newContentButtonStyle`} value={(sec as any)._newContentButtonStyle} />}
                  {(sec as any)._newContentButtonBgColor !== undefined && <input type="hidden" name={`sections[${index}].newContentButtonBgColor`} value={(sec as any)._newContentButtonBgColor} />}
                  {(sec as any)._newContentButtonTextColor !== undefined && <input type="hidden" name={`sections[${index}].newContentButtonTextColor`} value={(sec as any)._newContentButtonTextColor} />}
                  {(sec as any)._newContentTextColor !== undefined && <input type="hidden" name={`sections[${index}].newContentTextColor`} value={(sec as any)._newContentTextColor} />}
                  {((sec as any)._newContentDesktopX !== undefined) && <input type="hidden" name={`sections[${index}].newContentDesktopX`} value={(sec as any)._newContentDesktopX} />}
                  {((sec as any)._newContentDesktopY !== undefined) && <input type="hidden" name={`sections[${index}].newContentDesktopY`} value={(sec as any)._newContentDesktopY} />}
                  {((sec as any)._newContentMobileX !== undefined) && <input type="hidden" name={`sections[${index}].newContentMobileX`} value={(sec as any)._newContentMobileX} />}
                  {((sec as any)._newContentMobileY !== undefined) && <input type="hidden" name={`sections[${index}].newContentMobileY`} value={(sec as any)._newContentMobileY} />}
                </td>
                <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#6b6865" }}>{sec.sectionType}</td>
                <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#6b6865", fontFamily: "monospace" }}>
                  {sec.contentItemId.substring(0, 22)}…
                </td>
                <td style={{ padding: "1rem 0", textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => handleEdit(index)}
                    style={{ background: "transparent", border: "1px solid #e8e4df", color: "#1a1a18", cursor: "pointer", fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(sec.id)}
                    style={{ background: "transparent", border: "1px solid #e8e4df", color: "#c0392b", cursor: "pointer", fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAdding ? (
        <div style={{ background: "#fcfaf8", padding: "1.5rem", border: "1px solid #e8e4df", marginTop: "1rem" }}>
          <h3 style={{ fontSize: "0.9rem", color: "#1a1a18", marginBottom: "1.5rem", fontWeight: 500 }}>Create & Associate Content</h3>

          {/* Slot + Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={LabelStyle}>Target Slot</label>
              <input value={slot} onChange={e => setSlot(e.target.value)} type="text" placeholder="home-hero-banner" style={InputStyle} />
            </div>
            <div>
              <label style={LabelStyle}>Section Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={InputStyle}>
                <option value="HERO_BANNER">Hero Banner</option>
                <option value="EDITORIAL">Editorial</option>
                <option value="PRODUCT_INFO">Product Info</option>
              </select>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={LabelStyle}>Headline</label>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Campaign headline text" style={InputStyle} />
          </div>

          {/* Banner Image */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={LabelStyle}>Banner Image</label>
            <div
              style={{ border: "2px dashed #e8e4df", padding: "1.5rem", textAlign: "center", marginBottom: "0.75rem", cursor: "pointer", background: "#fafaf8" }}
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <div>
                  <img src={imagePreview.startsWith("data:") ? imagePreview : imagePreview} alt="Preview"
                    style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain", marginBottom: "0.5rem" }} />
                  <div style={{ fontSize: "0.75rem", color: imagePreview.startsWith("data:") ? "#22c55e" : "#9a9690" }}>
                    {imagePreview.startsWith("data:") ? "✓ Image uploaded" : "URL image preview"}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>↑</div>
                  <div style={{ fontSize: "0.85rem", color: "#6b6865", marginBottom: "0.25rem" }}>
                    {isUploading ? "Reading file…" : "Click to upload your image"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9a9690" }}>JPG, PNG, WEBP supported</div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ flex: 1, height: "1px", background: "#e8e4df" }} />
              <span style={{ color: "#9a9690", fontSize: "0.75rem", letterSpacing: "0.1em" }}>OR PASTE URL</span>
              <div style={{ flex: 1, height: "1px", background: "#e8e4df" }} />
            </div>
            <input
              value={imageUrl.startsWith("data:") ? "" : imageUrl}
              onChange={handleUrlChange}
              type="text"
              placeholder="https://..."
              style={InputStyle}
            />
          </div>

          {/* Styling & Positioning */}
          <div style={{ marginBottom: "1.5rem", padding: "1.5rem", background: "#fcfaf8", border: "1px solid #e8e4df" }}>
            <h4 style={{ fontSize: "0.85rem", margin: "0 0 1rem", fontWeight: 500, color: "#1a1a18" }}>Styling & Positioning</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={LabelStyle}>Button Style</label>
                <select value={buttonStyle} onChange={e => setButtonStyle(e.target.value)} style={InputStyle}>
                  <option value="luxury">Luxury (Underline)</option>
                  <option value="filled">Filled Solid</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost (Text Only)</option>
                </select>
              </div>
              <div>
                <label style={LabelStyle}>Banner Text Color</label>
                <input type="color" value={bannerTextColor} onChange={e => setBannerTextColor(e.target.value)} style={{ ...InputStyle, padding: "0.2rem", height: "42px" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={LabelStyle}>Button Bg Color</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="color" value={buttonBgColor || "#ffffff"} onChange={e => setButtonBgColor(e.target.value)} style={{ width: "42px", height: "42px", padding: "0.2rem", border: "1px solid #e8e4df" }} />
                  <input type="text" placeholder="#ffffff or transparent" value={buttonBgColor} onChange={e => setButtonBgColor(e.target.value)} style={{ ...InputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={LabelStyle}>Button Text Color</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="color" value={buttonTextColor || "#000000"} onChange={e => setButtonTextColor(e.target.value)} style={{ width: "42px", height: "42px", padding: "0.2rem", border: "1px solid #e8e4df" }} />
                  <input type="text" placeholder="#000000" value={buttonTextColor} onChange={e => setButtonTextColor(e.target.value)} style={{ ...InputStyle, flex: 1 }} />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={LabelStyle}>Desktop Position (X%, Y%)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="number" min="0" max="100" placeholder="X (0-100)" value={desktopX} onChange={e => setDesktopX(e.target.value ? Number(e.target.value) : "")} style={InputStyle} />
                  <input type="number" min="0" max="100" placeholder="Y (0-100)" value={desktopY} onChange={e => setDesktopY(e.target.value ? Number(e.target.value) : "")} style={InputStyle} />
                </div>
              </div>
              <div>
                <label style={LabelStyle}>Mobile Position (X%, Y%)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="number" min="0" max="100" placeholder="X (0-100)" value={mobileX} onChange={e => setMobileX(e.target.value ? Number(e.target.value) : "")} style={InputStyle} />
                  <input type="number" min="0" max="100" placeholder="Y (0-100)" value={mobileY} onChange={e => setMobileY(e.target.value ? Number(e.target.value) : "")} style={InputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ ...LabelStyle, marginBottom: "1rem" }}>
              Call-To-Action Buttons (up to 3)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {([0, 1, 2] as const).map(i => (
                <div key={i} style={{ background: "#f7f5f2", padding: "1rem", border: "1px solid #ece8e3" }}>
                  <div style={{ fontSize: "0.7rem", color: "#9a9690", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>
                    Button {i + 1} {i === 0 ? "(Primary)" : i === 1 ? "(Secondary)" : "(Tertiary)"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ ...LabelStyle, marginBottom: "0.35rem" }}>Button Label</label>
                      <input
                        value={ctas[i].label}
                        onChange={e => updateCta(i, "label", e.target.value)}
                        type="text"
                        placeholder={i === 0 ? "Shop Now" : i === 1 ? "Explore Collection" : "Learn More"}
                        style={InputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ ...LabelStyle, marginBottom: "0.35rem" }}>Link URL</label>
                      <input
                        value={ctas[i].url}
                        onChange={e => updateCta(i, "url", e.target.value)}
                        type="text"
                        placeholder="/collections/new"
                        style={InputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="button" onClick={handleSave} disabled={isUploading} style={{
              background: isUploading ? "#9a9690" : "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem",
              border: "none", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
              cursor: isUploading ? "not-allowed" : "pointer"
            }}>
              {isUploading ? "Reading Image…" : "Save & Link"}
            </button>
            <button type="button" onClick={cancelForm}
              style={{ background: "transparent", color: "#1a1a18", padding: "0.8rem 1.5rem", border: "1px solid #e8e4df", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              Cancel
            </button>
          </div>

          {/* Hidden fields for form submission */}
          <input type="hidden" name={`sections[${sections.length}].id`} value={`sec-unsaved-${Date.now()}`} />
          <input type="hidden" name={`sections[${sections.length}].campaignId`} value={campaignId} />
          <input type="hidden" name={`sections[${sections.length}].slug`} value={slot} />
          <input type="hidden" name={`sections[${sections.length}].sectionType`} value={type} />
          <input type="hidden" name={`sections[${sections.length}].contentItemId`} value={`new-content-${Date.now()}`} />
          {title && <input type="hidden" name={`sections[${sections.length}].newContentTitle`} value={title} />}
          {imageUrl && <input type="hidden" name={`sections[${sections.length}].newContentImageUrl`} value={imageUrl} />}
          {ctas[0].label && <input type="hidden" name={`sections[${sections.length}].newContentCta1Label`} value={ctas[0].label} />}
          {ctas[0].url && <input type="hidden" name={`sections[${sections.length}].newContentCta1Url`} value={ctas[0].url} />}
          {ctas[1].label && <input type="hidden" name={`sections[${sections.length}].newContentCta2Label`} value={ctas[1].label} />}
          {ctas[1].url && <input type="hidden" name={`sections[${sections.length}].newContentCta2Url`} value={ctas[1].url} />}
          {ctas[2].label && <input type="hidden" name={`sections[${sections.length}].newContentCta3Label`} value={ctas[2].label} />}
          {ctas[2].url && <input type="hidden" name={`sections[${sections.length}].newContentCta3Url`} value={ctas[2].url} />}
        </div>
      ) : (
        <button type="button" onClick={() => setIsAdding(true)}
          style={{ marginTop: sections.length > 0 ? "0" : "1.5rem", background: "transparent", color: "#1a1a18", padding: "0.6rem 1rem", border: "1px solid #e8e4df", fontSize: "0.75rem", cursor: "pointer" }}>
          + Associate Section
        </button>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UniversalSectionBuilder } from "@/components/admin/UniversalSectionBuilder";
import { SectionType } from "@/lib/types/homepage";

type Section = {
  id: string;
  type: SectionType;
  hidden: boolean;
  data: any;
};

interface LivePreviewBuilderProps {
  apiEndpoint: string;
  pageTitle: string;
  backUrl: string;
  previewUrl: string;
  allowedSections?: SectionType[];
}

export function LivePreviewBuilder({ apiEndpoint, pageTitle, backUrl, previewUrl, allowedSections }: LivePreviewBuilderProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showSectionMenu, setShowSectionMenu] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;

    const payloadSections = sections.map(sec => {
      let s = JSON.parse(JSON.stringify(sec));
      if (s.type === "hero-slider") {
        s.data.slides = (s.data.slides || []).map((slide: any) => {
          if (files[`${s.id}_${slide.id}_desktop`]) {
             if(!slide.media) slide.media = { desktop: {} };
             slide.media.desktop.url = URL.createObjectURL(files[`${s.id}_${slide.id}_desktop`] as File);
          }
          if (files[`${s.id}_${slide.id}_mobile`]) {
             if(!slide.media) slide.media = { mobile: {} };
             slide.media.mobile.url = URL.createObjectURL(files[`${s.id}_${slide.id}_mobile`] as File);
          }
          return slide;
        });
      } else if (s.type === "image-section" || s.type === "editorial-section" || s.type === "split-layout" || s.type === "quote-block" || s.type === "newsletter-block" || s.type === "featured-collection" || s.type === "product-carousel" || s.type === "rich-text-block") {
        if (files[`${s.id}_desktop`]) {
          if(!s.data.media) s.data.media = { desktop: {} };
          s.data.media.desktop.url = URL.createObjectURL(files[`${s.id}_desktop`] as File);
        }
        if (files[`${s.id}_mobile`]) {
          if(!s.data.media) s.data.media = { mobile: {} };
          s.data.media.mobile.url = URL.createObjectURL(files[`${s.id}_mobile`] as File);
        }
      } else if (s.type === "collection-showcase" || s.type === "lookbook-grid") {
        if (s.data.collectionShowcase?.items) {
          s.data.collectionShowcase.items = s.data.collectionShowcase.items.map((item: any) => {
            if (files[`${s.id}_item_${item.id}_desktop`]) {
              if(!item.media) item.media = { desktop: {}, mobile: {} };
              item.media.desktop.url = URL.createObjectURL(files[`${s.id}_item_${item.id}_desktop`] as File);
            }
            if (files[`${s.id}_item_${item.id}_mobile`]) {
              if(!item.media) item.media = { desktop: {}, mobile: {} };
              item.media.mobile.url = URL.createObjectURL(files[`${s.id}_item_${item.id}_mobile`] as File);
            }
            return item;
          });
        }
      }
      return s;
    });

    iframeRef.current.contentWindow.postMessage({ type: "SYNC_PREVIEW", sections: payloadSections }, "*");
  }, [sections, files]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_POSITION") {
        const { secId, slideId, x, y, mode } = event.data;
        setSections(p => p.map(s => {
          if (s.id !== secId) return s;
          if (s.type === "hero-slider") {
            return { ...s, data: { ...s.data, slides: s.data.slides.map((sl:any) => {
              if (sl.id !== slideId) return sl;
              return mode === "desktop" ? { ...sl, layout: { ...sl.layout, desktop: { ...sl.layout?.desktop, x, y } } } : { ...sl, layout: { ...sl.layout, mobile: { ...sl.layout?.mobile, x, y } } };
            })}};
          }
          if ((s.type === "collection-showcase" || s.type === "lookbook-grid") && slideId) {
            return { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: s.data.collectionShowcase.items.map((sl:any) => {
              if (sl.id !== slideId) return sl;
              return mode === "desktop" ? { ...sl, layout: { ...sl.layout, desktop: { ...sl.layout?.desktop, x, y } } } : { ...sl, layout: { ...sl.layout, mobile: { ...sl.layout?.mobile, x, y } } };
            })}}};
          }
          return mode === "desktop" ? { ...s, data: { ...s.data, layout: { ...s.data.layout, desktop: { ...s.data.layout?.desktop, x, y } } } } : { ...s, data: { ...s.data, layout: { ...s.data.layout, mobile: { ...s.data.layout?.mobile, x, y } } } };
        }));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onDragStart = (e: React.DragEvent, index: number) => { setDraggedIdx(index); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null) return;
    const newSections = [...sections];
    const item = newSections.splice(draggedIdx, 1)[0];
    newSections.splice(index, 0, item);
    setSections(newSections);
    setDraggedIdx(null);
  };

  useEffect(() => {
    fetch(`${apiEndpoint}?t=${Date.now()}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          const loaded = res.data.sections || [];
          const withIds = loaded.map((sec: any) => {
            if (sec.type === "collection-showcase" || sec.type === "lookbook-grid") {
              if (!sec.data.collectionShowcase && sec.data.items) {
                sec.data.collectionShowcase = { layoutType: sec.data.layout || "grid", maxWidth: sec.data.maxWidth || "boxed", items: sec.data.items };
              }
              if (sec.data.collectionShowcase?.items) {
                sec.data.collectionShowcase.items = sec.data.collectionShowcase.items.map((it: any, i: number) => ({
                  ...it,
                  id: it.id || `item_${Date.now()}_${i}`
                }));
              }
            }
            return sec;
          });
          setSections(withIds);
        }
        setLoading(false);
      })
      .catch(err => { setError("Failed to load content."); setLoading(false); });
  }, [apiEndpoint]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.url;
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);

    try {
      const payload = JSON.parse(JSON.stringify({ sections }));
      for (const sec of payload.sections) {
        if (sec.type === "hero-slider") {
          for (const slide of sec.data.slides) {
            if (files[`${sec.id}_${slide.id}_desktop`]) {
              if(!slide.media) slide.media = { desktop: {} };
              slide.media.desktop.url = await uploadFile(files[`${sec.id}_${slide.id}_desktop`] as File);
            }
            if (files[`${sec.id}_${slide.id}_mobile`]) {
              if(!slide.media) slide.media = { mobile: {} };
              slide.media.mobile.url = await uploadFile(files[`${sec.id}_${slide.id}_mobile`] as File);
            }
          }
        } else if (sec.type === "image-section" || sec.type === "editorial-section" || sec.type === "split-layout" || sec.type === "quote-block" || sec.type === "newsletter-block" || sec.type === "featured-collection" || sec.type === "product-carousel" || sec.type === "rich-text-block" || sec.type === "motion-arrival" || sec.type === "motion-manifesto" || sec.type === "motion-canvas" || sec.type === "motion-storytelling" || sec.type === "motion-values" || sec.type === "motion-future" || sec.type === "motion-signature") {
          if (files[`${sec.id}_desktop`]) {
            if(!sec.data.media) sec.data.media = { desktop: {} };
            sec.data.media.desktop.url = await uploadFile(files[`${sec.id}_desktop`] as File);
          }
          if (files[`${sec.id}_mobile`]) {
            if(!sec.data.media) sec.data.media = { mobile: {} };
            sec.data.media.mobile.url = await uploadFile(files[`${sec.id}_mobile`] as File);
          }
        } else if (sec.type === "collection-showcase" || sec.type === "lookbook-grid" || sec.type === "motion-atelier") {
          if (sec.data.collectionShowcase?.items) {
            for (const item of sec.data.collectionShowcase.items) {
              if (files[`${sec.id}_item_${item.id}_desktop`]) {
                if(!item.media) item.media = { desktop: {}, mobile: {} };
                item.media.desktop.url = await uploadFile(files[`${sec.id}_item_${item.id}_desktop`] as File);
              }
              if (files[`${sec.id}_item_${item.id}_mobile`]) {
                if(!item.media) item.media = { desktop: {}, mobile: {} };
                item.media.mobile.url = await uploadFile(files[`${sec.id}_item_${item.id}_mobile`] as File);
              }
            }
          }
        }
      }

      const res = await fetch(apiEndpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setSections(json.data.sections || []);
      setFiles({}); setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const updateSectionData = (id: string, key: string, value: any) => setSections(p => p.map(s => s.id === id ? { ...s, data: { ...s.data, [key]: value } } : s));

  const addSection = (type: SectionType) => {
    const newId = `sec_${Date.now()}`;
    let defaultData: any = {};
    switch(type) {
      case "hero-slider": defaultData = { slides: [{ id: "1", heading: "New Banner", description: "", x:50, y:50, mobileX:50, mobileY:50, width:100, textColor:"#ffffff", fontSize: 4, fontWeight: 300, letterSpacing: 0.05, lineHeight: 1.1, shadow: "none", gradientOverlay: false, overlayStrength:0, buttonStyle:"luxury", animation:"slide-up", primaryButton: {enabled:true, label:"Explore",url:"#"}, secondaryButton: {enabled:false, label:"",url:""}, desktopImage:"", mobileImage:"" }], video: "" }; break;
      case "spacer": defaultData = { heightMobile: 64, heightDesktop: 120 }; break;
      case "image-section": defaultData = { title: "Campaign", subtitle: "", image: "", button: { enabled: true, label: "Shop", url: "#", style: "luxury" } }; break;
      case "collection-showcase": defaultData = { layout: "4-columns", maxWidth: "boxed", items: [{ collectionId: "women", overrideImage: "", overrideHeading: "", overrideDescription: "", overrideButton: "" }] }; break;
      case "editorial-section": defaultData = { heading: "Editorial", description: "Visual canvas...", desktopImage:"", mobileImage:"", video:"", x:50, y:50, mobileX:50, mobileY:50, width:80, textColor:"#ffffff", fontSize:4, fontWeight:300, letterSpacing:0, lineHeight:1.1, shadow:"none", gradientOverlay:false, overlayStrength:0, button: { enabled:true, label:"Discover", url:"#", style:"outline" } }; break;
      case "split-layout": defaultData = { layout: "image-left", ratio: "50-50", desktopImage:"", mobileImage:"", heading: "Split Content", description: "Text goes here...", button: { enabled:true, label:"Read More", url:"#", style:"luxury" } }; break;
      case "product-carousel": defaultData = { heading: "Featured Products", collectionId: "women", itemsCount: 8 }; break;
      case "featured-collection": defaultData = { heading: "Curated Selection", collectionId: "men" }; break;
      case "lookbook-grid": defaultData = { collectionShowcase: { layoutType: "masonry", maxWidth: "full", items: [] } }; break;
      case "quote-block": defaultData = { content: { heading: "A luxury statement", subheading: "— Founder", description: "" } }; break;
      case "newsletter-block": defaultData = { content: { heading: "Join the Club", description: "Sign up for exclusive offers." } }; break;
      case "instagram-feed": defaultData = { content: { heading: "Follow Us" }, primaryButton: { enabled: true, label: "View on Instagram", url: "https://instagram.com" } }; break;
      case "rich-text-block": defaultData = { content: { heading: "TEZHHOMAYAA", subheading: "", description: "Capturing the spirit of refinement.", primaryButton: { enabled: true, label: "Discover the campaign", url: "#", style: "luxury" } }, layout: { desktop: { textWidth: 60, align: "center", padding: "6rem 0" } }, style: { textColor: "#1a1a18" } }; break;
      case "contact-info-block": defaultData = { content: { heading: "CLIENT SERVICES", description: "Our Client Advisors are available..." }, contactInfo: { fields: [{ label: "Email", value: "care@tezhhomayaa.com", link: "mailto:care@tezhhomayaa.com" }] } }; break;
      case "contact-form": defaultData = { content: { heading: "SEND AN ENQUIRY" }, contactForm: { enabled: true, subjects: ["Client Services", "Press", "Wholesale", "Other"] } }; break;
      case "social-presence": defaultData = { content: { heading: "SOCIAL", description: "Follow our updates." }, socialPresence: { links: [{ platform: "Instagram", url: "https://instagram.com" }] } }; break;
      
      // Cinematic Motion Defaults
      case "motion-arrival": defaultData = { content: { heading: "ART INFUSED FASHION" }, style: { backgroundColor: "#000000", textColor: "#ffffff" } }; break;
      case "motion-manifesto": defaultData = { content: { description: "NOT EVERY GARMENT\nIS DESIGNED.\nSome\nare\ncomposed." }, style: { backgroundColor: "#000000", textColor: "#ffffff", descriptionFontSize: 4 } }; break;
      case "motion-canvas": defaultData = { content: { heading: "THE LIVING CANVAS" }, desktopImage: "", mobileImage: "", style: { backgroundColor: "#1a1a18", textColor: "#ffffff" } }; break;
      case "motion-storytelling": defaultData = { content: { description: "Thought 1\nThought 2\nThought 3" }, desktopImage: "", style: { backgroundColor: "#ffffff", textColor: "#1a1a18" } }; break;
      case "motion-values": defaultData = { content: { heading: "BE JOYFUL", subheading: "KEEP EVOLVING", description: "REMOVE UNNECESSARY" }, style: { backgroundColor: "#f0ece6", textColor: "#1a1a18", fontSize: 6 } }; break;
      case "motion-atelier": defaultData = { collectionShowcase: { items: [{ overrideHeading: "Texture 1" }, { overrideHeading: "Detail 2" }] }, style: { backgroundColor: "#1a1a18" } }; break;
      case "motion-future": defaultData = { content: { description: "The future is\nform\nbeyond motion." }, style: { backgroundColor: "#ffffff", textColor: "#1a1a18", descriptionFontSize: 3 } }; break;
      case "motion-signature": defaultData = { content: { heading: "ART INFUSED FASHION" }, button: { enabled: true, label: "ENTER THE HOUSE", url: "/collections", style: "outline" }, style: { backgroundColor: "#000000", textColor: "#ffffff" } }; break;
    }
    setSections([...sections, { id: newId, type, hidden: false, data: defaultData }]);
    setExpandedId(newId); setShowSectionMenu(false);
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#9a9690" }}>Loading builder...</div>;

  const iframeWidths = { desktop: "100%", tablet: "768px", mobile: "390px" };

  const allTypes: { label: string, value: SectionType }[] = [
    { label: "Hero Slider", value: "hero-slider" },
    { label: "Editorial Content", value: "editorial-section" },
    { label: "Split Layout", value: "split-layout" },
    { label: "Collection Showcase", value: "collection-showcase" },
    { label: "Image Banner", value: "image-section" },
    { label: "Product Carousel", value: "product-carousel" },
    { label: "Featured Collection", value: "featured-collection" },
    { label: "Lookbook Grid", value: "lookbook-grid" },
    { label: "Quote Block", value: "quote-block" },
    { label: "Rich Text Block", value: "rich-text-block" },
    { label: "Newsletter Block", value: "newsletter-block" },
    { label: "Instagram Feed", value: "instagram-feed" },
    { label: "Contact Info Block", value: "contact-info-block" },
    { label: "Contact Form", value: "contact-form" },
    { label: "Social Presence", value: "social-presence" },
    { label: "Spacer", value: "spacer" },
    
    { label: "(Motion) Arrival", value: "motion-arrival" },
    { label: "(Motion) Manifesto", value: "motion-manifesto" },
    { label: "(Motion) Canvas", value: "motion-canvas" },
    { label: "(Motion) Storytelling", value: "motion-storytelling" },
    { label: "(Motion) Values", value: "motion-values" },
    { label: "(Motion) Atelier", value: "motion-atelier" },
    { label: "(Motion) Future", value: "motion-future" },
    { label: "(Motion) Signature", value: "motion-signature" },
  ];

  const availableTypes = allowedSections ? allTypes.filter(t => allowedSections.includes(t.value)) : allTypes;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(400px, 600px) 1fr", gap: "2rem", alignItems: "start", height: "calc(100vh - 4rem)", overflow: "hidden" }}>
      
      {/* ── Left Sidebar (Editor) ── */}
      <div style={{ height: "100%", overflowY: "auto", paddingRight: "1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}><Link href={backUrl} style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>← Back</Link></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 2vw, 1.8rem)", fontWeight: 300, color: "#1a1a18", margin: 0, letterSpacing: "0.02em" }}>{pageTitle}</h1>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "#1a1a18", color: "#f7f5f2", border: "none", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", borderRadius: "2px" }}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
        {error && <div style={{ background: "#fdf0f0", border: "1px solid #e0b8b8", padding: "1rem", color: "#6b3a3a", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{error}</div>}
        {success && <div style={{ background: "#f0fdf4", border: "1px solid #bce3c5", padding: "1rem", color: "#2d6b3a", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Saved successfully.</div>}

        {/* Section List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingBottom: "2rem" }}>
          {sections.map((sec, idx) => {
            const isExpanded = expandedId === sec.id;
            const prettyType = sec.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
            return (
              <div key={sec.id} draggable onDragStart={(e) => onDragStart(e, idx)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, idx)} style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", opacity: draggedIdx === idx ? 0.5 : (sec.hidden ? 0.6 : 1) }}>
                
                <div onClick={() => setExpandedId(isExpanded ? null : sec.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", cursor: "pointer", background: isExpanded ? "#fafaf8" : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}><span style={{ color: "#ccc9c4", cursor: "grab" }}>⋮⋮</span><h3 style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#1a1a18" }}>{prettyType}</h3>{sec.hidden && <span style={{ fontSize: "0.6rem", background: "#f0ece6", padding: "2px 6px", borderRadius: "2px" }}>HIDDEN</span>}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}><button onClick={(e) => {e.stopPropagation(); setSections(p => p.map(s => s.id === sec.id ? { ...s, hidden: !s.hidden } : s))}} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", textTransform: "uppercase" }}>{sec.hidden ? "Show" : "Hide"}</button><button onClick={(e) => {e.stopPropagation(); setSections(p => p.filter(s => s.id !== sec.id))}} style={{ background: "none", border: "none", color: "#a55", cursor: "pointer", fontSize: "0.7rem", textTransform: "uppercase" }}>Delete</button><span style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span></div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "1.5rem", borderTop: "1px solid #e8e4df", display: "flex", flexDirection: "column", gap: "1.5rem", cursor: "default" }} onClick={e => e.stopPropagation()}>
                    
                    {sec.type === "spacer" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div><label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>Desktop Height (px)</label><input type="number" value={sec.data.heightDesktop} onChange={e => updateSectionData(sec.id, 'heightDesktop', Number(e.target.value))} style={{ padding: "0.8rem", width: "100%", border: "1px solid #ccc9c4" }} /></div>
                        <div><label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>Mobile Height (px)</label><input type="number" value={sec.data.heightMobile} onChange={e => updateSectionData(sec.id, 'heightMobile', Number(e.target.value))} style={{ padding: "0.8rem", width: "100%", border: "1px solid #ccc9c4" }} /></div>
                      </div>
                    )}

                    {sec.type === "hero-slider" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        {sec.data.slides?.map((slide: any, slideIdx: number) => (
                          <div key={slide.id} style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid #e8e4df", paddingBottom: "0.5rem" }}>
                              <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Slide {slideIdx + 1} Editor</h4>
                              <button onClick={() => {
                                const newSlides = sec.data.slides.filter((_:any, idx:number) => idx !== slideIdx);
                                setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, slides: newSlides } } : s));
                              }} style={{ background: "none", border: "none", color: "#a55", fontSize: "0.75rem", textTransform: "uppercase", cursor: "pointer" }}>Delete Slide</button>
                            </div>
                            <UniversalSectionBuilder 
                              data={slide}
                              onChange={(newData) => setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, slides: s.data.slides.map((sl:any) => sl.id === slide.id ? { ...sl, ...newData } : sl) } } : s))}
                              viewMode={viewMode}
                              onMediaFilesChange={(key, f) => setFiles(p => ({ ...p, [key]: f }))}
                              mediaFiles={files}
                              mediaPrefix={`${sec.id}_${slide.id}`}
                              sectionType="hero-slider"
                            />
                          </div>
                        ))}
                        <button onClick={() => {
                          const newSlide = { id: `slide_${Math.random().toString(36).substring(2, 9)}`, heading: "New Slide", description: "", primaryButton: { enabled: true, label: "Explore", url: "#" } };
                          setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, slides: [...(s.data.slides || []), newSlide] } } : s));
                        }} style={{ padding: "1rem", background: "transparent", border: "1px dashed #ccc9c4", color: "#1a1a18", cursor: "pointer", borderRadius: "2px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>+ Add Slide</button>
                      </div>
                    )}

                    {(sec.type !== "hero-slider" && sec.type !== "spacer" && sec.type !== "collection-showcase" && sec.type !== "lookbook-grid") && (
                      <UniversalSectionBuilder 
                        data={sec.data}
                        onChange={(newData) => setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, ...newData } } : s))}
                        viewMode={viewMode}
                        onMediaFilesChange={(key, f) => setFiles(p => ({ ...p, [key]: f }))}
                        mediaFiles={files}
                        mediaPrefix={sec.id}
                        sectionType={sec.type}
                      />
                    )}

                  </div>
                )}
                {isExpanded && (sec.type === "collection-showcase" || sec.type === "lookbook-grid") && (
                  <div style={{ padding: "1.5rem", borderTop: "1px solid #e8e4df", display: "flex", flexDirection: "column", gap: "2rem", cursor: "default" }} onClick={e => e.stopPropagation()}>
                    <div style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px" }}>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", borderBottom: "1px solid #e8e4df", paddingBottom: "0.5rem" }}>Container Settings</h4>
                      <UniversalSectionBuilder 
                        data={sec.data}
                        onChange={(newData) => setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, ...newData } } : s))}
                        viewMode={viewMode}
                        onMediaFilesChange={(key, f) => setFiles(p => ({ ...p, [key]: f }))}
                        mediaFiles={files}
                        mediaPrefix={`${sec.id}_container`}
                        sectionType={sec.type}
                      />
                    </div>
                    {sec.data.collectionShowcase?.items?.map((item: any, itemIdx: number) => (
                      <div key={item.id || itemIdx} style={{ border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "4px", position: "relative" }}>
                        <div style={{ position: "absolute", top: "1rem", right: "1.5rem", display: "flex", gap: "1rem", zIndex: 50 }}>
                          <button disabled={itemIdx === 0} onClick={() => {
                            const newItems = [...sec.data.collectionShowcase!.items];
                            [newItems[itemIdx-1], newItems[itemIdx]] = [newItems[itemIdx], newItems[itemIdx-1]];
                            setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: newItems } } } : s));
                          }} style={{ background: "none", border: "none", color: itemIdx === 0 ? "#ccc" : "#1a1a18", fontSize: "0.75rem", textTransform: "uppercase", cursor: itemIdx === 0 ? "default" : "pointer" }}>↑</button>
                          <button disabled={itemIdx === sec.data.collectionShowcase!.items.length - 1} onClick={() => {
                            const newItems = [...sec.data.collectionShowcase!.items];
                            [newItems[itemIdx+1], newItems[itemIdx]] = [newItems[itemIdx], newItems[itemIdx+1]];
                            setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: newItems } } } : s));
                          }} style={{ background: "none", border: "none", color: itemIdx === sec.data.collectionShowcase!.items.length - 1 ? "#ccc" : "#1a1a18", fontSize: "0.75rem", textTransform: "uppercase", cursor: itemIdx === sec.data.collectionShowcase!.items.length - 1 ? "default" : "pointer" }}>↓</button>
                          <button onClick={() => {
                            const clone = JSON.parse(JSON.stringify(item));
                            clone.id = `item_${Math.random().toString(36).substring(2, 9)}`;
                            const newItems = [...sec.data.collectionShowcase!.items];
                            newItems.splice(itemIdx + 1, 0, clone);
                            setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: newItems } } } : s));
                          }} style={{ background: "none", border: "none", color: "#1a1a18", fontSize: "0.75rem", textTransform: "uppercase", cursor: "pointer" }}>Duplicate</button>
                          <button onClick={() => {
                            const newItems = sec.data.collectionShowcase!.items.filter((_:any, idx:number) => idx !== itemIdx);
                            setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: newItems } } } : s));
                          }} style={{ background: "none", border: "none", color: "#a55", fontSize: "0.75rem", textTransform: "uppercase", cursor: "pointer" }}>Delete</button>
                        </div>
                        <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", borderBottom: "1px solid #e8e4df", paddingBottom: "0.5rem" }}>Card {itemIdx + 1} Editor</h4>
                        
                        <div style={{ marginBottom: "1.5rem" }}>
                          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>URL Binding</label>
                          <input value={item.url || item.collectionId || ""} placeholder="/women/bags" onChange={e => {
                            setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: s.data.collectionShowcase.items.map((it:any) => it.id === item.id ? { ...it, url: e.target.value } : it) } } } : s));
                          }} style={{ padding: "0.8rem", width: "100%", border: "1px solid #ccc9c4", maxWidth: "400px" }} />
                        </div>

                        <UniversalSectionBuilder 
                          data={item}
                          onChange={(newData) => setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: s.data.collectionShowcase.items.map((it:any) => it.id === item.id ? { ...it, ...newData } : it) } } } : s))}
                          viewMode={viewMode}
                          onMediaFilesChange={(key, f) => setFiles(p => ({ ...p, [key]: f }))}
                          mediaFiles={files}
                          mediaPrefix={`${sec.id}_item_${item.id}`}
                          sectionType="collection-item"
                        />
                      </div>
                    ))}
                    <button onClick={() => {
                      const newItem = { id: `item_${Math.random().toString(36).substring(2, 9)}`, url: "/new-collection", content: { heading: "New Collection" } };
                      setSections(p => p.map(s => s.id === sec.id ? { ...s, data: { ...s.data, collectionShowcase: { ...s.data.collectionShowcase, items: [...(s.data.collectionShowcase?.items || []), newItem] } } } : s));
                    }} style={{ padding: "1rem", background: "transparent", border: "1px dashed #ccc9c4", color: "#1a1a18", cursor: "pointer", borderRadius: "2px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>+ Add Card</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Section Controls */}
        <div style={{ marginTop: "2rem", position: "relative", paddingBottom: "2rem" }}>
          {showSectionMenu ? (
            <div style={{ background: "#ffffff", border: "1px solid #1a1a18", borderRadius: "2px", padding: "0.5rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem", borderBottom: "1px solid #e8e4df", marginBottom: "0.5rem" }}><span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Add Section</span><button onClick={() => setShowSectionMenu(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>✕</button></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {availableTypes.map(t => (
                  <button key={t.value} onClick={() => addSection(t.value as SectionType)} style={{ padding: "1rem", background: "#fafaf8", border: "1px solid #e8e4df", textAlign: "left", cursor: "pointer", fontSize: "0.85rem", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f0ece6"} onMouseLeave={e => e.currentTarget.style.background = "#fafaf8"}>{t.label}</button>
                ))}
              </div>
            </div>
          ) : (
            <button onClick={() => setShowSectionMenu(true)} style={{ width: "100%", padding: "1.5rem", background: "transparent", border: "1px dashed #ccc9c4", color: "#1a1a18", cursor: "pointer", borderRadius: "2px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>+ Add Section</button>
          )}
        </div>

      </div>

      {/* ── Right Sidebar (WYSIWYG Live Preview) ── */}
      <div style={{ height: "100%", background: "#f0ece6", borderRadius: "4px", border: "1px solid #e8e4df", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Viewport Toolbar */}
        <div style={{ padding: "0.75rem 1rem", background: "#ffffff", borderBottom: "1px solid #e8e4df", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.6rem", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", background: "#2d6b3a", borderRadius: "50%", display: "inline-block" }}></span>
              Live Preview
            </span>
            <Link 
              href={previewUrl} 
              target="_blank"
              style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", textDecoration: "none", border: "1px solid #e8e4df", padding: "0.3rem 0.6rem", borderRadius: "2px", display: "flex", alignItems: "center", gap: "0.25rem", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a18"; e.currentTarget.style.borderColor = "#ccc9c4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6865"; e.currentTarget.style.borderColor = "#e8e4df"; }}
            >
              Open Storefront ↗
            </Link>
          </div>
          <div style={{ display: "flex", gap: "0.25rem", background: "#f0ece6", padding: "0.25rem", borderRadius: "4px" }}>
            <button onClick={() => setViewMode("desktop")} style={{ padding: "0.4rem 0.8rem", background: viewMode === "desktop" ? "#ffffff" : "transparent", border: "none", borderRadius: "2px", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", boxShadow: viewMode === "desktop" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Desktop</button>
            <button onClick={() => setViewMode("tablet")} style={{ padding: "0.4rem 0.8rem", background: viewMode === "tablet" ? "#ffffff" : "transparent", border: "none", borderRadius: "2px", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", boxShadow: viewMode === "tablet" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Tablet</button>
            <button onClick={() => setViewMode("mobile")} style={{ padding: "0.4rem 0.8rem", background: viewMode === "mobile" ? "#ffffff" : "transparent", border: "none", borderRadius: "2px", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", boxShadow: viewMode === "mobile" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Mobile</button>
          </div>
        </div>

        {/* Iframe Container */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem", overflow: "auto" }}>
          <div style={{ 
            width: iframeWidths[viewMode], 
            height: "800px", 
            background: "#ffffff", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)", 
            transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            borderRadius: "2px",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0
          }}>
            <iframe 
              ref={iframeRef}
              src={previewUrl + (previewUrl.includes('?') ? '&adminPreview=true' : '?adminPreview=true')} 
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Storefront Preview"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

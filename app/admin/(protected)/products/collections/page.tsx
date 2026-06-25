"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SmartCollection, Condition } from "@/lib/smartCollections";

export default function SmartCollectionsPage() {
  const [collections, setCollections] = useState<SmartCollection[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [matchType, setMatchType] = useState<"ALL"|"ANY">("ALL");
  const [conditions, setConditions] = useState<Condition[]>([]);
  
  // Presentation
  const [presentation, setPresentation] = useState<any>({
    desktopGap: 32,
    mobileGap: 12,
    cardBottomSpacing: 10,
    desktopColumns: 4,
    mobileColumns: 2,
    density: 10,
    imageRatio: "3:4",
    cardStyle: "minimal",
    showPrice: true,
    showProductName: true,
    showCategory: false,
    hoverEffect: "zoom",
    bannerHeight: "large"
  });

  // Preview
  const [previewProducts, setPreviewProducts] = useState<any[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<"details"|"conditions"|"display">("details");
  const [previewDevice, setPreviewDevice] = useState<"desktop"|"tablet"|"mobile">("desktop");
  
  // Settings
  const [routingEnabled, setRoutingEnabled] = useState(false);

  useEffect(() => {
    fetchCollections();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch("/api/smart-collections/settings");
    const json = await res.json();
    if (json.success) setRoutingEnabled(json.data.enableSmartRouting);
  };
  
  const toggleRouting = async () => {
    const newVal = !routingEnabled;
    setRoutingEnabled(newVal);
    await fetch("/api/smart-collections/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enableSmartRouting: newVal })
    });
  };

  const fetchCollections = async () => {
    setLoading(true);
    const res = await fetch("/api/smart-collections");
    const json = await res.json();
    if (json.success) setCollections(json.data);
    setLoading(false);
  };

  const handleEdit = (c: SmartCollection) => {
    setEditingId(c.id);
    setTitle(c.title);
    setSlug(c.slug);
    setDescription(c.description || "");
    setBannerImage(c.bannerImage || "");
    setMatchType(c.matchType || "ALL");
    setConditions(c.conditions || []);
    if (c.presentation) setPresentation(c.presentation);
    setActiveTab("details");
  };

  const handleCreateNew = () => {
    setEditingId("new");
    setTitle("");
    setSlug("");
    setDescription("");
    setBannerImage("");
    setMatchType("ALL");
    setConditions([]);
    setPresentation({
      desktopGap: 32, mobileGap: 12, cardBottomSpacing: 10, desktopColumns: 4, mobileColumns: 2, density: 10,
      imageRatio: "3:4", cardStyle: "minimal", showPrice: true,
      showProductName: true, showCategory: false, hoverEffect: "zoom", bannerHeight: "large"
    });
    setActiveTab("details");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    await fetch(`/api/smart-collections/${id}`, { method: "DELETE" });
    fetchCollections();
  };

  const handleSave = async () => {
    const payload = { title, slug, description, bannerImage, matchType, conditions, presentation };
    const method = editingId === "new" ? "POST" : "PUT";
    const url = editingId === "new" ? "/api/smart-collections" : `/api/smart-collections/${editingId}`;
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    setEditingId(null);
    fetchCollections();
  };

  const addCondition = () => {
    setConditions([...conditions, { id: Math.random().toString(), field: "Tag", operator: "Equals", value: "" }]);
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  // Live Preview calculation
  useEffect(() => {
    if (!editingId) return;
    const calculatePreview = async () => {
      setCalculating(true);
      // We can fetch all products and evaluate locally, or we can add an endpoint for preview.
      // For instant luxury performance in admin, we fetch all products once and filter locally.
      const res = await fetch("/api/products");
      const json = await res.json();
      if (!json.success) { setCalculating(false); return; }
      
      const allProducts = json.data;
      const matched = allProducts.filter((product: any) => {
        if (conditions.length === 0) return false;
        
        // Match storefront logic: filter out drafts in live preview?
        // Wait, the admin probably *wants* to see all products in preview so they know it's working,
        // but maybe we should clearly label draft products.
        // For now, let's just add a status badge if it's draft so the user isn't confused why it's missing on the storefront.
        
        const evalCond = (c: Condition) => {
          const cVal = c.value.toLowerCase();
          let pVal: string | string[] = "";
          switch (c.field) {
            case "Tag": pVal = product.tags || []; break;
            case "Gender": pVal = product.gender || ""; break;
            case "Category": pVal = product.category || ""; break;
            case "Status": pVal = product.status || ""; break;
            case "Season": pVal = product.season || ""; break;
            case "Color": pVal = product.color || ""; break;
            case "Material": pVal = product.material || ""; break;
            case "Fit": pVal = product.fit || ""; break;
            case "Collection": pVal = product.collectionName || ""; break;
          }
          
          if (Array.isArray(pVal)) {
            const lower = pVal.map(v => v.toLowerCase());
            switch (c.operator) {
              case "Equals": return lower.includes(cVal);
              case "Not Equals": return !lower.includes(cVal);
              case "Contains": return lower.some(v => v.includes(cVal));
              case "Does Not Contain": return !lower.some(v => v.includes(cVal));
            }
          } else {
            const lower = pVal.toLowerCase();
            switch (c.operator) {
              case "Equals": return lower === cVal;
              case "Not Equals": return lower !== cVal;
              case "Contains": return lower.includes(cVal);
              case "Does Not Contain": return !lower.includes(cVal);
            }
          }
          return false;
        };
        
        if (matchType === "ALL") return conditions.every(evalCond);
        return conditions.some(evalCond);
      });
      
      setPreviewProducts(matched);
      setCalculating(false);

      const frame = document.getElementById("collection-preview-frame") as HTMLIFrameElement;
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({
          type: "SYNC_COLLECTION_PREVIEW",
          payload: {
            title,
            description,
            bannerImage,
            slug,
            products: matched,
            presentation
          }
        }, "*");
      }
    };
    
    const timeout = setTimeout(calculatePreview, 300);
    return () => clearTimeout(timeout);
  }, [conditions, matchType, editingId, title, description, bannerImage, slug, presentation]);

  if (editingId) {
    return (
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b6865", fontSize: "0.8rem", padding: 0 }}>
            ← Back to Collections
          </button>
          <button onClick={handleSave} style={{ padding: "0.75rem 2rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Save Collection
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e8e4df", gap: "1rem" }}>
              <button onClick={() => setActiveTab("details")} style={{ padding: "0.75rem 0", background: "none", border: "none", borderBottom: activeTab === "details" ? "2px solid #1a1a18" : "2px solid transparent", color: activeTab === "details" ? "#1a1a18" : "#9a9690", cursor: "pointer", fontSize: "0.85rem", fontWeight: activeTab === "details" ? 500 : 400 }}>Details</button>
              <button onClick={() => setActiveTab("conditions")} style={{ padding: "0.75rem 0", background: "none", border: "none", borderBottom: activeTab === "conditions" ? "2px solid #1a1a18" : "2px solid transparent", color: activeTab === "conditions" ? "#1a1a18" : "#9a9690", cursor: "pointer", fontSize: "0.85rem", fontWeight: activeTab === "conditions" ? 500 : 400 }}>Conditions</button>
              <button onClick={() => setActiveTab("display")} style={{ padding: "0.75rem 0", background: "none", border: "none", borderBottom: activeTab === "display" ? "2px solid #1a1a18" : "2px solid transparent", color: activeTab === "display" ? "#1a1a18" : "#9a9690", cursor: "pointer", fontSize: "0.85rem", fontWeight: activeTab === "display" ? 500 : 400 }}>Display Settings</button>
            </div>

            {/* Details Tab */}
            {activeTab === "details" && (
              <div style={{ background: "#fff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>URL Slug</label>
                    <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. women/pants" style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Banner Image URL</label>
                    <input value={bannerImage} onChange={e => setBannerImage(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Rules Tab */}
            {activeTab === "conditions" && (
              <div style={{ background: "#fff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#1a1a18" }}>Products must match:</span>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}>
                    <input type="radio" name="matchType" checked={matchType === "ALL"} onChange={() => setMatchType("ALL")} /> All conditions
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}>
                    <input type="radio" name="matchType" checked={matchType === "ANY"} onChange={() => setMatchType("ANY")} /> Any condition
                  </label>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {conditions.map(cond => (
                    <div key={cond.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr auto", gap: "0.5rem", alignItems: "center" }}>
                      <select value={cond.field} onChange={e => updateCondition(cond.id, "field", e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", background: "transparent" }}>
                        <option value="Tag">Tag</option>
                        <option value="Gender">Gender</option>
                        <option value="Category">Category</option>
                        <option value="Season">Season</option>
                        <option value="Collection">Collection</option>
                        <option value="Color">Color</option>
                        <option value="Material">Material</option>
                        <option value="Fit">Fit</option>
                        <option value="Status">Status</option>
                      </select>
                      <select value={cond.operator} onChange={e => updateCondition(cond.id, "operator", e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", background: "transparent" }}>
                        <option value="Equals">Equals</option>
                        <option value="Not Equals">Not Equals</option>
                        <option value="Contains">Contains</option>
                        <option value="Does Not Contain">Does Not Contain</option>
                      </select>
                      <input value={cond.value} onChange={e => updateCondition(cond.id, "value", e.target.value)} placeholder="Value" style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none" }} />
                      <button onClick={() => removeCondition(cond.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b6865", padding: "0.5rem", fontSize: "1.2rem" }}>&times;</button>
                    </div>
                  ))}
                </div>
                
                <button onClick={addCondition} style={{ marginTop: "1.5rem", padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid #1a1a18", cursor: "pointer", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  + Add Condition
                </button>
              </div>
            )}

            {/* Display Settings Tab */}
            {activeTab === "display" && (
              <div style={{ background: "#fff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Banner Height</label>
                    <select value={presentation.bannerHeight} onChange={e => setPresentation({ ...presentation, bannerHeight: e.target.value })} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", background: "transparent" }}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="cinematic">Cinematic (Full Screen)</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Image Ratio</label>
                    <select value={presentation.imageRatio} onChange={e => setPresentation({ ...presentation, imageRatio: e.target.value })} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", background: "transparent" }}>
                      <option value="Square">Square</option>
                      <option value="4:5">4:5</option>
                      <option value="3:4">3:4</option>
                      <option value="Original">Original</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Desktop Columns: {presentation.desktopColumns}</label>
                    <input type="range" min="2" max="6" value={presentation.desktopColumns} onChange={e => setPresentation({ ...presentation, desktopColumns: parseInt(e.target.value) })} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Mobile Columns: {presentation.mobileColumns}</label>
                    <input type="range" min="1" max="3" value={presentation.mobileColumns} onChange={e => setPresentation({ ...presentation, mobileColumns: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Desktop Product Gap: {presentation.desktopGap ?? 32}px</label>
                    <input type="range" min="0" max="80" value={presentation.desktopGap ?? 32} onChange={e => setPresentation({ ...presentation, desktopGap: parseInt(e.target.value) })} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Mobile Product Gap: {presentation.mobileGap ?? 12}px</label>
                    <input type="range" min="0" max="40" value={presentation.mobileGap ?? 12} onChange={e => setPresentation({ ...presentation, mobileGap: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Product Card Bottom Spacing: {presentation.cardBottomSpacing ?? 10}px</label>
                  <input type="range" min="0" max="60" value={presentation.cardBottomSpacing ?? 10} onChange={e => setPresentation({ ...presentation, cardBottomSpacing: parseInt(e.target.value) })} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Collection Density (Dense → Spacious)</label>
                  <input type="range" min="0" max="100" value={presentation.density} onChange={e => setPresentation({ ...presentation, density: parseInt(e.target.value) })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Hover Effect</label>
                    <select value={presentation.hoverEffect} onChange={e => setPresentation({ ...presentation, hoverEffect: e.target.value })} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", background: "transparent" }}>
                      <option value="zoom">Subtle Zoom</option>
                      <option value="swap">Image Swap</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #e8e4df" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "#1a1a18" }}>
                    <input type="checkbox" checked={presentation.showPrice} onChange={e => setPresentation({ ...presentation, showPrice: e.target.checked })} />
                    Show Price
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "#1a1a18" }}>
                    <input type="checkbox" checked={presentation.showProductName} onChange={e => setPresentation({ ...presentation, showProductName: e.target.checked })} />
                    Show Product Name
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "#1a1a18" }}>
                    <input type="checkbox" checked={presentation.showCategory} onChange={e => setPresentation({ ...presentation, showCategory: e.target.checked })} />
                    Show Category
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", position: "sticky", top: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #e8e4df", paddingBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#1a1a18" }}>Storefront Preview</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setPreviewDevice("desktop")} style={{ background: "none", border: "none", cursor: "pointer", color: previewDevice === "desktop" ? "#1a1a18" : "#9a9690", fontSize: "0.75rem" }}>Desktop</button>
                <button onClick={() => setPreviewDevice("tablet")} style={{ background: "none", border: "none", cursor: "pointer", color: previewDevice === "tablet" ? "#1a1a18" : "#9a9690", fontSize: "0.75rem" }}>Tablet</button>
                <button onClick={() => setPreviewDevice("mobile")} style={{ background: "none", border: "none", cursor: "pointer", color: previewDevice === "mobile" ? "#1a1a18" : "#9a9690", fontSize: "0.75rem" }}>Mobile</button>
              </div>
            </div>
            
            <div style={{ flex: 1, background: "#fafaf8", border: "1px solid #e8e4df", borderRadius: "2px", overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <iframe
                id="collection-preview-frame"
                src="/admin/preview/collection"
                style={{ 
                  width: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px", 
                  height: "100%", 
                  border: "none",
                  borderLeft: previewDevice !== "desktop" ? "1px solid #e8e4df" : "none",
                  borderRight: previewDevice !== "desktop" ? "1px solid #e8e4df" : "none",
                  transition: "width 0.3s ease",
                  backgroundColor: "#fff"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Smart Collections
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "#6b6865" }}>
              <input type="checkbox" checked={routingEnabled} onChange={toggleRouting} />
              Enable Smart Collection Routing
            </label>
            <span style={{ fontSize: "0.75rem", color: "#9a9690", fontStyle: "italic" }}>
              (When enabled, matching collection slugs will override the default category structure)
            </span>
          </div>
        </div>
        <button onClick={handleCreateNew} style={{ padding: "0.75rem 1.5rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Create Collection
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#9a9690", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Loading collections...
        </div>
      ) : (
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e4df", color: "#6b6865", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                <th style={{ padding: "1rem" }}>Title / Slug</th>
                <th style={{ padding: "1rem" }}>Conditions</th>
                <th style={{ padding: "1rem" }}>Products</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(c => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "1rem", color: "#1a1a18" }}>
                    <strong>{c.title}</strong><br />
                    <span style={{ fontSize: "0.8rem", color: "#6b6865" }}>/{c.slug}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "#6b6865", fontSize: "0.8rem" }}>
                    {c.conditions.length} condition(s) ({c.matchType})
                  </td>
                  <td style={{ padding: "1rem", color: "#6b6865" }}>
                    {c.productIds?.length || 0}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button onClick={() => handleEdit(c)} style={{ background: "none", border: "none", color: "#1a1a18", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}>Edit</button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: "none", border: "none", color: "#7c2a00", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}>Delete</button>
                  </td>
                </tr>
              ))}
              {collections.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem" }}>
                    No collections found. Create your first smart collection to dynamically organize products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

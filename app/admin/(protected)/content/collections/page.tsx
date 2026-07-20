"use client";

import React, { useState, useEffect } from "react";
import { UniversalMediaBuilder } from "@/components/admin/UniversalMediaBuilder";
import { UniversalSectionBuilder } from "@/components/admin/UniversalSectionBuilder";
import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";
import CollectionBanner from "@/components/sections/CollectionBanner";
import { Observability } from "@/lib/infrastructure/observability";

function ProductSequenceBuilder({
  activeCategory,
  productSequence,
  includeProducts,
  excludeProducts,
  onChange,
}: {
  activeCategory: string;
  productSequence: string[];
  includeProducts: string[];
  excludeProducts: string[];
  onChange: (updates: { productSequence: string[], includeProducts: string[], excludeProducts: string[] }) => void;
}) {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [baseProducts, setBaseProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      if (!activeCategory) return;
      setLoading(true);
      try {
        const [allRes, baseRes] = await Promise.all([
          fetch(`/api/products`).then(r => r.json()),
          fetch(`/api/collection-products?category=${activeCategory}`).then(r => r.json())
        ]);
        if (allRes.success) setAllProducts(allRes.data);
        if (baseRes.success) setBaseProducts(baseRes.data);
      } catch (err) {
        Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [activeCategory]);

  if (loading) return <div style={{ padding: "2rem", color: "#6b6865" }}>Loading products...</div>;

  const included = allProducts.filter(p => includeProducts.includes(p.id) && !baseProducts.some(b => b.id === p.id));
  const currentProducts = [...baseProducts, ...included].filter(p => !excludeProducts.includes(p.id));

  const sortedProducts = [...currentProducts].sort((a, b) => {
    const idxA = productSequence.indexOf(a.id);
    const idxB = productSequence.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  const currentSequence = productSequence.length > 0 ? productSequence : sortedProducts.map(p => p.id);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSeq = [...currentSequence];
    [newSeq[index - 1], newSeq[index]] = [newSeq[index], newSeq[index - 1]];
    onChange({ productSequence: newSeq, includeProducts, excludeProducts });
  };

  const moveDown = (index: number) => {
    if (index === currentSequence.length - 1) return;
    const newSeq = [...currentSequence];
    [newSeq[index], newSeq[index + 1]] = [newSeq[index + 1], newSeq[index]];
    onChange({ productSequence: newSeq, includeProducts, excludeProducts });
  };

  const handleRemove = (id: string) => {
    const newSeq = currentSequence.filter(x => x !== id);
    const newInc = includeProducts.filter(x => x !== id);
    const newExc = Array.from(new Set([...excludeProducts, id]));
    onChange({ productSequence: newSeq, includeProducts: newInc, excludeProducts: newExc });
  };

  const handleAdd = (id: string) => {
    const newExc = excludeProducts.filter(x => x !== id);
    const newInc = Array.from(new Set([...includeProducts, id]));
    // Wait to avoid duplicates in sequence
    const newSeq = currentSequence.includes(id) ? currentSequence : [...currentSequence, id];
    onChange({ productSequence: newSeq, includeProducts: newInc, excludeProducts: newExc });
    setShowAddModal(false);
  };

  return (
    <div style={{ background: "#fdfdfa", padding: "1.5rem", borderRadius: "4px", border: "1px solid #e8e4df" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, color: "#1a1a18" }}>Product Sequence</h3>
        <button onClick={() => setShowAddModal(!showAddModal)} style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", borderRadius: "2px" }}>
          {showAddModal ? "Cancel" : "Add Product"}
        </button>
      </div>
      
      {showAddModal && (
        <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e8e4df", marginBottom: "1rem", borderRadius: "4px", maxHeight: "300px", overflowY: "auto" }}>
          <p style={{ fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Select a product to add to this collection:</p>
          {allProducts.filter(p => !currentProducts.some(cp => cp.id === p.id)).map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #f0ece6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img src={p.image} alt="" style={{ width: "24px", height: "24px", objectFit: "cover" }} />
                <span style={{ fontSize: "0.8rem" }}>{p.name}</span>
              </div>
              <button onClick={() => handleAdd(p.id)} style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "#e8e4df", border: "none", cursor: "pointer" }}>Add</button>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: "0.8rem", color: "#6b6865", marginBottom: "1.5rem" }}>Manually order how products appear in this collection on the storefront.</p>
      
      {!sortedProducts.length && <p style={{ fontSize: "0.8rem", color: "#6b6865" }}>No products in this collection.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sortedProducts.map((product, idx) => (
          <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem", background: "#fff", border: "1px solid #e8e4df", borderRadius: "4px" }}>
            <img src={product.image} alt={product.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "2px" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.85rem", margin: 0, fontWeight: 500, color: "#1a1a18" }}>{product.name}</p>
              <p style={{ fontSize: "0.75rem", margin: 0, color: "#9a9690" }}>{product.price}</p>
            </div>
            <button onClick={() => handleRemove(product.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#d9534f", fontSize: "1rem", marginRight: "0.5rem" }} title="Remove from collection">×</button>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{ background: "transparent", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.3 : 1, padding: "2px" }}>▲</button>
              <button onClick={() => moveDown(idx)} disabled={idx === sortedProducts.length - 1} style={{ background: "transparent", border: "none", cursor: idx === sortedProducts.length - 1 ? "not-allowed" : "pointer", opacity: idx === sortedProducts.length - 1 ? 0.3 : 1, padding: "2px" }}>▼</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CollectionsBuilderPage() {
  const [categories, setCategories] = useState<{ key: string; title: string; subtitle?: string }[]>([]);
  const [banners, setBanners] = useState<{ [key: string]: UniversalSectionData }>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<{ [key: string]: File | null }>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch("/api/collection-categories").then(r => r.json()),
          fetch("/api/collection-banners").then(r => r.json())
        ]);
        if (catRes.success) {
          setCategories(catRes.data);
          if (catRes.data.length > 0) setActiveCategory(catRes.data[0].key);
        }
        if (banRes.success) {
          setBanners(banRes.data || {});
        }
      } catch (err) {
        Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to load collections data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDataChange = (newData: UniversalSectionData) => {
    if (!activeCategory) return;
    setBanners(prev => ({
      ...prev,
      [activeCategory]: newData
    }));
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_POSITION") {
        if (!activeCategory || !banners[activeCategory]) return;
        const { x, y, mode } = event.data;
        const currentData = banners[activeCategory];
        
        const updatedData = {
          ...currentData,
          layout: {
            ...currentData.layout,
            [mode]: {
              ...(currentData.layout as any)[mode],
              x,
              y
            }
          }
        };
        
        handleDataChange(updatedData);
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeCategory, banners]);

  const handleSave = async () => {
    if (!activeCategory) return;
    setSaving(true);
    try {
      // Step 1: Upload media files for the active category
      const currentData = banners[activeCategory];
      let desktopUrl = currentData?.media?.desktop?.url || "";
      let mobileUrl = currentData?.media?.mobile?.url || "";
      let hasNewMedia = false;

      const prefix = `collection_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) return json.url;
        throw new Error(json.error);
      };

      if (mediaFiles[`${prefix}_desktop`]) {
        desktopUrl = await uploadFile(mediaFiles[`${prefix}_desktop`]!);
        hasNewMedia = true;
      }
      if (mediaFiles[`${prefix}_mobile`]) {
        mobileUrl = await uploadFile(mediaFiles[`${prefix}_mobile`]!);
        hasNewMedia = true;
      }

      // Step 2: Save to JSON
      const finalData = { ...banners };
      if (hasNewMedia && finalData[activeCategory]) {
        finalData[activeCategory] = {
          ...finalData[activeCategory],
          media: {
            ...finalData[activeCategory].media,
            desktop: { ...finalData[activeCategory].media.desktop, url: desktopUrl },
            mobile: { ...finalData[activeCategory].media.mobile, url: mobileUrl }
          }
        };
      }

      const res = await fetch("/api/collection-banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      });
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
        setMediaFiles({}); // clear local files
        alert("Banner saved successfully!");
      } else {
        alert("Error saving banner: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#6b6865" }}>Loading...</div>;

  const currentBanner = activeCategory && banners[activeCategory] 
    ? normalizeSectionData(banners[activeCategory]) 
    : normalizeSectionData({ content: { heading: "New Banner" } }); // Initial default if none exists

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(400px, 600px) 1fr", gap: "2rem", alignItems: "start", height: "calc(100vh - 4rem)", overflow: "hidden" }}>
      
      {/* ── Left Sidebar: Editor ── */}
      <div style={{ height: "100%", overflowY: "auto", paddingRight: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", fontWeight: 300, color: "#1a1a18", margin: 0 }}>
            Collection Banners
          </h1>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: "0.6rem 1.5rem", background: "#1a1a18", color: "#fff", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Collection Selector */}
        <div style={{ marginBottom: "2rem", background: "#fdfdfa", padding: "1.5rem", borderRadius: "4px", border: "1px solid #e8e4df" }}>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem", color: "#6b6865" }}>
            Select Collection
          </label>
          <select 
            value={activeCategory || ""} 
            onChange={e => setActiveCategory(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc9c4", background: "#fff", fontSize: "0.9rem" }}
          >
            {categories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.title} ({cat.key})</option>
            ))}
          </select>
        </div>

        {activeCategory && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "4rem" }}>
            <UniversalMediaBuilder
              label="Banner Media"
              media={currentBanner.media}
              pendingDesktopFile={mediaFiles[`collection_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}_desktop`] || null}
              pendingMobileFile={mediaFiles[`collection_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}_mobile`] || null}
              onMediaChange={(media) => handleDataChange({ ...currentBanner, media })}
              onDesktopFileChange={(file) => setMediaFiles(prev => ({ ...prev, [`collection_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}_desktop`]: file }))}
              onMobileFileChange={(file) => setMediaFiles(prev => ({ ...prev, [`collection_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}_mobile`]: file }))}
              recommendedAspect="16:9 Desktop, 9:16 Mobile"
              recommendedSize="1920x1080px Desktop"
            />
            <UniversalSectionBuilder
              data={currentBanner}
              onChange={handleDataChange}
              viewMode={viewMode}
              onMediaFilesChange={(key, file) => setMediaFiles(prev => ({ ...prev, [key]: file }))}
              mediaFiles={mediaFiles}
              mediaPrefix={`collection_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}`}
              sectionType="image-section"
            />
            <ProductSequenceBuilder
              activeCategory={activeCategory}
              productSequence={currentBanner.productSequence || []}
              includeProducts={currentBanner.includeProducts || []}
              excludeProducts={currentBanner.excludeProducts || []}
              onChange={(updates) => handleDataChange({ ...currentBanner, ...updates })}
            />
          </div>
        )}
      </div>

      {/* ── Right Sidebar: Live Preview ── */}
      <div style={{ height: "100%", background: "#f0ece6", borderRadius: "4px", border: "1px solid #e8e4df", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", background: "#fff", borderBottom: "1px solid #e8e4df" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>
            Live Preview (Drag to Position)
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => setViewMode("desktop")} style={{ background: "transparent", border: "none", cursor: "pointer", opacity: viewMode === "desktop" ? 1 : 0.5, fontSize: "1.2rem" }}>💻</button>
            <button onClick={() => setViewMode("mobile")} style={{ background: "transparent", border: "none", cursor: "pointer", opacity: viewMode === "mobile" ? 1 : 0.5, fontSize: "1.2rem" }}>📱</button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem", overflow: "auto" }}>
          {activeCategory && (
            <div 
              style={{ 
                width: viewMode === "mobile" ? "375px" : "100%", 
                minHeight: viewMode === "mobile" ? "812px" : "auto",
                transition: "width 0.3s ease",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                background: "#fff",
                position: "relative",
                overflow: "hidden",
                border: viewMode === "mobile" ? "12px solid #1a1a18" : "none",
                borderRadius: viewMode === "mobile" ? "40px" : "4px"
              }}
            >
              <CollectionBanner 
                categoryKey={activeCategory} 
                data={currentBanner}
                sectionId="preview-banner" 
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

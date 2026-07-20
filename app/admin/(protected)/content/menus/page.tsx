"use client";

import React, { useState, useEffect } from "react";
import { MainNavEntry, Category, SubItem } from "@/lib/types/menus";
import { Observability } from "@/lib/infrastructure/observability";

export default function MenusContentPage() {
  const [menus, setMenus] = useState<MainNavEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menus")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setMenus(json.data);
        }
      })
      .catch((err) => Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menus),
      });
      const data = await res.json();
      if (data.success) {
        alert("Menus saved successfully!");
      } else {
        alert("Failed to save menus.");
      }
    } catch (err) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(err);
      alert("Error saving menus.");
    } finally {
      setSaving(false);
    }
  };

  const addMenu = () => {
    setMenus([...menus, { label: "New Menu", href: "/", expandable: false, categories: [] }]);
  };

  const removeMenu = (index: number) => {
    const newMenus = [...menus];
    newMenus.splice(index, 1);
    setMenus(newMenus);
  };

  const updateMenu = (index: number, key: string, value: any) => {
    const newMenus = [...menus];
    newMenus[index] = { ...newMenus[index], [key]: value };
    setMenus(newMenus);
  };

  const addCategory = (menuIndex: number) => {
    const newMenus = [...menus];
    const cat = newMenus[menuIndex].categories || [];
    cat.push({ label: "New Category", href: "/", items: [] });
    newMenus[menuIndex].categories = cat;
    setMenus(newMenus);
  };

  const updateCategory = (menuIndex: number, catIndex: number, key: string, value: any) => {
    const newMenus = [...menus];
    const cat = newMenus[menuIndex].categories![catIndex];
    newMenus[menuIndex].categories![catIndex] = { ...cat, [key]: value };
    setMenus(newMenus);
  };

  const removeCategory = (menuIndex: number, catIndex: number) => {
    const newMenus = [...menus];
    newMenus[menuIndex].categories!.splice(catIndex, 1);
    setMenus(newMenus);
  };

  const addItem = (menuIndex: number, catIndex: number) => {
    const newMenus = [...menus];
    const items = newMenus[menuIndex].categories![catIndex].items || [];
    items.push({ label: "New Link", href: "/" });
    newMenus[menuIndex].categories![catIndex].items = items;
    setMenus(newMenus);
  };

  const updateItem = (menuIndex: number, catIndex: number, itemIndex: number, key: string, value: any) => {
    const newMenus = [...menus];
    const item = newMenus[menuIndex].categories![catIndex].items![itemIndex];
    newMenus[menuIndex].categories![catIndex].items![itemIndex] = { ...item, [key]: value };
    setMenus(newMenus);
  };

  const removeItem = (menuIndex: number, catIndex: number, itemIndex: number) => {
    const newMenus = [...menus];
    newMenus[menuIndex].categories![catIndex].items!.splice(itemIndex, 1);
    setMenus(newMenus);
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Navigation Menus
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Configure your storefront header navigation.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ padding: "0.6rem 1.5rem", background: "#1a1a18", color: "#fff", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {menus.map((menu, mIndex) => (
          <div key={mIndex} style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #f0ece6", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flex: 1 }}>
                <input 
                  value={menu.label} 
                  onChange={(e) => updateMenu(mIndex, "label", e.target.value)}
                  style={{ padding: "0.5rem", border: "1px solid #ccc9c4", fontSize: "1rem", fontWeight: 500, width: "200px" }}
                  placeholder="Menu Label"
                />
                {!menu.expandable && (
                  <input 
                    value={menu.href || ""} 
                    onChange={(e) => updateMenu(mIndex, "href", e.target.value)}
                    style={{ padding: "0.5rem", border: "1px solid #ccc9c4", fontSize: "0.9rem", width: "250px" }}
                    placeholder="Link URL"
                  />
                )}
                <label style={{ fontSize: "0.8rem", color: "#6b6865", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input 
                    type="checkbox" 
                    checked={menu.expandable} 
                    onChange={(e) => updateMenu(mIndex, "expandable", e.target.checked)} 
                  />
                  Has Dropdown
                </label>
              </div>
              <button 
                onClick={() => removeMenu(mIndex)}
                style={{ padding: "0.4rem 0.8rem", background: "#fdf0f0", color: "#c0392b", border: "1px solid #f5d6d6", borderRadius: "2px", cursor: "pointer", fontSize: "0.75rem" }}
              >
                Remove
              </button>
            </div>

            {menu.expandable && (
              <div style={{ marginLeft: "1rem", borderLeft: "2px solid #e8e4df", paddingLeft: "1.5rem" }}>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "1rem" }}>Dropdown Categories</h4>
                
                {menu.categories?.map((cat, cIndex) => (
                  <div key={cIndex} style={{ marginBottom: "2rem", background: "#fafaf8", padding: "1.5rem", border: "1px solid #f0ece6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <input 
                          value={cat.label} 
                          onChange={(e) => updateCategory(mIndex, cIndex, "label", e.target.value)}
                          style={{ padding: "0.4rem", border: "1px solid #ccc9c4", width: "180px", fontSize: "0.85rem" }}
                          placeholder="Category Name"
                        />
                        <input 
                          value={cat.href} 
                          onChange={(e) => updateCategory(mIndex, cIndex, "href", e.target.value)}
                          style={{ padding: "0.4rem", border: "1px solid #ccc9c4", width: "220px", fontSize: "0.85rem" }}
                          placeholder="Category Link URL"
                        />
                      </div>
                      <button 
                        onClick={() => removeCategory(mIndex, cIndex)}
                        style={{ padding: "0.3rem 0.6rem", background: "transparent", color: "#c0392b", border: "none", cursor: "pointer", fontSize: "0.75rem" }}
                      >
                        Delete Category
                      </button>
                    </div>

                    <div style={{ paddingLeft: "1rem" }}>
                      {cat.items?.map((item, iIndex) => (
                        <div key={iIndex} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", alignItems: "center" }}>
                          <span style={{ color: "#ccc9c4" }}>└</span>
                          <input 
                            value={item.label} 
                            onChange={(e) => updateItem(mIndex, cIndex, iIndex, "label", e.target.value)}
                            style={{ padding: "0.3rem", border: "1px solid #e8e4df", width: "160px", fontSize: "0.8rem" }}
                            placeholder="Link Label"
                          />
                          <input 
                            value={item.href} 
                            onChange={(e) => updateItem(mIndex, cIndex, iIndex, "href", e.target.value)}
                            style={{ padding: "0.3rem", border: "1px solid #e8e4df", width: "200px", fontSize: "0.8rem" }}
                            placeholder="URL"
                          />
                          <button 
                            onClick={() => removeItem(mIndex, cIndex, iIndex)}
                            style={{ background: "transparent", border: "none", color: "#9a9690", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addItem(mIndex, cIndex)}
                        style={{ marginTop: "0.5rem", marginLeft: "1.5rem", padding: "0.3rem 0.6rem", background: "#fff", border: "1px solid #ccc9c4", color: "#6b6865", fontSize: "0.7rem", cursor: "pointer" }}
                      >
                        + Add Sub-Link
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => addCategory(mIndex)}
                  style={{ padding: "0.5rem 1rem", background: "#fff", border: "1px solid #1a1a18", color: "#1a1a18", cursor: "pointer", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  + Add Category Column
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={addMenu}
        style={{ marginTop: "2rem", padding: "1rem 2rem", background: "#fafaf8", border: "1px dashed #ccc9c4", color: "#1a1a18", cursor: "pointer", width: "100%", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
      >
        + Add Main Menu Item
      </button>

    </div>
  );
}

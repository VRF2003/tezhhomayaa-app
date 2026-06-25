"use client";

import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Save } from "lucide-react";
import { MainNavEntry, Category, SubItem } from "@/lib/types/menus";

export default function UnifiedNavigationPage() {
  const [menus, setMenus] = useState<MainNavEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/menus")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          // Give every item a unique ID for framer-motion Reorder
          const dataWithIds = json.data.map((m: any) => ({
            ...m,
            _id: Math.random().toString(36).substr(2, 9),
            categories: m.categories?.map((c: any) => ({
              ...c,
              _id: Math.random().toString(36).substr(2, 9),
              items: c.items?.map((i: any) => ({
                ...i,
                _id: Math.random().toString(36).substr(2, 9)
              }))
            }))
          }));
          setMenus(dataWithIds);
          // Auto-expand top level
          const initialExpanded: Record<string, boolean> = {};
          dataWithIds.forEach((m: any) => { initialExpanded[m._id] = true; });
          setExpandedNodes(initialExpanded);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Strip out the internal _id before saving
      const cleanData = menus.map((m: any) => ({
        label: m.label,
        href: m.href,
        expandable: m.expandable,
        categories: m.categories?.map((c: any) => ({
          label: c.label,
          href: c.href,
          items: c.items?.map((i: any) => ({
            label: i.label,
            href: i.href
          }))
        }))
      }));

      const res = await fetch("/api/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Navigation & Categories saved successfully! The Homepage Menu is now updated.");
      } else {
        alert("Failed to save.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- TOP LEVEL (Departments) ---
  const addTopLevel = () => {
    setMenus([...menus, { _id: Math.random().toString(36).substr(2, 9), label: "New Department", href: "/", expandable: true, categories: [] } as any]);
  };
  const updateTopLevel = (id: string, key: string, value: any) => {
    setMenus(menus.map((m: any) => m._id === id ? { ...m, [key]: value } : m));
  };
  const removeTopLevel = (id: string) => {
    setMenus(menus.filter((m: any) => m._id !== id));
  };

  // --- MID LEVEL (Categories) ---
  const addCategory = (parentId: string) => {
    setMenus(menus.map((m: any) => {
      if (m._id === parentId) {
        return {
          ...m,
          categories: [...(m.categories || []), { _id: Math.random().toString(36).substr(2, 9), label: "New Category", href: "/", items: [] }]
        };
      }
      return m;
    }));
    setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
  };
  const updateCategory = (parentId: string, id: string, key: string, value: any) => {
    setMenus(menus.map((m: any) => {
      if (m._id === parentId) {
        return { ...m, categories: m.categories.map((c: any) => c._id === id ? { ...c, [key]: value } : c) };
      }
      return m;
    }));
  };
  const removeCategory = (parentId: string, id: string) => {
    setMenus(menus.map((m: any) => {
      if (m._id === parentId) {
        return { ...m, categories: m.categories.filter((c: any) => c._id !== id) };
      }
      return m;
    }));
  };
  const setCategories = (parentId: string, newCategories: any[]) => {
    setMenus(menus.map((m: any) => m._id === parentId ? { ...m, categories: newCategories } : m));
  };

  // --- BOTTOM LEVEL (Subcategories) ---
  const addSubcategory = (topId: string, midId: string) => {
    setMenus(menus.map((m: any) => {
      if (m._id === topId) {
        return {
          ...m,
          categories: m.categories.map((c: any) => {
            if (c._id === midId) {
              return { ...c, items: [...(c.items || []), { _id: Math.random().toString(36).substr(2, 9), label: "New Subcategory", href: "/" }] };
            }
            return c;
          })
        };
      }
      return m;
    }));
    setExpandedNodes(prev => ({ ...prev, [midId]: true }));
  };
  const updateSubcategory = (topId: string, midId: string, id: string, key: string, value: any) => {
    setMenus(menus.map((m: any) => {
      if (m._id === topId) {
        return {
          ...m,
          categories: m.categories.map((c: any) => {
            if (c._id === midId) {
              return { ...c, items: c.items.map((i: any) => i._id === id ? { ...i, [key]: value } : i) };
            }
            return c;
          })
        };
      }
      return m;
    }));
  };
  const removeSubcategory = (topId: string, midId: string, id: string) => {
    setMenus(menus.map((m: any) => {
      if (m._id === topId) {
        return {
          ...m,
          categories: m.categories.map((c: any) => {
            if (c._id === midId) {
              return { ...c, items: c.items.filter((i: any) => i._id !== id) };
            }
            return c;
          })
        };
      }
      return m;
    }));
  };
  const setSubcategories = (topId: string, midId: string, newItems: any[]) => {
    setMenus(menus.map((m: any) => {
      if (m._id === topId) {
        return {
          ...m,
          categories: m.categories.map((c: any) => {
            if (c._id === midId) {
              return { ...c, items: newItems };
            }
            return c;
          })
        };
      }
      return m;
    }));
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Navigation & Categories
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Drag and drop to structure your website's main menu and product taxonomy.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", background: "#1a1a18", color: "#fff", border: "none", borderRadius: "4px", cursor: saving ? "not-allowed" : "pointer", fontWeight: 500, fontSize: "0.85rem" }}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div style={{ background: "#fbfaf9", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "8px" }}>
        <Reorder.Group axis="y" values={menus} onReorder={setMenus} style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menus.map((topLevel: any) => (
            <Reorder.Item key={topLevel._id} value={topLevel} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "6px", marginBottom: "1rem", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              {/* TOP LEVEL HEADER */}
              <div style={{ display: "flex", alignItems: "center", padding: "1rem", background: "#fdfdfc", borderBottom: expandedNodes[topLevel._id] ? "1px solid #e8e4df" : "none" }}>
                <div style={{ cursor: "grab", padding: "0.5rem", color: "#a8a49f", marginRight: "0.5rem" }}><GripVertical size={18} /></div>
                <button onClick={() => toggleExpand(topLevel._id)} style={{ background: "none", border: "none", cursor: "pointer", marginRight: "1rem", color: "#1a1a18" }}>
                  {expandedNodes[topLevel._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                <div style={{ display: "flex", gap: "1rem", flex: 1, alignItems: "center" }}>
                  <input 
                    onPointerDown={(e) => e.stopPropagation()}
                    value={topLevel.label} 
                    onChange={(e) => updateTopLevel(topLevel._id, "label", e.target.value)}
                    style={{ padding: "0.5rem 0.75rem", border: "1px solid #ddd9d4", borderRadius: "4px", fontSize: "1rem", fontWeight: 500, width: "200px" }}
                    placeholder="Department Name"
                  />
                  <input 
                    onPointerDown={(e) => e.stopPropagation()}
                    value={topLevel.href || ""} 
                    onChange={(e) => updateTopLevel(topLevel._id, "href", e.target.value)}
                    style={{ padding: "0.5rem 0.75rem", border: "1px solid #ddd9d4", borderRadius: "4px", fontSize: "0.9rem", width: "250px" }}
                    placeholder="URL Path (e.g. /women)"
                  />
                </div>
                <button onClick={() => removeTopLevel(topLevel._id)} style={{ color: "#e84a4a", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}><Trash2 size={18} /></button>
              </div>

              {/* CATEGORIES (MID LEVEL) */}
              {expandedNodes[topLevel._id] && (
                <div style={{ padding: "1.5rem", paddingLeft: "4rem" }}>
                  {topLevel.categories && topLevel.categories.length > 0 ? (
                    <Reorder.Group axis="y" values={topLevel.categories} onReorder={(vals) => setCategories(topLevel._id, vals)} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {topLevel.categories.map((cat: any) => (
                        <Reorder.Item key={cat._id} value={cat} style={{ background: "#fdfcfb", border: "1px solid #e8e4df", borderRadius: "6px", marginBottom: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", padding: "0.75rem 1rem", borderBottom: expandedNodes[cat._id] ? "1px solid #e8e4df" : "none" }}>
                            <div style={{ cursor: "grab", padding: "0.5rem", color: "#a8a49f", marginRight: "0.5rem" }}><GripVertical size={16} /></div>
                            <button onClick={() => toggleExpand(cat._id)} style={{ background: "none", border: "none", cursor: "pointer", marginRight: "1rem", color: "#1a1a18" }}>
                              {expandedNodes[cat._id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            <div style={{ display: "flex", gap: "1rem", flex: 1, alignItems: "center" }}>
                              <input 
                                onPointerDown={(e) => e.stopPropagation()}
                                value={cat.label} 
                                onChange={(e) => updateCategory(topLevel._id, cat._id, "label", e.target.value)}
                                style={{ padding: "0.4rem 0.75rem", border: "1px solid #ddd9d4", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 500, width: "180px" }}
                                placeholder="Category Name"
                              />
                              <input 
                                onPointerDown={(e) => e.stopPropagation()}
                                value={cat.href || ""} 
                                onChange={(e) => updateCategory(topLevel._id, cat._id, "href", e.target.value)}
                                style={{ padding: "0.4rem 0.75rem", border: "1px solid #ddd9d4", borderRadius: "4px", fontSize: "0.85rem", width: "220px" }}
                                placeholder="URL Path"
                              />
                            </div>
                            <button onClick={() => removeCategory(topLevel._id, cat._id)} style={{ color: "#e84a4a", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}><Trash2 size={16} /></button>
                          </div>

                          {/* SUBCATEGORIES (BOTTOM LEVEL) */}
                          {expandedNodes[cat._id] && (
                            <div style={{ padding: "1rem 1.5rem", paddingLeft: "3.5rem", background: "#fff" }}>
                              {cat.items && cat.items.length > 0 ? (
                                <Reorder.Group axis="y" values={cat.items} onReorder={(vals) => setSubcategories(topLevel._id, cat._id, vals)} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                  {cat.items.map((sub: any) => (
                                    <Reorder.Item key={sub._id} value={sub} style={{ display: "flex", alignItems: "center", padding: "0.5rem", background: "#fff", border: "1px solid transparent", borderBottom: "1px solid #f0ece6", marginBottom: "0.5rem" }}>
                                      <div style={{ cursor: "grab", padding: "0.25rem", color: "#c8c4bf", marginRight: "0.5rem" }}><GripVertical size={14} /></div>
                                      <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                                        <input 
                                          onPointerDown={(e) => e.stopPropagation()}
                                          value={sub.label} 
                                          onChange={(e) => updateSubcategory(topLevel._id, cat._id, sub._id, "label", e.target.value)}
                                          style={{ padding: "0.3rem 0.5rem", border: "1px solid #e8e4df", borderRadius: "4px", fontSize: "0.85rem", width: "160px", background: "#fafaf8" }}
                                          placeholder="Subcategory"
                                        />
                                        <input 
                                          onPointerDown={(e) => e.stopPropagation()}
                                          value={sub.href || ""} 
                                          onChange={(e) => updateSubcategory(topLevel._id, cat._id, sub._id, "href", e.target.value)}
                                          style={{ padding: "0.3rem 0.5rem", border: "1px solid #e8e4df", borderRadius: "4px", fontSize: "0.8rem", width: "200px", background: "#fafaf8" }}
                                          placeholder="URL Path"
                                        />
                                      </div>
                                      <button onClick={() => removeSubcategory(topLevel._id, cat._id, sub._id)} style={{ color: "#e84a4a", background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}><Trash2 size={14} /></button>
                                    </Reorder.Item>
                                  ))}
                                </Reorder.Group>
                              ) : (
                                <p style={{ fontSize: "0.8rem", color: "#9a9690", fontStyle: "italic", margin: "0 0 1rem" }}>No subcategories added.</p>
                              )}
                              <button onClick={() => addSubcategory(topLevel._id, cat._id)} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", color: "#5D0017", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500 }}>
                                <Plus size={14} /> Add Subcategory
                              </button>
                            </div>
                          )}
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <p style={{ fontSize: "0.9rem", color: "#9a9690", fontStyle: "italic", margin: "0 0 1rem" }}>No categories added to this department.</p>
                  )}
                  <button onClick={() => addCategory(topLevel._id)} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", color: "#5D0017", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500, marginTop: "0.5rem" }}>
                    <Plus size={16} /> Add Category
                  </button>
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <button onClick={addTopLevel} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", background: "#fff", border: "1px dashed #c8c4bf", borderRadius: "6px", color: "#1a1a18", cursor: "pointer", fontSize: "0.95rem", fontWeight: 500, width: "100%", justifyContent: "center", marginTop: "1rem" }}>
          <Plus size={18} /> Add New Department
        </button>
      </div>
    </div>
  );
}

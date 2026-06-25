"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Tag = { id: string; name: string; productCount: number };

export default function TagLibraryPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modals / Actions
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [mergingTag, setMergingTag] = useState<Tag | null>(null);
  
  const [editName, setEditName] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    const res = await fetch("/api/tags");
    const json = await res.json();
    if (json.success) setTags(json.data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag? It will be removed from all products.")) return;
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    fetchTags();
  };

  const handleSaveRename = async () => {
    if (!editingTag || !editName.trim()) return;
    await fetch(`/api/tags/${editingTag.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName })
    });
    setEditingTag(null);
    fetchTags();
  };

  const handleSaveMerge = async () => {
    if (!mergingTag || !mergeTargetId) return;
    await fetch(`/api/tags/${mergingTag.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "merge", targetId: mergeTargetId })
    });
    setMergingTag(null);
    fetchTags();
  };

  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: 0, letterSpacing: "0.02em" }}>
          Tag Library
        </h1>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "1.5rem", borderRadius: "2px", marginBottom: "2rem" }}>
        <input 
          type="text" 
          placeholder="Search tags..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#9a9690", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Loading tags...
        </div>
      ) : (
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e4df", color: "#6b6865", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                <th style={{ padding: "1rem" }}>Tag Name</th>
                <th style={{ padding: "1rem" }}>Products</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTags.map(tag => (
                <tr key={tag.id} style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "1rem", color: "#1a1a18" }}>
                    <span style={{ background: "#f0ede8", padding: "0.25rem 0.5rem", borderRadius: "2px" }}>{tag.name}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "#6b6865" }}>
                    {tag.productCount}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button onClick={() => { setEditingTag(tag); setEditName(tag.name); }} style={{ background: "none", border: "none", color: "#1a1a18", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}>Rename</button>
                    <button onClick={() => setMergingTag(tag)} style={{ background: "none", border: "none", color: "#1a1a18", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}>Merge</button>
                    <button onClick={() => handleDelete(tag.id)} style={{ background: "none", border: "none", color: "#7c2a00", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredTags.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem" }}>
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Rename Modal */}
      {editingTag && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", padding: "2rem", width: "400px", borderRadius: "2px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 300, margin: "0 0 1rem" }}>Rename Tag</h2>
            <input 
              value={editName}
              onChange={e => setEditName(e.target.value)}
              style={{ width: "100%", padding: "0.85rem", border: "1px solid #ccc9c4", marginBottom: "1.5rem" }}
            />
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button onClick={() => setEditingTag(null)} style={{ padding: "0.5rem 1rem", background: "none", border: "1px solid #ccc9c4", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveRename} style={{ padding: "0.5rem 1rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {mergingTag && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", padding: "2rem", width: "400px", borderRadius: "2px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 300, margin: "0 0 1rem" }}>Merge Tag</h2>
            <p style={{ fontSize: "0.85rem", color: "#6b6865", marginBottom: "1rem" }}>
              Merge <strong>{mergingTag.name}</strong> into another tag. The source tag will be deleted, and all its products will be assigned the target tag.
            </p>
            <select 
              value={mergeTargetId}
              onChange={e => setMergeTargetId(e.target.value)}
              style={{ width: "100%", padding: "0.85rem", border: "1px solid #ccc9c4", marginBottom: "1.5rem" }}
            >
              <option value="">Select target tag...</option>
              {tags.filter(t => t.id !== mergingTag.id).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button onClick={() => setMergingTag(null)} style={{ padding: "0.5rem 1rem", background: "none", border: "1px solid #ccc9c4", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveMerge} disabled={!mergeTargetId} style={{ padding: "0.5rem 1rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", opacity: mergeTargetId ? 1 : 0.5 }}>Merge</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

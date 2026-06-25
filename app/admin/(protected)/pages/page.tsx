"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PageMetadata = {
  id: string;
  title: string;
  slug: string;
  status: string;
  template: string;
  mode?: string;
  lastUpdated: string;
};

export default function PagesDashboard() {
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newTemplate, setNewTemplate] = useState("Custom Page");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const json = await res.json();
      if (json.success) {
        setPages(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleStatusChange = async (slug: string, newStatus: string) => {
    setPages(pages.map(p => p.slug === slug ? { ...p, status: newStatus } : p));
    try {
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleModeChange = async (slug: string, newMode: string) => {
    setPages(pages.map(p => p.slug === slug ? { ...p, mode: newMode } : p));
    try {
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, mode: newMode })
      });
    } catch (err) {
      console.error("Failed to update mode", err);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
    setNewSlug(generateSlug(e.target.value));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) return;
    setIsCreating(true);

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, slug: newSlug, template: newTemplate })
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/admin/pages/${newSlug}`);
      } else {
        alert(json.error || "Failed to create page");
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500, color: "#1a1a18", margin: "0 0 0.5rem" }}>Pages</h1>
          <p style={{ color: "#6b6865", margin: 0, fontSize: "0.9rem" }}>Manage dynamic pages across your storefront.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "#1a1a18",
            color: "#ffffff",
            border: "none",
            padding: "0.8rem 1.5rem",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: "2px"
          }}
        >
          Create Page
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#6b6865" }}>Loading pages...</div>
      ) : (
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "4px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e8e4df" }}>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18" }}>Title</th>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18" }}>URL</th>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18" }}>Template</th>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18" }}>Status</th>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18" }}>Page Mode</th>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18" }}>Last Updated</th>
                <th style={{ padding: "1.2rem 1.5rem", fontWeight: 500, color: "#1a1a18", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s ease" }} onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#1a1a18", fontWeight: 500 }}>
                    {page.title}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: "#6b6865", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                      /{page.slug}
                    </a>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>
                    {page.template}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <select
                      value={page.status}
                      onChange={(e) => handleStatusChange(page.slug, e.target.value)}
                      style={{ 
                        padding: "0.4rem 0.8rem", 
                        borderRadius: "16px", 
                        fontSize: "0.75rem",
                        background: page.status === "Published" ? "#e6f4ea" : page.status === "Archived" ? "#fce8e6" : "#f1f3f4",
                        color: page.status === "Published" ? "#137333" : page.status === "Archived" ? "#c5221f" : "#3c4043",
                        border: "1px solid transparent",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        fontWeight: 500,
                        textAlign: "center",
                        minWidth: "80px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.border = "1px solid #dcdcdc"}
                      onMouseLeave={(e) => e.currentTarget.style.border = "1px solid transparent"}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    {page.slug === "about-us" ? (
                      <select
                        value={page.mode || "classic"}
                        onChange={(e) => handleModeChange(page.slug, e.target.value)}
                        style={{ 
                          padding: "0.4rem 0.8rem", 
                          borderRadius: "2px", 
                          fontSize: "0.75rem",
                          background: "#ffffff",
                          color: "#1a1a18",
                          border: "1px solid #e8e4df",
                          cursor: "pointer",
                          outline: "none",
                          fontWeight: 500,
                        }}
                      >
                        <option value="classic">Classic</option>
                        <option value="motion">Motion Experience</option>
                      </select>
                    ) : (
                      <span style={{ color: "#9a9690", fontSize: "0.85rem" }}>Classic</span>
                    )}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>
                    {new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                    <Link href={`/admin/pages/${page.slug}${page.mode === 'motion' ? '?mode=motion' : ''}`}>
                      <button style={{
                        background: "transparent",
                        border: "1px solid #e8e4df",
                        padding: "0.4rem 1rem",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        borderRadius: "2px",
                        color: "#1a1a18",
                      }}>
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "4rem", textAlign: "center", color: "#6b6865" }}>
                    No pages found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26,26,24,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
        }}>
          <div style={{
            background: "#ffffff", padding: "2.5rem", borderRadius: "4px",
            width: "100%", maxWidth: "480px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: 500 }}>Create New Page</h2>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", color: "#6b6865" }}>Page Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={handleTitleChange} 
                  required
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem" }}
                  placeholder="e.g. Terms & Conditions"
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", color: "#6b6865" }}>URL Slug</label>
                <input 
                  type="text" 
                  value={newSlug} 
                  onChange={e => setNewSlug(e.target.value)} 
                  required
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem" }}
                />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", color: "#6b6865" }}>Template</label>
                <select 
                  value={newTemplate}
                  onChange={e => setNewTemplate(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem", background: "white" }}
                >
                  <option value="Editorial Page">Editorial Page</option>
                  <option value="Legal Page">Legal Page</option>
                  <option value="Contact Page">Contact Page</option>
                  <option value="Campaign Page">Campaign Page</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Custom Page">Custom Page</option>
                </select>
              </div>
              
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "0.8rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", color: "#6b6865" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  style={{
                    background: "#1a1a18", color: "#ffffff", border: "none",
                    padding: "0.8rem 2rem", cursor: isCreating ? "not-allowed" : "pointer", borderRadius: "2px"
                  }}
                >
                  {isCreating ? "Creating..." : "Create Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

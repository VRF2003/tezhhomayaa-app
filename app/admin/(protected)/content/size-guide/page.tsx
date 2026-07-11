"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UniversalRichEditor } from "@/components/admin/UniversalRichEditor";

export default function GlobalSizeGuideAdmin() {
  const [data, setData] = useState({ women: "", men: "", unisex: "" });
  const [activeTab, setActiveTab] = useState<"women" | "men" | "unisex">("women");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/size-guide?t=${Date.now()}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setData({
            women: res.data.women || "",
            men: res.data.men || "",
            unisex: res.data.unisex || "",
          });
        }
      })
      .catch(() => setError("Failed to load size guide."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/size-guide", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "#9a9690" }}>Loading size guide...</div>;
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/content" style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          ← Back to Content
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Global Size Guide
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#6b6865", margin: 0 }}>
            Configure default size guides based on department (Women, Men, Unisex).
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          style={{ 
            padding: "0.8rem 1.8rem", 
            background: "#1a1a18", 
            color: "#f7f5f2", 
            border: "none", 
            fontSize: "0.6rem", 
            letterSpacing: "0.15em", 
            textTransform: "uppercase", 
            cursor: saving ? "not-allowed" : "pointer", 
            borderRadius: "2px", 
            opacity: saving ? 0.7 : 1, 
            flexShrink: 0 
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <div style={{ background: "#fdf0f0", border: "1px solid #e0b8b8", padding: "0.75rem 1rem", color: "#6b3a3a", fontSize: "0.8rem", marginBottom: "1.25rem", borderRadius: "2px" }}>{error}</div>}
      {success && <div style={{ background: "#f0fdf4", border: "1px solid #bce3c5", padding: "0.75rem 1rem", color: "#2d6b3a", fontSize: "0.8rem", marginBottom: "1.25rem", borderRadius: "2px" }}>✓ Saved — changes are now live on the store.</div>}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid #e8e4df" }}>
        {(["women", "men", "unisex"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #1a1a18" : "2px solid transparent",
              color: activeTab === tab ? "#1a1a18" : "#9a9690",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: activeTab === tab ? 500 : 400
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
        <UniversalRichEditor 
          value={data[activeTab]} 
          onChange={(val) => setData(prev => ({ ...prev, [activeTab]: val }))} 
        />
      </div>
    </div>
  );
}

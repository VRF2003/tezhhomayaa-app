"use client";

import { useState, useEffect } from "react";

type HeaderSettings = {
  logoImage: string;
  desktopLogoWidth: number;
  mobileLogoWidth: number;
  logoLinkUrl: string;
  stickyHeader: boolean;
  transparentHeader: boolean;
};

export default function HeaderContentPage() {
  const [settings, setSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/header")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setSettings(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load header settings", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: keyof HeaderSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const json = await res.json();
      if (json.success) {
        setMessage("Header settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (err) {
      setMessage("Error saving settings.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "#6b6865" }}>Loading settings...</div>;
  }

  if (!settings) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "#6b6865" }}>Failed to load settings.</div>;
  }

  return (
    <div style={{ maxWidth: "800px", animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 500, color: "#1a1a18", margin: 0 }}>
          Header Settings
        </h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "#1a1a18",
            color: "#ffffff",
            border: "none",
            padding: "0.8rem 1.5rem",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: saving ? "not-allowed" : "pointer",
            borderRadius: "2px",
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: "1rem", 
          marginBottom: "2rem", 
          background: message.includes("success") ? "#e6f4ea" : "#fce8e6", 
          color: message.includes("success") ? "#137333" : "#c5221f",
          borderRadius: "4px",
          fontSize: "0.85rem"
        }}>
          {message}
        </div>
      )}

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "4px" }}>
        
        {/* Logo Image URL */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>Logo Image URL</label>
          <input 
            type="text" 
            value={settings.logoImage} 
            onChange={e => handleChange("logoImage", e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem" }}
          />
          <p style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "0.4rem" }}>Enter an absolute URL or a path (e.g. /branding/logo.png)</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Desktop Logo Width */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>Desktop Logo Width (px)</label>
            <input 
              type="number" 
              value={settings.desktopLogoWidth} 
              onChange={e => handleChange("desktopLogoWidth", parseInt(e.target.value) || 0)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem" }}
            />
          </div>

          {/* Mobile Logo Width */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>Mobile Logo Width (px)</label>
            <input 
              type="number" 
              value={settings.mobileLogoWidth} 
              onChange={e => handleChange("mobileLogoWidth", parseInt(e.target.value) || 0)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem" }}
            />
          </div>
        </div>

        {/* Logo Link URL */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>Logo Link URL</label>
          <input 
            type="text" 
            value={settings.logoLinkUrl} 
            onChange={e => handleChange("logoLinkUrl", e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", borderRadius: "2px", fontSize: "0.9rem" }}
          />
          <p style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "0.4rem" }}>The destination when a user clicks the logo. Default is /</p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e8e4df", margin: "2rem 0" }} />

        {/* Sticky Header Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>Sticky Header</label>
            <p style={{ fontSize: "0.75rem", color: "#9a9690", margin: "0.2rem 0 0" }}>Keep the header fixed at the top when scrolling down.</p>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: "40px", height: "24px" }}>
            <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={settings.stickyHeader} onChange={e => handleChange("stickyHeader", e.target.checked)} />
            <span style={{
              position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: settings.stickyHeader ? "#1a1a18" : "#e8e4df",
              transition: ".4s", borderRadius: "24px"
            }}>
              <span style={{
                position: "absolute", content: '""', height: "16px", width: "16px", left: "4px", bottom: "4px",
                backgroundColor: "white", transition: ".4s", borderRadius: "50%",
                transform: settings.stickyHeader ? "translateX(16px)" : "translateX(0)"
              }}/>
            </span>
          </label>
        </div>

        {/* Transparent Header Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>Transparent Header</label>
            <p style={{ fontSize: "0.75rem", color: "#9a9690", margin: "0.2rem 0 0" }}>Make the header background transparent when at the top of the page.</p>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: "40px", height: "24px" }}>
            <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={settings.transparentHeader} onChange={e => handleChange("transparentHeader", e.target.checked)} />
            <span style={{
              position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: settings.transparentHeader ? "#1a1a18" : "#e8e4df",
              transition: ".4s", borderRadius: "24px"
            }}>
              <span style={{
                position: "absolute", content: '""', height: "16px", width: "16px", left: "4px", bottom: "4px",
                backgroundColor: "white", transition: ".4s", borderRadius: "50%",
                transform: settings.transparentHeader ? "translateX(16px)" : "translateX(0)"
              }}/>
            </span>
          </label>
        </div>

      </div>
    </div>
  );
}

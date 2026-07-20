"use client";
import React, { useState } from "react";
import { PreviewService } from "@/lib/preview/services/PreviewService";
import { Observability } from "@/lib/infrastructure/observability";

export default function PreviewAdminDashboard() {
  const [market, setMarket] = useState("GLOBAL");
  const [language, setLanguage] = useState("en");
  const [dateStr, setDateStr] = useState("");
  const [draftsEnabled, setDraftsEnabled] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerate = async () => {
    // In a real app we would call a server action, but for the architecture 
    // demo we can call the service directly or an API. 
    // We'll simulate the API call here to get the signed URL.
    try {
      const res = await fetch("/api/preview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: market,
          languageCode: language,
          previewDate: dateStr ? new Date(dateStr).toISOString() : undefined,
          draftContentEnabled: draftsEnabled
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedLink(window.location.origin + data.url);
      }
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(e);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Experience Preview
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Generate securely signed preview links to simulate Time Travel and Drafts.
          </p>
        </div>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Simulate Market</label>
            <select value={market} onChange={e => setMarket(e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontFamily: "inherit" }}>
              <option value="GLOBAL">Global Fallback</option>
              <option value="mkt_bh">Bahrain</option>
              <option value="mkt_ae">UAE</option>
              <option value="mkt_sg">Singapore</option>
              <option value="mkt_in">India</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Simulate Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontFamily: "inherit" }}>
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Time Travel (Date & Time)</label>
            <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontFamily: "inherit" }} />
            <div style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "0.5rem" }}>Leave blank to use current time.</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Content Visibility</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <input type="checkbox" id="drafts" checked={draftsEnabled} onChange={e => setDraftsEnabled(e.target.checked)} />
              <label htmlFor="drafts" style={{ fontSize: "0.85rem", color: "#1a1a18" }}>Enable Draft Campaigns & Unpublished Assets</label>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e8e4df", paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={handleGenerate} style={{ 
            background: "#1a1a18", color: "#ffffff", padding: "1rem", border: "none", width: "fit-content",
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
          }}>
            Generate Secure Link
          </button>
          
          {generatedLink && (
            <div style={{ padding: "1.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", marginTop: "1rem" }}>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: "bold" }}>Your Signed Preview URL (Valid for 2 Hours)</div>
              <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ wordBreak: "break-all", textDecoration: "underline", color: "#166534" }}>{generatedLink}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

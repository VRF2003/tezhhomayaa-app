import React from "react";
import { RuntimeContextBuilder } from "@/lib/preview/services/RuntimeContextBuilder";

export async function PreviewBanner() {
  const runtime = await RuntimeContextBuilder.build();
  
  if (!runtime.isPreview) return null;
  
  const payload = await RuntimeContextBuilder.getPreviewPayload();
  const expDate = payload ? new Date(payload.exp).toLocaleTimeString() : "";

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#1a1a18",
      color: "#ffffff",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      fontFamily: "monospace",
      fontSize: "0.8rem",
      border: "1px solid #3f3f3f"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #3f3f3f", paddingBottom: "0.5rem", marginBottom: "0.2rem" }}>
        <strong style={{ letterSpacing: "0.1em", textTransform: "uppercase", color: "#f59e0b" }}>⚠️ Preview Mode Active</strong>
        <a href="/api/preview/disable" style={{ color: "#9ca3af", textDecoration: "none", cursor: "pointer", marginLeft: "1rem" }}>✕ Exit</a>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem" }}>
        <span style={{ color: "#9ca3af" }}>Simulated Time:</span>
        <span>{runtime.currentDate.toLocaleString()}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem" }}>
        <span style={{ color: "#9ca3af" }}>Draft Visibility:</span>
        <span>{runtime.draftContentEnabled ? "ENABLED" : "DISABLED"}</span>
      </div>
      {payload?.marketId && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem" }}>
          <span style={{ color: "#9ca3af" }}>Market Override:</span>
          <span>{payload.marketId}</span>
        </div>
      )}
      {payload?.languageCode && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem" }}>
          <span style={{ color: "#9ca3af" }}>Lang Override:</span>
          <span>{payload.languageCode}</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem", marginTop: "0.5rem", borderTop: "1px dashed #3f3f3f", paddingTop: "0.5rem" }}>
        <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>Session expires at {expDate}</span>
      </div>
    </div>
  );
}

import React from "react";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { ISeoRepository } from "@/lib/seo/repositories/ISeoRepository";

export const dynamic = "force-dynamic";

export default async function SeoAdminDashboard() {
  const repo = RepositoryResolver.resolve<ISeoRepository>("ISeoRepository");
  const seoItems = await repo.findAll();

  // Sort newest first
  seoItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" };
      case "DRAFT": return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
      case "ARCHIVED": return { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
      default: return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Localized SEO Engine
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Manage market-aware metadata, canonicals, and structured data.
          </p>
        </div>
        <button style={{ 
          background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", 
          fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
        }}>
          + New SEO Rule
        </button>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
          <input 
            type="text" 
            placeholder="Search by slug or title..." 
            style={{ 
              width: "100%", maxWidth: "400px", padding: "0.8rem 1rem", border: "1px solid #e8e4df", 
              fontSize: "0.85rem", fontFamily: "inherit" 
            }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Route Slug</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Market Targeting</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Meta Title</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500, textAlign: "right" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {seoItems.map(item => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e8e4df" }}>
                <td style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.95rem", color: "#1a1a18", fontWeight: 500, fontFamily: "monospace" }}>
                    /{item.slug}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "0.3rem" }}>
                    {item.structuredData ? "JSON-LD Included" : "Standard Metadata"}
                  </div>
                </td>
                <td style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>
                    {item.marketId === "GLOBAL" ? "Global (Fallback)" : 
                     item.marketId === "REGION" ? `Region: ${item.regionId}` : 
                     `Market: ${item.marketId}`}
                  </div>
                </td>
                <td style={{ padding: "1.5rem" }}>
                  <span style={{ 
                    fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", 
                    textTransform: "uppercase", 
                    background: getStatusColor(item.status).bg, 
                    color: getStatusColor(item.status).color, 
                    border: `1px solid ${getStatusColor(item.status).border}` 
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>{item.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b6865", marginTop: "0.3rem", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.description}
                  </div>
                </td>
                <td style={{ padding: "1.5rem", textAlign: "right" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#1a1a18" }}>{item.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

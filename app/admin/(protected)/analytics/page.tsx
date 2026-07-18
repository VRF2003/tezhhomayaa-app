export const dynamic = "force-dynamic";
import React from "react";
import { aggAnalyticsRepo } from "@/lib/analytics";

export default async function AnalyticsDashboard() {
  // In a real application, we might pass filters from searchParams
  const report = await aggAnalyticsRepo.getDashboardReport();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Experience Analytics
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Aggregated insights for Localized Experiences (Observer Only).
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Total Views</div>
          <div style={{ fontSize: "3rem", fontWeight: 300, color: "#1a1a18" }}>{report.totalViews}</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Preview Activity</div>
          <div style={{ fontSize: "3rem", fontWeight: 300, color: "#f59e0b" }}>{report.previewActivity}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: "0 0 1.5rem 0", borderBottom: "1px solid #e8e4df", paddingBottom: "1rem" }}>Top Markets</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {Object.entries(report.viewsByMarket).sort((a,b) => b[1] - a[1]).map(([market, views]) => (
              <li key={market} style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px dashed #f0f0f0" }}>
                <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{market}</span>
                <span style={{ fontWeight: "bold" }}>{views}</span>
              </li>
            ))}
            {Object.keys(report.viewsByMarket).length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No market data yet.</div>
            )}
          </ul>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: "0 0 1.5rem 0", borderBottom: "1px solid #e8e4df", paddingBottom: "1rem" }}>Top Campaigns</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {Object.entries(report.viewsByCampaign).sort((a,b) => b[1] - a[1]).map(([campaign, views]) => (
              <li key={campaign} style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px dashed #f0f0f0" }}>
                <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{campaign}</span>
                <span style={{ fontWeight: "bold" }}>{views}</span>
              </li>
            ))}
            {Object.keys(report.viewsByCampaign).length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No campaign data yet.</div>
            )}
          </ul>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: "0 0 1.5rem 0", borderBottom: "1px solid #e8e4df", paddingBottom: "1rem" }}>Top Sections</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {Object.entries(report.viewsBySection).sort((a,b) => b[1] - a[1]).map(([section, views]) => (
              <li key={section} style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px dashed #f0f0f0" }}>
                <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{section}</span>
                <span style={{ fontWeight: "bold" }}>{views}</span>
              </li>
            ))}
            {Object.keys(report.viewsBySection).length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No section data yet.</div>
            )}
          </ul>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: "0 0 1.5rem 0", borderBottom: "1px solid #e8e4df", paddingBottom: "1rem" }}>Top Languages</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {Object.entries(report.viewsByLanguage).sort((a,b) => b[1] - a[1]).map(([lang, views]) => (
              <li key={lang} style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px dashed #f0f0f0" }}>
                <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{lang}</span>
                <span style={{ fontWeight: "bold" }}>{views}</span>
              </li>
            ))}
            {Object.keys(report.viewsByLanguage).length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No language data yet.</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

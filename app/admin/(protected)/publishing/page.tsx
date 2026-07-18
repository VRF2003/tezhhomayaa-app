export const dynamic = "force-dynamic";
import React from "react";
import { lifecycleRepo } from "@/lib/lifecycle";

export default async function PublishingDashboard() {
  const publishedPkgs = await lifecycleRepo.getPackagesByState("PUBLISHED");
  const reviewPkgs = await lifecycleRepo.getPackagesByState("IN_REVIEW");
  const scheduledPkgs = await lifecycleRepo.getPackagesByState("SCHEDULED");
  const auditLogs = await lifecycleRepo.getAuditLog();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Publishing Governance
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Experience Lifecycle & Publishing Platform (ELPP) Control Plane.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>In Review</div>
          <div style={{ fontSize: "3rem", fontWeight: 300, color: "#f59e0b" }}>{reviewPkgs.length}</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Scheduled</div>
          <div style={{ fontSize: "3rem", fontWeight: 300, color: "#3b82f6" }}>{scheduledPkgs.length}</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Live Packages</div>
          <div style={{ fontSize: "3rem", fontWeight: 300, color: "#10b981" }}>{publishedPkgs.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
        {/* Active Queues */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: "0 0 1.5rem 0", borderBottom: "1px solid #e8e4df", paddingBottom: "1rem" }}>
            Active Queues
          </h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {[...reviewPkgs, ...scheduledPkgs].map(pkg => (
              <li key={pkg.packageId} style={{ padding: "1rem", border: "1px solid #f0f0f0", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <strong>{pkg.name}</strong>
                  <span style={{ fontSize: "0.75rem", background: pkg.state === "IN_REVIEW" ? "#fef3c7" : "#dbeafe", color: pkg.state === "IN_REVIEW" ? "#92400e" : "#1e40af", padding: "0.2rem 0.5rem", borderRadius: "10px" }}>
                    {pkg.state}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  Contains {pkg.entities.length} entities (v{pkg.versionNumber})
                </div>
              </li>
            ))}
            {reviewPkgs.length === 0 && scheduledPkgs.length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No packages in queue.</div>
            )}
          </ul>
        </div>

        {/* Global Audit Log */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: "0 0 1.5rem 0", borderBottom: "1px solid #e8e4df", paddingBottom: "1rem" }}>
            Global Audit Ledger
          </h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {auditLogs.slice(0, 5).map(log => (
              <li key={log.auditId} style={{ padding: "0.8rem 0", borderBottom: "1px dashed #f0f0f0", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontWeight: "bold" }}>{log.actor}</span>
                  <span style={{ color: "#9ca3af" }}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ color: "#4b5563" }}>
                  Moved <code style={{ background: "#f3f4f6", padding: "0.1rem 0.3rem" }}>{log.targetId}</code> from {log.previousState} to <strong>{log.newState}</strong>
                </div>
                <div style={{ color: "#6b7280", marginTop: "0.2rem", fontStyle: "italic" }}>
                  "{log.reason}"
                </div>
              </li>
            ))}
            {auditLogs.length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No audit logs recorded yet.</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

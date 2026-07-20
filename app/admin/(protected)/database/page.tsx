"use client";

import React, { useEffect, useState } from "react";
import { FiDatabase, FiHardDrive, FiActivity, FiLayers, FiCheckCircle } from "react-icons/fi";

export default function DatabaseDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/database")
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading dashboard...</div>;
  }

  if (!data) {
    return <div style={{ padding: "2rem" }}>Failed to load dashboard.</div>;
  }

  const { activeProvider, migrations, health, cacheMetrics } = data;

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e8e4df",
    borderRadius: "8px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem"
  };

  const titleStyle = {
    fontSize: "0.85rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#6b6865",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const valueStyle = {
    fontSize: "1.75rem",
    fontWeight: 500,
    color: "#1a1a18",
    margin: 0
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.5rem" }}>
          Enterprise Persistence Platform
        </h1>
        <p style={{ color: "#6b6865", margin: 0 }}>Monitor system health, migrations, and active persistence drivers.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        {/* Active Provider */}
        <div style={cardStyle}>
          <h2 style={titleStyle}><FiDatabase /> Active Provider</h2>
          <p style={valueStyle}>{activeProvider}</p>
          <p style={{ fontSize: "0.85rem", color: "#28a745", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <FiCheckCircle /> Connected
          </p>
        </div>

        {/* System Health */}
        <div style={cardStyle}>
          <h2 style={titleStyle}><FiActivity /> System Health</h2>
          <p style={valueStyle}>{health.status}</p>
          <p style={{ fontSize: "0.85rem", color: "#6b6865", margin: 0 }}>
            Uptime: {Math.floor(health.uptime / 60)} minutes
          </p>
        </div>

        {/* Cache Hit Rate */}
        <div style={cardStyle}>
          <h2 style={titleStyle}><FiHardDrive /> Cache Hit Rate</h2>
          <p style={valueStyle}>{(cacheMetrics.hitRate * 100).toFixed(1)}%</p>
          <p style={{ fontSize: "0.85rem", color: "#6b6865", margin: 0 }}>
            {cacheMetrics.hits} hits / {cacheMetrics.misses} misses
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 400, margin: "0 0 1.5rem" }}>Migration History</h2>
      
      <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e8e4df" }}>
              <th style={{ padding: "1rem", fontWeight: 500, color: "#6b6865" }}>Version</th>
              <th style={{ padding: "1rem", fontWeight: 500, color: "#6b6865" }}>Migration Name</th>
              <th style={{ padding: "1rem", fontWeight: 500, color: "#6b6865" }}>Executed At</th>
              <th style={{ padding: "1rem", fontWeight: 500, color: "#6b6865" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {migrations.map((m: any, i: number) => (
              <tr key={i} style={{ borderBottom: i === migrations.length - 1 ? "none" : "1px solid #e8e4df" }}>
                <td style={{ padding: "1rem", fontFamily: "var(--font-dm-mono, monospace)" }}>v{m.version}</td>
                <td style={{ padding: "1rem" }}>{m.name}</td>
                <td style={{ padding: "1rem", color: "#6b6865" }}>{new Date(m.executedAt).toLocaleString()}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.25rem 0.5rem", borderRadius: "100px",
                    background: m.status === "COMPLETED" ? "#e6f4ea" : "#fce8e6",
                    color: m.status === "COMPLETED" ? "#137333" : "#c5221f",
                    fontSize: "0.75rem", fontWeight: 500
                  }}>
                    {m.status === "COMPLETED" ? <FiCheckCircle /> : null} {m.status}
                  </span>
                </td>
              </tr>
            ))}
            {migrations.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#6b6865" }}>
                  No migrations have been recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

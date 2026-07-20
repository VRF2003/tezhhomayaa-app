"use client";

import React, { useEffect, useState } from "react";
import { FiActivity, FiAlertTriangle, FiList, FiClock, FiLock } from "react-icons/fi";

export default function ObservabilityDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("LOGS");

  useEffect(() => {
    const fetchObservability = () => {
      fetch("/api/admin/observability")
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setData(res.data);
          }
        })
        .finally(() => setLoading(false));
    };

    fetchObservability();
    const interval = setInterval(fetchObservability, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <div style={{ padding: "2rem" }}>Loading observability platform...</div>;
  }

  const { logs, metrics, alerts, audits, spans } = data || { logs:[], metrics:[], alerts:[], audits:[], spans:[] };

  const tabs = [
    { id: "LOGS", label: "Live Logs", icon: <FiList /> },
    { id: "METRICS", label: "Metrics", icon: <FiActivity /> },
    { id: "ALERTS", label: "Alerts", icon: <FiAlertTriangle /> },
    { id: "AUDITS", label: "Audit Trail", icon: <FiLock /> },
    { id: "TRACES", label: "Tracing", icon: <FiClock /> },
  ];

  const renderTabNav = () => (
    <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #e8e4df", marginBottom: "2rem" }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === t.id ? "2px solid #1a1a18" : "2px solid transparent",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: activeTab === t.id ? "#1a1a18" : "#6b6865",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "-1px"
          }}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: "1200px" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.5rem" }}>
          Enterprise Observability Platform
        </h1>
        <p style={{ color: "#6b6865", margin: 0 }}>Monitor real-time system health, logs, and distributed traces.</p>
      </header>

      {renderTabNav()}

      <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "8px", overflow: "hidden" }}>
        
        {activeTab === "LOGS" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e8e4df", color: "#6b6865" }}>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Time</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Severity</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Domain / Operation</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Message</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Correlation ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l: any, i: number) => (
                <tr key={i} style={{ borderBottom: i === logs.length - 1 ? "none" : "1px solid #e8e4df", fontFamily: "var(--font-dm-mono, monospace)" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "#9a9690" }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                  <td style={{ padding: "0.75rem 1rem", color: l.severity === "ERROR" ? "#c5221f" : l.severity === "WARN" ? "#f29900" : "#1a1a18" }}>
                    {l.severity}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6b6865" }}>{l.domain}::{l.operation}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{l.message}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#9a9690", fontSize: "0.7rem" }}>{l.correlationId?.substring(0, 8) || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "METRICS" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e8e4df", color: "#6b6865" }}>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Time</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Type</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Name</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m: any, i: number) => (
                <tr key={i} style={{ borderBottom: i === metrics.length - 1 ? "none" : "1px solid #e8e4df", fontFamily: "var(--font-dm-mono, monospace)" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "#9a9690" }}>{new Date(m.timestamp).toLocaleTimeString()}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{m.type}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6b6865" }}>{m.name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{m.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "ALERTS" && (
          <div style={{ padding: "2rem", color: "#6b6865" }}>
            {alerts.length === 0 ? "No active alerts." : JSON.stringify(alerts, null, 2)}
          </div>
        )}

        {activeTab === "AUDITS" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e8e4df", color: "#6b6865" }}>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Time</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Actor</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Action</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Resource</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a: any, i: number) => (
                <tr key={i} style={{ borderBottom: i === audits.length - 1 ? "none" : "1px solid #e8e4df", fontFamily: "var(--font-dm-mono, monospace)" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "#9a9690" }}>{new Date(a.timestamp).toLocaleTimeString()}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{a.actorId}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6b6865" }}>{a.action}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{a.resourceType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "TRACES" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e8e4df", color: "#6b6865" }}>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Span Name</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Duration</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>Trace ID</th>
              </tr>
            </thead>
            <tbody>
              {spans.map((s: any, i: number) => (
                <tr key={i} style={{ borderBottom: i === spans.length - 1 ? "none" : "1px solid #e8e4df", fontFamily: "var(--font-dm-mono, monospace)" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{s.name}</td>
                  <td style={{ padding: "0.75rem 1rem", color: s.status === "OK" ? "#137333" : "#c5221f" }}>{s.status}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6b6865" }}>{s.durationMs}ms</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#9a9690", fontSize: "0.7rem" }}>{s.traceId?.substring(0, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

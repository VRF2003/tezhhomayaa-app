"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDateFormatter, useTimeFormatter } from "@/lib/global-experience/formatters";

interface Subscriber {
  email: string;
  subscribedAt: string;
  source: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const dateFormatter = useDateFormatter();
  const timeFormatter = useTimeFormatter();

  const load = () => {
    setLoading(true);
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setSubscribers(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    await fetch("/api/newsletter", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    load();
  };

  const handleExport = () => {
    const csv = [
      "Email,Subscribed At,Source",
      ...subscribers.map(
        (s) => `${s.email},${timeFormatter.formatDateTime(s.subscribedAt)},${s.source}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tezhhomayaa-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const label: React.CSSProperties = {
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#6b6865",
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Newsletter Subscribers
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            {loading ? "Loading..." : `${subscribers.length} subscriber${subscribers.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={handleExport}
            disabled={subscribers.length === 0}
            style={{ padding: "0.6rem 1.5rem", background: "transparent", color: "#1a1a18", border: "1px solid #1a1a18", borderRadius: "2px", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "0.85rem 1rem", border: "1px solid #e8e4df", background: "#fff", fontSize: "0.9rem", outline: "none", borderRadius: "2px" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "1rem 1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
          <span style={label}>Email Address</span>
          <span style={{ ...label, textAlign: "right", minWidth: "160px" }}>Subscribed</span>
          <span style={{ ...label, minWidth: "60px" }}></span>
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#9a9690", fontSize: "0.9rem" }}>
            Loading subscribers...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <p style={{ color: "#9a9690", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              {search ? "No subscribers match your search." : "No subscribers yet."}
            </p>
            {!search && (
              <p style={{ color: "#c8c4bf", fontSize: "0.8rem" }}>
                Subscribers will appear here once someone signs up via the footer newsletter block.
              </p>
            )}
          </div>
        ) : (
          filtered.map((sub, i) => (
            <div
              key={sub.email}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                padding: "1rem 1.5rem",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid #f0ece6" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: "0.9rem", color: "#1a1a18" }}>{sub.email}</span>
              <span style={{ fontSize: "0.8rem", color: "#7a7874", textAlign: "right", minWidth: "160px" }}>
                {dateFormatter.formatShortDate(sub.subscribedAt)}
              </span>
              <div style={{ minWidth: "60px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleDelete(sub.email)}
                  style={{ background: "none", border: "none", color: "#c8a0a0", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.05em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#a55")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#c8a0a0")}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "1rem", textAlign: "right" }}>
          Showing {filtered.length} of {subscribers.length}
        </p>
      )}
    </div>
  );
}

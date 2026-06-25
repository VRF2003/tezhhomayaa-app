"use client";

import { useState, useCallback } from "react";
import { useAdminUser } from "@/lib/admin-auth";

type ImportResult = {
  success: boolean;
  count?: number;
  categories?: Record<string, number>;
  error?: string;
};

export default function ImportPage() {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const user = useAdminUser();

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setResult({ success: false, error: "Please upload a CSV file (.csv). Export it from Shopify Admin → Products → Export." });
      return;
    }

    setFileName(file.name);
    setStatus("loading");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import-csv", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("done");
        setResult(data);
      } else {
        setStatus("error");
        setResult({ success: false, error: data.error || "Import failed. Please check the CSV format." });
      }
    } catch {
      setStatus("error");
      setResult({ success: false, error: "Network error — make sure the dev server is running." });
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
        Shopify Product Import
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#7a7874", marginBottom: "3rem" }}>
        Upload your Shopify product export CSV to automatically populate all category and product pages.
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          width: "100%",
          border: `1.5px dashed ${dragging ? "#1a1a18" : "#ccc9c4"}`,
          borderRadius: "2px",
          padding: "3.5rem 2rem",
          textAlign: "center",
          background: dragging ? "#f0ede8" : "#ffffff",
          transition: "all 0.3s ease",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
        onClick={() => document.getElementById("csv-file-input")?.click()}
      >
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={onFileInput}
        />

        <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.5 }}>↑</div>

        {fileName ? (
          <p style={{ fontSize: "0.9rem", color: "#1a1a18", margin: 0, fontWeight: 500 }}>
            {fileName}
          </p>
        ) : (
          <>
            <p style={{ fontSize: "1rem", color: "#3a3835", margin: "0 0 0.5rem", fontWeight: 400 }}>
              Drop your Shopify CSV here
            </p>
            <p style={{ fontSize: "0.75rem", color: "#9a9690", margin: 0 }}>
              or click to browse files
            </p>
          </>
        )}
      </div>

      {/* How to export instructions */}
      {status === "idle" && (
        <div style={{
          width: "100%",
          background: "#f7f5f2",
          border: "1px solid #e8e4df",
          padding: "1.5rem",
          borderRadius: "2px",
          marginBottom: "2rem",
        }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", margin: "0 0 0.75rem" }}>
            HOW TO EXPORT FROM SHOPIFY
          </p>
          <ol style={{ fontSize: "0.82rem", color: "#6b6865", lineHeight: 2, margin: 0, paddingLeft: "1.2rem" }}>
            <li>Go to Shopify Admin → Products</li>
            <li>Click <strong>Export</strong> (top right)</li>
            <li>Choose <em>All products</em> and format <em>CSV for Excel, Numbers, or other spreadsheet programs</em></li>
            <li>Click <strong>Export products</strong></li>
            <li>Upload the downloaded <code>.csv</code> file here</li>
          </ol>
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "1px solid #1a1a18",
            borderTop: "1px solid transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }} />
          <p style={{ color: "#6b6865", fontSize: "0.85rem" }}>Importing products…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Success */}
      {status === "done" && result?.success && (
        <div style={{
          width: "100%",
          background: "#f0f7f0",
          border: "1px solid #b8d9b8",
          padding: "2rem",
          borderRadius: "2px",
        }}>
          <p style={{ fontSize: "1rem", color: "#1a4d1a", fontWeight: 500, margin: "0 0 1rem" }}>
            ✓ {result.count} products imported successfully
          </p>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4d7a4d", margin: "0 0 0.75rem" }}>
            Category Breakdown
          </p>
          {result.categories && Object.entries(result.categories).map(([cat, count]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#3a5a3a", padding: "0.2rem 0", borderBottom: "1px solid #c8e0c8" }}>
              <span>/{cat}</span>
              <span>{count} products</span>
            </div>
          ))}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a href="/" style={{ padding: "0.75rem 1.5rem", background: "#1a1a18", color: "#f7f5f2", textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              View Site
            </a>
            <button
              onClick={() => { setStatus("idle"); setFileName(null); setResult(null); }}
              style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid #1a1a18", color: "#1a1a18", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Import Another
            </button>
          </div>
          <p style={{ fontSize: "0.72rem", color: "#4d7a4d", marginTop: "1rem" }}>
            Restart the dev server if new product pages are not showing: <code>npm run dev</code>
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && result && (
        <div style={{
          width: "100%",
          background: "#fdf0f0",
          border: "1px solid #e0b8b8",
          padding: "2rem",
          borderRadius: "2px",
        }}>
          <p style={{ fontSize: "1rem", color: "#4d1a1a", fontWeight: 500, margin: "0 0 0.5rem" }}>
            ✕ Import failed
          </p>
          <p style={{ fontSize: "0.85rem", color: "#6b3a3a", margin: "0 0 1.5rem" }}>{result.error}</p>
          <button
            onClick={() => { setStatus("idle"); setFileName(null); setResult(null); }}
            style={{ padding: "0.75rem 1.5rem", background: "#1a1a18", color: "#f7f5f2", border: "none", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

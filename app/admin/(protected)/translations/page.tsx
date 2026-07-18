import React from "react";
import { InMemoryTranslationRepository } from "@/lib/translations/repositories/InMemoryTranslationRepository";
import { TranslationService } from "@/lib/translations/services/TranslationService";

export const dynamic = "force-dynamic";

export default async function TranslationsAdminDashboard() {
  const repo = new InMemoryTranslationRepository();
  const service = new TranslationService(repo);
  const sets = await repo.findAll();

  // Sort newest first
  sets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
            Translation Management
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Manage namespaced UI strings, language overrides, and placeholder interpolations.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{ 
            background: "transparent", color: "#1a1a18", padding: "0.8rem 1.5rem", border: "1px solid #1a1a18", 
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
          }}>
            Import XLIFF
          </button>
          <button style={{ 
            background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", 
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
          }}>
            + New Translation Set
          </button>
        </div>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8", display: "flex", gap: "1rem" }}>
          <input 
            type="text" 
            placeholder="Search namespaces or keys..." 
            style={{ 
              flex: 1, maxWidth: "400px", padding: "0.8rem 1rem", border: "1px solid #e8e4df", 
              fontSize: "0.85rem", fontFamily: "inherit" 
            }}
          />
          <select style={{ padding: "0.8rem 1rem", border: "1px solid #e8e4df", fontSize: "0.85rem", fontFamily: "inherit", backgroundColor: "#fff" }}>
            <option>All Languages</option>
            <option>English (en)</option>
            <option>Arabic (ar)</option>
            <option>French (fr)</option>
          </select>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Set Name</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Status / Health</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Entries</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Namespaces</th>
              <th style={{ padding: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500, textAlign: "right" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {sets.map(set => {
              const health = service.validate(set);
              const namespaces = Array.from(new Set(set.entries.map(e => e.namespace)));
              const languages = Array.from(new Set(set.entries.map(e => e.languageCode)));

              return (
                <tr key={set.id} style={{ borderBottom: "1px solid #e8e4df" }}>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ fontSize: "0.95rem", color: "#1a1a18", fontWeight: 500 }}>
                      {set.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "0.3rem" }}>
                      Langs: {languages.join(", ")}
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ 
                        fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", 
                        textTransform: "uppercase", 
                        background: getStatusColor(set.status).bg, 
                        color: getStatusColor(set.status).color, 
                        border: `1px solid ${getStatusColor(set.status).border}` 
                      }}>
                        {set.status}
                      </span>
                      {health.status === "INVALID" && (
                        <span title={health.messages.join(", ")} style={{ color: "#dc2626", fontSize: "1.2rem" }}>⚠️</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#1a1a18" }}>
                      {set.entries.length} keys
                    </span>
                  </td>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "#6b6865" }}>
                      {namespaces.join(", ")}
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem", textAlign: "right" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#1a1a18" }}>{set.priority}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

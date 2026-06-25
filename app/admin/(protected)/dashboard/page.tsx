"use client";

import Link from "next/link";
import { useAdminUser, hasPermission } from "@/lib/admin-auth";

export default function AdminDashboard() {
  const user = useAdminUser();
  if (!user) return null;

  return (
    <div>
      <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
        Overview
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#7a7874", marginBottom: "3rem" }}>
        Manage your storefront operations.
      </p>

      {/* Grid of tools */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "2rem",
      }}>
        {/* Import Tool */}
        {hasPermission(user.role, "Products") && (
          <Link href="/admin/import" style={{ textDecoration: "none" }}>
            <div style={{
              background: "#ffffff",
              border: "1px solid #e8e4df",
              padding: "2rem",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,24,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.5rem" }}>
                Shopify Product Import
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#7a7874", lineHeight: 1.6, flex: 1 }}>
                Upload your Shopify product export CSV to automatically populate all category and product pages.
              </p>
              <div style={{ marginTop: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18" }}>
                Launch Tool →
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

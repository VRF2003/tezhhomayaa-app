"use client";

import React from "react";
import { useIdentity } from "@/lib/iam";
import { logoutAction } from "@/lib/iam/actions";
import { useRouter } from "next/navigation";

export function TopNav() {
  const router = useRouter();
  const { identity, isAuthenticated } = useIdentity();
  
  if (!isAuthenticated || !identity) return null;

  const handleSignOut = async () => {
    await logoutAction();
    router.push("/admin");
  };

  return (
    <header style={{
      height: "70px",
      background: "#ffffff",
      borderBottom: "1px solid #e8e4df",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 2rem",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#6b6865", transition: "color 0.2s ease", padding: 0,
          }}
        >
          ⌘K Search
        </button>
        <div style={{ width: "1px", height: "24px", background: "#e8e4df" }} />
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.85rem", color: "#1a1a18", margin: "0 0 0.15rem", fontWeight: 500 }}>
            {identity.user.name}
          </p>
          <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", margin: 0 }}>
            {identity.role.name}
          </p>
        </div>
        <div style={{ width: "1px", height: "24px", background: "#e8e4df" }} />
        <button
          onClick={handleSignOut}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#6b6865", transition: "color 0.2s ease", padding: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#1a1a18"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#6b6865"}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

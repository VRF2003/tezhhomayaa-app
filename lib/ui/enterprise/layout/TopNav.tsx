"use client";

import React from "react";
import { useIdentity } from "@/lib/iam";
import { logoutAction } from "@/lib/iam/actions";
import { useRouter, usePathname } from "next/navigation";
import { WorkspaceRegistry } from "../registry/WorkspaceRegistry";
import Link from "next/link";

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { identity, isAuthenticated } = useIdentity();
  
  if (!isAuthenticated || !identity) return null;

  const handleSignOut = async () => {
    await logoutAction();
    router.push("/admin");
  };

  const activeWorkspace = WorkspaceRegistry.getActiveWorkspace(pathname);

  return (
    <header style={{
      background: "#ffffff",
      borderBottom: "1px solid #e8e4df",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      {/* Top Utility Bar */}
      <div style={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        borderBottom: "1px solid #f2f0ec"
      }}>
        <div style={{ flex: 1 }}>
          <button 
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            style={{
              background: "#f7f5f2", border: "1px solid #e8e4df", borderRadius: "4px", cursor: "text",
              fontSize: "0.75rem", color: "#9a9690", padding: "0.4rem 0.8rem", width: "240px",
              textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}
          >
            <span>{activeWorkspace?.searchPlaceholder || "Search..."}</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 500 }}>⌘K</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
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
      </div>

      {/* Workspace Context Header */}
      {activeWorkspace && (
        <div style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", margin: "0 0 0.5rem 0" }}>
              {activeWorkspace.breadcrumb}
            </p>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.25rem 0" }}>
              {activeWorkspace.name}
            </h1>
            {activeWorkspace.description && (
              <p style={{ fontSize: "0.85rem", color: "#6b6865", margin: 0 }}>
                {activeWorkspace.description}
              </p>
            )}
          </div>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {activeWorkspace.quickActions && activeWorkspace.quickActions.map(action => (
              <Link key={action.label} href={action.href} style={{ textDecoration: "none" }}>
                <div style={{
                  fontSize: "0.75rem", color: "#6b6865", padding: "0.5rem 1rem",
                  border: "1px solid #e8e4df", borderRadius: "4px", transition: "all 0.2s ease",
                  background: "#ffffff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f7f5f2"; e.currentTarget.style.color = "#1a1a18"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#6b6865"; }}
                >
                  {action.label}
                </div>
              </Link>
            ))}

            {activeWorkspace.primaryAction && (
              <Link href={activeWorkspace.primaryAction.href} style={{ textDecoration: "none" }}>
                <div style={{
                  fontSize: "0.75rem", color: "#ffffff", background: "#1a1a18",
                  padding: "0.5rem 1rem", borderRadius: "4px", transition: "all 0.2s ease",
                  fontWeight: 500
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#333330"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a18"; }}
                >
                  {activeWorkspace.primaryAction.label}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

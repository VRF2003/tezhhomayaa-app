"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationRegistry } from "../registry/NavigationRegistry";
import { useIdentity, PermissionService, PermissionAction, PermissionResource } from "@/lib/iam";

export function Sidebar() {
  const pathname = usePathname();
  const allItems = NavigationRegistry.getAll();
  const { identity, isAuthenticated } = useIdentity();
  
  if (!isAuthenticated || !identity) return null;

  return (
    <aside style={{
      width: "260px",
      background: "#ffffff",
      borderRight: "1px solid #e8e4df",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      flexShrink: 0,
    }}>
      <div style={{ padding: "2rem", borderBottom: "1px solid #e8e4df" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>
          TEZHHOMAYAA
        </p>
        <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginTop: "0.4rem", margin: 0 }}>
          ADMINISTRATION
        </p>
      </div>

      <nav style={{ padding: "2rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto" }}>
        {allItems.map((item) => {
          let show = item.always;
          if (!show && item.requiredPermissions && item.requiredPermissions.length > 0) {
            show = item.requiredPermissions.some(perm => 
              PermissionService.can(identity.role, perm.action as PermissionAction, perm.resource as PermissionResource)
            );
          } else if (!show) {
            show = true; // Default to show if no perms specified and not hidden
          }

          if (!show) return null;
          
          const active = item.subItems 
            ? pathname.startsWith(item.href)
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <div key={item.id} style={{ display: "flex", flexDirection: "column" }}>
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "4px",
                  background: active && (!item.subItems || item.subItems.length === 0) ? "#f7f5f2" : "transparent",
                  color: active ? "#1a1a18" : "#6b6865",
                  fontSize: "0.85rem",
                  fontWeight: active ? 500 : 400,
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#fafaf8"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {item.label}
                </div>
              </Link>

              {item.subItems && active && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", paddingLeft: "2rem", marginTop: "0.2rem" }}>
                  {item.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                      
                    return (
                      <Link key={sub.id} href={sub.href} style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          color: isSubActive ? "#1a1a18" : "#9a9690",
                          fontSize: "0.75rem",
                          fontWeight: isSubActive ? 500 : 400,
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!isSubActive) e.currentTarget.style.color = "#1a1a18"; }}
                        onMouseLeave={(e) => { if (!isSubActive) e.currentTarget.style.color = "#9a9690"; }}
                        >
                          {sub.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

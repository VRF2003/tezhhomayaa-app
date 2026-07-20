"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkspaceRegistry, NavigationSection } from "../registry/WorkspaceRegistry";
import { useIdentity, PermissionService, PermissionAction, PermissionResource } from "@/lib/iam";
import { useWorkspaceState } from "../core/useWorkspaceState";

const SECTION_ORDER: NavigationSection[] = ["BUSINESS", "ADMINISTRATION", "PLATFORM"];

export function Sidebar() {
  const pathname = usePathname();
  const groupedWorkspaces = WorkspaceRegistry.getGrouped();
  const activeWorkspace = WorkspaceRegistry.getActiveWorkspace(pathname);
  const { identity, isAuthenticated } = useIdentity();
  const { state, isLoaded, toggleSection } = useWorkspaceState();
  
  if (!isAuthenticated || !identity || !isLoaded) return null;

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

      <nav style={{ padding: "2rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "2rem", overflowY: "auto" }}>
        {SECTION_ORDER.map((section) => {
          const workspaces = groupedWorkspaces[section];
          if (!workspaces || workspaces.length === 0) return null;

          const isExpanded = state.expandedSections[section];

          return (
            <div key={section} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div 
                onClick={() => toggleSection(section)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 1rem",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <h3 style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", margin: 0, fontWeight: 500 }}>
                  {section}
                </h3>
                <span style={{ fontSize: "0.65rem", color: "#9a9690", transition: "transform 0.2s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {workspaces.map((ws) => {
                    let show = ws.always;
                    if (!show && ws.requiredPermissions && ws.requiredPermissions.length > 0) {
                      show = ws.requiredPermissions.some(perm => 
                        PermissionService.can(identity.role, perm.action as PermissionAction, perm.resource as PermissionResource)
                      );
                    } else if (!show) {
                      show = true;
                    }

                    if (!show) return null;
                    
                    const isWorkspaceActive = activeWorkspace?.id === ws.id;

                    return (
                      <div key={ws.id} style={{ display: "flex", flexDirection: "column" }}>
                        <Link href={ws.route} style={{ textDecoration: "none" }}>
                          <div style={{
                            padding: "0.75rem 1rem",
                            borderRadius: "4px",
                            background: isWorkspaceActive ? "#f7f5f2" : "transparent",
                            color: isWorkspaceActive ? "#1a1a18" : "#6b6865",
                            fontSize: "0.85rem",
                            fontWeight: isWorkspaceActive ? 500 : 400,
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            borderLeft: isWorkspaceActive ? "3px solid #1a1a18" : "3px solid transparent",
                          }}
                          onMouseEnter={(e) => { if (!isWorkspaceActive) e.currentTarget.style.background = "#fafaf8"; }}
                          onMouseLeave={(e) => { if (!isWorkspaceActive) e.currentTarget.style.background = "transparent"; }}
                          >
                            <span style={{ marginLeft: isWorkspaceActive ? "-3px" : "0", transition: "margin 0.2s ease" }}>
                              {ws.name}
                            </span>
                          </div>
                        </Link>

                        {/* Expand SubItems only if this is the active workspace */}
                        {ws.subItems && isWorkspaceActive && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", paddingLeft: "1rem", marginTop: "0.25rem" }}>
                            {ws.subItems.map((sub) => {
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
                                    background: isSubActive ? "rgba(247, 245, 242, 0.5)" : "transparent"
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
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

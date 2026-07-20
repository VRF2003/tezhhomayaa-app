"use client";

import React from "react";
import { WidgetRegistry } from "@/lib/ui/enterprise/registry/WidgetRegistry";
import { PermissionGuard } from "@/lib/ui/enterprise/security/PermissionGuard";
import { useIdentity } from "@/lib/iam";

export default function DashboardPage() {
  const widgets = WidgetRegistry.getAll();
  const { identity } = useIdentity();
  
  if (!identity) return null;

  return (
    <div>
      <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
        Overview
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#7a7874", marginBottom: "3rem" }}>
        Manage your storefront operations.
      </p>

      {/* Grid of tools dynamically rendered from the WidgetRegistry */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "2rem",
      }}>
        {widgets.map(widget => (
          <PermissionGuard key={widget.id} requiredPermissions={widget.requiredPermissions}>
             <widget.component context={{ moduleId: widget.id, permissions: [] }} />
          </PermissionGuard>
        ))}
      </div>
    </div>
  );
}

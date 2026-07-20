"use client";

import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function EnterpriseLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fafaf8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopNav />
        <main style={{ padding: "3rem 4rem", flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

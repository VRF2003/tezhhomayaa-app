"use client";

import React, { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string, description: string, action?: ReactNode }) {
  return (
    <div style={{
      padding: "6rem 2rem",
      textAlign: "center",
      background: "#ffffff",
      border: "1px solid #e8e4df",
      borderRadius: "2px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.5rem" }}>
        {title}
      </h3>
      <p style={{ color: "#7a7874", fontSize: "0.9rem", margin: "0 0 2rem", maxWidth: "400px", lineHeight: 1.5 }}>
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

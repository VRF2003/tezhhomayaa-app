"use client";

import React from "react";

export function SkeletonLoader({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8e4df" }}>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} style={{ padding: "1.2rem 1.5rem" }}>
                <div style={{ height: "14px", width: "60%", background: "#f2f0ec", borderRadius: "2px", animation: "pulse 1.5s infinite ease-in-out" }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: "1px solid #f9f8f6" }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} style={{ padding: "1.2rem 1.5rem" }}>
                  <div style={{ 
                    height: "14px", 
                    width: colIndex === 0 ? "80%" : "40%", 
                    background: "#f7f5f2", 
                    borderRadius: "2px", 
                    animation: "pulse 1.5s infinite ease-in-out" 
                  }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
}

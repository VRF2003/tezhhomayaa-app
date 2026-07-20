"use client";

import React from "react";
// In a full implementation, Recharts or Chart.js would be wrapped here.
// This abstraction guarantees provider independence.

export type ChartData = { name: string; value: number }[];

export function LineChart({ data, height = 300 }: { data: ChartData; height?: number }) {
  return (
    <div style={{ height }} className="flex items-end gap-2 w-full pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" 
            style={{ height: `${Math.max((d.value / Math.max(...data.map(x => x.value))) * 100, 5)}%` }}
            title={`${d.name}: ${d.value}`}
          />
          <span className="text-xs text-gray-400">{d.name}</span>
        </div>
      ))}
    </div>
  );
}

// Stubs for other chart types
export function BarChart({ data }: { data: ChartData }) { return <LineChart data={data} />; }
export function PieChart({ data }: { data: ChartData }) { return <div className="text-gray-400 p-4 text-center">Pie Chart Stub</div>; }
export function AreaChart({ data }: { data: ChartData }) { return <LineChart data={data} />; }

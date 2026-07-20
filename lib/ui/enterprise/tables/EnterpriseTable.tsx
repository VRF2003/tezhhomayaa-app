"use client";

import React from "react";

export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
};

export function EnterpriseTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick 
}: { 
  data: T[]; 
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((col, i) => (
              <th key={i} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {data.map((row) => (
            <tr 
              key={row.id} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((col, i) => (
                <td key={i} className="py-4 px-4 text-sm text-gray-900 dark:text-gray-300">
                  {col.cell ? col.cell(row) : String(row[col.accessorKey])}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-500 text-sm">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

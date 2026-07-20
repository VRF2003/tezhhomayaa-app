"use client";

import React from "react";
import { PageHeader } from "@/lib/ui/enterprise/design-system/structural";
import { EnterpriseTable } from "@/lib/ui/enterprise/tables/EnterpriseTable";
import { StatusBadge } from "@/lib/ui/enterprise/design-system/indicators";

export default function ActivityCenterPage() {
  const activities = [
    { id: "1", action: "Product Published", module: "Commerce", status: "success", time: "2 mins ago" },
    { id: "2", action: "Media Variants Generated", module: "Media", status: "success", time: "2 mins ago" },
    { id: "3", action: "Search Indexed", module: "Search", status: "success", time: "3 mins ago" },
    { id: "4", action: "Cache Warmed", module: "Cache", status: "success", time: "3 mins ago" },
    { id: "5", action: "Deployment Completed", module: "Deployment", status: "info", time: "1 hour ago" },
    { id: "6", action: "Observability Recorded", module: "Observability", status: "neutral", time: "1 hour ago" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Activity Center" 
        description="Enterprise timeline of events across all modules."
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <EnterpriseTable 
          data={activities}
          columns={[
            { header: "Action", accessorKey: "action" },
            { header: "Module", accessorKey: "module" },
            { header: "Time", accessorKey: "time" },
            { header: "Status", accessorKey: "status", cell: (row) => <StatusBadge status={row.status as any} label={row.status.toUpperCase()} /> }
          ]}
        />
      </div>
    </div>
  );
}

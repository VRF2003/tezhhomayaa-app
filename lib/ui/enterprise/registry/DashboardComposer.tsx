import React from "react";
import { WidgetRegistry } from "./WidgetRegistry";
import { PermissionGuard } from "../security/PermissionGuard";

export function DashboardComposer() {
  const widgets = WidgetRegistry.getAll();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {widgets.map((widget) => (
        <PermissionGuard key={widget.id} requiredPermissions={widget.requiredPermissions}>
          <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {widget.title}
            </h3>
            <div className="flex-1">
              <widget.component context={{ moduleId: widget.id, permissions: [] }} />
            </div>
          </div>
        </PermissionGuard>
      ))}
    </div>
  );
}

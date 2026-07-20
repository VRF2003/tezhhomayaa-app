import React, { ReactNode } from "react";

export function EnterpriseCard({ children, title, subtitle, className = "" }: { children: ReactNode, title?: string, subtitle?: string, className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export function MetricCard({ title, value, trend, trendLabel }: { title: string, value: string | number, trend?: "up" | "down" | "neutral", trendLabel?: string }) {
  return (
    <EnterpriseCard>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendLabel}
          </span>
        )}
      </div>
    </EnterpriseCard>
  );
}

export function HealthCard({ title, healthy, message, latency, onClick }: { title: string, healthy: boolean, message?: string, latency?: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${healthy ? "bg-green-500" : "bg-red-500"}`} />
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{healthy ? "Operational" : "Degraded"}</p>
      {message && <p className="text-sm text-red-500 mt-1">{message}</p>}
      {latency && <p className="text-xs text-gray-400 mt-2">{latency} latency</p>}
    </div>
  );
}

export function QuickActionCard({ title, icon, onClick }: { title: string, icon: ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
    >
      <div className="text-gray-500 dark:text-gray-400 mb-3">{icon}</div>
      <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">{title}</span>
    </button>
  );
}

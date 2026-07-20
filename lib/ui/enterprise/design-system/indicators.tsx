import React from "react";

export function StatusBadge({ status, label }: { status: "success" | "warning" | "error" | "info" | "neutral", label: string }) {
  const colors = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {label}
    </span>
  );
}

export function TrendIndicator({ value, label, positiveIsGood = true }: { value: number, label: string, positiveIsGood?: boolean }) {
  const isPositive = value >= 0;
  const isGood = isPositive === positiveIsGood;
  
  return (
    <div className="flex items-center gap-1">
      <span className={`text-sm font-bold ${isGood ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "↑" : "↓"} {Math.abs(value)}%
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-full w-full text-gray-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mb-4"></div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string, retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-full w-full text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">!</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{message}</p>
      {retry && (
        <button onClick={retry} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Try Again
        </button>
      )}
    </div>
  );
}

export function SkeletonLoader({ className = "h-4 w-full" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`}></div>;
}

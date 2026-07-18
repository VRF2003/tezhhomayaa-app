import React from "react";

export function SectionErrorState({ slug, error }: { slug: string, error: Error }) {
  // In production, we might want to log this and render nothing to gracefully degrade.
  // For development and the requirements of Phase 2.8.2, we render a clear error block.
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-red-50 border-t border-b border-red-200 p-8 text-center">
      <h3 className="text-red-800 font-semibold mb-2">LEP Resolution Failed</h3>
      <p className="text-red-600 text-sm mb-4">Could not load content for slug: '{slug}'</p>
      <div className="text-xs text-red-500 font-mono bg-white p-4 rounded border border-red-100 max-w-2xl overflow-auto text-left whitespace-pre-wrap">
        {error.message}
      </div>
    </div>
  );
}

export function SectionEmptyState({ slug, type }: { slug: string, type: string }) {
  // Graceful degradation - takes up 0 space if no variant is returned for a market
  return null;
}

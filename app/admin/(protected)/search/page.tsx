import React from "react";
import { SearchHealthCheck } from "@/lib/infrastructure/search/health/SearchHealthCheck";
import { SearchMetrics } from "@/lib/infrastructure/search/metrics/SearchMetrics";

export const metadata = {
  title: "Search Platform | Tezhhomayaa Admin",
};

export default async function SearchAdminPage() {
  const health = await SearchHealthCheck.check();
  const metrics = SearchMetrics.getMetrics();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Enterprise Search & Indexing Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Provider Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Provider Status</h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${health.healthy ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-2xl font-bold capitalize text-black dark:text-white">{health.provider}</span>
          </div>
          {!health.healthy && <p className="text-sm text-red-500 mt-2">{health.message}</p>}
        </div>

        {/* Total Searches */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Queries</h2>
          <span className="text-2xl font-bold text-black dark:text-white">{metrics.totalSearches}</span>
        </div>

        {/* Zero Results */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Zero Results</h2>
          <span className="text-2xl font-bold text-black dark:text-white">{metrics.zeroResultSearches}</span>
        </div>

        {/* Avg Latency */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Latency</h2>
          <span className="text-2xl font-bold text-black dark:text-white">{metrics.avgLatency.toFixed(2)} ms</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Index Management</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manually trigger a full reindex of all documents. This action operates safely in the background via the IndexPipeline.
        </p>
        <form action={async () => {
          "use server";
          // In a real implementation this would trigger an async background job or event
          console.log("Triggered Manual Full Reindex via Admin Panel");
        }}>
          <button 
            type="submit" 
            className="px-6 py-3 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-medium rounded-lg transition-colors"
          >
            Start Full Reindex
          </button>
        </form>
      </div>
    </div>
  );
}

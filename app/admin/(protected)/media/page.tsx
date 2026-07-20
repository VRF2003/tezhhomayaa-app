import React from "react";
import { MediaHealthCheck } from "@/lib/infrastructure/media/health/MediaHealthCheck";

export const metadata = {
  title: "Media Platform | Tezhhomayaa Admin",
};

export default async function MediaAdminPage() {
  const health = await MediaHealthCheck.check();
  
  // Convert bytes to MB for display
  const storageMB = (health.storageUsageBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Enterprise Asset & Media Platform</h1>
      
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

        {/* Storage Usage */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Storage</h2>
          <span className="text-2xl font-bold text-black dark:text-white">{storageMB} MB</span>
        </div>

        {/* Failed Uploads */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Failed Uploads</h2>
          <span className="text-2xl font-bold text-black dark:text-white">{health.metrics.failedUploads}</span>
        </div>

        {/* Avg Upload Latency */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Upload Latency</h2>
          <span className="text-2xl font-bold text-black dark:text-white">{health.metrics.avgUploadLatency.toFixed(2)} ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Processing Queue Status</h2>
          <ul className="space-y-3">
            <li className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Avg Transformation Time</span>
              <span className="font-semibold">{health.metrics.avgTransformationTime.toFixed(2)} ms</span>
            </li>
            <li className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Avg Optimization Time</span>
              <span className="font-semibold">{health.metrics.avgOptimizationTime.toFixed(2)} ms</span>
            </li>
            <li className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Avg Variant Gen Time</span>
              <span className="font-semibold">{health.metrics.avgVariantGenerationTime.toFixed(2)} ms</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Media Library Analytics</h2>
          <ul className="space-y-3">
             <li className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Storage Growth (Last 30d)</span>
              <span className="font-semibold text-green-600">+{((health.metrics.storageGrowth || 0) / (1024 * 1024)).toFixed(2)} MB</span>
            </li>
            <li className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Largest Asset</span>
              <span className="font-semibold text-blue-600 cursor-pointer">View Details &rarr;</span>
            </li>
            <li className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Duplicate / Orphaned Assets</span>
              <span className="font-semibold text-orange-500 cursor-pointer">Scan Now &rarr;</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}

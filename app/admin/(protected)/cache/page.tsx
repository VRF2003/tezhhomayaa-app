"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { FiRefreshCw, FiServer, FiActivity, FiDatabase } from 'react-icons/fi';

export default function CacheDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [warming, setWarming] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/cache')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const triggerWarmup = async () => {
    setWarming(true);
    await fetch('/api/admin/cache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'warmup' })
    });
    setWarming(false);
    fetchStats(); // refresh stats
  };

  if (loading && !data) return <div className="p-8">Loading ECP Stats...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FiDatabase /> Enterprise Cache Platform
        </h1>
        <div className="flex gap-4">
          <button onClick={fetchStats} className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
             <FiRefreshCw /> Refresh
          </button>
          <button 
             onClick={triggerWarmup} 
             disabled={warming}
             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
             {warming ? 'Warming...' : 'Trigger Global Warmup'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
               <FiServer className="text-blue-500"/> {data?.provider}
            </div>
            <p className="text-sm text-green-600 mt-1">{data?.status}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Hit Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
               <FiActivity className="text-green-500"/> {data?.metrics.hitRatio}%
            </div>
            <p className="text-sm text-gray-500 mt-1">{data?.metrics.hits} Hits / {data?.metrics.misses} Misses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Key Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.size} Keys</div>
            <p className="text-sm text-gray-500 mt-1">In active memory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.metrics.avgLatencyMs}ms</div>
            <p className="text-sm text-gray-500 mt-1">Read-through overhead</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <CardHeader>
             <CardTitle>Top Cached Resources</CardTitle>
           </CardHeader>
           <CardContent>
             <ul className="space-y-4">
                {data?.topResources.map((res: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                     <div>
                       <p className="font-medium">{res.key}</p>
                       <p className="text-xs text-gray-500">Hits: {res.hits}</p>
                     </div>
                     <span className="text-sm bg-gray-100 px-2 py-1 rounded">{res.size}</span>
                  </li>
                ))}
             </ul>
           </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <CardTitle>Recent Invalidations</CardTitle>
           </CardHeader>
           <CardContent>
             <ul className="space-y-4">
                {data?.recentInvalidations.map((inv: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                     <div className="flex items-center gap-2">
                       <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{inv.tag}</span>
                       <p className="text-sm">Evicted via EventBus</p>
                     </div>
                     <span className="text-xs text-gray-500">{new Date(inv.timestamp).toLocaleTimeString()}</span>
                  </li>
                ))}
             </ul>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

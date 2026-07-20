"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { FiRefreshCw, FiServer, FiShield, FiRotateCcw, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function DeploymentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [rollingBack, setRollingBack] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/deployment')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const triggerValidation = async () => {
    setValidating(true);
    const res = await fetch('/api/admin/deployment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'validate' })
    });
    const d = await res.json();
    setValidationResults(d.results || []);
    setValidating(false);
  };

  const triggerRollback = async () => {
    if (!confirm("Are you sure you want to rollback to the previous stable release?")) return;
    setRollingBack(true);
    await fetch('/api/admin/deployment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'rollback' })
    });
    setRollingBack(false);
    fetchStats();
  };

  if (loading && !data) return <div className="p-8">Loading EDP Stats...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FiServer /> Enterprise Deployment Platform
        </h1>
        <div className="flex gap-4">
          <button onClick={fetchStats} className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
             <FiRefreshCw /> Refresh
          </button>
          <button 
             onClick={triggerValidation} 
             disabled={validating}
             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
             <FiShield /> {validating ? 'Validating...' : 'Validate Deployment'}
          </button>
          <button 
             onClick={triggerRollback} 
             disabled={rollingBack}
             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
             <FiRotateCcw /> {rollingBack ? 'Rolling Back...' : 'Emergency Rollback'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase">{data?.environment}</div>
            <p className="text-sm text-gray-500 mt-1">Read Only: {data?.capabilities?.isReadOnly ? 'Yes' : 'No'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Release</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={data?.activeRelease?.id}>
               {data?.activeRelease?.id}
            </div>
            <p className="text-sm text-green-600 mt-1">State: {data?.activeRelease?.state}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Build Version</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.activeRelease?.manifest?.build?.version}</div>
            <p className="text-sm text-gray-500 mt-1 truncate">Commit: {data?.activeRelease?.manifest?.build?.commitHash}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Standard</div>
            <p className="text-sm text-gray-500 mt-1">Direct Switchover</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
           <CardHeader>
             <CardTitle>Release History</CardTitle>
           </CardHeader>
           <CardContent>
             <ul className="space-y-4">
                {data?.history?.map((rel: any, idx: number) => (
                  <li key={idx} className="flex flex-col border-b pb-2 last:border-0">
                     <div className="flex justify-between items-center">
                       <p className="font-medium truncate" title={rel.id}>{rel.id}</p>
                       <span className={`text-xs px-2 py-1 rounded-full ${
                          rel.state === 'Active' ? 'bg-green-100 text-green-700' :
                          rel.state === 'Rolled Back' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                       }`}>
                         {rel.state}
                       </span>
                     </div>
                     <span className="text-xs text-gray-500 mt-1">{new Date(rel.createdAt).toLocaleString()}</span>
                  </li>
                ))}
             </ul>
           </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <CardTitle>Validation Pipeline Results</CardTitle>
           </CardHeader>
           <CardContent>
             {validationResults.length === 0 ? (
               <div className="text-gray-500 text-sm italic">Run validation to see pipeline results.</div>
             ) : (
               <ul className="space-y-3">
                  {validationResults.map((res: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                       <div className="flex items-center gap-2">
                         {res.success ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500" />}
                         <span className="font-medium text-sm">{res.stage}</span>
                       </div>
                       <span className="text-xs text-gray-600 truncate max-w-[200px]" title={res.message}>
                         {res.message}
                       </span>
                    </li>
                  ))}
               </ul>
             )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

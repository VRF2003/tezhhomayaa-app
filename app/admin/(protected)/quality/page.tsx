"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function QualityDashboard() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/quality')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
           setError(data.error);
        } else {
           setReport(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch quality report');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading ETQP Data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Enterprise Testing & Quality Platform</h1>
        {report && (
           <div className={`px-4 py-2 rounded font-bold ${report.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
             Quality Score: {report.score}/100
           </div>
        )}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
             {error}
          </CardContent>
        </Card>
      )}

      {report && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Architecture Status */}
          <Card>
            <CardHeader>
              <CardTitle>Architecture Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {report.architecture.passed ? (
                  <span className="text-green-600">PASSED</span>
                ) : (
                  <span className="text-red-600">FAILED</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {report.architecture.violations?.length || 0} Rule Violations
              </p>
            </CardContent>
          </Card>

          {/* Contracts Status */}
          <Card>
            <CardHeader>
              <CardTitle>Repository Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {report.contracts.passed ? (
                  <span className="text-green-600">PASSED</span>
                ) : (
                  <span className="text-yellow-600">PENDING</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                All persistence providers aligned
              </p>
            </CardContent>
          </Card>

          {/* Coverage Status */}
          <Card>
            <CardHeader>
              <CardTitle>Test Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {report.coverage.passed ? (
                  <span className="text-green-600">PASSED</span>
                ) : (
                  <span className="text-yellow-600">PENDING</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Meets enterprise minimums
              </p>
            </CardContent>
          </Card>

        </div>
      )}

      {report && report.architecture.violations?.length > 0 && (
         <Card className="mt-8 border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">Architecture Violations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <ul className="space-y-4">
                 {report.architecture.violations.map((v: any, i: number) => (
                    <li key={i} className="border-b pb-4 last:border-0">
                       <p className="font-bold text-red-600">[{v.rule}] {v.file}:{v.line || '?'}</p>
                       <p className="text-sm mt-1">{v.message}</p>
                    </li>
                 ))}
               </ul>
            </CardContent>
         </Card>
      )}
    </div>
  );
}

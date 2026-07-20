import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reportPath = path.join(process.cwd(), 'lib/infrastructure/testing/coverage-reports/quality-report.json');
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({
        score: 0,
        architecture: { passed: false, violations: [] },
        coverage: { passed: false },
        contracts: { passed: false },
        error: "Quality report not found. Run 'npm run etqp:ci' first.",
      });
    }

    const reportData = fs.readFileSync(reportPath, 'utf8');
    const report = JSON.parse(reportData);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load quality report" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = Observability.ringBuffer.getLogs(50);
    const metrics = Observability.ringBuffer.getMetrics(50);
    const alerts = Observability.ringBuffer.getAlerts(20);
    const audits = Observability.ringBuffer.getAudits(20);
    const spans = Observability.ringBuffer.getSpans(50);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        metrics,
        alerts,
        audits,
        spans
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

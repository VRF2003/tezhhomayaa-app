import { IExporter } from "./IExporter";
import { StructuredLog, MetricRecord, TraceSpan, AuditRecord, Alert } from "../types";

export class ConsoleExporter implements IExporter {
  exportLog(log: StructuredLog): void {
    const formatted = `[${log.timestamp}] [${log.severity}] [${log.domain}::${log.operation}] ${log.message} ${log.metadata ? JSON.stringify(log.metadata) : ""}`;
    if (log.severity === "ERROR") {
      console.error(formatted);
    } else if (log.severity === "WARN") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  exportMetric(metric: MetricRecord): void {
    // In production console, we might not want to spam metrics, but for development we log them
    // console.log(`[METRIC] ${metric.name} (${metric.type}): ${metric.value}`);
  }

  exportSpan(span: TraceSpan): void {
    // console.log(`[TRACE] [${span.traceId}] Span: ${span.name} - ${span.durationMs}ms [${span.status}]`);
  }

  exportAudit(audit: AuditRecord): void {
    console.log(`[AUDIT] [${audit.timestamp}] Actor:${audit.actorId} Action:${audit.action} Resource:${audit.resourceType}`);
  }

  exportAlert(alert: Alert): void {
    const fn = alert.severity === "CRITICAL" || alert.severity === "HIGH" ? console.error : console.warn;
    fn(`[ALERT] [${alert.severity}] ${alert.message}`);
  }
}

import { IExporter } from "./IExporter";
import { StructuredLog, MetricRecord, TraceSpan, AuditRecord, Alert } from "../types";

export class RingBufferExporter implements IExporter {
  private logs: StructuredLog[] = [];
  private metrics: MetricRecord[] = [];
  private spans: TraceSpan[] = [];
  private audits: AuditRecord[] = [];
  private alerts: Alert[] = [];

  private maxCapacity: number;

  constructor(maxCapacity: number = 1000) {
    this.maxCapacity = maxCapacity;
  }

  private add<T>(buffer: T[], item: T) {
    buffer.unshift(item); // Add to front
    if (buffer.length > this.maxCapacity) {
      buffer.pop(); // Remove from end
    }
  }

  exportLog(log: StructuredLog): void {
    this.add(this.logs, log);
  }

  exportMetric(metric: MetricRecord): void {
    this.add(this.metrics, metric);
  }

  exportSpan(span: TraceSpan): void {
    this.add(this.spans, span);
  }

  exportAudit(audit: AuditRecord): void {
    this.add(this.audits, audit);
  }

  exportAlert(alert: Alert): void {
    this.add(this.alerts, alert);
  }

  // Retrieval for admin dashboard
  getLogs(limit: number = 100) { return this.logs.slice(0, limit); }
  getMetrics(limit: number = 100) { return this.metrics.slice(0, limit); }
  getSpans(limit: number = 100) { return this.spans.slice(0, limit); }
  getAudits(limit: number = 100) { return this.audits.slice(0, limit); }
  getAlerts(limit: number = 100) { return this.alerts.slice(0, limit); }
}

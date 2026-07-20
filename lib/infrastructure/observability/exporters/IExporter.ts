import { StructuredLog, MetricRecord, TraceSpan, AuditRecord, Alert } from "../types";

export interface IExporter {
  exportLog(log: StructuredLog): void | Promise<void>;
  exportMetric(metric: MetricRecord): void | Promise<void>;
  exportSpan(span: TraceSpan): void | Promise<void>;
  exportAudit(audit: AuditRecord): void | Promise<void>;
  exportAlert(alert: Alert): void | Promise<void>;
}

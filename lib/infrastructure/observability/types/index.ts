export type LogSeverity = "DEBUG" | "INFO" | "WARN" | "ERROR" | "AUDIT";

export interface LogMetadata {
  [key: string]: any;
}

export interface StructuredLog {
  timestamp: string;
  correlationId?: string;
  requestId?: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  sessionId?: string;
  severity: LogSeverity;
  category: string;
  domain: string;
  operation: string;
  durationMs?: number;
  message: string;
  metadata?: LogMetadata;
}

export type MetricType = "COUNTER" | "GAUGE" | "HISTOGRAM" | "TIMER";

export interface MetricRecord {
  name: string;
  type: MetricType;
  value: number;
  tags?: Record<string, string>;
  timestamp: string;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  status: "OK" | "ERROR";
  tags?: Record<string, string>;
}

export interface HealthStatus {
  service: string;
  status: "HEALTHY" | "DEGRADED" | "OFFLINE";
  latencyMs?: number;
  lastChecked: string;
  details?: Record<string, any>;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: { field: string; old: any; new: any }[];
  ipAddress?: string;
  userAgent?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: any, health: any) => boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
}

export interface Alert {
  id: string;
  ruleId: string;
  timestamp: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  resolved: boolean;
  resolvedAt?: string;
}

import { Logger } from "./core/Logger";
import { MetricsService } from "./core/MetricsService";
import { TracingService } from "./core/TracingService";
import { HealthService } from "./core/HealthService";
import { AuditService } from "./core/AuditService";
import { AlertManager } from "./core/AlertManager";
import { ConsoleExporter } from "./exporters/ConsoleExporter";
import { RingBufferExporter } from "./exporters/RingBufferExporter";
import { IExporter } from "./exporters/IExporter";

export class Observability {
  private static exporters: IExporter[] = [];
  public static ringBuffer: RingBufferExporter;
  
  public static metrics: MetricsService;
  public static tracing: TracingService;
  public static health = HealthService;
  public static audit: AuditService;
  public static alerts: AlertManager;

  // Initialize statically
  static {
    // Default exporters
    const consoleExporter = new ConsoleExporter();
    Observability.ringBuffer = new RingBufferExporter(1000); // Admin dashboard buffer
    
    Observability.exporters = [consoleExporter, Observability.ringBuffer];

    Observability.metrics = new MetricsService(Observability.exporters);
    Observability.tracing = new TracingService(Observability.exporters);
    Observability.audit = new AuditService(Observability.exporters);
    Observability.alerts = new AlertManager(Observability.exporters);
  }

  public static getLogger(domain: string): Logger {
    return new Logger(domain, Observability.exporters);
  }

  public static getMetrics(): MetricsService {
    return Observability.metrics;
  }

  public static getTracing(): TracingService {
    return Observability.tracing;
  }

  public static getAudit(): AuditService {
    return Observability.audit;
  }

  public static getAlerts(): AlertManager {
    return Observability.alerts;
  }

  // Allow configuring exporters later (e.g. adding OpenTelemetry or Datadog)
  public static registerExporter(exporter: IExporter) {
    Observability.exporters.push(exporter);
  }
}

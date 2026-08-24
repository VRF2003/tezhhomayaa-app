import { IExporter } from "../exporters/IExporter";
import { ObservabilityContext } from "./ObservabilityContext";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `span-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export class TracingService {
  private exporters: IExporter[];

  constructor(exporters: IExporter[]) {
    this.exporters = exporters;
  }

  public startSpan(context: ObservabilityContext, name: string, tags?: Record<string, string>): { spanId: string, end: (status: "OK"|"ERROR") => void } {
    const spanId = generateId();
    const parentSpanId = context.spanId;
    const startTime = Date.now();

    const end = (status: "OK" | "ERROR") => {
      const endTime = Date.now();
      const span = {
        traceId: context.traceId,
        spanId,
        parentSpanId,
        name,
        startTime,
        endTime,
        durationMs: endTime - startTime,
        status,
        tags
      };
      
      for (const exporter of this.exporters) {
        exporter.exportSpan(span);
      }
    };

    return { spanId, end };
  }
}

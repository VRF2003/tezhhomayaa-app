import { ObservabilityContext } from "./ObservabilityContext";
import { IExporter } from "../exporters/IExporter";
import { LogSeverity, LogMetadata } from "../types";

export class Logger {
  private domain: string;
  private exporters: IExporter[];
  private context?: ObservabilityContext;

  constructor(domain: string, exporters: IExporter[], context?: ObservabilityContext) {
    this.domain = domain;
    this.exporters = exporters;
    this.context = context;
  }

  public withContext(context: ObservabilityContext): Logger {
    return new Logger(this.domain, this.exporters, context);
  }

  private log(severity: LogSeverity, operation: string, message: any, metadata?: any) {
    const timestamp = new Date().toISOString();
    let msgString = "";
    if (message instanceof Error) {
      msgString = message.message;
      if (!metadata) metadata = { stack: message.stack };
      else if (typeof metadata === "object") metadata.stack = message.stack;
    } else if (typeof message === "object") {
      try { msgString = JSON.stringify(message); } catch { msgString = String(message); }
    } else {
      msgString = String(message);
    }

    const logRecord = {
      timestamp,
      correlationId: this.context?.correlationId,
      requestId: this.context?.requestId,
      traceId: this.context?.traceId,
      spanId: this.context?.spanId,
      severity,
      category: "APP",
      domain: this.domain,
      operation,
      message: msgString,
      metadata,
    };

    for (const exporter of this.exporters) {
      exporter.exportLog(logRecord);
    }
  }

  public info(operation: string, message: any, metadata?: any) {
    this.log("INFO", operation, message, metadata);
  }

  public warn(operation: string, message: any, metadata?: any) {
    this.log("WARN", operation, message, metadata);
  }

  public error(operation: string, message: any, metadata?: any) {
    this.log("ERROR", operation, message, metadata);
  }

  public debug(operation: string, message: any, metadata?: any) {
    this.log("DEBUG", operation, message, metadata);
  }
}

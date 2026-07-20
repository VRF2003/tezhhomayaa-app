import { randomUUID } from "crypto";

export class ObservabilityContext {
  public correlationId: string;
  public requestId: string;
  public traceId: string;
  public spanId?: string;

  constructor(opts?: {
    correlationId?: string;
    requestId?: string;
    traceId?: string;
    spanId?: string;
  }) {
    this.correlationId = opts?.correlationId || randomUUID();
    this.requestId = opts?.requestId || randomUUID();
    this.traceId = opts?.traceId || randomUUID();
    this.spanId = opts?.spanId;
  }

  public cloneWithNewSpan(newSpanId: string): ObservabilityContext {
    return new ObservabilityContext({
      correlationId: this.correlationId,
      requestId: this.requestId,
      traceId: this.traceId,
      spanId: newSpanId,
    });
  }
}

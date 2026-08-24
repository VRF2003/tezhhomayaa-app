function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `ctx-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

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
    this.correlationId = opts?.correlationId || generateId();
    this.requestId = opts?.requestId || generateId();
    this.traceId = opts?.traceId || generateId();
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

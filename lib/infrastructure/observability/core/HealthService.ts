import { HealthStatus } from "../types";

export class HealthService {
  private static statuses: Map<string, HealthStatus> = new Map();

  public static reportHealth(service: string, status: "HEALTHY" | "DEGRADED" | "OFFLINE", latencyMs?: number, details?: any) {
    this.statuses.set(service, {
      service,
      status,
      latencyMs,
      details,
      lastChecked: new Date().toISOString()
    });
  }

  public static getStatuses(): HealthStatus[] {
    return Array.from(this.statuses.values());
  }
}

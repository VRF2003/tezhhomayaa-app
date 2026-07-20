import { IExporter } from "../exporters/IExporter";
import { AlertRule, Alert } from "../types";
import { randomUUID } from "crypto";
import { HealthService } from "./HealthService";

export class AlertManager {
  private exporters: IExporter[];
  private rules: AlertRule[] = [];
  private activeAlerts: Map<string, Alert> = new Map();

  constructor(exporters: IExporter[]) {
    this.exporters = exporters;
  }

  public addRule(rule: AlertRule) {
    this.rules.push(rule);
  }

  public evaluate(metricsBuffer: any[]) {
    const healthStatuses = HealthService.getStatuses();
    
    for (const rule of this.rules) {
      const triggered = rule.condition(metricsBuffer, healthStatuses);
      
      if (triggered && !this.activeAlerts.has(rule.id)) {
        const alert: Alert = {
          id: randomUUID(),
          ruleId: rule.id,
          timestamp: new Date().toISOString(),
          severity: rule.severity,
          message: rule.message,
          resolved: false
        };
        this.activeAlerts.set(rule.id, alert);
        for (const exporter of this.exporters) {
          exporter.exportAlert(alert);
        }
      } else if (!triggered && this.activeAlerts.has(rule.id)) {
        const alert = this.activeAlerts.get(rule.id)!;
        alert.resolved = true;
        alert.resolvedAt = new Date().toISOString();
        this.activeAlerts.delete(rule.id);
        
        // Optionally export resolution alert
        for (const exporter of this.exporters) {
          exporter.exportAlert(alert);
        }
      }
    }
  }

  public getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values());
  }
}

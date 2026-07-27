import { IExporter } from "../exporters/IExporter";
import { AuditRecord } from "../types";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export class AuditService {
  private exporters: IExporter[];

  constructor(exporters: IExporter[]) {
    this.exporters = exporters;
  }

  public recordAudit(
    actorId: string,
    action: string,
    resourceType: string,
    opts?: {
      actorRole?: string;
      resourceId?: string;
      changes?: { field: string; old: any; new: any }[];
      ipAddress?: string;
      userAgent?: string;
    }
  ) {
    const audit: AuditRecord = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      actorId,
      action,
      resourceType,
      ...opts
    };

    for (const exporter of this.exporters) {
      exporter.exportAudit(audit);
    }
  }
}

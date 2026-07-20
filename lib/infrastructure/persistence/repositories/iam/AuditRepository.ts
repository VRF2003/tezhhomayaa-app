import { IAuditRepository } from "@/lib/iam";
import { AuditLog } from "@/lib/iam/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class AuditRepository implements IAuditRepository {
  private collection = "iam_audit_logs";

  constructor(private driver: IDatabaseDriver) {}

  async log(entry: AuditLog): Promise<void> {
    await this.driver.write(this.collection, entry.id, entry);
  }

  async getLogs(filters?: Partial<AuditLog>): Promise<AuditLog[]> {
    return this.driver.query(this.collection, filters);
  }
}

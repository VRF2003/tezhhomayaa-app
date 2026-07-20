import { IAuditRepository } from "@/lib/iam/repositories/IAuditRepository";
import { AuditLog } from "@/lib/iam/repositories/IAuditRepository";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class AuditRepository implements IAuditRepository {
  private collection = "iam_audit_logs";

  constructor(private driver: IDatabaseDriver) {}

  async log(entry: AuditLog): Promise<void> {
    await this.driver.write(this.collection, entry.id, entry);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.driver.query(this.collection, {});
  }

  async findByActor(actorId: string): Promise<AuditLog[]> {
    return this.driver.query(this.collection, { actorId });
  }

  // Keeping getLogs for backward compatibility if it's used elsewhere, or just rename it if not.
  async getLogs(filters?: Partial<AuditLog>): Promise<AuditLog[]> {
    return this.driver.query(this.collection, filters);
  }
}

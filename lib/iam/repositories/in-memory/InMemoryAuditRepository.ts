import { AuditLog, IAuditRepository } from "../IAuditRepository";

export class InMemoryAuditRepository implements IAuditRepository {
  private logs: AuditLog[] = [];

  async log(audit: AuditLog): Promise<void> {
    this.logs.push(audit);
  }

  async findAll(): Promise<AuditLog[]> {
    return [...this.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async findByActor(actorId: string): Promise<AuditLog[]> {
    return this.logs
      .filter(l => l.actorId === actorId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

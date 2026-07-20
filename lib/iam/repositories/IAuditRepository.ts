import { IamEventType } from "../events/IamEventBus";

export interface AuditLog {
  id: string;
  eventType: IamEventType;
  actorId?: string;
  targetId?: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface IAuditRepository {
  log(audit: AuditLog): Promise<void>;
  findAll(): Promise<AuditLog[]>;
  findByActor(actorId: string): Promise<AuditLog[]>;
}

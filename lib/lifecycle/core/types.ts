export type LifecycleState = 
  | "DRAFT" 
  | "IN_REVIEW" 
  | "APPROVED" 
  | "SCHEDULED" 
  | "PUBLISHED" 
  | "PAUSED" 
  | "ARCHIVED" 
  | "REJECTED";

export interface Publishable {
  entityId: string;
  entityType: string;
  versionNumber: number; // For Optimistic Locking
  payload: any;
}

export interface PublishPackage {
  packageId: string;
  name: string;
  state: LifecycleState;
  entities: Publishable[];
  versionNumber: number;
  scheduledPublishAt?: string;
  scheduledArchiveAt?: string;
}

export interface VersionRecord {
  versionId: string;
  targetId: string; // Could be a packageId or entityId
  targetType: "PACKAGE" | "ENTITY";
  versionNumber: number;
  payload: any; // Immutable snapshot of the package or entity
  createdAt: string;
  createdBy: string;
}

export interface AuditLogEntry {
  auditId: string;
  targetId: string;
  targetType: "PACKAGE" | "ENTITY";
  timestamp: string;
  actor: string;
  previousState: LifecycleState;
  newState: LifecycleState;
  reason: string;
}

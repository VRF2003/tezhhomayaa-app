import { PublishPackage, VersionRecord, AuditLogEntry } from "../core/types";

export interface ILifecycleRepository {
  /**
   * Retrieves a package by ID.
   */
  getPackage(packageId: string): Promise<PublishPackage | null>;

  /**
   * Saves or updates a package.
   */
  savePackage(pkg: PublishPackage): Promise<void>;

  /**
   * Retrieves packages filtered by state (e.g. for Draft or Review queues).
   */
  getPackagesByState(state: string): Promise<PublishPackage[]>;

  /**
   * Creates an immutable version record.
   */
  saveVersion(version: VersionRecord): Promise<void>;

  /**
   * Retrieves all versions for a given target (Package or Entity).
   */
  getVersions(targetId: string): Promise<VersionRecord[]>;

  /**
   * Retrieves a specific version record.
   */
  getVersion(versionId: string): Promise<VersionRecord | null>;

  /**
   * Appends an entry to the immutable audit log.
   */
  appendAuditLog(entry: AuditLogEntry): Promise<void>;

  /**
   * Retrieves the global audit log (or filtered by targetId).
   */
  getAuditLog(targetId?: string): Promise<AuditLogEntry[]>;
}

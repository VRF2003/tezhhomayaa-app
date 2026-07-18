import { ILifecycleRepository } from "./ILifecycleRepository";
import { PublishPackage, VersionRecord, AuditLogEntry } from "../core/types";

export class InMemoryLifecycleRepository implements ILifecycleRepository {
  private packages: Map<string, PublishPackage> = new Map();
  private versions: Map<string, VersionRecord> = new Map();
  private auditLog: AuditLogEntry[] = [];

  async getPackage(packageId: string): Promise<PublishPackage | null> {
    const pkg = this.packages.get(packageId);
    if (!pkg) return null;
    // Deep clone to prevent accidental mutations by caller
    return JSON.parse(JSON.stringify(pkg));
  }

  async savePackage(pkg: PublishPackage): Promise<void> {
    this.packages.set(pkg.packageId, JSON.parse(JSON.stringify(pkg)));
  }

  async getPackagesByState(state: string): Promise<PublishPackage[]> {
    const results: PublishPackage[] = [];
    for (const pkg of this.packages.values()) {
      if (pkg.state === state) {
        results.push(JSON.parse(JSON.stringify(pkg)));
      }
    }
    return results;
  }

  async saveVersion(version: VersionRecord): Promise<void> {
    this.versions.set(version.versionId, JSON.parse(JSON.stringify(version)));
  }

  async getVersions(targetId: string): Promise<VersionRecord[]> {
    const results: VersionRecord[] = [];
    for (const v of this.versions.values()) {
      if (v.targetId === targetId) {
        results.push(JSON.parse(JSON.stringify(v)));
      }
    }
    return results.sort((a, b) => b.versionNumber - a.versionNumber); // Descending
  }

  async getVersion(versionId: string): Promise<VersionRecord | null> {
    const v = this.versions.get(versionId);
    return v ? JSON.parse(JSON.stringify(v)) : null;
  }

  async appendAuditLog(entry: AuditLogEntry): Promise<void> {
    this.auditLog.push(JSON.parse(JSON.stringify(entry)));
  }

  async getAuditLog(targetId?: string): Promise<AuditLogEntry[]> {
    let logs = this.auditLog;
    if (targetId) {
      logs = logs.filter(l => l.targetId === targetId);
    }
    // Return sorted newest first
    return JSON.parse(JSON.stringify(logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())));
  }
}

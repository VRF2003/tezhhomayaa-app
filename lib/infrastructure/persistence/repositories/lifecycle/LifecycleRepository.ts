import { ILifecycleRepository } from "@/lib/lifecycle/repositories/ILifecycleRepository";
import { PublishPackage, VersionRecord, AuditLogEntry } from "@/lib/lifecycle/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class LifecycleRepository implements ILifecycleRepository {
  constructor(private driver: IDatabaseDriver) {}

  async getPackage(packageId: string): Promise<PublishPackage | null> {
    return this.driver.read("lifecycle_packages", packageId);
  }

  async savePackage(pkg: PublishPackage): Promise<void> {
    await this.driver.write("lifecycle_packages", pkg.id, pkg);
  }

  async getPackagesByState(state: string): Promise<PublishPackage[]> {
    return this.driver.query("lifecycle_packages", { state });
  }

  async saveVersion(version: VersionRecord): Promise<void> {
    await this.driver.write("lifecycle_versions", version.id, version);
  }

  async getVersions(targetId: string): Promise<VersionRecord[]> {
    return this.driver.query("lifecycle_versions", { targetId });
  }

  async getVersion(versionId: string): Promise<VersionRecord | null> {
    return this.driver.read("lifecycle_versions", versionId);
  }

  async appendAuditLog(entry: AuditLogEntry): Promise<void> {
    await this.driver.write("lifecycle_audit_logs", entry.id, entry);
  }

  async getAuditLog(targetId?: string): Promise<AuditLogEntry[]> {
    if (targetId) {
      return this.driver.query("lifecycle_audit_logs", { targetId });
    }
    return this.driver.query("lifecycle_audit_logs");
  }
}

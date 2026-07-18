import { randomUUID } from "crypto";
import { ILifecycleRepository } from "../repositories/ILifecycleRepository";
import { ILifecycleEventBus } from "../events/LifecycleEvents";
import { ConcurrencyError } from "../errors/ConcurrencyError";
import { PublishPackage, LifecycleState, VersionRecord } from "../core/types";

export class PublishingService {
  constructor(
    private repo: ILifecycleRepository,
    private eventBus: ILifecycleEventBus
  ) {}

  /**
   * Internal helper to validate Optimistic Locking
   */
  private async validateLock(pkg: PublishPackage): Promise<PublishPackage> {
    const existing = await this.repo.getPackage(pkg.packageId);
    if (existing && existing.versionNumber !== pkg.versionNumber) {
      throw new ConcurrencyError(`Optimistic locking failed for package ${pkg.packageId}. Expected version ${pkg.versionNumber}, found ${existing.versionNumber}`);
    }
    return existing || pkg;
  }

  /**
   * Internal helper to record an audit log entry
   */
  private async logAudit(packageId: string, actor: string, previousState: LifecycleState, newState: LifecycleState, reason: string): Promise<void> {
    await this.repo.appendAuditLog({
      auditId: randomUUID(),
      targetId: packageId,
      targetType: "PACKAGE",
      timestamp: new Date().toISOString(),
      actor,
      previousState,
      newState,
      reason
    });
  }

  async submitForReview(pkg: PublishPackage, actor: string, reason: string = "Submitted for review"): Promise<void> {
    const safePkg = await this.validateLock(pkg);
    const prevState = safePkg.state;
    
    safePkg.state = "IN_REVIEW";
    safePkg.versionNumber++;
    await this.repo.savePackage(safePkg);
    await this.logAudit(safePkg.packageId, actor, prevState, "IN_REVIEW", reason);
    
    this.eventBus.publish({
      eventId: randomUUID(),
      eventType: "PACKAGE_SUBMITTED_FOR_REVIEW",
      packageId: safePkg.packageId,
      actor,
      timestamp: new Date().toISOString()
    });
  }

  async publishPackage(pkg: PublishPackage, actor: string, reason: string = "Direct publish"): Promise<void> {
    const safePkg = await this.validateLock(pkg);
    const prevState = safePkg.state;
    
    safePkg.state = "PUBLISHED";
    safePkg.versionNumber++;
    await this.repo.savePackage(safePkg);

    // Create immutable version record for the entire package
    const version: VersionRecord = {
      versionId: randomUUID(),
      targetId: safePkg.packageId,
      targetType: "PACKAGE",
      versionNumber: safePkg.versionNumber,
      payload: safePkg.entities,
      createdAt: new Date().toISOString(),
      createdBy: actor
    };
    await this.repo.saveVersion(version);
    
    await this.logAudit(safePkg.packageId, actor, prevState, "PUBLISHED", reason);
    
    // Broadcast event so engines (LEP, Campaign, SEO) can invalidate caches or update their read models
    this.eventBus.publish({
      eventId: randomUUID(),
      eventType: "PACKAGE_PUBLISHED",
      packageId: safePkg.packageId,
      actor,
      timestamp: new Date().toISOString(),
      metadata: { versionId: version.versionId }
    });
  }

  async rollbackPackage(packageId: string, targetVersionId: string, actor: string, reason: string = "Rollback requested"): Promise<void> {
    const existing = await this.repo.getPackage(packageId);
    if (!existing) throw new Error("Package not found");

    const targetVersion = await this.repo.getVersion(targetVersionId);
    if (!targetVersion) throw new Error("Target version not found");

    const prevState = existing.state;
    
    // Create new forward-moving state using the old payload
    existing.entities = targetVersion.payload;
    existing.state = "PUBLISHED";
    existing.versionNumber++;
    await this.repo.savePackage(existing);

    const newVersion: VersionRecord = {
      versionId: randomUUID(),
      targetId: existing.packageId,
      targetType: "PACKAGE",
      versionNumber: existing.versionNumber,
      payload: existing.entities, // payload from old version
      createdAt: new Date().toISOString(),
      createdBy: actor
    };
    await this.repo.saveVersion(newVersion);

    await this.logAudit(existing.packageId, actor, prevState, "PUBLISHED", `Rollback to version ${targetVersion.versionNumber} (${reason})`);
    
    this.eventBus.publish({
      eventId: randomUUID(),
      eventType: "PACKAGE_ROLLED_BACK",
      packageId: existing.packageId,
      actor,
      timestamp: new Date().toISOString(),
      metadata: { rollbackToVersionId: targetVersionId, newVersionId: newVersion.versionId }
    });
  }
}

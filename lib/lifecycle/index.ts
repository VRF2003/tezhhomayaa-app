import { GlobalLifecycleEventBus } from "./events/LifecycleEvents";
import { InMemoryLifecycleRepository } from "./repositories/InMemoryLifecycleRepository";
import { PublishingService } from "./services/PublishingService";
import { PublishPackage } from "./core/types";
import { randomUUID } from "crypto";

export const lifecycleRepo = new InMemoryLifecycleRepository();
export const GlobalPublishingService = new PublishingService(lifecycleRepo, GlobalLifecycleEventBus);

// Seeding the InMemory DB for Dashboard demonstration purposes
async function seedMockData() {
  const pkg1: PublishPackage = {
    packageId: "pkg-1001",
    name: "Summer 2026 Collection Launch",
    state: "PUBLISHED",
    versionNumber: 2,
    entities: [
      { entityId: "camp-summer-26", entityType: "CAMPAIGN", versionNumber: 2, payload: {} },
      { entityId: "seo-summer-26", entityType: "SEO", versionNumber: 2, payload: {} }
    ]
  };
  
  const pkg2: PublishPackage = {
    packageId: "pkg-1002",
    name: "Black Friday Pre-Sale",
    state: "IN_REVIEW",
    versionNumber: 1,
    entities: [
      { entityId: "camp-bf-presale", entityType: "CAMPAIGN", versionNumber: 1, payload: {} },
      { entityId: "lep-bf-hero", entityType: "LEP_CONTENT", versionNumber: 1, payload: {} }
    ]
  };

  const pkg3: PublishPackage = {
    packageId: "pkg-1003",
    name: "Global Terms of Service Update",
    state: "SCHEDULED",
    versionNumber: 1,
    scheduledPublishAt: "2026-08-01T00:00:00Z",
    entities: [
      { entityId: "lep-tos", entityType: "LEP_CONTENT", versionNumber: 1, payload: {} }
    ]
  };

  await lifecycleRepo.savePackage(pkg2);
  await lifecycleRepo.savePackage(pkg3);

  // Use the service to naturally seed the published one so we get an audit log & version
  await GlobalPublishingService.publishPackage(pkg1, "System Seeder", "Initial Seeding");
}

seedMockData().catch(console.error);

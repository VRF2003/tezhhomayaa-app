import { RepositoryRegistry } from "./registry/RepositoryRegistry";

// IAM Repositories
import { UserRepository } from "./repositories/iam/UserRepository";
import { RoleRepository } from "./repositories/iam/RoleRepository";
import { PermissionRepository } from "./repositories/iam/PermissionRepository";
import { SessionRepository } from "./repositories/iam/SessionRepository";
import { AuditRepository } from "./repositories/iam/AuditRepository";

import { MigrationRunner } from "./migrations/MigrationRunner";
import { SeedIAM_001 } from "./migrations/001_SeedIAM";
import { SeedContent_002 } from "./migrations/002_SeedContent";
import { SeedAdditionalContent_003 } from "./migrations/003_SeedAdditionalContent";

// LEP Repositories
import { CampaignRepository } from "./repositories/lep/CampaignRepository";
import { ContentItemRepository } from "./repositories/lep/ContentItemRepository";

// Other Domain Repositories
import { SeoRepository } from "./repositories/seo/SeoRepository";
import { TranslationRepository } from "./repositories/translations/TranslationRepository";
import { AnalyticsRepository } from "./repositories/analytics/AnalyticsRepository";
import { AggregationRepository } from "./repositories/analytics/AggregationRepository";
import { LifecycleRepository } from "./repositories/lifecycle/LifecycleRepository";
import { DocumentRepository } from "./repositories/content/DocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export function bootstrapPersistence() {
  // Register IAM Repositories
  RepositoryRegistry.register("IUserRepository", UserRepository);
  RepositoryRegistry.register("IRoleRepository", RoleRepository);
  RepositoryRegistry.register("IPermissionRepository", PermissionRepository);
  RepositoryRegistry.register("ISessionRepository", SessionRepository);
  RepositoryRegistry.register("IAuditRepository", AuditRepository);
  
  // Register and Run Migrations
  MigrationRunner.register(new SeedIAM_001());
  MigrationRunner.register(new SeedContent_002());
  MigrationRunner.register(new SeedAdditionalContent_003());
  MigrationRunner.runUp().catch(Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error"));
  
  // Register LEP Repositories
  RepositoryRegistry.register("ICampaignRepository", CampaignRepository);
  RepositoryRegistry.register("IContentItemRepository", ContentItemRepository);
  
  // Register Other Domains
  RepositoryRegistry.register("ISeoRepository", SeoRepository);
  RepositoryRegistry.register("ITranslationRepository", TranslationRepository);
  RepositoryRegistry.register("IAnalyticsRepository", AnalyticsRepository);
  RepositoryRegistry.register("IAggregationRepository", AggregationRepository);
  RepositoryRegistry.register("ILifecycleRepository", LifecycleRepository);
  RepositoryRegistry.register("IDocumentRepository", DocumentRepository);
}

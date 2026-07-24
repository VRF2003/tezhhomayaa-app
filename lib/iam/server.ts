import { AuthenticationService } from "./services/AuthenticationService";
import { SessionService } from "./sessions/SessionService";
import { TokenService } from "./tokens/TokenService";
import { RepositoryResolver } from "../infrastructure/persistence/resolver/RepositoryResolver";
import { bootstrapPersistence } from "../infrastructure/persistence/bootstrap";
// Ensure Persistence is bootstrapped before resolving repositories
bootstrapPersistence();
import { InMemoryIamEventBus } from "./events/IamEventBus";
import { BUILT_IN_ROLES, BUILT_IN_PERMISSIONS } from "./roles/RoleRegistry";
import * as argon2 from "argon2";

// Global cache to persist InMemory repositories across Next.js fast-refresh
const globalAny: any = global;

if (!globalAny.iamRepositories) {
  globalAny.iamRepositories = {
    userRepo: RepositoryResolver.resolve("IUserRepository"),
    roleRepo: RepositoryResolver.resolve("IRoleRepository"),
    permissionRepo: RepositoryResolver.resolve("IPermissionRepository"),
    sessionRepo: RepositoryResolver.resolve("ISessionRepository"),
    auditRepo: RepositoryResolver.resolve("IAuditRepository"),
    eventBus: new InMemoryIamEventBus(),
  };

  // Seed default Super Admin user
  (async () => {
    try {
      const defaultHash = await argon2.hash("Tezh2026Admin");
      await globalAny.iamRepositories.userRepo.create({
        id: "usr_super_admin",
        email: "office@tezhhomayaa.com",
        username: "admin",
        name: "System Admin",
        roleId: "role_super_admin",
        passwordHash: defaultHash,
        isActive: true,
        isLocked: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to seed default IAM user", e);
    }
  })();
}

import { IUserRepository } from "./repositories/IUserRepository";
import { IRoleRepository } from "./repositories/IRoleRepository";
import { IPermissionRepository } from "./repositories/IPermissionRepository";
import { ISessionRepository } from "./repositories/ISessionRepository";
import { IAuditRepository } from "./repositories/IAuditRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const iamUserRepo = globalAny.iamRepositories.userRepo as IUserRepository;
export const iamRoleRepo = globalAny.iamRepositories.roleRepo as IRoleRepository;
export const iamPermissionRepo = globalAny.iamRepositories.permissionRepo as IPermissionRepository;
export const iamSessionRepo = globalAny.iamRepositories.sessionRepo as ISessionRepository;
export const iamAuditRepo = globalAny.iamRepositories.auditRepo as IAuditRepository;
export const iamEventBus = globalAny.iamRepositories.eventBus as InMemoryIamEventBus;

export const sessionService = new SessionService(iamSessionRepo);

export const authenticationService = new AuthenticationService(
  iamUserRepo,
  iamRoleRepo,
  sessionService,
  iamEventBus
);

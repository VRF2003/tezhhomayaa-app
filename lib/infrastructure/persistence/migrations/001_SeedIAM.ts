import { IMigration } from "./MigrationRunner";
import { RepositoryResolver } from "../resolver/RepositoryResolver";
import { IRoleRepository, IPermissionRepository } from "@/lib/iam";
import { BUILT_IN_ROLES, BUILT_IN_PERMISSIONS } from "@/lib/iam/roles/RoleRegistry";

export class SeedIAM_001 implements IMigration {
  version = 1;
  name = "001_SeedIAM";

  async up(): Promise<void> {
    const roleRepo = RepositoryResolver.resolve<IRoleRepository>("IRoleRepository");
    const permRepo = RepositoryResolver.resolve<IPermissionRepository>("IPermissionRepository");

    // Check if seeded
    const existingRoles = await roleRepo.findAll();
    if (existingRoles.length === 0) {
      for (const role of Object.values(BUILT_IN_ROLES)) {
        await roleRepo.create(role);
      }
      for (const perm of Object.values(BUILT_IN_PERMISSIONS)) {
        await permRepo.create(perm);
      }
    }
  }

  async down(): Promise<void> {
    const roleRepo = RepositoryResolver.resolve<IRoleRepository>("IRoleRepository");
    const permRepo = RepositoryResolver.resolve<IPermissionRepository>("IPermissionRepository");
    
    // In a real down migration we would delete these, but since they are built-in, 
    // it's safer to leave them or clear the collection.
  }
}

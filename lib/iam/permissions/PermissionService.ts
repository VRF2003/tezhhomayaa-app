import { Permission, Role, PermissionAction, PermissionResource, PermissionScope } from "../core/types";

export class PermissionService {
  /**
   * Evaluates if a given role possesses a specific permission logic.
   * Format of permissionToCheck: `{action}:{resource}:{scope}`
   * E.g., `Publish:Campaign:Global`
   */
  static can(role: Role, action: PermissionAction, resource: PermissionResource, scope: PermissionScope = "Global"): boolean {
    for (const perm of role.permissions) {
      // Super Admin override check
      if (perm.action === "Any" && perm.resource === "All") {
        return true;
      }
      
      const actionMatches = perm.action === "Any" || perm.action === action;
      const resourceMatches = perm.resource === "All" || perm.resource === resource;
      const scopeMatches = perm.scope === "Any" || perm.scope === scope;

      if (actionMatches && resourceMatches && scopeMatches) {
        return true;
      }
    }
    return false;
  }

  static cannot(role: Role, action: PermissionAction, resource: PermissionResource, scope: PermissionScope = "Global"): boolean {
    return !this.can(role, action, resource, scope);
  }

  static canAny(role: Role, requirements: { action: PermissionAction, resource: PermissionResource, scope?: PermissionScope }[]): boolean {
    for (const req of requirements) {
      if (this.can(role, req.action, req.resource, req.scope)) {
        return true;
      }
    }
    return false;
  }

  static canAll(role: Role, requirements: { action: PermissionAction, resource: PermissionResource, scope?: PermissionScope }[]): boolean {
    if (requirements.length === 0) return true;
    for (const req of requirements) {
      if (!this.can(role, req.action, req.resource, req.scope)) {
        return false;
      }
    }
    return true;
  }
}

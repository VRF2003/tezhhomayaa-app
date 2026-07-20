import { Permission } from "../../core/types";
import { IPermissionRepository } from "../IPermissionRepository";

export class InMemoryPermissionRepository implements IPermissionRepository {
  private permissions: Map<string, Permission> = new Map();

  constructor(initialData: Permission[] = []) {
    initialData.forEach(p => this.permissions.set(p.id, p));
  }

  async findById(id: string): Promise<Permission | null> {
    return this.permissions.get(id) || null;
  }

  async findAll(): Promise<Permission[]> {
    return Array.from(this.permissions.values());
  }

  async create(permission: Permission): Promise<void> {
    this.permissions.set(permission.id, permission);
  }

  async update(permission: Permission): Promise<void> {
    this.permissions.set(permission.id, permission);
  }

  async delete(id: string): Promise<void> {
    this.permissions.delete(id);
  }
}

import { Role } from "../../core/types";
import { IRoleRepository } from "../IRoleRepository";

export class InMemoryRoleRepository implements IRoleRepository {
  private roles: Map<string, Role> = new Map();

  constructor(initialData: Role[] = []) {
    initialData.forEach(r => this.roles.set(r.id, r));
  }

  async findById(id: string): Promise<Role | null> {
    return this.roles.get(id) || null;
  }

  async findByName(name: string): Promise<Role | null> {
    for (const role of this.roles.values()) {
      if (role.name === name) return role;
    }
    return null;
  }

  async findAll(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async create(role: Role): Promise<void> {
    this.roles.set(role.id, role);
  }

  async update(role: Role): Promise<void> {
    this.roles.set(role.id, role);
  }

  async delete(id: string): Promise<void> {
    this.roles.delete(id);
  }
}

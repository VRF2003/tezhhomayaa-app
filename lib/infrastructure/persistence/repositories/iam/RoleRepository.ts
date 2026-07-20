import { IRoleRepository } from "@/lib/iam/repositories/IRoleRepository";
import { Role } from "@/lib/iam/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class RoleRepository implements IRoleRepository {
  private collection = "iam_roles";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<Role | null> {
    return this.driver.read(this.collection, id);
  }

  async findAll(): Promise<Role[]> {
    return this.driver.query(this.collection);
  }

  async findByName(name: string): Promise<Role | null> {
    const results = await this.driver.query(this.collection, { name });
    return results.length > 0 ? (results[0] as Role) : null;
  }

  async create(role: Role): Promise<void> {
    await this.driver.write(this.collection, role.id, role);
  }

  async update(role: Role): Promise<void> {
    await this.driver.write(this.collection, role.id, role);
  }

  async delete(id: string): Promise<void> {
    await this.driver.delete(this.collection, id);
  }
}

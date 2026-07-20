import { IPermissionRepository } from "@/lib/iam/repositories/IPermissionRepository";
import { Permission } from "@/lib/iam/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class PermissionRepository implements IPermissionRepository {
  private collection = "iam_permissions";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<Permission | null> {
    return this.driver.read(this.collection, id);
  }

  async findAll(): Promise<Permission[]> {
    return this.driver.query(this.collection);
  }

  async create(permission: Permission): Promise<void> {
    await this.driver.write(this.collection, permission.id, permission);
  }

  async update(permission: Permission): Promise<void> {
    await this.driver.write(this.collection, permission.id, permission);
  }

  async delete(id: string): Promise<void> {
    await this.driver.delete(this.collection, id);
  }
}

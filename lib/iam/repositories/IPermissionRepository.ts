import { Permission } from "../core/types";

export interface IPermissionRepository {
  findById(id: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  create(permission: Permission): Promise<void>;
  update(permission: Permission): Promise<void>;
  delete(id: string): Promise<void>;
}

"use server";

import { iamUserRepo, iamRoleRepo, iamSessionRepo, iamPermissionRepo, sessionService } from "./server";
import { User, Role, Permission } from "./core/types";
import { revalidatePath } from "next/cache";

// Users
export async function getUsers() {
  return await iamUserRepo.findAll();
}

export async function createUser(user: User) {
  await iamUserRepo.create(user);
  revalidatePath("/admin/users");
}

export async function updateUser(user: User) {
  await iamUserRepo.update(user);
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  await iamUserRepo.delete(id);
  revalidatePath("/admin/users");
}

// Roles
export async function getRoles() {
  return await iamRoleRepo.findAll();
}

export async function createRole(role: Role) {
  await iamRoleRepo.create(role);
  revalidatePath("/admin/roles");
}

export async function updateRole(role: Role) {
  await iamRoleRepo.update(role);
  revalidatePath("/admin/roles");
}

export async function deleteRole(id: string) {
  await iamRoleRepo.delete(id);
  revalidatePath("/admin/roles");
}

// Permissions
export async function getPermissions() {
  return await iamPermissionRepo.findAll();
}

// Sessions
export async function getSessions() {
  return await iamSessionRepo.findAll();
}

export async function forceLogoutSession(sessionId: string) {
  await sessionService.revokeSession(sessionId);
  revalidatePath("/admin/sessions");
}

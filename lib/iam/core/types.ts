export interface AuditIdentity {
  actorId: string;
  timestamp: string;
}

export type PermissionAction = "Create" | "Read" | "Update" | "Delete" | "Publish" | "Manage" | "View" | "Rollback" | "ForceLogout" | "Any";
export type PermissionResource = "Campaign" | "Content" | "Market" | "SEO" | "Translation" | "User" | "Role" | "Permission" | "Session" | "Settings" | "Analytics" | "Order" | "Product" | "Stock" | "All";
export type PermissionScope = "Global" | "Market" | "Region" | "Self" | "Any";

export interface Permission {
  id: string;
  action: PermissionAction;
  resource: PermissionResource;
  scope: PermissionScope;
  description?: string;
}

export interface Role {
  id: string;
  name: string; // e.g., "Super Admin"
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  username?: string;
  name: string;
  roleId: string;
  passwordHash: string; // Argon2 hash
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  lastActivityAt: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string | null;
  location?: string; // Future reserved
}

export interface Identity {
  user: Omit<User, "passwordHash">;
  role: Role;
}

export interface AccessToken {
  token: string;
  expiresAt: number;
}

export interface RefreshToken {
  token: string;
  expiresAt: number;
}

export interface LoginAttempt {
  email: string;
  success: boolean;
  timestamp: string;
  ip: string;
  device: string;
}

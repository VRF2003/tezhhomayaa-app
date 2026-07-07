"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type Role = "Super Admin" | "Manager" | "Inventory" | "Customer Support";

export type Permission = "Products" | "Orders" | "Stock" | "Full Access";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "Super Admin": ["Full Access", "Products", "Orders", "Stock"],
  "Manager": ["Products", "Orders"],
  "Inventory": ["Products", "Stock"],
  "Customer Support": ["Orders"],
};

export type AdminUser = {
  email: string;
  name: string;
  role: Role;
};

// Mock Database
export const ADMIN_USERS: Record<string, AdminUser & { passwordHash: string }> = {
  "office@tezhhomayaa.com": { email: "office@tezhhomayaa.com", name: "System Admin", role: "Super Admin", passwordHash: "Tezh2026Admin" },
  "manager@tezhhomayaa.com": { email: "manager@tezhhomayaa.com", name: "Store Manager", role: "Manager", passwordHash: "Tezh2026Admin" },
  "inventory@tezhhomayaa.com": { email: "inventory@tezhhomayaa.com", name: "Inventory Controller", role: "Inventory", passwordHash: "Tezh2026Admin" },
  "support@tezhhomayaa.com": { email: "support@tezhhomayaa.com", name: "Support Agent", role: "Customer Support", passwordHash: "Tezh2026Admin" },
};

export function hasPermission(role: Role, requiredPermission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes("Full Access") || perms.includes(requiredPermission);
}

// ─── Component Wrapper ───────────────────────────────────────
export function AdminGuard({ children, requiredPermission }: { children: ReactNode; requiredPermission?: Permission }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tz_admin_user");
      if (!stored) {
        router.push("/admin");
        return;
      }
      
      const parsedUser = JSON.parse(stored) as AdminUser;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsedUser);

      if (requiredPermission && !hasPermission(parsedUser.role, requiredPermission)) {
        router.push("/admin/dashboard");
      } else {
        setAuthorized(true);
      }
    } catch {
      localStorage.removeItem("tz_admin_user");
      router.push("/admin");
    }
  }, [router, requiredPermission]);

  if (!authorized || !user) return null;

  return <>{children}</>;
}

export function useAdminUser() {
  const [user, setUser] = useState<AdminUser | null>(null);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tz_admin_user");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);
  
  return user;
}

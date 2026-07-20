"use client";

import React, { ReactNode } from "react";
// In a real implementation, we would hook into IAM service context here
// import { usePermissions } from "@/lib/infrastructure/iam/hooks";

interface PermissionGuardProps {
  requiredPermissions?: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ requiredPermissions, children, fallback = null }: PermissionGuardProps) {
  // const userPermissions = usePermissions();
  // const hasAccess = !requiredPermissions || requiredPermissions.every(p => userPermissions.includes(p));
  
  const hasAccess = true; // Stubbed for EXP foundation until fully wired

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

"use client";

import React, { ReactNode } from "react";
import { EnterpriseLayout } from "../layout/EnterpriseLayout";
// Note: In the future, Context Providers (Theme, IAM, EventBus Contexts) wrap this shell.

export function EnterpriseShell({ children }: { children: ReactNode }) {
  return (
    <EnterpriseLayout>
      {children}
    </EnterpriseLayout>
  );
}

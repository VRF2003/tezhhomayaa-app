"use client";

import React, { useEffect } from "react";
import { EnterpriseShell } from "@/lib/ui/enterprise/core/EnterpriseShell";
import { CommandPalette } from "@/lib/ui/enterprise/command/CommandPalette";
import { bootstrapEnterpriseUI } from "@/lib/ui/enterprise/bootstrap";

// Run registry bootstrap before initial render
bootstrapEnterpriseUI();

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {

  return (
    <EnterpriseShell>
      {children}
      <CommandPalette />
    </EnterpriseShell>
  );
}

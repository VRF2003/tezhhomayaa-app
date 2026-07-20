import { ReactNode } from "react";

export type NavigationSection = "BUSINESS" | "ADMINISTRATION" | "PLATFORM";

export type WorkspaceAction = {
  label: string;
  href: string;
};

export type WorkspaceSubItem = {
  id: string;
  label: string;
  href: string;
};

export interface Workspace {
  id: string;
  name: string;
  navigationSection: NavigationSection;
  route: string;
  description: string;
  breadcrumb: string;
  searchPlaceholder: string;
  primaryAction?: WorkspaceAction;
  quickActions?: WorkspaceAction[];
  defaultExpanded?: boolean;
  themeToken?: string;
  subItems?: WorkspaceSubItem[];
  order?: number;
  requiredPermissions?: { action: string; resource: string }[];
  always?: boolean;
}

export class WorkspaceRegistry {
  private static workspaces: Map<string, Workspace> = new Map();

  static register(workspace: Workspace) {
    this.workspaces.set(workspace.id, workspace);
  }

  static unregister(id: string) {
    this.workspaces.delete(id);
  }

  static getAll(): Workspace[] {
    return Array.from(this.workspaces.values()).sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  static getGrouped(): Record<NavigationSection, Workspace[]> {
    const all = this.getAll();
    const grouped: Record<NavigationSection, Workspace[]> = {
      BUSINESS: [],
      ADMINISTRATION: [],
      PLATFORM: [],
    };
    for (const ws of all) {
      if (grouped[ws.navigationSection]) {
        grouped[ws.navigationSection].push(ws);
      } else {
        grouped["PLATFORM"].push(ws); // Fallback
      }
    }
    return grouped;
  }

  static getActiveWorkspace(pathname: string): Workspace | null {
    const all = this.getAll();
    // Sort by length of route descending so more specific routes match first if needed
    // But since workspaces are top-level (e.g. /admin/products), we just match startsWith
    let bestMatch: Workspace | null = null;
    let longestMatch = 0;

    for (const ws of all) {
      if (pathname.startsWith(ws.route)) {
        if (ws.route.length > longestMatch) {
          longestMatch = ws.route.length;
          bestMatch = ws;
        }
      }
    }
    
    // Fallbacks for direct exact matches
    if (!bestMatch) {
      bestMatch = all.find(ws => pathname === ws.route) || null;
    }

    return bestMatch;
  }
}

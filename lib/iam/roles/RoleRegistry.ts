import { Permission, Role } from "../core/types";

export const BUILT_IN_PERMISSIONS: Record<string, Permission> = {
  // Global Access
  FULL_ACCESS: { id: "perm_full_access", action: "Any", resource: "All", scope: "Any", description: "Absolute control over the system" },
  
  // Campaign & Content
  PUBLISH_CAMPAIGN: { id: "perm_publish_campaign", action: "Publish", resource: "Campaign", scope: "Global" },
  MANAGE_CONTENT: { id: "perm_manage_content", action: "Manage", resource: "Content", scope: "Global" },
  VIEW_CONTENT: { id: "perm_view_content", action: "View", resource: "Content", scope: "Global" },
  ROLLBACK_CONTENT: { id: "perm_rollback_content", action: "Rollback", resource: "Content", scope: "Global" },
  
  // Settings & Markets
  MANAGE_MARKETS: { id: "perm_manage_markets", action: "Manage", resource: "Market", scope: "Global" },
  MANAGE_SEO: { id: "perm_manage_seo", action: "Manage", resource: "SEO", scope: "Global" },
  MANAGE_TRANSLATIONS: { id: "perm_manage_translations", action: "Manage", resource: "Translation", scope: "Global" },
  MANAGE_SETTINGS: { id: "perm_manage_settings", action: "Manage", resource: "Settings", scope: "Global" },
  
  // IAM
  MANAGE_USERS: { id: "perm_manage_users", action: "Manage", resource: "User", scope: "Global" },
  MANAGE_ROLES: { id: "perm_manage_roles", action: "Manage", resource: "Role", scope: "Global" },
  MANAGE_PERMISSIONS: { id: "perm_manage_permissions", action: "Manage", resource: "Permission", scope: "Global" },
  FORCE_LOGOUT: { id: "perm_force_logout", action: "ForceLogout", resource: "Session", scope: "Global" },
  
  // Analytics & Orders
  VIEW_ANALYTICS: { id: "perm_view_analytics", action: "View", resource: "Analytics", scope: "Global" },
  MANAGE_ORDERS: { id: "perm_manage_orders", action: "Manage", resource: "Order", scope: "Global" },
  MANAGE_PRODUCTS: { id: "perm_manage_products", action: "Manage", resource: "Product", scope: "Global" },
  MANAGE_STOCK: { id: "perm_manage_stock", action: "Manage", resource: "Stock", scope: "Global" },
};

export const BUILT_IN_ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    id: "role_super_admin",
    name: "Super Admin",
    description: "Unrestricted access to all modules and settings.",
    permissions: [BUILT_IN_PERMISSIONS.FULL_ACCESS],
  },
  ADMINISTRATOR: {
    id: "role_admin",
    name: "Administrator",
    description: "Can manage all commerce, content, and users, except IAM roles.",
    permissions: [
      BUILT_IN_PERMISSIONS.MANAGE_CONTENT,
      BUILT_IN_PERMISSIONS.PUBLISH_CAMPAIGN,
      BUILT_IN_PERMISSIONS.MANAGE_MARKETS,
      BUILT_IN_PERMISSIONS.MANAGE_SEO,
      BUILT_IN_PERMISSIONS.MANAGE_TRANSLATIONS,
      BUILT_IN_PERMISSIONS.MANAGE_SETTINGS,
      BUILT_IN_PERMISSIONS.MANAGE_USERS,
      BUILT_IN_PERMISSIONS.VIEW_ANALYTICS,
      BUILT_IN_PERMISSIONS.MANAGE_ORDERS,
      BUILT_IN_PERMISSIONS.MANAGE_PRODUCTS,
      BUILT_IN_PERMISSIONS.MANAGE_STOCK,
    ],
  },
  EDITOR: {
    id: "role_editor",
    name: "Editor",
    description: "Can create and edit content, but cannot publish campaigns.",
    permissions: [
      BUILT_IN_PERMISSIONS.MANAGE_CONTENT,
      BUILT_IN_PERMISSIONS.VIEW_ANALYTICS,
    ],
  },
  PUBLISHER: {
    id: "role_publisher",
    name: "Publisher",
    description: "Can publish campaigns and rollback content.",
    permissions: [
      BUILT_IN_PERMISSIONS.PUBLISH_CAMPAIGN,
      BUILT_IN_PERMISSIONS.ROLLBACK_CONTENT,
      BUILT_IN_PERMISSIONS.VIEW_CONTENT,
    ],
  },
  REVIEWER: {
    id: "role_reviewer",
    name: "Reviewer",
    description: "Can view draft and published content for review purposes.",
    permissions: [
      BUILT_IN_PERMISSIONS.VIEW_CONTENT,
    ],
  },
  CONTENT_AUTHOR: {
    id: "role_author",
    name: "Content Author",
    description: "Can manage content, SEO, and translations.",
    permissions: [
      BUILT_IN_PERMISSIONS.MANAGE_CONTENT,
      BUILT_IN_PERMISSIONS.MANAGE_SEO,
      BUILT_IN_PERMISSIONS.MANAGE_TRANSLATIONS,
    ],
  },
  VIEWER: {
    id: "role_viewer",
    name: "Viewer",
    description: "Can only view analytics and read-only content.",
    permissions: [
      BUILT_IN_PERMISSIONS.VIEW_ANALYTICS,
      BUILT_IN_PERMISSIONS.VIEW_CONTENT,
    ],
  }
};

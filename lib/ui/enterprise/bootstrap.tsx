"use client";

import { WorkspaceRegistry } from "./registry/WorkspaceRegistry";
import { WidgetRegistry } from "./registry/WidgetRegistry";
import { CommandRegistry } from "./registry/CommandRegistry";
import React from "react";
import Link from "next/link";

export function bootstrapEnterpriseUI() {
  // 1. Dashboard
  WorkspaceRegistry.register({ 
    id: "dashboard", 
    name: "Dashboard", 
    route: "/admin/dashboard", 
    navigationSection: "BUSINESS",
    description: "Overview of your enterprise performance and activity.",
    breadcrumb: "Business / Dashboard",
    searchPlaceholder: "Search dashboard...",
    always: true, 
    order: 1 
  });
  
  // 2. Commerce / Products
  WorkspaceRegistry.register({ 
    id: "products", 
    name: "Products", 
    route: "/admin/products", 
    navigationSection: "BUSINESS",
    description: "Manage products, pricing, categories and inventory.",
    breadcrumb: "Business / Products",
    searchPlaceholder: "Search products, SKUs and categories...",
    primaryAction: { label: "+ New Product", href: "/admin/products/new" },
    quickActions: [
      { label: "Import Products", href: "/admin/import" },
      { label: "Bulk Edit", href: "/admin/products/bulk" }
    ],
    requiredPermissions: [{ action: "Manage", resource: "Product" }], 
    order: 2,
    subItems: [
      { id: "products-all", label: "All Products", href: "/admin/products" },
      { id: "products-tags", label: "Tag Library", href: "/admin/products/tags" },
      { id: "products-cols", label: "Collections", href: "/admin/products/collections" },
      { id: "products-active", label: "Active Products", href: "/admin/products?status=active" },
      { id: "products-draft", label: "Draft Products", href: "/admin/products?status=draft" },
      { id: "products-new", label: "Add Product", href: "/admin/products/new" },
    ]
  });

  WorkspaceRegistry.register({ 
    id: "categories", 
    name: "Categories", 
    route: "/admin/categories", 
    navigationSection: "BUSINESS",
    description: "Organize and curate your product categories.",
    breadcrumb: "Business / Categories",
    searchPlaceholder: "Search categories...",
    primaryAction: { label: "+ New Category", href: "/admin/categories/new" },
    requiredPermissions: [{ action: "Manage", resource: "Product" }], 
    order: 3 
  });
  
  // 3. Content
  WorkspaceRegistry.register({ 
    id: "pages", 
    name: "Pages", 
    route: "/admin/pages", 
    navigationSection: "BUSINESS",
    description: "Manage standard pages and legal documents.",
    breadcrumb: "Business / Pages",
    searchPlaceholder: "Search pages...",
    primaryAction: { label: "+ New Page", href: "/admin/pages/new" },
    requiredPermissions: [{ action: "Manage", resource: "Content" }], 
    order: 4 
  });

  WorkspaceRegistry.register({ 
    id: "lookbook", 
    name: "Lookbook", 
    route: "/admin/lookbook", 
    navigationSection: "BUSINESS",
    description: "Curate visual lookbooks for new collections.",
    breadcrumb: "Business / Lookbook",
    searchPlaceholder: "Search lookbooks...",
    requiredPermissions: [{ action: "Manage", resource: "Content" }], 
    order: 5 
  });

  WorkspaceRegistry.register({ 
    id: "campaigns", 
    name: "Campaigns", 
    route: "/admin/campaigns", 
    navigationSection: "BUSINESS",
    description: "Create, schedule and publish luxury campaigns.",
    breadcrumb: "Business / Campaigns",
    searchPlaceholder: "Search campaigns...",
    primaryAction: { label: "+ New Campaign", href: "/admin/campaigns/new" },
    requiredPermissions: [{ action: "Publish", resource: "Campaign" }], 
    order: 6 
  });

  WorkspaceRegistry.register({ 
    id: "seo", 
    name: "SEO Rules", 
    route: "/admin/seo", 
    navigationSection: "BUSINESS",
    description: "Manage global and page-specific SEO metadata.",
    breadcrumb: "Business / SEO Rules",
    searchPlaceholder: "Search SEO rules...",
    requiredPermissions: [{ action: "Manage", resource: "SEO" }], 
    order: 7 
  });

  WorkspaceRegistry.register({ 
    id: "translations", 
    name: "Translations", 
    route: "/admin/translations", 
    navigationSection: "BUSINESS",
    description: "Manage localized content across all regions.",
    breadcrumb: "Business / Translations",
    searchPlaceholder: "Search translations...",
    requiredPermissions: [{ action: "Manage", resource: "Translation" }], 
    order: 8 
  });

  WorkspaceRegistry.register({ 
    id: "publishing", 
    name: "Publishing", 
    route: "/admin/publishing", 
    navigationSection: "BUSINESS",
    description: "Review and deploy content to production.",
    breadcrumb: "Business / Publishing",
    searchPlaceholder: "Search publishing queue...",
    requiredPermissions: [{ action: "Publish", resource: "Campaign" }], 
    order: 9 
  });

  WorkspaceRegistry.register({ 
    id: "preview", 
    name: "Experience Preview", 
    route: "/admin/preview", 
    navigationSection: "BUSINESS",
    description: "Preview the storefront experience as different customer segments.",
    breadcrumb: "Business / Experience Preview",
    searchPlaceholder: "Search preview segments...",
    requiredPermissions: [{ action: "View", resource: "Content" }], 
    order: 10 
  });

  WorkspaceRegistry.register({ 
    id: "analytics", 
    name: "Analytics", 
    route: "/admin/analytics", 
    navigationSection: "BUSINESS",
    description: "Review performance and business metrics.",
    breadcrumb: "Business / Analytics",
    searchPlaceholder: "Search analytics...",
    requiredPermissions: [{ action: "View", resource: "Analytics" }], 
    order: 11 
  });
  
  WorkspaceRegistry.register({
    id: "content", 
    name: "Content", 
    route: "/admin/content", 
    navigationSection: "BUSINESS",
    description: "Manage structured content architectures.",
    breadcrumb: "Business / Content",
    searchPlaceholder: "Search content...",
    requiredPermissions: [{ action: "Manage", resource: "Content" }], 
    order: 12,
    subItems: [
      { id: "c-home", label: "Homepage", href: "/admin/content/homepage" },
      { id: "c-cols", label: "Collections", href: "/admin/content/collections" },
      { id: "c-prod", label: "Product Pages", href: "/admin/content/product-pages" },
      { id: "c-com", label: "Commerce", href: "/admin/content/commerce" },
      { id: "c-head", label: "Header", href: "/admin/content/header" },
      { id: "c-foot", label: "Footer", href: "/admin/content/footer" },
      { id: "c-menu", label: "Menus", href: "/admin/content/menus" },
      { id: "c-media", label: "Media Library", href: "/admin/content/media" },
      { id: "c-size", label: "Global Size Guide", href: "/admin/content/size-guide" },
      { id: "c-journal", label: "Journal", href: "/admin/content/journal" },
    ]
  });

  // 4. Operations
  WorkspaceRegistry.register({ 
    id: "orders", 
    name: "Orders", 
    route: "/admin/orders", 
    navigationSection: "BUSINESS",
    description: "Monitor and fulfil customer orders.",
    breadcrumb: "Business / Orders",
    searchPlaceholder: "Search orders, customers...",
    primaryAction: { label: "Export Orders", href: "/admin/orders/export" },
    requiredPermissions: [{ action: "Manage", resource: "Order" }], 
    order: 13 
  });

  WorkspaceRegistry.register({ 
    id: "customers", 
    name: "Customers", 
    route: "/admin/customers", 
    navigationSection: "BUSINESS",
    description: "View customer profiles and order history.",
    breadcrumb: "Business / Customers",
    searchPlaceholder: "Search customers...",
    requiredPermissions: [{ action: "Manage", resource: "Order" }], 
    order: 14 
  });

  WorkspaceRegistry.register({ 
    id: "subscribers", 
    name: "Subscribers", 
    route: "/admin/subscribers", 
    navigationSection: "BUSINESS",
    description: "Manage newsletter and marketing subscribers.",
    breadcrumb: "Business / Subscribers",
    searchPlaceholder: "Search subscribers...",
    requiredPermissions: [{ action: "Manage", resource: "Order" }], 
    order: 15 
  });

  WorkspaceRegistry.register({ 
    id: "inventory", 
    name: "Inventory", 
    route: "/admin/inventory", 
    navigationSection: "BUSINESS",
    description: "Track global stock levels across all locations.",
    breadcrumb: "Business / Inventory",
    searchPlaceholder: "Search inventory...",
    requiredPermissions: [{ action: "Manage", resource: "Stock" }], 
    order: 16 
  });

  // 5. System & Settings (ADMINISTRATION)
  WorkspaceRegistry.register({
    id: "iam", 
    name: "IAM & Security", 
    route: "/admin/users", 
    navigationSection: "ADMINISTRATION",
    description: "Manage users, permissions and enterprise security.",
    breadcrumb: "Administration / IAM & Security",
    searchPlaceholder: "Search users, email, roles...",
    primaryAction: { label: "+ Invite User", href: "/admin/users/invite" },
    requiredPermissions: [{ action: "Manage", resource: "User" }], 
    order: 17,
    subItems: [
      { id: "iam-users", label: "Users", href: "/admin/users" },
      { id: "iam-roles", label: "Roles", href: "/admin/roles" },
      { id: "iam-perms", label: "Permissions", href: "/admin/permissions" },
      { id: "iam-sess", label: "Sessions", href: "/admin/sessions" },
    ]
  });

  WorkspaceRegistry.register({
    id: "appearance", 
    name: "Appearance", 
    route: "/admin/appearance", 
    navigationSection: "ADMINISTRATION",
    description: "Configure global theme and typography settings.",
    breadcrumb: "Administration / Appearance",
    searchPlaceholder: "Search appearance settings...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 18,
    subItems: [
      { id: "app-mob", label: "Mobile Layout", href: "/admin/appearance/mobile" },
      { id: "app-typ", label: "Typography", href: "/admin/appearance/typography" },
      { id: "app-jrn", label: "Journal Theme", href: "/admin/appearance/journal-theme" },
    ]
  });

  WorkspaceRegistry.register({ 
    id: "settings", 
    name: "Settings", 
    route: "/admin/settings", 
    navigationSection: "ADMINISTRATION",
    description: "Manage core platform configurations.",
    breadcrumb: "Administration / Settings",
    searchPlaceholder: "Search settings...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 19 
  });

  // 6. Platform Infrastructure (PLATFORM)
  WorkspaceRegistry.register({ 
    id: "health", 
    name: "Platform Health", 
    route: "/admin/health", 
    navigationSection: "PLATFORM",
    description: "Monitor system health and incident reports.",
    breadcrumb: "Platform / Platform Health",
    searchPlaceholder: "Search system health...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 20 
  });

  WorkspaceRegistry.register({ 
    id: "activity", 
    name: "Activity Center", 
    route: "/admin/activity", 
    navigationSection: "PLATFORM",
    description: "Global activity and audit logs.",
    breadcrumb: "Platform / Activity Center",
    searchPlaceholder: "Search activity logs...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 21 
  });

  WorkspaceRegistry.register({ 
    id: "database", 
    name: "Database", 
    route: "/admin/database", 
    navigationSection: "PLATFORM",
    description: "Direct database and persistence monitoring.",
    breadcrumb: "Platform / Database",
    searchPlaceholder: "Search databases...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 22 
  });

  WorkspaceRegistry.register({ 
    id: "quality", 
    name: "Quality", 
    route: "/admin/quality", 
    navigationSection: "PLATFORM",
    description: "Code quality and testing insights.",
    breadcrumb: "Platform / Quality",
    searchPlaceholder: "Search quality metrics...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 23 
  });

  WorkspaceRegistry.register({ 
    id: "cache", 
    name: "Cache", 
    route: "/admin/cache", 
    navigationSection: "PLATFORM",
    description: "Manage caching strategies and invalidation.",
    breadcrumb: "Platform / Cache",
    searchPlaceholder: "Search cache keys...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 24 
  });

  WorkspaceRegistry.register({ 
    id: "deployment", 
    name: "Deployment", 
    route: "/admin/deployment", 
    navigationSection: "PLATFORM",
    description: "Manage Vercel deployments and builds.",
    breadcrumb: "Platform / Deployment",
    searchPlaceholder: "Search deployments...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 25 
  });

  WorkspaceRegistry.register({ 
    id: "media", 
    name: "Media", 
    route: "/admin/media", 
    navigationSection: "PLATFORM",
    description: "Manage Cloudinary media optimization.",
    breadcrumb: "Platform / Media",
    searchPlaceholder: "Search media configurations...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 26 
  });

  WorkspaceRegistry.register({ 
    id: "search", 
    name: "Search", 
    route: "/admin/search", 
    navigationSection: "PLATFORM",
    description: "Configure search engines and indexes.",
    breadcrumb: "Platform / Search",
    searchPlaceholder: "Search configurations...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 27 
  });

  WorkspaceRegistry.register({ 
    id: "observability", 
    name: "Observability", 
    route: "/admin/observability", 
    navigationSection: "PLATFORM",
    description: "View APM and performance traces.",
    breadcrumb: "Platform / Observability",
    searchPlaceholder: "Search observability...",
    requiredPermissions: [{ action: "Manage", resource: "Settings" }], 
    order: 28 
  });

  CommandRegistry.register({
    id: "goto-health",
    title: "Platform Health",
    subtitle: "Navigate to Platform Health Center",
    onSelect: () => { window.location.href = "/admin/health"; }
  });

  WidgetRegistry.register({
    id: "import-tool",
    title: "Shopify Product Import",
    requiredPermissions: ["Manage:Product"],
    component: () => (
      <Link href="/admin/import" style={{ textDecoration: "none" }}>
        <div style={{
          background: "#ffffff",
          border: "1px solid #e8e4df",
          padding: "2rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,24,0.04)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.5rem" }}>
            Shopify Product Import
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#7a7874", lineHeight: 1.6, flex: 1 }}>
            Upload your Shopify product export CSV to automatically populate all category and product pages.
          </p>
          <div style={{ marginTop: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18" }}>
            Launch Tool →
          </div>
        </div>
      </Link>
    )
  });
}


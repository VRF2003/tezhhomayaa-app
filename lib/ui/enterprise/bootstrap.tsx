"use client";

import { NavigationRegistry } from "./registry/NavigationRegistry";
import { WidgetRegistry } from "./registry/WidgetRegistry";
import { CommandRegistry } from "./registry/CommandRegistry";
import React from "react";
import Link from "next/link";

export function bootstrapEnterpriseUI() {
  // 1. Dashboard
  NavigationRegistry.register({ id: "dashboard", label: "Dashboard", href: "/admin/dashboard", always: true, order: 1 });
  
  // 2. Commerce / Products
  NavigationRegistry.register({ 
    id: "products", label: "Products", href: "/admin/products", 
    requiredPermissions: [{ action: "Manage", resource: "Product" }], order: 2,
    subItems: [
      { id: "products-all", label: "All Products", href: "/admin/products" },
      { id: "products-tags", label: "Tag Library", href: "/admin/products/tags" },
      { id: "products-cols", label: "Collections", href: "/admin/products/collections" },
      { id: "products-active", label: "Active Products", href: "/admin/products?status=active" },
      { id: "products-draft", label: "Draft Products", href: "/admin/products?status=draft" },
      { id: "products-new", label: "Add Product", href: "/admin/products/new" },
    ]
  });

  NavigationRegistry.register({ id: "categories", label: "Categories", href: "/admin/categories", requiredPermissions: [{ action: "Manage", resource: "Product" }], order: 3 });
  
  // 3. Content
  NavigationRegistry.register({ id: "pages", label: "Pages", href: "/admin/pages", requiredPermissions: [{ action: "Manage", resource: "Content" }], order: 4 });
  NavigationRegistry.register({ id: "lookbook", label: "Lookbook", href: "/admin/lookbook", requiredPermissions: [{ action: "Manage", resource: "Content" }], order: 5 });
  NavigationRegistry.register({ id: "campaigns", label: "Campaigns", href: "/admin/campaigns", requiredPermissions: [{ action: "Publish", resource: "Campaign" }], order: 6 });
  NavigationRegistry.register({ id: "seo", label: "SEO Rules", href: "/admin/seo", requiredPermissions: [{ action: "Manage", resource: "SEO" }], order: 7 });
  NavigationRegistry.register({ id: "translations", label: "Translations", href: "/admin/translations", requiredPermissions: [{ action: "Manage", resource: "Translation" }], order: 8 });
  NavigationRegistry.register({ id: "publishing", label: "Publishing", href: "/admin/publishing", requiredPermissions: [{ action: "Publish", resource: "Campaign" }], order: 9 });
  NavigationRegistry.register({ id: "preview", label: "Experience Preview", href: "/admin/preview", requiredPermissions: [{ action: "View", resource: "Content" }], order: 10 });
  NavigationRegistry.register({ id: "analytics", label: "Analytics", href: "/admin/analytics", requiredPermissions: [{ action: "View", resource: "Analytics" }], order: 11 });
  
  NavigationRegistry.register({
    id: "content", label: "Content", href: "/admin/content", requiredPermissions: [{ action: "Manage", resource: "Content" }], order: 12,
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
  NavigationRegistry.register({ id: "orders", label: "Orders", href: "/admin/orders", requiredPermissions: [{ action: "Manage", resource: "Order" }], order: 13 });
  NavigationRegistry.register({ id: "customers", label: "Customers", href: "/admin/customers", requiredPermissions: [{ action: "Manage", resource: "Order" }], order: 14 });
  NavigationRegistry.register({ id: "subscribers", label: "Subscribers", href: "/admin/subscribers", requiredPermissions: [{ action: "Manage", resource: "Order" }], order: 15 });
  NavigationRegistry.register({ id: "inventory", label: "Inventory", href: "/admin/inventory", requiredPermissions: [{ action: "Manage", resource: "Stock" }], order: 16 });

  // 5. System & Settings
  NavigationRegistry.register({
    id: "iam", label: "IAM & Security", href: "/admin/users", requiredPermissions: [{ action: "Manage", resource: "User" }], order: 17,
    subItems: [
      { id: "iam-users", label: "Users", href: "/admin/users" },
      { id: "iam-roles", label: "Roles", href: "/admin/roles" },
      { id: "iam-perms", label: "Permissions", href: "/admin/permissions" },
      { id: "iam-sess", label: "Sessions", href: "/admin/sessions" },
    ]
  });

  NavigationRegistry.register({
    id: "appearance", label: "Appearance", href: "/admin/appearance", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 18,
    subItems: [
      { id: "app-mob", label: "Mobile Layout", href: "/admin/appearance/mobile" },
      { id: "app-typ", label: "Typography", href: "/admin/appearance/typography" },
      { id: "app-jrn", label: "Journal Theme", href: "/admin/appearance/journal-theme" },
    ]
  });

  NavigationRegistry.register({ id: "settings", label: "Settings", href: "/admin/settings", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 19 });

  // 6. Platform Infrastructure (grouped together visually at the bottom, or just standard links)
  NavigationRegistry.register({ id: "health", label: "Platform Health", href: "/admin/health", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 20 });
  NavigationRegistry.register({ id: "activity", label: "Activity Center", href: "/admin/activity", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 21 });
  NavigationRegistry.register({ id: "database", label: "Database", href: "/admin/database", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 22 });
  NavigationRegistry.register({ id: "quality", label: "Quality", href: "/admin/quality", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 23 });
  NavigationRegistry.register({ id: "cache", label: "Cache", href: "/admin/cache", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 24 });
  NavigationRegistry.register({ id: "deployment", label: "Deployment", href: "/admin/deployment", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 25 });
  NavigationRegistry.register({ id: "media", label: "Media", href: "/admin/media", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 26 });
  NavigationRegistry.register({ id: "search", label: "Search", href: "/admin/search", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 27 });
  NavigationRegistry.register({ id: "observability", label: "Observability", href: "/admin/observability", requiredPermissions: [{ action: "Manage", resource: "Settings" }], order: 28 });

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

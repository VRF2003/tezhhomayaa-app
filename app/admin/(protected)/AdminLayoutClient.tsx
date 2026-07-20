"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useIdentity, PermissionService, PermissionAction, PermissionResource, PermissionScope } from "@/lib/iam";
import { logoutAction } from "@/lib/iam/actions";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { identity, isAuthenticated } = useIdentity();

  if (!isAuthenticated || !identity) {
    return null; // or a loading spinner, but middleware guarantees auth
  }

  const { user, role } = identity;

  const handleSignOut = async () => {
    await logoutAction();
    router.push("/admin");
  };

  // Helper for checking permission
  const checkPerm = (action: PermissionAction, resource: PermissionResource, scope: PermissionScope = "Global") => {
    return PermissionService.can(role, action, resource, scope);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", always: true },
    { 
      name: "Products", 
      href: "/admin/products", 
      show: checkPerm("Manage", "Product"),
      subItems: [
        { name: "All Products", href: "/admin/products" },
        { name: "Tag Library", href: "/admin/products/tags" },
        { name: "Collections", href: "/admin/products/collections" },
        { name: "Active Products", href: "/admin/products?status=active" },
        { name: "Draft Products", href: "/admin/products?status=draft" },
        { name: "Add Product", href: "/admin/products/new" },
      ]
    },
    { name: "Categories", href: "/admin/categories", show: checkPerm("Manage", "Product") },
    { name: "Pages", href: "/admin/pages", show: checkPerm("Manage", "Content") },
    { name: "Lookbook", href: "/admin/lookbook", show: checkPerm("Manage", "Content") },
    { name: "Campaigns", href: "/admin/campaigns", show: checkPerm("Publish", "Campaign") },
    { name: "SEO Rules", href: "/admin/seo", show: checkPerm("Manage", "SEO") },
    { name: "Translations", href: "/admin/translations", show: checkPerm("Manage", "Translation") },
    { name: "Publishing", href: "/admin/publishing", show: checkPerm("Publish", "Campaign") || checkPerm("Rollback", "Content") },
    { name: "Experience Preview", href: "/admin/preview", show: checkPerm("View", "Content") },
    { name: "Analytics", href: "/admin/analytics", show: checkPerm("View", "Analytics") },
    { 
      name: "Content", 
      href: "/admin/content", 
      show: checkPerm("Manage", "Content"),
      subItems: [
        { name: "Homepage", href: "/admin/content/homepage" },
        { name: "Collections", href: "/admin/content/collections" },
        { name: "Product Pages", href: "/admin/content/product-pages" },
        { name: "Commerce", href: "/admin/content/commerce" },
        { name: "Header", href: "/admin/content/header" },
        { name: "Footer", href: "/admin/content/footer" },
        { name: "Menus", href: "/admin/content/menus" },
        { name: "Media Library", href: "/admin/content/media" },
        { name: "Global Size Guide", href: "/admin/content/size-guide" },
        { name: "Journal", href: "/admin/content/journal" },
      ]
    },
    { name: "Orders", href: "/admin/orders", show: checkPerm("Manage", "Order") },
    { name: "Customers", href: "/admin/customers", show: checkPerm("Manage", "Order") },
    { name: "Subscribers", href: "/admin/subscribers", show: checkPerm("Manage", "Order") },
    { name: "Inventory", href: "/admin/inventory", show: checkPerm("Manage", "Stock") },
    { 
      name: "IAM & Security", 
      href: "/admin/users", 
      show: checkPerm("Manage", "User"),
      subItems: [
        { name: "Users", href: "/admin/users" },
        { name: "Roles", href: "/admin/roles" },
        { name: "Permissions", href: "/admin/permissions" },
        { name: "Sessions", href: "/admin/sessions" },
      ]
    },
    { 
      name: "Appearance", 
      href: "/admin/appearance", 
      show: checkPerm("Manage", "Settings"),
      subItems: [
        { name: "Mobile Layout", href: "/admin/appearance/mobile" },
        { name: "Typography", href: "/admin/appearance/typography" },
        { name: "Journal Theme", href: "/admin/appearance/journal-theme" },
      ]
    },
    { name: "Settings", href: "/admin/settings", show: checkPerm("Manage", "Settings") },
    { name: "Database", href: "/admin/database", show: checkPerm("Manage", "Settings") },
    { name: "Quality", href: "/admin/quality", show: checkPerm("Manage", "Settings") },
    { name: "Cache", href: "/admin/cache", show: checkPerm("Manage", "Settings") },
    { name: "Deployment", href: "/admin/deployment", show: checkPerm("Manage", "Settings") },
    { name: "Media", href: "/admin/media", show: checkPerm("Manage", "Settings") },
    { name: "Search", href: "/admin/search", show: checkPerm("Manage", "Settings") },
    { name: "Observability", href: "/admin/observability", show: checkPerm("Manage", "Settings") },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fafaf8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: "260px",
        background: "#ffffff",
        borderRight: "1px solid #e8e4df",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
      }}>
        <div style={{ padding: "2rem", borderBottom: "1px solid #e8e4df" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>
            TEZHHOMAYAA
          </p>
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginTop: "0.4rem", margin: 0 }}>
            ADMINISTRATION
          </p>
        </div>

        <nav style={{ padding: "2rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto" }}>
          {navItems.map((item) => {
            if (!item.always && !item.show) return null;
            
            const active = item.subItems 
              ? pathname.startsWith(item.href)
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <div key={item.name} style={{ display: "flex", flexDirection: "column" }}>
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "4px",
                    background: active && !item.subItems ? "#f7f5f2" : "transparent",
                    color: active ? "#1a1a18" : "#6b6865",
                    fontSize: "0.85rem",
                    fontWeight: active ? 500 : 400,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#fafaf8"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    {item.name}
                  </div>
                </Link>

                {item.subItems && active && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", paddingLeft: "2rem", marginTop: "0.2rem" }}>
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                        
                      return (
                        <Link key={sub.name} href={sub.href} style={{ textDecoration: "none" }}>
                          <div style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            color: isSubActive ? "#1a1a18" : "#9a9690",
                            fontSize: "0.75rem",
                            fontWeight: isSubActive ? 500 : 400,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => { if (!isSubActive) e.currentTarget.style.color = "#1a1a18"; }}
                          onMouseLeave={(e) => { if (!isSubActive) e.currentTarget.style.color = "#9a9690"; }}
                          >
                            {sub.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <header style={{
          height: "70px",
          background: "#ffffff",
          borderBottom: "1px solid #e8e4df",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 2rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.85rem", color: "#1a1a18", margin: "0 0 0.15rem", fontWeight: 500 }}>
                {user.name}
              </p>
              <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", margin: 0 }}>
                {role.name}
              </p>
            </div>
            <div style={{ width: "1px", height: "24px", background: "#e8e4df" }} />
            <button
              onClick={handleSignOut}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#6b6865", transition: "color 0.2s ease", padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#1a1a18"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6b6865"}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: "3rem", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

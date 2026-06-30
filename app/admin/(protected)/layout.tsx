"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminGuard, useAdminUser, hasPermission } from "@/lib/admin-auth";

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAdminUser();

  const handleSignOut = () => {
    localStorage.removeItem("tz_admin_user");
    router.push("/admin");
  };

  if (!user) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", req: "Full Access" as const, always: true },
    { 
      name: "Products", 
      href: "/admin/products", 
      req: "Products" as const,
      subItems: [
        { name: "All Products", href: "/admin/products" },
        { name: "Tag Library", href: "/admin/products/tags" },
        { name: "Collections", href: "/admin/products/collections" },
        { name: "Active Products", href: "/admin/products?status=active" },
        { name: "Draft Products", href: "/admin/products?status=draft" },
        { name: "Add Product", href: "/admin/products/new" },
      ]
    },
    { name: "Categories", href: "/admin/categories", req: "Products" as const },
    { name: "Pages", href: "/admin/pages", req: "Full Access" as const },
    { 
      name: "Content", 
      href: "/admin/content", 
      req: "Full Access" as const,
      subItems: [
        { name: "Homepage", href: "/admin/content/homepage" },
        { name: "Collections", href: "/admin/content/collections" },
        { name: "Product Pages", href: "/admin/content/product-pages" },
        { name: "Commerce", href: "/admin/content/commerce" },
        { name: "Header", href: "/admin/content/header" },
        { name: "Footer", href: "/admin/content/footer" },
        { name: "Menus", href: "/admin/content/menus" },
        { name: "Media Library", href: "/admin/content/media" },
      ]
    },
    { name: "Orders", href: "/admin/orders", req: "Orders" as const },
    { name: "Customers", href: "/admin/customers", req: "Orders" as const },
    { name: "Subscribers", href: "/admin/subscribers", req: "Orders" as const },
    { name: "Inventory", href: "/admin/inventory", req: "Stock" as const },
    { 
      name: "Appearance", 
      href: "/admin/appearance", 
      req: "Full Access" as const,
      subItems: [
        { name: "Mobile Layout", href: "/admin/appearance/mobile" },
        { name: "Typography", href: "/admin/appearance/typography" },
      ]
    },
    { name: "Settings", href: "/admin/settings", req: "Full Access" as const },
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

        <nav style={{ padding: "2rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navItems.map((item) => {
            if (!item.always && !hasPermission(user.role, item.req)) return null;
            
            // Check active state differently for Products which has subItems
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

                {/* Render sub-items if active */}
                {item.subItems && active && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", paddingLeft: "2rem", marginTop: "0.2rem" }}>
                    {item.subItems.map((sub) => {
                      // Compare exact URL (with query params if applicable) or pathname
                      const isSubActive = typeof window !== 'undefined' 
                        ? window.location.pathname + window.location.search === sub.href
                        : pathname === sub.href;
                        
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
                {user.role}
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

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <ProtectedLayoutContent>
        {children}
      </ProtectedLayoutContent>
    </AdminGuard>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/store";
import { useState } from "react";

export default function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [hovered, setHovered] = useState<string | null>(null);

  const links = [
    { label: "Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "Addresses", href: "/account/addresses" },
    { label: "Profile", href: "/account/profile" },
    { label: "Support", href: "/account/support" },
  ];

  return (
    <aside style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    }}>
      <h2 style={{
        fontFamily: "var(--font-dm-mono, monospace)",
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#9a9690",
        margin: 0,
      }}>
        My Account
      </h2>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {links.map(link => {
          const isActive = pathname === link.href;
          const isHovered = hovered === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "1.4rem",
                textDecoration: "none",
                color: "var(--obsidian)",
                opacity: isActive ? 1 : (isHovered ? 0.7 : 0.4),
                transition: "opacity 0.3s ease",
              }}
            >
              {link.label}
            </Link>
          );
        })}
        
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "1.4rem",
            color: "var(--obsidian)",
            opacity: hovered === "logout" ? 0.7 : 0.4,
            transition: "opacity 0.3s ease",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textAlign: "left",
            marginTop: "2rem",
          }}
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

"use client";

import { useAuth } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// ─── Shared Styles ────────────────────────────────────────────
const sansMenu: React.CSSProperties = {
  fontFamily: "var(--font-cormorant, serif)",
  fontWeight: 400,
  letterSpacing: "0.02em",
};

export default function AccountPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isLoggedIn, login, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const linksToRender = isLoggedIn ? [
    { label: "Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "Addresses", href: "/account/addresses" },
    { label: "Profile", href: "/account/profile" },
    { label: "Support", href: "/contact" },
    { label: "Logout", action: () => { logout(); } },
  ] : [
    { label: "Sign In", href: "/account/login" },
    { label: "Create Account", href: "/account/register" },
    { label: "Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "Addresses", href: "/account/addresses" },
    { label: "Profile", href: "/account/profile" },
    { label: "Support", href: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible overlay to catch clicks outside the panel */}
          <div 
            onClick={onClose} 
            style={{ position: "fixed", inset: 0, zIndex: 100 }} 
            aria-hidden="true" 
          />
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "100%", // Just below the icon
              right: "-2rem", // Slightly offset to center visually under the icon area
              marginTop: "2rem",
              background: "#ffffff",
              border: "1px solid #e8e6e1", // Thin separator border, no shadow
              padding: "3rem 4rem", // Generous editorial whitespace
              zIndex: 150,
              minWidth: "340px",
              display: "flex",
              flexDirection: "column",
            }}
            role="dialog"
            aria-label="My Account"
          >
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#9a9690",
              marginBottom: "2.5rem",
            }}>
              My Account
            </h3>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              {linksToRender.map((link) => (
                <li key={link.label}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      style={{
                        ...sansMenu,
                        fontSize: "1.25rem",
                        color: "var(--obsidian)",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "inline-block",
                        position: "relative",
                        opacity: hoveredLink && hoveredLink !== link.label ? 0.35 : 1, // Minimal text-only hover state
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href!}
                      onClick={onClose}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      style={{
                        ...sansMenu,
                        fontSize: "1.25rem",
                        color: "var(--obsidian)",
                        textDecoration: "none",
                        display: "inline-block",
                        position: "relative",
                        opacity: hoveredLink && hoveredLink !== link.label ? 0.35 : 1,
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart, useSearch, useWishlist, useAuth } from "@/lib/store";
import AccountPanel from "@/components/layout/AccountPanel";
import { MarketHeader } from "@/components/market/MarketHeader";


// ─── Icons ────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CartIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const WishlistIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// ─── Navigation Data ──────────────────────────────────────────
import { MainNavEntry } from "@/lib/types/menus";

// ─── Shared Styles ────────────────────────────────────────────
const sansMenu: React.CSSProperties = {
  fontFamily: "var(--font-cormorant, serif)",
  fontWeight: 400,
  letterSpacing: "0.02em",
};

// ─── Luxury Underline Link ─────────────────────────────────────
function LuxLink({
  href, children, onClick, style,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none", display: "inline-block", position: "relative", ...style }}
    >
      {children}
      <span style={{
        position: "absolute",
        bottom: "-2px",
        left: 0,
        height: "1px",
        width: hovered ? "100%" : "0%",
        background: "var(--obsidian)",
        transition: "width 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "block",
      }} />
    </Link>
  );
}

// ─── Content Fade wrapper (no remount, just content crossfade) ─
function FadeContent({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────
export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [accountPanelOpen, setAccountPanelOpen] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();

  const [headerSettings, setHeaderSettings] = useState<any>({
    logoImage: "/branding/tezhhomayaa-logo-v3.png",
    desktopLogoWidth: 420,
    mobileLogoWidth: 280,
    logoLinkUrl: "/",
    stickyHeader: true,
    transparentHeader: true
  });
  const [mainNav, setMainNav] = useState<MainNavEntry[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/api/header")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setHeaderSettings(json.data);
      })
      .catch(console.error);

    fetch("/api/menus")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setMainNav(json.data);
      })
      .catch(console.error);


  }, []);

  // Ecommerce hooks
  const { cartCount, openMiniCart } = useCart();
  const { openSearch } = useSearch();
  const { wishlist } = useWishlist();

  // Three independent, non-resetting state levels
  const [activeMain, setActiveMain] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);

  // Timeout refs for hover tolerance — prevents instant collapse on brief cursor gaps
  const closeMainTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeSubTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closePanelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (closeMainTimer.current) clearTimeout(closeMainTimer.current);
    if (closeSubTimer.current) clearTimeout(closeSubTimer.current);
    if (closePanelTimer.current) clearTimeout(closePanelTimer.current);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [panelOpen]);

  // Cleanup timers on unmount
  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const closePanel = useCallback(() => {
    clearAllTimers();
    setPanelOpen(false);
    setActiveMain(null);
    setActiveSub(null);
  }, [clearAllTimers]);

  // Tolerant setter: cancel any pending close, then set immediately
  const handleMainEnter = useCallback((label: string) => {
    clearAllTimers();
    setActiveMain(label);
    setActiveSub(null); // reset sub when switching main
  }, [clearAllTimers]);

  const handleMainNonExpandable = useCallback(() => {
    clearAllTimers();
    setActiveMain(null);
    setActiveSub(null);
  }, [clearAllTimers]);

  const handleSubEnter = useCallback((label: string) => {
    clearAllTimers();
    setActiveSub(label);
  }, [clearAllTimers]);

  const handleSubNone = useCallback(() => {
    clearAllTimers();
    // Delayed clear — 200ms tolerance so cursor can travel to col3 without flicker
    closeSubTimer.current = setTimeout(() => setActiveSub(null), 200);
  }, [clearAllTimers]);

  // When cursor leaves the entire panel → delayed close
  const handlePanelLeave = useCallback(() => {
    closePanelTimer.current = setTimeout(() => {
      setActiveMain(null);
      setActiveSub(null);
    }, 220);
  }, []);

  const handlePanelEnter = useCallback(() => {
    clearAllTimers();
  }, [clearAllTimers]);

  const activeEntry = mainNav.find((e) => e.label === activeMain);
  const activeSubEntry = activeEntry?.categories?.find((c) => c.label === activeSub);

  const col2Visible = !!(activeMain && activeEntry?.categories?.length);
  const col3Visible = !!(activeSub && activeSubEntry?.items?.length);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <motion.header
        className={`${headerSettings.stickyHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 z-50`}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 clamp(1rem, 4vw, 3rem)",
          height: "80px",
          background: scrolled || !headerSettings.transparentHeader ? "rgba(250, 250, 248, 0.96)" : "transparent",
          backdropFilter: scrolled || !headerSettings.transparentHeader ? "blur(20px)" : "none",
          borderBottom: scrolled || !headerSettings.transparentHeader ? "1px solid var(--border-soft)" : "1px solid transparent",
          transition: "background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.4s ease",
        }}
      >
        <style>{`
          .navbar-logo-img {
            height: clamp(38px, 4.5vw, 50px);
          }
          .header-icon-btn {
            font-size: 18px;
            position: relative;
          }
          .header-icon-btn.wishlist-btn {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: inherit;
          }
          @media (max-width: 768px) {
            .navbar-logo-img {
              height: calc(var(--mobile-logo-size, 1.05rem) * 2.25);
              width: 100%;
              max-width: 180px;
            }
            .header-icon-btn {
              font-size: var(--mobile-icon-size, 19px);
            }
          }
        `}</style>
        <div className="flex items-center justify-start" style={{ zIndex: 10 }}>
          <button
            className="icon-btn"
            onClick={() => { clearAllTimers(); setPanelOpen(true); }}
            aria-label="Open navigation menu"
            aria-expanded={panelOpen}
            id="nav-menu-trigger"
            style={{ width: "40px", flexDirection: "column", gap: "5px" }}
          >
            <span style={{ display: "block", width: "20px", height: "1px", background: "var(--slate)" }} />
            <span style={{ display: "block", width: "14px", height: "1px", background: "var(--slate)" }} />
            <span style={{ display: "block", width: "20px", height: "1px", background: "var(--slate)" }} />
          </button>
        </div>

        <div className="flex items-center justify-center">
          <Link href={headerSettings.logoLinkUrl || "/"} aria-label="Tezhhomayaa — home" className="pointer-events-auto" style={{ display: "block", paddingTop: "0.4rem", zIndex: 50, cursor: "pointer" }}>
            <Image
              src={headerSettings.logoImage || "/branding/tezhhomayaa-logo-v3.png"}
              alt="Tezhhomayaa"
              width={headerSettings.desktopLogoWidth || 420} height={156} priority
              className="navbar-logo-img"
              style={{ width: "auto", objectFit: "contain" }}
            />
          </Link>
        </div>

        <div className="flex items-center justify-end" style={{ zIndex: 10, gap: "clamp(1rem, 4vw, 1.8rem)" }}>
          {/* Currency */}
          <div className="hidden md:flex items-center">
            <MarketHeader />
          </div>

          {/* Search */}
          <button
            className="icon-btn header-icon-btn"
            onClick={openSearch}
            aria-label="Search"
            id="nav-search"
          >
            <SearchIcon />
          </button>

          {/* My Account */}
          <div style={{ position: "relative" }}>
            <button
              className="icon-btn header-icon-btn"
              onClick={() => setAccountPanelOpen(!accountPanelOpen)}
              aria-label="My Account"
              id="nav-account"
            >
              <UserIcon />
            </button>
            <AccountPanel 
              isOpen={accountPanelOpen} 
              onClose={() => setAccountPanelOpen(false)} 
            />
          </div>

          {/* Cart */}
          <button
            className="icon-btn header-icon-btn"
            onClick={openMiniCart}
            aria-label={`Shopping bag — ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            id="nav-cart"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-5px", right: "-5px",
                width: "14px", height: "14px",
                background: "#1a1a18", color: "#f7f5f2",
                borderRadius: "50%", fontSize: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-dm-mono, monospace)", letterSpacing: 0,
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </motion.header>

      {/* ── Navigation Overlay ──────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={closePanel}
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(26, 26, 24, 0.32)",
                backdropFilter: "blur(2px)",
              }}
            />

            {/* ── Panel Shell ─────────────────────────────────── */}
            {/*
              KEY ARCHITECTURE:
              - The shell slides in once. It does NOT remount when columns appear.
              - Columns 2 & 3 are ALWAYS in the DOM (width: 0 when hidden), so
                switching Women→Men never triggers a remount animation on col2.
              - Content inside col2/col3 uses AnimatePresence to crossfade.
              - All hover handlers use timeouts (200ms) to prevent flicker.
            */}
            <motion.div
              key="nav-panel"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.58, ease: [0.4, 0, 0.15, 1] }}
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handlePanelLeave}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 300,
                display: "flex",
                flexDirection: "row",
                // overflow hidden keeps col2/col3 invisible without layout shift
                overflow: "hidden",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              id="nav-panel"
            >

              {/* ─── COL 1: Main Categories ─────────────────── */}
              <div style={{
                width: isMobile ? "100vw" : "380px",
                flexShrink: 0,
                background: "var(--white)",
                borderRight: "1px solid var(--border-soft)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}>
                {/* Panel Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                  padding: "0 clamp(2rem, 5vw, 3rem)",
                  height: "80px",
                  borderBottom: "1px solid var(--border-soft)",
                }}>
                  <Image
                    src="/branding/tezhhomayaa-logo-v3.png" alt="Tezhhomayaa"
                    width={240} height={89}
                    style={{ width: "auto", height: "26px", objectFit: "contain" }}
                  />
                  <button className="icon-btn" onClick={closePanel} aria-label="Close navigation menu" id="nav-panel-close">
                    <CloseIcon />
                  </button>
                </div>

                {/* Main Nav List */}
                <nav style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }} aria-label="Site navigation">
                  <ul role="list" style={{
                    listStyle: "none",
                    margin: 0,
                    padding: "clamp(2rem, 4vw, 3rem) clamp(2rem, 5vw, 3rem) 1rem",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    {mainNav.map((entry, i) => {
                      const isActive = activeMain === entry.label;
                      const isExpandable = !!entry.expandable;

                      return (
                        <motion.li
                          key={entry.label}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 + 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          style={{ borderBottom: "1px solid var(--border-soft)" }}
                          onMouseEnter={() => {
                            if (!isMobile) {
                              if (isExpandable) handleMainEnter(entry.label);
                              else handleMainNonExpandable();
                            }
                          }}
                        >
                          <div 
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "1.35rem 0",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (isMobile) {
                                if (isExpandable) {
                                  if (isActive) {
                                    setActiveMain(null);
                                    setActiveSub(null);
                                  } else {
                                    handleMainEnter(entry.label);
                                  }
                                } else {
                                  handleMainNonExpandable();
                                }
                              }
                            }}
                          >
                            {isExpandable ? (
                              <span style={{
                                ...sansMenu,
                                fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                                color: "var(--obsidian)",
                                transition: "color 0.3s ease",
                                display: "inline-block",
                                position: "relative",
                              }}>
                                {entry.label}
                                <span style={{
                                  position: "absolute",
                                  bottom: "-2px",
                                  left: 0,
                                  height: "1px",
                                  width: isActive ? "100%" : "0%",
                                  background: "var(--obsidian)",
                                  transition: "width 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
                                  display: "block",
                                }} />
                              </span>
                            ) : (
                              <LuxLink
                                href={entry.href || "/"}
                                onClick={closePanel}
                                style={{
                                  ...sansMenu,
                                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                                  color: "var(--obsidian)",
                                }}
                              >
                                {entry.label}
                              </LuxLink>
                            )}
                            {isExpandable && (
                              <span style={{
                                fontSize: "1.1rem",
                                color: "var(--obsidian)",
                                transition: "color 0.3s ease, transform 0.3s ease",
                                transform: isActive ? (isMobile ? "rotate(90deg)" : "translateX(4px)") : (isMobile ? "rotate(0deg)" : "translateX(0)"),
                                display: "block",
                                lineHeight: 1,
                              }}>
                                ›
                              </span>
                            )}
                          </div>

                          <AnimatePresence>
                            {isMobile && isActive && isExpandable && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                style={{ overflow: "hidden" }}
                              >
                                <ul style={{ listStyle: "none", padding: "0.5rem 0 1rem 1rem", margin: 0 }}>
                                  {entry.categories?.map(cat => {
                                    const hasSubItems = !!(cat.items && cat.items.length > 0);
                                    const isSubActive = activeSub === cat.label;
                                    
                                    return (
                                      <li key={cat.label} style={{ marginBottom: hasSubItems ? "0" : "1rem" }}>
                                        <div 
                                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: "1rem" }}
                                          onClick={(e) => {
                                            if (hasSubItems) {
                                              e.preventDefault();
                                              setActiveSub(isSubActive ? null : cat.label);
                                            } else {
                                              closePanel();
                                            }
                                          }}
                                        >
                                          {hasSubItems ? (
                                            <span style={{ fontSize: "1.1rem", color: "var(--obsidian)", fontFamily: "var(--font-cormorant, serif)", display: "block", transition: "color 0.3s ease" }}>
                                              {cat.label}
                                            </span>
                                          ) : (
                                            <LuxLink href={cat.href || "/"} onClick={closePanel} style={{ fontSize: "1.1rem", color: "var(--obsidian)", fontFamily: "var(--font-cormorant, serif)", display: "block" }}>
                                              {cat.label}
                                            </LuxLink>
                                          )}
                                          {hasSubItems && (
                                            <span style={{
                                              fontSize: "1.1rem",
                                              color: "var(--obsidian)",
                                              transform: isSubActive ? "rotate(90deg)" : "rotate(0deg)",
                                              transition: "transform 0.3s ease, color 0.3s ease"
                                            }}>
                                              ›
                                            </span>
                                          )}
                                        </div>
                                        
                                        <AnimatePresence>
                                          {hasSubItems && isSubActive && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                              style={{ overflow: "hidden" }}
                                            >
                                              <ul style={{ listStyle: "none", padding: "0 0 1rem 1rem", margin: 0 }}>
                                                {cat.items!.map(item => (
                                                  <li key={item.label} style={{ marginBottom: "0.8rem" }}>
                                                    <LuxLink 
                                                      href={item.href || "/"} 
                                                      onClick={closePanel} 
                                                      style={{ 
                                                        fontSize: "0.75rem", 
                                                        color: "var(--obsidian)", 
                                                        fontFamily: "var(--font-dm-mono, monospace)",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.12em",
                                                        display: "block"
                                                      }}
                                                    >
                                                      {item.label}
                                                    </LuxLink>
                                                  </li>
                                                ))}
                                              </ul>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Catch hover events in the empty space below the menu items */}
                  <div 
                    style={{ flex: 1 }} 
                    onMouseEnter={() => { if (!isMobile) handleMainNonExpandable(); }} 
                  />

                  {/* Secondary Nav */}
                  <motion.div
                    onMouseEnter={() => { if (!isMobile) handleMainNonExpandable(); }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    style={{
                      marginTop: "auto",
                      padding: "1.5rem clamp(2rem, 5vw, 3rem) clamp(2rem, 4vw, 3rem)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.8rem",
                      borderTop: "1px solid var(--border-soft)",
                    }}
                  >
                    {!isLoggedIn ? (
                      <LuxLink
                        href="/account/login"
                        onClick={closePanel}
                        style={{
                          fontFamily: "var(--font-cormorant, serif)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--obsidian)",
                        }}
                      >
                        Sign In
                      </LuxLink>
                    ) : (
                      <div 
                        onClick={(e) => { e.preventDefault(); logout(); closePanel(); }}
                        style={{ cursor: "pointer" }}
                      >
                        <span style={{
                          fontFamily: "var(--font-cormorant, serif)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--obsidian)",
                        }}>
                          Logout
                        </span>
                      </div>
                    )}
                    <LuxLink
                      href="/account/orders"
                      onClick={closePanel}
                      style={{
                        fontFamily: "var(--font-cormorant, serif)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--obsidian)",
                      }}
                    >
                      My Order
                    </LuxLink>
                    <LuxLink
                      href="/contact"
                      onClick={closePanel}
                      style={{
                        fontFamily: "var(--font-cormorant, serif)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--obsidian)",
                      }}
                    >
                      Contact Us
                    </LuxLink>
                    
                    <div className="md:hidden" style={{ paddingTop: "1rem", marginTop: "0.5rem", borderTop: "1px solid var(--border-soft)" }}>
                      <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Market</p>
                      <MarketHeader />
                    </div>
                  </motion.div>
                </nav>
              </div>

              {/* ─── COL 2: Subcategories ──────────────────────
                  This column is ALWAYS mounted. Width animates 0→320px.
                  This prevents remount animation when switching Women↔Men.
                  Content inside crossfades via AnimatePresence.
              ─────────────────────────────────────────────── */}
              <motion.div
                animate={{ width: !isMobile && col2Visible ? 320 : 0, opacity: !isMobile && col2Visible ? 1 : 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flexShrink: 0,
                  background: "var(--white)",
                  borderRight: col2Visible ? "1px solid var(--border-soft)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  paddingTop: "80px",
                }}
              >
                <AnimatePresence mode="wait">
                  {col2Visible && activeEntry && (
                    <FadeContent id={activeMain!}>
                      {/* Col 2 section label */}
                      <div style={{
                        padding: "clamp(1.8rem, 3.5vw, 2.8rem) clamp(1.8rem, 3.5vw, 2.5rem) 1.2rem",
                        borderBottom: "1px solid var(--border-soft)",
                        flexShrink: 0,
                      }}>
                        <span style={{
                          ...sansMenu,
                          fontSize: "0.65rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase" as const,
                          color: "var(--obsidian)",
                          opacity: 0.65,
                        }}>
                          {activeMain}
                        </span>
                      </div>

                      <ul role="list" style={{
                        listStyle: "none",
                        margin: 0,
                        padding: "1.2rem clamp(1.8rem, 3.5vw, 2.5rem)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                      }}>
                        {activeEntry.categories?.map((cat, ci) => {
                          const isSubActive = activeSub === cat.label;
                          const hasItems = !!(cat.items && cat.items.length > 0);

                          return (
                            <li
                              key={cat.label}
                              style={{ borderBottom: "1px solid var(--border-soft)" }}
                              onMouseEnter={() => {
                                if (hasItems) handleSubEnter(cat.label);
                                else handleSubNone();
                              }}
                            >
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "1.1rem 0",
                                cursor: "pointer",
                              }}>
                                {hasItems ? (
                                  <span style={{
                                      ...sansMenu,
                                      fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                                      color: "var(--obsidian)",
                                      transition: "color 0.3s ease",
                                    display: "inline-block",
                                    position: "relative",
                                  }}>
                                    {cat.label}
                                    <span style={{
                                      position: "absolute",
                                      bottom: "-2px",
                                      left: 0,
                                      height: "1px",
                                      width: isSubActive ? "100%" : "0%",
                                      background: "var(--obsidian)",
                                      transition: "width 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
                                      display: "block",
                                    }} />
                                  </span>
                                ) : (
                                  <LuxLink
                                    href={cat.href}
                                    onClick={closePanel}
                                    style={{
                                      ...sansMenu,
                                      fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                                      color: "var(--obsidian)",
                                    }}
                                  >
                                    {cat.label}
                                  </LuxLink>
                                )}
                                {hasItems && (
                                  <span style={{
                                    fontSize: "1rem",
                                    color: "var(--obsidian)",
                                    transition: "color 0.3s ease, transform 0.3s ease",
                                    transform: isSubActive ? "translateX(4px)" : "translateX(0)",
                                    lineHeight: 1,
                                  }}>
                                    ›
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </FadeContent>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ─── COL 3: Nested Items ───────────────────────
                  Also always mounted. Width animates 0→290px.
                  Content crossfades via AnimatePresence.
              ─────────────────────────────────────────────── */}
              <motion.div
                animate={{ width: col3Visible ? 290 : 0, opacity: col3Visible ? 1 : 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flexShrink: 0,
                  background: "var(--white)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  paddingTop: "80px",
                }}
              >
                <AnimatePresence mode="wait">
                  {col3Visible && activeSubEntry && (
                    <FadeContent id={activeSub!}>
                      {/* Col 3 section label */}
                      <div style={{
                        padding: "clamp(1.8rem, 3.5vw, 2.8rem) clamp(1.8rem, 3.5vw, 2.5rem) 1.2rem",
                        borderBottom: "1px solid var(--border-soft)",
                        flexShrink: 0,
                      }}>
                        <span style={{
                          ...sansMenu,
                          fontSize: "0.65rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase" as const,
                          color: "var(--obsidian)",
                          opacity: 0.65,
                        }}>
                          {activeSub}
                        </span>
                      </div>

                      <ul role="list" style={{
                        listStyle: "none",
                        margin: 0,
                        padding: "1.2rem clamp(1.8rem, 3.5vw, 2.5rem)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                      }}>
                        {/* View All */}
                        <li style={{ paddingBottom: "0.9rem", borderBottom: "1px solid var(--border-soft)", marginBottom: "0.4rem" }}>
                          <LuxLink
                            href={activeSubEntry.href}
                            onClick={closePanel}
                            style={{
                              fontFamily: "var(--font-cormorant, serif)",
                              fontStyle: "normal",
                              fontWeight: 400,
                              fontSize: "0.85rem",
                              color: "var(--obsidian)",
                              letterSpacing: "0.04em",
                              opacity: 0.7,
                            }}
                          >
                            View All {activeSub}
                          </LuxLink>
                        </li>

                        {activeSubEntry.items?.map((item, ii) => (
                          <motion.li
                            key={item.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: ii * 0.04, duration: 0.35 }}
                            style={{ borderBottom: "1px solid var(--border-soft)" }}
                          >
                            <div style={{ padding: "0.95rem 0" }}>
                              <LuxLink
                                href={item.href}
                                onClick={closePanel}
                                style={{
                                  fontFamily: "var(--font-cormorant, serif)",
                                  fontWeight: 400,
                                  fontSize: "clamp(1rem, 1.4vw, 1.1rem)",
                                  color: "var(--obsidian)",
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {item.label}
                              </LuxLink>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </FadeContent>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

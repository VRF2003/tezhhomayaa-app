"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice } from "@/lib/currency";
import { useCommerce } from "@/lib/commerce-context";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

export default function MiniCart() {
  const { miniCartOpen, closeMiniCart, items, cartCount, cartTotalRaw, removeFromCart, updateQty } = useCart();
  const { formatPrice } = useCurrency();
  const commerce = useCommerce();
  const mc = commerce.miniCart;
  const sh = commerce.shipping;
  const st = commerce.style;

  useEffect(() => {
    document.body.style.overflow = miniCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [miniCartOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeMiniCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeMiniCart]);

  const shippingMsg = cartTotalRaw >= sh.freeShippingThreshold
    ? sh.freeShippingUnlocked
    : sh.freeShippingMessage.replace("{threshold}", formatPrice(sh.freeShippingThreshold));

  return (
    <AnimatePresence>
      {miniCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMiniCart}
            aria-hidden="true"
            style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(26,26,24,0.28)", backdropFilter: "blur(2px)" }}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.15, 1] }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 900,
              width: `min(${st.miniCartWidth || "440px"}, 100vw)`,
              background: st.miniCartBg || "#faf9f7",
              display: "flex", flexDirection: "column",
              boxShadow: "-4px 0 40px rgba(26,26,24,0.08)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 clamp(1.5rem, 4vw, 2rem)",
              height: "72px", flexShrink: 0,
              borderBottom: `1px solid ${st.cartBorderColor || "#ddd9d4"}`,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "1.25rem", color: st.cartTextColor || "#1a1a18", letterSpacing: "0.02em" }}>
                  {mc.drawerTitle}
                </span>
                {cartCount > 0 && (
                  <span style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.14em", color: "#9a9690" }}>
                    {cartCount} {cartCount === 1 ? mc.itemSingularLabel : mc.itemPluralLabel}
                  </span>
                )}
              </div>
              <button
                onClick={closeMiniCart}
                aria-label="Close cart"
                id="cart-close"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", color: st.cartTextColor || "#1a1a18", display: "flex", alignItems: "center" }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Free shipping progress */}
            {sh.progressBarEnabled && items.length > 0 && (
              <div style={{ padding: "0.75rem clamp(1.5rem, 4vw, 2rem)", background: "#f5f3ef", borderBottom: `1px solid ${st.cartBorderColor || "#ddd9d4"}`, flexShrink: 0 }}>
                <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.46rem", letterSpacing: "0.12em", color: "#6b6865", margin: "0 0 0.4rem", textTransform: "uppercase" }}>
                  {shippingMsg}
                </p>
                <div style={{ height: "2px", background: st.cartBorderColor || "#e8e4df", borderRadius: "1px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((cartTotalRaw / sh.freeShippingThreshold) * 100, 100)}%`, background: sh.progressBarColor || "#1a1a18", transition: "width 0.4s ease", borderRadius: "1px" }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2rem)" }}>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: "5rem" }}>
                  <p style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontStyle: "italic", fontSize: "1.2rem", color: "#9a9690", letterSpacing: "0.04em" }}>
                    {mc.emptyStateText}
                  </p>
                  <Link
                    href={mc.emptyStateCtaUrl || "/"}
                    onClick={closeMiniCart}
                    style={{
                      display: "inline-block", marginTop: "1.5rem", padding: "0.85rem 2rem",
                      background: "transparent", border: `1px solid ${st.cartBorderColor || "#ccc9c4"}`, cursor: "pointer",
                      fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                      letterSpacing: "0.18em", textTransform: "uppercase", color: st.cartTextColor || "#3a3835",
                      textDecoration: "none",
                    }}
                  >
                    {mc.emptyStateCta}
                  </Link>
                </div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {items.map((item) => {
                    const key = `${item.product.slug}::${item.selectedSize ?? ""}`;
                    return (
                      <li key={key} style={{ display: "flex", gap: "1rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${st.cartBorderColor || "#edeae5"}` }}>
                        {/* Thumbnail */}
                        <Link href={item.product.href} onClick={closeMiniCart} style={{ flexShrink: 0, display: "block" }}>
                          <div style={{ position: "relative", width: "80px", height: "107px", background: "#edeae5", overflow: "hidden" }}>
                            <Image src={item.product.image} alt={item.product.name} fill sizes="80px" style={{ objectFit: "cover" }} />
                          </div>
                        </Link>

                        {/* Info */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <Link href={item.product.href} onClick={closeMiniCart} style={{ textDecoration: "none" }}>
                            <p style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "0.98rem", color: st.cartTextColor || "#1a1a18", margin: 0, letterSpacing: "0.01em" }}>
                              {item.product.name}
                            </p>
                          </Link>
                          {item.selectedSize && (
                            <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.46rem", letterSpacing: "0.14em", color: "#9a9690", margin: 0, textTransform: "uppercase" }}>
                              {mc.sizeLabelPrefix} {item.selectedSize}
                            </p>
                          )}
                          <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#3a3835", margin: 0 }}>
                            {formatPrice(getProductPrice(item.product))}
                          </p>

                          {/* Qty + Remove */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${st.cartBorderColor || "#ddd9d4"}` }}>
                              <button onClick={() => updateQty(item.product.slug, item.selectedSize, item.quantity - 1)} aria-label="Decrease quantity" style={{ width: "28px", height: "28px", background: "none", border: "none", cursor: "pointer", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.75rem", color: st.cartTextColor || "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                              <span style={{ width: "28px", textAlign: "center", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.08em", color: st.cartTextColor || "#1a1a18" }}>{item.quantity}</span>
                              <button onClick={() => updateQty(item.product.slug, item.selectedSize, item.quantity + 1)} aria-label="Increase quantity" style={{ width: "28px", height: "28px", background: "none", border: "none", cursor: "pointer", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.75rem", color: st.cartTextColor || "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.product.slug, item.selectedSize)} aria-label={`Remove ${item.product.name} from cart`} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a9690", display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.44rem", letterSpacing: "0.1em" }}>
                              <TrashIcon /> {mc.removeLabel}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ flexShrink: 0, padding: "clamp(1.2rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2rem)", borderTop: `1px solid ${st.cartBorderColor || "#ddd9d4"}`, background: st.miniCartBg || "#faf9f7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem" }}>
                  <span style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9690" }}>
                    {mc.subtotalLabel}
                  </span>
                  <span style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "1.15rem", color: st.cartTextColor || "#1a1a18", letterSpacing: "0.03em" }}>
                    {formatPrice(cartTotalRaw)}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={closeMiniCart}
                  id="view-cart-btn"
                  style={{
                    display: "block", width: "100%", padding: "1.1rem",
                    background: st.checkoutButtonBg || "#1a1a18", color: st.checkoutButtonColor || "#f7f5f2",
                    textDecoration: "none", textAlign: "center",
                    fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: st.addToBagFontSize || "0.55rem",
                    letterSpacing: st.addToBagLetterSpacing || "0.2em", textTransform: "uppercase",
                    boxSizing: "border-box", marginBottom: "0.6rem",
                    transition: "background 0.3s",
                  }}
                >
                  {mc.viewCartLabel}
                </Link>
                <button
                  onClick={closeMiniCart}
                  style={{
                    display: "block", width: "100%", padding: "1.1rem",
                    background: "transparent", color: st.cartTextColor || "#3a3835",
                    fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: st.addToBagFontSize || "0.55rem",
                    letterSpacing: st.addToBagLetterSpacing || "0.2em", textTransform: "uppercase",
                    border: `1px solid ${st.cartBorderColor || "#ccc9c4"}`, cursor: "pointer",
                    boxSizing: "border-box", transition: "border-color 0.3s",
                  }}
                >
                  {mc.continueBrowsingLabel}
                </button>
                {(mc.trustBadgeEnabled) && (
                  <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.4rem", letterSpacing: "0.1em", color: "#9a9690", margin: "1rem 0 0", textAlign: "center", textTransform: "uppercase", lineHeight: 1.8 }}>
                    {mc.trustBadgeText}
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

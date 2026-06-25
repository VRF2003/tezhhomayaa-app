"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/store";
import { useCurrency } from "@/components/CurrencyProvider";
import { getProductPrice } from "@/lib/currency";
import { useCommerce } from "@/lib/commerce-context";

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

export default function CartPage() {
  const { items, cartCount, updateQty, removeFromCart, clearCart, cartTotalRaw } = useCart();
  const { formatPrice } = useCurrency();
  const commerce = useCommerce();
  const c = commerce.cart;
  const sh = commerce.shipping;
  const st = commerce.style;
  const cf = commerce.cartFooter;

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return null;

  const shippingMsg = cartTotalRaw >= sh.freeShippingThreshold
    ? sh.freeShippingUnlocked
    : (c.shippingMessage || sh.freeShippingMessage).replace("{threshold}", formatPrice(sh.freeShippingThreshold));

  return (
    <main style={{ minHeight: "100vh", background: st.cartBg || "#faf9f7" }}>
      <Navbar />
      <div style={{ height: "80px" }} />

      {c.headerImageEnabled && c.headerImageUrl && (
        <div style={{
          position: "relative", width: "100%", height: c.headerHeight || "35vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <Image src={c.headerImageUrl} alt="Cart Banner" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "#000", opacity: c.headerOverlayOpacity ?? 0.2 }} />
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 2rem" }}>
            <h1 style={{
              fontFamily: st.headingFont || "var(--font-cormorant, serif)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300,
              color: c.headerTextColor || "#ffffff", margin: "0 0 0.5rem",
              letterSpacing: "0.02em"
            }}>
              {c.headerTitle || c.pageTitle}
            </h1>
            {c.headerSubtitle && (
              <p style={{
                fontFamily: st.headingFont || "var(--font-cormorant, serif)",
                fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 300, fontStyle: "italic",
                color: c.headerTextColor || "#ffffff", margin: 0, opacity: 0.9,
                letterSpacing: "0.04em"
              }}>
                {c.headerSubtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: "clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 6rem)" }}>
        {/* Header */}
        {!(c.headerImageEnabled && c.headerImageUrl) && (
          <div style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
            paddingBottom: "1.5rem", borderBottom: `1px solid ${st.cartBorderColor || "#ddd9d4"}`,
          }}>
            <h1 style={{
              fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.02em",
              color: st.cartTextColor || "#1a1a18", margin: 0,
            }}>
              {c.pageTitle}
            </h1>
            {cartCount > 0 && (
              <span style={{
                fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                letterSpacing: "0.14em", color: "#9a9690", textTransform: "uppercase",
              }}>
                {cartCount} {cartCount === 1 ? c.itemSingularLabel : c.itemPluralLabel}
              </span>
            )}
          </div>
        )}

        {items.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: "center", paddingTop: "6rem", paddingBottom: "6rem" }}>
            <p style={{
              fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300,
              fontStyle: "italic", fontSize: "1.4rem", color: "#9a9690",
              letterSpacing: "0.04em", marginBottom: "2rem",
            }}>
              {c.emptyStateText}
            </p>
            <Link href={c.emptyStateCtaUrl || "/"} style={{
              fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.52rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: st.cartTextColor || "#1a1a18",
              textDecoration: "none", padding: "1rem 2.5rem",
              border: `1px solid ${st.cartTextColor || "#1a1a18"}`, display: "inline-block",
              transition: "background 0.3s, color 0.3s",
            }}>
              {c.emptyStateCta}
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr clamp(280px, 30%, 380px)",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "start",
          }}>
            {/* Items list */}
            <div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {items.map((item) => {
                  const key = `${item.product.slug}::${item.selectedSize ?? ""}`;
                  return (
                    <li key={key} style={{
                      display: "grid", gridTemplateColumns: "120px 1fr",
                      gap: "clamp(1rem, 3vw, 2rem)",
                      padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
                      borderBottom: `1px solid ${st.cartBorderColor || "#edeae5"}`,
                    }}>
                      <Link href={item.product.href} style={{ display: "block" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "133%", background: "#edeae5", overflow: "hidden" }}>
                          <Image src={item.product.image} alt={item.product.name} fill sizes="160px" style={{ objectFit: "cover" }} />
                        </div>
                      </Link>

                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "0.25rem" }}>
                        <div>
                          <Link href={item.product.href} style={{ textDecoration: "none" }}>
                            <h2 style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "clamp(1rem, 1.8vw, 1.3rem)", color: st.cartTextColor || "#1a1a18", margin: "0 0 0.4rem", letterSpacing: "0.01em" }}>
                              {item.product.name}
                            </h2>
                          </Link>
                          {item.selectedSize && (
                            <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.48rem", letterSpacing: "0.14em", color: "#9a9690", margin: "0 0 0.3rem", textTransform: "uppercase" }}>
                              {c.sizeLabelPrefix} {item.selectedSize}
                            </p>
                          )}
                          <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "#3a3835", margin: 0 }}>
                            {formatPrice(getProductPrice(item.product))}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${st.cartBorderColor || "#ddd9d4"}` }}>
                            <button onClick={() => updateQty(item.product.slug, item.selectedSize, item.quantity - 1)} aria-label="Decrease quantity" style={{ width: "36px", height: "36px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: st.cartTextColor || "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                            <span style={{ width: "36px", textAlign: "center", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.08em", color: st.cartTextColor || "#1a1a18" }}>{item.quantity}</span>
                            <button onClick={() => updateQty(item.product.slug, item.selectedSize, item.quantity + 1)} aria-label="Increase quantity" style={{ width: "36px", height: "36px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: st.cartTextColor || "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.slug, item.selectedSize)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a9690", display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.44rem", letterSpacing: "0.1em", padding: 0 }}>
                            <TrashIcon /> {c.removeLabel}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div style={{ paddingTop: "1.5rem" }}>
                <button onClick={clearCart} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.44rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9690", textDecoration: "underline", textUnderlineOffset: "3px", padding: 0 }}>
                  {c.clearCartLabel}
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ position: "sticky", top: "100px", background: st.summaryBg || "#f0ede8", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
              <h2 style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "1.2rem", color: st.cartTextColor || "#1a1a18", letterSpacing: "0.04em", margin: "0 0 1.8rem" }}>
                {c.orderSummaryTitle}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${st.cartBorderColor || "#ddd9d4"}` }}>
                {items.map((item) => (
                  <div key={`${item.product.slug}::${item.selectedSize}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
                    <span style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "0.92rem", color: "#3a3835", flex: 1 }}>
                      {item.quantity} × {item.product.name} {item.selectedSize ? `(${item.selectedSize})` : ""}
                    </span>
                    <span style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.48rem", letterSpacing: "0.1em", color: st.cartTextColor || "#1a1a18", whiteSpace: "nowrap" }}>
                      {formatPrice(getProductPrice(item.product) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9690" }}>{c.subtotalLabel}</span>
                <span style={{ fontFamily: st.headingFont || "var(--font-cormorant, serif)", fontWeight: 300, fontSize: "1.3rem", color: st.cartTextColor || "#1a1a18", letterSpacing: "0.02em" }}>{formatPrice(cartTotalRaw)}</span>
              </div>

              {/* Shipping row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
                <span style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9690" }}>{c.shippingLabel}</span>
                <span style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.48rem", letterSpacing: "0.08em", color: "#6b6865" }}>{c.shippingValue}</span>
              </div>

              <button id="checkout-btn" style={{ display: "block", width: "100%", padding: "1.2rem", background: st.checkoutButtonBg || "#1a1a18", color: st.checkoutButtonColor || "#f7f5f2", border: "none", cursor: "pointer", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: st.addToBagFontSize || "0.55rem", letterSpacing: st.addToBagLetterSpacing || "0.2em", textTransform: "uppercase", marginBottom: "0.75rem", transition: "background 0.3s", boxSizing: "border-box" }}>
                {c.checkoutButtonLabel}
              </button>

              <Link href={c.continueBrowsingUrl || "/"} style={{ display: "block", width: "100%", padding: "1.1rem", background: "transparent", color: "#3a3835", fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: st.addToBagFontSize || "0.55rem", letterSpacing: st.addToBagLetterSpacing || "0.2em", textTransform: "uppercase", textDecoration: "none", border: `1px solid ${st.cartBorderColor || "#ccc9c4"}`, textAlign: "center", boxSizing: "border-box", transition: "border-color 0.3s" }}>
                {c.continueBrowsingLabel}
              </Link>

              {/* Trust messages */}
              <div style={{ marginTop: "1.5rem" }}>
                {c.shippingMessageEnabled && (
                  <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.44rem", letterSpacing: "0.1em", color: "#9a9690", margin: "0 0 0.4rem", lineHeight: 1.9, textTransform: "uppercase", textAlign: "center" }}>
                    {shippingMsg}
                  </p>
                )}
                {c.giftPackagingEnabled && (
                  <p style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.44rem", letterSpacing: "0.1em", color: "#9a9690", margin: 0, lineHeight: 1.9, textTransform: "uppercase", textAlign: "center" }}>
                    {c.giftPackagingMessage}
                  </p>
                )}
                {cf.trustMessagesEnabled && cf.trustMessages?.filter(t => t.enabled).map((t, i) => (
                  <p key={i} style={{ fontFamily: st.bodyFont || "var(--font-dm-mono, monospace)", fontSize: "0.4rem", letterSpacing: "0.08em", color: "#9a9690", margin: "0.3rem 0 0", textAlign: "center" }}>
                    {t.icon} {t.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

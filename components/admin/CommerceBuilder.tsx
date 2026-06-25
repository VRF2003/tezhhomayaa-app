"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CommerceData, defaultCommerceData,
  CommerceAddToBagSettings, CommerceMiniCartSettings, CommerceCartSettings,
  CommerceCheckoutSettings, CommerceShippingMessages, CommerceEmptyCartSettings,
  CommerceRecommendedSettings, CommerceCartFooterSettings, CommerceStyleSettings,
} from "@/lib/types/commerce";

// ─── Safe helpers ──────────────────────────────────────────────────────────────
const safeStr = (v: unknown, fallback = ""): string => typeof v === "string" ? v : fallback;
const safeNum = (v: unknown, fallback = 0): number => typeof v === "number" ? v : fallback;
const safeBool = (v: unknown, fallback = false): boolean => typeof v === "boolean" ? v : fallback;

type SectionKey = "addToBag" | "miniCart" | "cart" | "checkout" | "shipping" | "emptyCart" | "recommended" | "cartFooter" | "style";

const SECTIONS: { key: SectionKey; label: string; icon: string; description: string }[] = [
  { key: "addToBag",     label: "Add To Bag",          icon: "⊕", description: "Button labels & states" },
  { key: "miniCart",     label: "Mini Cart",            icon: "◎", description: "Drawer content & footer" },
  { key: "cart",         label: "Cart Page",            icon: "≡", description: "Full cart page text" },
  { key: "checkout",     label: "Checkout Experience",  icon: "✦", description: "Checkout headings & labels" },
  { key: "shipping",     label: "Shipping Messages",    icon: "→", description: "Thresholds & progress bar" },
  { key: "emptyCart",    label: "Empty Cart State",     icon: "◇", description: "Empty bag experience" },
  { key: "recommended",  label: "Recommended Products", icon: "◈", description: "You may also like" },
  { key: "cartFooter",   label: "Cart Footer",          icon: "§", description: "Trust badges & legal" },
  { key: "style",        label: "Commerce Styling",     icon: "◉", description: "Colors, fonts & spacing" },
];

// ─── Field components ─────────────────────────────────────────────────────────
const FL: React.CSSProperties = { fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", display: "block", marginBottom: "0.4rem" };
const INP: React.CSSProperties = { width: "100%", padding: "0.65rem 0.75rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px", boxSizing: "border-box", fontFamily: "inherit" };
const SH: React.CSSProperties = { fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#9a9690", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f0ece6" };
const BTN: React.CSSProperties = { padding: "0.5rem 1rem", background: "#fafaf8", border: "1px dashed #d0ccc7", cursor: "pointer", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a18", borderRadius: "2px" };

function TF({ label, value, onChange, placeholder, hint, multiline = false }: { label: string; value: unknown; onChange: (v: string) => void; placeholder?: string; hint?: string; multiline?: boolean }) {
  const safe = safeStr(value);
  return (
    <div>
      <label style={FL}>{label}</label>
      {multiline
        ? <textarea value={safe} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...INP, resize: "vertical", minHeight: "72px" }} />
        : <input type="text" value={safe} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={INP} />
      }
      {hint && <p style={{ fontSize: "0.7rem", color: "#9a9690", margin: "0.35rem 0 0", lineHeight: 1.6 }}>{hint}</p>}
    </div>
  );
}

function NF({ label, value, onChange, min, max }: { label: string; value: unknown; onChange: (v: number) => void; min?: number; max?: number }) {
  const safe = safeNum(value);
  return (
    <div>
      <label style={FL}>{label}</label>
      <input type="number" value={safe} min={min} max={max} onChange={e => onChange(Number(e.target.value))} style={{ ...INP, maxWidth: "160px" }} />
    </div>
  );
}

function CF({ label, value, onChange, fallback = "#1a1a18" }: { label: string; value: unknown; onChange: (v: string) => void; fallback?: string }) {
  const safe = safeStr(value, fallback);
  const hex = safe.startsWith("#") ? safe : fallback;
  return (
    <div>
      <label style={FL}>{label}</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input type="color" value={hex} onChange={e => onChange(e.target.value)} style={{ width: "40px", height: "36px", padding: 0, border: "1px solid #e8e4df", borderRadius: "2px", cursor: "pointer" }} />
        <input type="text" value={safe} onChange={e => onChange(e.target.value)} style={{ flex: 1, ...INP }} />
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange, hint }: { label: string; checked: unknown; onChange: (v: boolean) => void; hint?: string }) {
  const val = safeBool(checked);
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
      <div style={{ position: "relative", flexShrink: 0, marginTop: "1px" }}>
        <input type="checkbox" checked={val} onChange={e => onChange(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        <div style={{ width: "36px", height: "20px", background: val ? "#1a1a18" : "#d0ccc7", borderRadius: "10px", transition: "background 0.2s", position: "relative" }}>
          <div style={{ position: "absolute", top: "2px", left: val ? "18px" : "2px", width: "16px", height: "16px", background: "#fff", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
      </div>
      <div>
        <span style={{ fontSize: "0.85rem", color: "#1a1a18" }}>{label}</span>
        {hint && <p style={{ fontSize: "0.7rem", color: "#9a9690", margin: "0.2rem 0 0" }}>{hint}</p>}
      </div>
    </label>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e8e4df", borderRadius: "4px", background: "#fff", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {title && <p style={SH}>{title}</p>}
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>{children}</div>;
}

// ─── Section Editors ─────────────────────────────────────────────────────────

function AddToBagEditor({ data, onChange }: { data: CommerceAddToBagSettings; onChange: (d: CommerceAddToBagSettings) => void }) {
  const u = (key: keyof CommerceAddToBagSettings, v: string) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Button Labels">
        <Grid2>
          <TF label="Default Label" value={data.buttonLabel} onChange={v => u("buttonLabel", v)} placeholder="Add to Bag" />
          <TF label="Adding State" value={data.addingLabel} onChange={v => u("addingLabel", v)} placeholder="Adding..." />
          <TF label="Added State" value={data.addedLabel} onChange={v => u("addedLabel", v)} placeholder="Added" />
          <TF label="Out of Stock" value={data.outOfStockLabel} onChange={v => u("outOfStockLabel", v)} placeholder="Out of Stock" />
        </Grid2>
      </Card>
      <Card title="Size Selection">
        <Grid2>
          <TF label="Select Size Prompt" value={data.selectSizeLabel} onChange={v => u("selectSizeLabel", v)} placeholder="Select a Size" />
          <TF label="Size Label Prefix" value={data.sizeLabelPrefix} onChange={v => u("sizeLabelPrefix", v)} placeholder="Size:" />
        </Grid2>
      </Card>
      <Card title="Wishlist & Notify">
        <Grid2>
          <TF label="Notify Me Label" value={data.notifyMeLabel} onChange={v => u("notifyMeLabel", v)} placeholder="Notify Me" />
          <TF label="Wishlist Add Label" value={data.wishlistLabel} onChange={v => u("wishlistLabel", v)} placeholder="Save to Wishlist" />
          <TF label="Wishlist Saved Label" value={data.wishlistAddedLabel} onChange={v => u("wishlistAddedLabel", v)} placeholder="Saved" />
        </Grid2>
      </Card>
    </div>
  );
}

function MiniCartEditor({ data, onChange }: { data: CommerceMiniCartSettings; onChange: (d: CommerceMiniCartSettings) => void }) {
  const u = (key: keyof CommerceMiniCartSettings, v: any) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Drawer Header">
        <Grid2>
          <TF label="Drawer Title" value={data.drawerTitle} onChange={v => u("drawerTitle", v)} placeholder="Bag" />
          <TF label="Item Singular (e.g. piece)" value={data.itemSingularLabel} onChange={v => u("itemSingularLabel", v)} />
          <TF label="Item Plural (e.g. pieces)" value={data.itemPluralLabel} onChange={v => u("itemPluralLabel", v)} />
          <TF label="Size Label Prefix" value={data.sizeLabelPrefix} onChange={v => u("sizeLabelPrefix", v)} placeholder="Size:" />
        </Grid2>
      </Card>
      <Card title="Empty Bag State">
        <TF label="Empty Bag Message" value={data.emptyStateText} onChange={v => u("emptyStateText", v)} />
        <Grid2>
          <TF label="Empty CTA Button" value={data.emptyStateCta} onChange={v => u("emptyStateCta", v)} />
          <TF label="Empty CTA URL" value={data.emptyStateCtaUrl} onChange={v => u("emptyStateCtaUrl", v)} placeholder="/" />
        </Grid2>
      </Card>
      <Card title="Labels & Buttons">
        <Grid2>
          <TF label="Subtotal Label" value={data.subtotalLabel} onChange={v => u("subtotalLabel", v)} />
          <TF label="Remove Item Label" value={data.removeLabel} onChange={v => u("removeLabel", v)} />
          <TF label="View Cart Button" value={data.viewCartLabel} onChange={v => u("viewCartLabel", v)} />
          <TF label="Continue Browsing Button" value={data.continueBrowsingLabel} onChange={v => u("continueBrowsingLabel", v)} />
        </Grid2>
      </Card>
      <Card title="Trust Badge">
        <Toggle label="Show Trust Badge" checked={data.trustBadgeEnabled} onChange={v => u("trustBadgeEnabled", v)} />
        {safeBool(data.trustBadgeEnabled) && (
          <TF label="Trust Badge Text" value={data.trustBadgeText} onChange={v => u("trustBadgeText", v)} placeholder="Complimentary gift packaging" />
        )}
      </Card>
    </div>
  );
}

function CartEditor({ data, onChange }: { data: CommerceCartSettings; onChange: (d: CommerceCartSettings) => void }) {
  const u = (key: keyof CommerceCartSettings, v: any) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Image Header Banner">
        <Toggle label="Enable Image Header" checked={data.headerImageEnabled} onChange={v => u("headerImageEnabled", v)} hint="Shows a full-width hero image at the top of the cart page." />
        {safeBool(data.headerImageEnabled) && (<>
          <TF label="Image URL" value={data.headerImageUrl} onChange={v => u("headerImageUrl", v)} placeholder="https://..." />
          <Grid2>
            <TF label="Header Title" value={data.headerTitle} onChange={v => u("headerTitle", v)} placeholder="Your Bag" />
            <TF label="Header Subtitle" value={data.headerSubtitle} onChange={v => u("headerSubtitle", v)} placeholder="Complete your look." />
            <TF label="Header Height (e.g. 40vh)" value={data.headerHeight} onChange={v => u("headerHeight", v)} placeholder="35vh" />
            <CF label="Text Color" value={data.headerTextColor} onChange={v => u("headerTextColor", v)} fallback="#ffffff" />
          </Grid2>
          <div style={{ marginTop: "1rem" }}>
            <NF label="Overlay Opacity (0 to 1)" value={data.headerOverlayOpacity} onChange={v => u("headerOverlayOpacity", v)} min={0} max={1} />
          </div>
        </>)}
      </Card>
      <Card title="Page Settings">
        <Grid2>
          <TF label="Page Title" value={data.pageTitle} onChange={v => u("pageTitle", v)} placeholder="Your Bag" />
          <TF label="Item Singular" value={data.itemSingularLabel} onChange={v => u("itemSingularLabel", v)} placeholder="piece" />
          <TF label="Item Plural" value={data.itemPluralLabel} onChange={v => u("itemPluralLabel", v)} placeholder="pieces" />
          <TF label="Size Label Prefix" value={data.sizeLabelPrefix} onChange={v => u("sizeLabelPrefix", v)} placeholder="Size:" />
        </Grid2>
      </Card>
      <Card title="Empty State">
        <TF label="Empty State Text" value={data.emptyStateText} onChange={v => u("emptyStateText", v)} />
        <Grid2>
          <TF label="Empty CTA Button" value={data.emptyStateCta} onChange={v => u("emptyStateCta", v)} />
          <TF label="Empty CTA URL" value={data.emptyStateCtaUrl} onChange={v => u("emptyStateCtaUrl", v)} placeholder="/" />
        </Grid2>
      </Card>
      <Card title="Item Actions">
        <Grid2>
          <TF label="Remove Item Label" value={data.removeLabel} onChange={v => u("removeLabel", v)} />
          <TF label="Clear Cart Label" value={data.clearCartLabel} onChange={v => u("clearCartLabel", v)} />
        </Grid2>
      </Card>
      <Card title="Order Summary">
        <Grid2>
          <TF label="Order Summary Title" value={data.orderSummaryTitle} onChange={v => u("orderSummaryTitle", v)} />
          <TF label="Subtotal Label" value={data.subtotalLabel} onChange={v => u("subtotalLabel", v)} />
          <TF label="Shipping Label" value={data.shippingLabel} onChange={v => u("shippingLabel", v)} />
          <TF label="Shipping Value Text" value={data.shippingValue} onChange={v => u("shippingValue", v)} placeholder="Calculated at checkout" />
          <TF label="Checkout Button" value={data.checkoutButtonLabel} onChange={v => u("checkoutButtonLabel", v)} />
          <TF label="Continue Browsing Button" value={data.continueBrowsingLabel} onChange={v => u("continueBrowsingLabel", v)} />
          <TF label="Continue Browsing URL" value={data.continueBrowsingUrl} onChange={v => u("continueBrowsingUrl", v)} placeholder="/" />
        </Grid2>
      </Card>
      <Card title="Trust Messages">
        <Toggle label="Show Shipping Message" checked={data.shippingMessageEnabled} onChange={v => u("shippingMessageEnabled", v)} hint="Uses {threshold} as placeholder for the free shipping amount." />
        {safeBool(data.shippingMessageEnabled) && (
          <TF label="Shipping Message Text" value={data.shippingMessage} onChange={v => u("shippingMessage", v)} hint='Use {threshold} where the amount should appear. E.g. "Free shipping on orders above {threshold}"' />
        )}
        <Toggle label="Show Gift Packaging Message" checked={data.giftPackagingEnabled} onChange={v => u("giftPackagingEnabled", v)} />
        {safeBool(data.giftPackagingEnabled) && (
          <TF label="Gift Packaging Text" value={data.giftPackagingMessage} onChange={v => u("giftPackagingMessage", v)} />
        )}
      </Card>
    </div>
  );
}

function CheckoutEditor({ data, onChange }: { data: CommerceCheckoutSettings; onChange: (d: CommerceCheckoutSettings) => void }) {
  const u = (key: keyof CommerceCheckoutSettings, v: string) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Page Headings">
        <Grid2>
          <TF label="Checkout Page Title" value={data.checkoutHeading} onChange={v => u("checkoutHeading", v)} />
          <TF label="Shipping Heading" value={data.shippingHeading} onChange={v => u("shippingHeading", v)} />
          <TF label="Payment Heading" value={data.paymentHeading} onChange={v => u("paymentHeading", v)} />
          <TF label="Review Order Heading" value={data.orderReviewHeading} onChange={v => u("orderReviewHeading", v)} />
        </Grid2>
      </Card>
      <Card title="Buttons & Navigation">
        <Grid2>
          <TF label="Place Order Button" value={data.placeOrderLabel} onChange={v => u("placeOrderLabel", v)} />
          <TF label="Back to Cart Button" value={data.backToCartLabel} onChange={v => u("backToCartLabel", v)} />
        </Grid2>
      </Card>
      <Card title="Order Note">
        <TF label="Note Field Label" value={data.noteLabel} onChange={v => u("noteLabel", v)} />
        <TF label="Note Placeholder" value={data.notePlaceholder} onChange={v => u("notePlaceholder", v)} multiline />
      </Card>
      <Card title="Terms & Legal">
        <TF label="Terms Intro Text" value={data.termsText} onChange={v => u("termsText", v)} hint='Shown before the terms link. E.g. "By placing your order you agree to our"' />
        <Grid2>
          <TF label="Terms Link Label" value={data.termsLinkLabel} onChange={v => u("termsLinkLabel", v)} placeholder="Terms & Conditions" />
          <TF label="Terms Link URL" value={data.termsLinkUrl} onChange={v => u("termsLinkUrl", v)} placeholder="/terms" />
        </Grid2>
      </Card>
    </div>
  );
}

function ShippingEditor({ data, onChange }: { data: CommerceShippingMessages; onChange: (d: CommerceShippingMessages) => void }) {
  const u = (key: keyof CommerceShippingMessages, v: any) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Free Shipping Threshold">
        <NF label="Free Shipping Amount (in base currency units)" value={data.freeShippingThreshold} onChange={v => u("freeShippingThreshold", v)} min={0} />
        <TF label="Progress Message (before threshold)" value={data.freeShippingMessage} onChange={v => u("freeShippingMessage", v)} hint='Use {threshold} as placeholder for the amount. E.g. "Free shipping on orders above {threshold}"' />
        <TF label="Unlocked Message (after threshold)" value={data.freeShippingUnlocked} onChange={v => u("freeShippingUnlocked", v)} placeholder="You've unlocked free shipping!" />
      </Card>
      <Card title="Progress Bar">
        <Toggle label="Show Free Shipping Progress Bar" checked={data.progressBarEnabled} onChange={v => u("progressBarEnabled", v)} hint="Appears in Mini Cart below the header." />
        {safeBool(data.progressBarEnabled) && (
          <CF label="Progress Bar Color" value={data.progressBarColor} onChange={v => u("progressBarColor", v)} fallback="#1a1a18" />
        )}
      </Card>
      <Card title="Shipping Method Labels">
        <Grid2>
          <TF label="Standard Shipping Label" value={data.standardShippingLabel} onChange={v => u("standardShippingLabel", v)} />
          <TF label="Express Shipping Label" value={data.expressShippingLabel} onChange={v => u("expressShippingLabel", v)} />
          <TF label="Free Shipping Label" value={data.freeShippingLabel} onChange={v => u("freeShippingLabel", v)} />
        </Grid2>
        <TF label="Delivery Estimate Text" value={data.deliveryEstimateText} onChange={v => u("deliveryEstimateText", v)} placeholder="Estimated delivery: 3–7 business days" />
      </Card>
    </div>
  );
}

function EmptyCartEditor({ data, onChange }: { data: CommerceEmptyCartSettings; onChange: (d: CommerceEmptyCartSettings) => void }) {
  const u = (key: keyof CommerceEmptyCartSettings, v: any) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Content">
        <TF label="Heading" value={data.heading} onChange={v => u("heading", v)} placeholder="Your Bag is Empty" />
        <TF label="Subheading" value={data.subheading} onChange={v => u("subheading", v)} placeholder="Discover our latest collection." multiline />
      </Card>
      <Card title="Primary CTA">
        <Grid2>
          <TF label="Button Label" value={data.ctaLabel} onChange={v => u("ctaLabel", v)} placeholder="Explore Collection" />
          <TF label="Button URL" value={data.ctaUrl} onChange={v => u("ctaUrl", v)} placeholder="/" />
        </Grid2>
      </Card>
      <Card title="Secondary CTA (optional)">
        <Grid2>
          <TF label="Secondary Button Label" value={data.secondaryCtaLabel} onChange={v => u("secondaryCtaLabel", v)} placeholder="Return Home" />
          <TF label="Secondary Button URL" value={data.secondaryCtaUrl} onChange={v => u("secondaryCtaUrl", v)} placeholder="/" />
        </Grid2>
      </Card>
      <Card title="Illustration">
        <Toggle label="Show Illustration / Symbol" checked={data.illustrationEnabled} onChange={v => u("illustrationEnabled", v)} />
        {safeBool(data.illustrationEnabled) && (
          <TF label="Symbol / Character" value={data.illustrationText} onChange={v => u("illustrationText", v)} placeholder="◈" hint="Can be a unicode symbol, emoji, or short text." />
        )}
        <Toggle label="Show Recently Viewed Items" checked={data.showRecentlyViewed} onChange={v => u("showRecentlyViewed", v)} />
      </Card>
    </div>
  );
}

function RecommendedEditor({ data, onChange }: { data: CommerceRecommendedSettings; onChange: (d: CommerceRecommendedSettings) => void }) {
  const u = (key: keyof CommerceRecommendedSettings, v: any) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Enable Recommendations">
        <Toggle label="Show Recommended Products" checked={data.enabled} onChange={v => u("enabled", v)} />
      </Card>
      {safeBool(data.enabled) && (<>
        <Card title="Labels">
          <TF label="Section Heading" value={data.heading} onChange={v => u("heading", v)} placeholder="You May Also Like" />
          <TF label="Section Subheading (optional)" value={data.subheading} onChange={v => u("subheading", v)} />
        </Card>
        <Card title="Display Settings">
          <NF label="Number of Products to Show" value={data.displayCount} onChange={v => u("displayCount", v)} min={1} max={12} />
          <div>
            <label style={FL}>Product Source</label>
            <select value={data.source} onChange={e => u("source", e.target.value)} style={{ ...INP, maxWidth: "260px" }}>
              <option value="related">Related to cart items</option>
              <option value="bestsellers">Bestsellers</option>
              <option value="manual">Manual selection</option>
            </select>
          </div>
        </Card>
        <Card title="Placement">
          <Toggle label="Show on Cart Page" checked={data.showOnCart} onChange={v => u("showOnCart", v)} />
          <Toggle label="Show on Mini Cart" checked={data.showOnMiniCart} onChange={v => u("showOnMiniCart", v)} />
          <Toggle label="Show on Empty Cart" checked={data.showOnEmptyCart} onChange={v => u("showOnEmptyCart", v)} />
        </Card>
      </>)}
    </div>
  );
}

function CartFooterEditor({ data, onChange }: { data: CommerceCartFooterSettings; onChange: (d: CommerceCartFooterSettings) => void }) {
  const u = (key: keyof CommerceCartFooterSettings, v: any) => onChange({ ...data, [key]: v });
  const updateTrust = (i: number, key: string, v: any) => {
    const msgs = [...(data.trustMessages || [])];
    msgs[i] = { ...msgs[i], [key]: v };
    u("trustMessages", msgs);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Trust Badges">
        <Toggle label="Show Trust Badges" checked={data.trustMessagesEnabled} onChange={v => u("trustMessagesEnabled", v)} />
        {safeBool(data.trustMessagesEnabled) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(data.trustMessages || []).map((msg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "#fafaf8", border: "1px solid #f0ece6", borderRadius: "2px" }}>
                <input type="checkbox" checked={safeBool(msg.enabled, true)} onChange={e => updateTrust(i, "enabled", e.target.checked)} style={{ flexShrink: 0 }} />
                <input type="text" value={safeStr(msg.icon)} onChange={e => updateTrust(i, "icon", e.target.value)} placeholder="Icon" style={{ width: "48px", padding: "0.4rem", border: "1px solid #e8e4df", fontSize: "1rem", textAlign: "center", borderRadius: "2px" }} />
                <input type="text" value={safeStr(msg.text)} onChange={e => updateTrust(i, "text", e.target.value)} placeholder="Trust message..." style={{ flex: 1, padding: "0.4rem 0.6rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px" }} />
                <button onClick={() => { const msgs = [...(data.trustMessages || [])]; msgs.splice(i, 1); u("trustMessages", msgs); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#c8a0a0", fontSize: "0.7rem", padding: "0.25rem" }}>✕</button>
              </div>
            ))}
            <button onClick={() => u("trustMessages", [...(data.trustMessages || []), { icon: "✦", text: "New trust message", enabled: true }])} style={BTN}>+ Add Trust Message</button>
          </div>
        )}
      </Card>
      <Card title="Policy Text">
        <TF label="Return Policy Text" value={data.returnPolicyText} onChange={v => u("returnPolicyText", v)} />
        <Grid2>
          <TF label="Return Policy URL" value={data.returnPolicyUrl} onChange={v => u("returnPolicyUrl", v)} placeholder="/returns" />
          <TF label="Secure Payment Text" value={data.securePaymentText} onChange={v => u("securePaymentText", v)} />
        </Grid2>
        <TF label="Privacy Text" value={data.privacyText} onChange={v => u("privacyText", v)} />
        <TF label="Copyright Text" value={data.copyrightText} onChange={v => u("copyrightText", v)} />
      </Card>
    </div>
  );
}

function StyleEditor({ data, onChange }: { data: CommerceStyleSettings; onChange: (d: CommerceStyleSettings) => void }) {
  const u = (key: keyof CommerceStyleSettings, v: string) => onChange({ ...data, [key]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title="Add To Bag Button">
        <Grid2>
          <CF label="Button Background" value={data.addToBagBg} onChange={v => u("addToBagBg", v)} fallback="#1a1a18" />
          <CF label="Button Text Color" value={data.addToBagColor} onChange={v => u("addToBagColor", v)} fallback="#f7f5f2" />
          <TF label="Border Radius (e.g. 0px)" value={data.addToBagBorderRadius} onChange={v => u("addToBagBorderRadius", v)} />
          <TF label="Font Size (e.g. 0.55rem)" value={data.addToBagFontSize} onChange={v => u("addToBagFontSize", v)} />
          <TF label="Letter Spacing (e.g. 0.2em)" value={data.addToBagLetterSpacing} onChange={v => u("addToBagLetterSpacing", v)} />
        </Grid2>
      </Card>
      <Card title="Cart Page Colors">
        <Grid2>
          <CF label="Cart Background" value={data.cartBg} onChange={v => u("cartBg", v)} fallback="#faf9f7" />
          <CF label="Text Color" value={data.cartTextColor} onChange={v => u("cartTextColor", v)} fallback="#1a1a18" />
          <CF label="Border / Divider Color" value={data.cartBorderColor} onChange={v => u("cartBorderColor", v)} fallback="#ddd9d4" />
          <CF label="Order Summary Background" value={data.summaryBg} onChange={v => u("summaryBg", v)} fallback="#f0ede8" />
          <CF label="Checkout Button Background" value={data.checkoutButtonBg} onChange={v => u("checkoutButtonBg", v)} fallback="#1a1a18" />
          <CF label="Checkout Button Text" value={data.checkoutButtonColor} onChange={v => u("checkoutButtonColor", v)} fallback="#f7f5f2" />
        </Grid2>
      </Card>
      <Card title="Mini Cart">
        <Grid2>
          <CF label="Mini Cart Background" value={data.miniCartBg} onChange={v => u("miniCartBg", v)} fallback="#faf9f7" />
          <TF label="Mini Cart Width (e.g. 440px)" value={data.miniCartWidth} onChange={v => u("miniCartWidth", v)} placeholder="440px" />
        </Grid2>
      </Card>
      <Card title="Typography">
        <TF label="Heading Font (CSS value)" value={data.headingFont} onChange={v => u("headingFont", v)} placeholder="var(--font-cormorant, serif)" hint="Used for cart titles, product names." />
        <TF label="Body / Label Font (CSS value)" value={data.bodyFont} onChange={v => u("bodyFont", v)} placeholder="var(--font-dm-mono, monospace)" hint="Used for buttons, labels, prices." />
      </Card>
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────────────────
export function CommerceBuilder({ apiEndpoint, backUrl }: { apiEndpoint: string; backUrl: string }) {
  const [data, setData] = useState<CommerceData>(defaultCommerceData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("addToBag");

  useEffect(() => {
    fetch(`${apiEndpoint}?t=${Date.now()}`)
      .then(r => r.json())
      .then(res => { if (res.success && res.data) setData(res.data); })
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch(apiEndpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const update = useCallback(<K extends SectionKey>(section: K, value: CommerceData[K]) => {
    setData(d => ({ ...d, [section]: value }));
  }, []);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#9a9690" }}>Loading Commerce Builder...</div>;

  const activeInfo = SECTIONS.find(s => s.key === activeSection)!;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "0", minHeight: "calc(100vh - 70px)" }}>
      {/* ── Left sidebar nav ── */}
      <div style={{ borderRight: "1px solid #e8e4df", background: "#fff", padding: "1.5rem 1rem", position: "sticky", top: "70px", height: "calc(100vh - 70px)", overflowY: "auto" }}>
        <Link href={backUrl} style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>← Content</Link>
        <p style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#9a9690", marginBottom: "0.75rem", paddingLeft: "0.5rem" }}>Commerce Builder</p>
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
            width: "100%", display: "flex", alignItems: "flex-start", gap: "0.75rem",
            padding: "0.85rem 0.75rem", background: activeSection === s.key ? "#f7f5f2" : "transparent",
            border: "none", borderRadius: "4px", cursor: "pointer", textAlign: "left",
            borderLeft: activeSection === s.key ? "2px solid #1a1a18" : "2px solid transparent",
            marginBottom: "0.15rem", transition: "all 0.15s",
          }}>
            <span style={{ fontSize: "0.9rem", color: "#6b6865", flexShrink: 0, marginTop: "1px" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: activeSection === s.key ? 500 : 400, color: activeSection === s.key ? "#1a1a18" : "#4a4845", marginBottom: "0.15rem" }}>{s.label}</div>
              <div style={{ fontSize: "0.62rem", color: "#9a9690", letterSpacing: "0.02em" }}>{s.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Main content area ── */}
      <div style={{ background: "#fafaf8", padding: "2.5rem", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "1.1rem", color: "#6b6865" }}>{activeInfo.icon}</span>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 300, color: "#1a1a18", margin: 0, letterSpacing: "0.02em" }}>{activeInfo.label}</h1>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#6b6865", margin: 0 }}>{activeInfo.description} — all changes update the live store immediately after saving.</p>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.8rem 1.8rem", background: "#1a1a18", color: "#f7f5f2", border: "none", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", borderRadius: "2px", opacity: saving ? 0.7 : 1, flexShrink: 0 }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && <div style={{ background: "#fdf0f0", border: "1px solid #e0b8b8", padding: "0.75rem 1rem", color: "#6b3a3a", fontSize: "0.8rem", marginBottom: "1.25rem", borderRadius: "2px" }}>{error}</div>}
        {success && <div style={{ background: "#f0fdf4", border: "1px solid #bce3c5", padding: "0.75rem 1rem", color: "#2d6b3a", fontSize: "0.8rem", marginBottom: "1.25rem", borderRadius: "2px" }}>✓ Saved — changes are now live on the store.</div>}

        {/* Section editor */}
        <div style={{ maxWidth: "860px" }}>
          {activeSection === "addToBag"    && <AddToBagEditor   data={data.addToBag}    onChange={v => update("addToBag", v)} />}
          {activeSection === "miniCart"    && <MiniCartEditor   data={data.miniCart}    onChange={v => update("miniCart", v)} />}
          {activeSection === "cart"        && <CartEditor       data={data.cart}        onChange={v => update("cart", v)} />}
          {activeSection === "checkout"    && <CheckoutEditor   data={data.checkout}    onChange={v => update("checkout", v)} />}
          {activeSection === "shipping"    && <ShippingEditor   data={data.shipping}    onChange={v => update("shipping", v)} />}
          {activeSection === "emptyCart"   && <EmptyCartEditor  data={data.emptyCart}   onChange={v => update("emptyCart", v)} />}
          {activeSection === "recommended" && <RecommendedEditor data={data.recommended} onChange={v => update("recommended", v)} />}
          {activeSection === "cartFooter"  && <CartFooterEditor data={data.cartFooter}  onChange={v => update("cartFooter", v)} />}
          {activeSection === "style"       && <StyleEditor      data={data.style}       onChange={v => update("style", v)} />}
        </div>
      </div>
    </div>
  );
}

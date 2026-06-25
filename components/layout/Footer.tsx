"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { FooterData, FooterBlock, defaultFooterData } from "@/lib/types/footer";

// ── Helpers ────────────────────────────────────────────────────
function colSpanClass(span: number | undefined, def: number) {
  const s = span ?? def;
  const map: Record<number, string> = { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4", 5: "md:col-span-5", 6: "md:col-span-6", 7: "md:col-span-7", 8: "md:col-span-8", 9: "md:col-span-9", 10: "md:col-span-10", 11: "md:col-span-11", 12: "md:col-span-12" };
  return map[s] || `md:col-span-${def}`;
}

// ── Newsletter form (real email capture) ──────────────────────
function NewsletterForm({ block, settings }: { block: FooterBlock; settings: FooterData["settings"] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMsg("Thank you. You will receive rare dispatches from the atelier.");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(json.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollReveal delay={0.25} y={18}>
      {block.heading && (
        <span className="text-label block mb-4" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)", letterSpacing: "0.22em" }}>
          {block.heading.toUpperCase()}
        </span>
      )}
      {block.content && (
        <p className="text-editorial mb-5" style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.35rem)", color: settings.textColor, lineHeight: 1.8, whiteSpace: "pre-line", maxWidth: "320px" }}>
          {block.content}
        </p>
      )}
      {status === "success" ? (
        <p style={{ fontSize: "clamp(0.75rem, 0.9vw, 1rem)", color: settings.headingColor, letterSpacing: "0.08em", lineHeight: 1.7 }}>{msg}</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "320px" }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={block.placeholder || ""}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${settings.borderColor}`,
              padding: "0.5rem 0",
              fontSize: "clamp(0.85rem, 1vw, 1.1rem)",
              color: settings.textColor,
              outline: "none",
              fontFamily: "inherit",
              letterSpacing: "0.04em",
            }}
          />
          {status === "error" && <p style={{ fontSize: "0.75rem", color: "#a55", margin: 0 }}>{msg}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              alignSelf: "flex-start",
              background: "transparent",
              border: "none",
              padding: "0.25rem 0",
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: "clamp(0.6rem, 0.8vw, 0.9rem)",
              letterSpacing: "0.2em",
              color: settings.headingColor,
              cursor: "pointer",
              textTransform: "uppercase",
              borderBottom: `1px solid ${settings.headingColor}`,
              opacity: status === "loading" ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {status === "loading" ? "Sending..." : (block.buttonText || "")}
        </button>
        </form>
      )}
    </ScrollReveal>
  );
}

// ── Main Footer ───────────────────────────────────────────────
export default function Footer({ initialData }: { initialData?: FooterData }) {
  const [data, setData] = useState<FooterData>(initialData || defaultFooterData);

  useEffect(() => {
    if (!initialData) {
      fetch("/api/footer").then((r) => r.json()).then((json) => { if (json.success && json.data) setData(json.data); }).catch(console.error);
    }
    const handleMsg = (e: MessageEvent) => { if (e.data?.type === "SYNC_FOOTER_PREVIEW") setData(e.data.data); };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [initialData]);

  const { settings, blocks } = data;

  const renderBlock = (block: FooterBlock, index: number) => {
    if (block.hidden) return null;

    // ── BRAND ──────────────────────────────────────────────────
    if (block.type === "brand") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 5)}>
        <ScrollReveal delay={0} y={18}>
          <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "clamp(0.75rem, 1vw, 1.2rem)", letterSpacing: "0.28em", color: settings.headingColor, textTransform: "uppercase", marginBottom: "1.25rem" }}>
            {block.heading}
          </div>
          <p className="text-editorial" style={{ fontSize: "clamp(1rem, 1.2vw, 1.5rem)", maxWidth: "300px", lineHeight: 1.85, color: settings.textColor }}>{block.content}</p>
        </ScrollReveal>
      </div>
    );

    // ── RICH TEXT ──────────────────────────────────────────────
    if (block.type === "rich-text") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 4)}>
        <ScrollReveal delay={0.1 + index * 0.05} y={14}>
          {block.heading && <span className="text-label block mb-4" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}>{block.heading.toUpperCase()}</span>}
          <p className="text-editorial" style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.4rem)", color: settings.textColor, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: block.content || "" }} />
        </ScrollReveal>
      </div>
    );

    // ── LINK GROUP ─────────────────────────────────────────────
    if (block.type === "link-group") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 3)}>
        <ScrollReveal delay={0.1 + index * 0.08} y={18}>
          {block.heading && <span className="text-label block mb-5" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}>{block.heading.toUpperCase()}</span>}
          <ul className="flex flex-col gap-3" role="list">
            {block.links?.map((link) => (
              <li key={link.label}>
                <Link href={link.url || "#"} className="group relative text-editorial" style={{ fontSize: "clamp(1rem, 1.2vw, 1.5rem)", textDecoration: "none", color: settings.linkColor || settings.textColor, display: "inline-block" }}>
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full" style={{ backgroundColor: settings.hoverColor || settings.headingColor, transition: "width 0.35s cubic-bezier(0.16,1,0.3,1)" }} />
                </Link>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    );

    // ── SOCIAL LINKS ───────────────────────────────────────────
    if (block.type === "social-links") {
      const platforms = block.socialPlatforms || (block.links?.map((l) => ({ platform: l.label, url: l.url, enabled: true })) || []);
      const active = platforms.filter((p) => p.enabled && p.url && p.url !== "#");
      if (active.length === 0 && platforms.length === 0) return null;
      return (
        <div key={block.id} className={colSpanClass(block.style?.colSpan, 5)}>
          <ScrollReveal delay={0.14} y={14} className="flex flex-wrap items-center gap-5 mt-8 md:mt-0">
            {(block.socialPlatforms ? block.socialPlatforms.filter((p) => p.enabled) : block.links || []).map((s: any) => (
              <a key={s.platform || s.label} href={s.url || "#"} target={s.url?.startsWith("http") ? "_blank" : undefined} rel={s.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group relative text-label" style={{ color: settings.textColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.3s ease" }}>
                {(s.platform || s.label || "").toUpperCase()}
                <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full" style={{ backgroundColor: settings.hoverColor || settings.headingColor, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
              </a>
            ))}
          </ScrollReveal>
        </div>
      );
    }

    // ── NEWSLETTER ─────────────────────────────────────────────
    if (block.type === "newsletter") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 4)}>
        <NewsletterForm block={block} settings={settings} />
      </div>
    );

    // ── CUSTOMER CARE ──────────────────────────────────────────
    if (block.type === "customer-care") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 3)}>
        <ScrollReveal delay={0.1 + index * 0.05} y={16}>
          {block.heading && <span className="text-label block mb-5" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}>{block.heading.toUpperCase()}</span>}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {block.email && <a href={`mailto:${block.email}`} style={{ color: settings.linkColor || settings.textColor, textDecoration: "none", fontSize: "clamp(0.95rem, 1.1vw, 1.3rem)", fontFamily: "inherit" }}>{block.email}</a>}
            {block.phone && <a href={`tel:${block.phone}`} style={{ color: settings.textColor, textDecoration: "none", fontSize: "clamp(0.9rem, 1vw, 1.2rem)" }}>{block.phone}</a>}
            {block.address && <p style={{ color: settings.textColor, fontSize: "clamp(0.85rem, 1vw, 1.1rem)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{block.address}</p>}
            {block.responseTime && <p style={{ color: settings.textColor, fontSize: "clamp(0.75rem, 0.9vw, 1rem)", opacity: 0.6, margin: 0 }}>Response: {block.responseTime}</p>}
          </div>
        </ScrollReveal>
      </div>
    );

    // ── CURRENCY & REGION ──────────────────────────────────────
    if (block.type === "currency-region" && block.currencyEnabled !== false) return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 2)}>
        <ScrollReveal delay={0.1} y={14}>
          {block.heading && <span className="text-label block mb-3" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}>{block.heading.toUpperCase()}</span>}
          <p style={{ color: settings.textColor, fontSize: "clamp(0.85rem, 1vw, 1.1rem)", opacity: 0.7, margin: 0 }}>🌐 International · USD</p>
        </ScrollReveal>
      </div>
    );

    // ── LEGAL LINKS ────────────────────────────────────────────
    if (block.type === "legal-links") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 3)}>
        <ScrollReveal delay={0.1 + index * 0.05} y={16}>
          {block.heading && <span className="text-label block mb-5" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}>{block.heading.toUpperCase()}</span>}
          <ul className="flex flex-col gap-2" role="list">
            {(block.legalLinks || []).filter((l) => l.enabled).map((link) => (
              <li key={link.label}>
                <Link href={link.url || "#"} className="group relative text-editorial" style={{ fontSize: "clamp(0.9rem, 1.05vw, 1.25rem)", textDecoration: "none", color: settings.textColor, display: "inline-block" }}>
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full" style={{ backgroundColor: settings.hoverColor || settings.headingColor, transition: "width 0.35s cubic-bezier(0.16,1,0.3,1)" }} />
                </Link>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    );

    // ── IMAGE ──────────────────────────────────────────────────
    if (block.type === "image" && block.imageUrl) return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 3)}>
        <ScrollReveal delay={0.1} y={14}>
          {block.imageLink ? (
            <Link href={block.imageLink}><img src={block.imageUrl} alt={block.imageAlt || ""} style={{ width: "100%", display: "block", objectFit: "cover" }} /></Link>
          ) : (
            <img src={block.imageUrl} alt={block.imageAlt || ""} style={{ width: "100%", display: "block", objectFit: "cover" }} />
          )}
        </ScrollReveal>
      </div>
    );

    // ── VIDEO ──────────────────────────────────────────────────
    if (block.type === "video" && block.videoUrl) return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 3)}>
        <video src={block.videoUrl} autoPlay={block.videoAutoplay} loop={block.videoLoop} muted={block.videoMuted} playsInline style={{ width: "100%", display: "block", objectFit: "cover" }} />
      </div>
    );

    // ── DIVIDER ────────────────────────────────────────────────
    if (block.type === "divider") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 12)}>
        <hr style={{ border: "none", borderTop: `${block.dividerThickness || "1px"} solid ${block.dividerColor || settings.borderColor}`, margin: `${block.dividerMargin || "0"} 0` }} />
      </div>
    );

    // ── SPACER ─────────────────────────────────────────────────
    if (block.type === "spacer") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 12)}>
        <div style={{ height: block.spacerHeight || "3rem" }} className="hidden md:block" />
        <div style={{ height: block.spacerHeightMobile || "1.5rem" }} className="block md:hidden" />
      </div>
    );

    // ── QUOTE ──────────────────────────────────────────────────
    if (block.type === "quote") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 12)}>
        <ScrollReveal delay={0.2} y={20}>
          <div style={{ textAlign: "center", padding: "clamp(2rem, 5vw, 4rem) 0" }}>
            {block.heading && (
              <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "clamp(0.65rem, 0.9vw, 1rem)", letterSpacing: "0.3em", color: settings.headingColor, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                {block.heading}
              </p>
            )}
            {block.quoteText && (
              <p className="text-editorial" style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)", color: settings.textColor, lineHeight: 1.8, fontStyle: "italic", maxWidth: "600px", margin: "0 auto", whiteSpace: "pre-line" }}>
                {block.quoteText}
              </p>
            )}
            {block.quoteAuthor && (
              <p style={{ fontSize: "clamp(0.7rem, 0.85vw, 1rem)", color: settings.textColor, opacity: 0.5, marginTop: "1rem", letterSpacing: "0.15em" }}>
                — {block.quoteAuthor}
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    );

    // ── CAMPAIGN ───────────────────────────────────────────────
    if (block.type === "campaign") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 12)}>
        <ScrollReveal delay={0.15} y={16}>
          {block.heading && <span className="text-label block mb-6" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)", letterSpacing: "0.22em" }}>{block.heading.toUpperCase()}</span>}
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap" }}>
            {(block.campaigns || []).map((campaign) => (
              <Link key={campaign.label} href={campaign.link || "#"} style={{ textDecoration: "none" }} className="group">
                <span className="relative text-editorial inline-block" style={{ fontSize: "clamp(1rem, 1.5vw, 1.8rem)", color: settings.textColor, letterSpacing: "0.08em", transition: "color 0.3s" }}>
                  {campaign.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full" style={{ backgroundColor: settings.hoverColor || settings.headingColor, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
                </span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    );

    // ── CONTACT ────────────────────────────────────────────────
    if (block.type === "contact") return (
      <div key={block.id} className={colSpanClass(block.style?.colSpan, 3)}>
        <ScrollReveal delay={0.1 + index * 0.05} y={16}>
          {block.heading && <span className="text-label block mb-5" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}>{block.heading.toUpperCase()}</span>}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {block.email && <a href={`mailto:${block.email}`} style={{ color: settings.linkColor || settings.textColor, textDecoration: "none", fontSize: "clamp(0.95rem, 1.1vw, 1.3rem)" }}>{block.email}</a>}
            {block.phone && <p style={{ color: settings.textColor, margin: 0, fontSize: "clamp(0.9rem, 1vw, 1.2rem)" }}>{block.phone}</p>}
            {block.address && <p style={{ color: settings.textColor, margin: 0, fontSize: "clamp(0.85rem, 1vw, 1.1rem)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{block.address}</p>}
            {block.imageLink && <a href={block.imageLink} target="_blank" rel="noopener noreferrer" style={{ color: settings.headingColor, fontSize: "clamp(0.65rem, 0.85vw, 1rem)", letterSpacing: "0.1em", textDecoration: "none", borderBottom: `1px solid ${settings.headingColor}`, paddingBottom: "2px", display: "inline-block", marginTop: "0.5rem" }}>View Map →</a>}
          </div>
        </ScrollReveal>
      </div>
    );

    return null;
  };

  return (
    <footer role="contentinfo" className="w-full relative" style={{ background: settings.backgroundColor, borderTop: `1px solid ${settings.borderColor}` }}>
      <div className="w-full max-w-none">
        <div className="w-full mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-12 w-full" style={{ gap: settings.columnGap || "2rem", paddingTop: settings.paddingTop, paddingBottom: settings.paddingBottom }}>
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: `1px solid ${settings.borderColor}`, paddingTop: "1.5rem", paddingBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: settings.bottomBarAlignment || "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <span className="text-label" style={{ color: settings.textColor, fontSize: settings.bottomBarFontSize || "clamp(0.55rem, 0.8vw, 0.9rem)", letterSpacing: "0.2em", opacity: 0.6 }}>
              {settings.bottomBarText}
            </span>
            <span className="text-label flex gap-4" style={{ color: settings.textColor, fontSize: settings.bottomBarFontSize || "clamp(0.55rem, 0.8vw, 0.9rem)", letterSpacing: "0.15em", opacity: 0.6 }}>
              {settings.bottomBarLinks?.map((link, idx) => (
                <span key={link.label}>
                  <Link href={link.url || "#"} style={{ textDecoration: "none", color: "inherit" }}>{link.label}</Link>
                  {idx < (settings.bottomBarLinks.length - 1) && " · "}
                </span>
              ))}
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

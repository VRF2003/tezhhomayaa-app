"use client";

import AccountLayout from "@/components/account/AccountLayout";
import Link from "next/link";

export default function SupportPage() {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem 0",
    border: "none",
    borderBottom: "1px solid #ddd9d4",
    background: "transparent",
    fontFamily: "var(--font-cormorant, serif)",
    fontSize: "1.2rem",
    color: "#1a1a18",
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono, monospace)",
    fontSize: "0.55rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#9a9690",
    display: "block",
    marginBottom: "0.4rem",
  };

  return (
    <AccountLayout title="Support & Inquiries">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "6rem" }}>
        
        {/* Contact Form */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
            letterSpacing: "0.15em", color: "#1a1a18", margin: "0 0 2rem 0",
            textTransform: "uppercase"
          }}>
            Send a Message
          </h3>

          <form style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Name</label>
                <input type="text" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required style={inputStyle} />
            </div>
            
            <div>
              <label style={labelStyle}>Order Number (Optional)</label>
              <input type="text" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea required rows={4} style={{ ...inputStyle, resize: "vertical" }}></textarea>
            </div>

            <button type="button" style={{
              padding: "1rem 2.5rem",
              background: "#1a1a18", color: "#f7f5f2",
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.6rem",
              letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
              border: "1px solid #1a1a18", cursor: "pointer",
              transition: "background 0.4s ease, color 0.4s ease",
              marginTop: "1rem",
              alignSelf: "flex-start"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#f7f5f2"; }}
            >
              Submit Inquiry
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
          
          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Direct Contact
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.3rem", color: "#4a4845", margin: 0 }}>
                <span style={{ display: "inline-block", width: "80px", color: "#9a9690", fontSize: "1rem" }}>Email</span> 
                concierge@tezhhomayaa.com
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.3rem", color: "#4a4845", margin: 0 }}>
                <span style={{ display: "inline-block", width: "80px", color: "#9a9690", fontSize: "1rem" }}>Phone</span> 
                +1 (800) 555-0199
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.3rem", color: "#4a4845", margin: 0 }}>
                <span style={{ display: "inline-block", width: "80px", color: "#9a9690", fontSize: "1rem" }}>WhatsApp</span> 
                +1 (800) 555-0199
              </p>
            </div>
          </div>

          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Boutique
            </h3>
            <address style={{
              fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
              color: "#4a4845", fontStyle: "normal", lineHeight: 1.6
            }}>
              Tezhhomayaa Flagship<br />
              123 Quiet Luxury Lane<br />
              New York, NY 10012<br />
              United States
            </address>
          </div>

          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Resources
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <Link href="/faq" style={{
                fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
                color: "#1a1a18", textDecoration: "none", opacity: 0.8, transition: "opacity 0.3s ease"
              }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}>
                Frequently Asked Questions
              </Link>
              <Link href="/shipping-returns" style={{
                fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
                color: "#1a1a18", textDecoration: "none", opacity: 0.8, transition: "opacity 0.3s ease"
              }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}>
                Shipping & Returns Policy
              </Link>
              <Link href="/care" style={{
                fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
                color: "#1a1a18", textDecoration: "none", opacity: 0.8, transition: "opacity 0.3s ease"
              }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}>
                Garment Care Guide
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AccountLayout>
  );
}

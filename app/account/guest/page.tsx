"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GuestPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would initialize a guest session/cart with the email
    router.push("/checkout"); // Assuming there is a checkout page eventually
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "1rem 0",
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
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#9a9690",
    display: "block",
    marginBottom: "0.5rem",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ height: "80px" }} />
      
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h1 style={{
            fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
            fontSize: "clamp(2.5rem, 4vw, 3.5rem)", letterSpacing: "0.02em",
            color: "#1a1a18", margin: "0 0 1rem 0", textAlign: "center"
          }}>
            Continue as Guest
          </h1>
          <p style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "1.2rem",
            color: "#4a4845",
            textAlign: "center",
            marginBottom: "3rem",
            lineHeight: 1.5,
          }}>
            Proceed to checkout. You will have the option to create an account at the end of the process.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <label style={labelStyle}>Email Address for Order Updates</label>
              <input type="email" required style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <button type="submit" style={{
              width: "100%", padding: "1.2rem",
              background: "#1a1a18", color: "#f7f5f2",
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.7rem",
              letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
              border: "1px solid #1a1a18", cursor: "pointer",
              transition: "background 0.4s ease, color 0.4s ease",
              marginTop: "1rem"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#f7f5f2"; }}
            >
              Continue
            </button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "3.5rem", textAlign: "center" }}>
            <Link href="/account/login" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#1a1a18", textDecoration: "none" }}>
              Have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

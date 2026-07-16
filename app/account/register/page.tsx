"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fullName = `${firstName} ${lastName}`;
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      // Trigger Welcome Email
      fetch("/api/auth/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userCredential.user.email, name: fullName })
      }).catch(console.error);

      router.push("/account/orders");
    } catch (error) {
      console.error(error);
      alert("Failed to create account. Check console for details.");
    }
  };

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
    <main style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ height: "80px" }} />
      
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem)",
      }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>
          <h1 style={{
            fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
            fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.02em",
            color: "#1a1a18", margin: "0 0 3rem 0", textAlign: "center"
          }}>
            Create Account
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First Name</label>
                <input type="text" required style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last Name</label>
                <input type="text" required style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" style={inputStyle} />
            </div>
            
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Password</label>
                <input type="password" required style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" required style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", marginTop: "0.5rem" }}>
              <input type="checkbox" id="newsletter" style={{ accentColor: "#1a1a18", marginTop: "0.3rem" }} defaultChecked />
              <label htmlFor="newsletter" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845", lineHeight: 1.4 }}>
                I wish to receive communications about Tezhhomayaa's latest collections and events.
              </label>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
              <input type="checkbox" id="privacy" required style={{ accentColor: "#1a1a18", marginTop: "0.3rem" }} />
              <label htmlFor="privacy" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845", lineHeight: 1.4 }}>
                I accept the <Link href="/privacy-policy" style={{ color: "#1a1a18" }}>Privacy Policy</Link> and Terms & Conditions.
              </label>
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
              Create Account
            </button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "3.5rem", textAlign: "center" }}>
            <Link href="/account/login" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#1a1a18", textDecoration: "none", opacity: 0.65 }}>
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

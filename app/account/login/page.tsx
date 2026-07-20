"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, getAdditionalUserInfo } from "firebase/auth";
import { useAuth } from "@/lib/store";
import { Observability } from "@/lib/infrastructure/observability";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If the user is already logged in (e.g. from a successful auth state change), push them to orders
  const { isLoggedIn, loading } = useAuth();
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/account/orders");
    }
  }, [isLoggedIn, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const additionalInfo = getAdditionalUserInfo(result);
        if (additionalInfo?.isNewUser) {
          // Trigger Welcome Email
          fetch("/api/auth/welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: result.user.email, name: result.user.displayName })
          }).catch(Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error"));
        }

        router.push("/account/orders");
      }
    } catch (error: any) {
      alert(`Failed to initiate Google login: ${error?.message || "Unknown error"}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/account/orders");
    } catch (error: any) {
      alert("Failed to login. Please check your credentials.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "1rem",
    border: "1px solid #ccc9c4",
    background: "transparent",
    fontFamily: "var(--font-cormorant, serif)",
    fontSize: "1.1rem",
    color: "#1a1a18",
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const socialBtnStyle: React.CSSProperties = {
    width: "100%",
    padding: "1rem",
    background: "transparent",
    border: "1px solid #1a1a18",
    color: "#1a1a18",
    fontFamily: "var(--font-dm-mono, monospace)",
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.8rem",
    transition: "background 0.3s ease",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ height: "80px" }} />
      
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem)",
      }}>
        
        {/* Main Header */}
        <h1 style={{
          fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 400,
          fontSize: "clamp(1.4rem, 2vw, 1.8rem)", letterSpacing: "0.1em",
          color: "#1a1a18", margin: "0 0 3rem 0", textAlign: "center",
          textTransform: "uppercase"
        }}>
          My Tezhhomayaa Account
        </h1>

        <div style={{ width: "100%", maxWidth: "460px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={handleGoogleLogin} style={socialBtnStyle} onMouseEnter={e => e.currentTarget.style.background = "#faf9f7"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button style={socialBtnStyle} onMouseEnter={e => e.currentTarget.style.background = "#faf9f7"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.61 1.54-1.33 2.89-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div style={{ margin: "2.5rem 0", fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#1a1a18", textTransform: "uppercase" }}>
          Or
        </div>

        <div style={{ width: "100%", maxWidth: "460px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 400,
            fontSize: "clamp(1rem, 1.5vw, 1.2rem)", letterSpacing: "0.08em",
            color: "#1a1a18", margin: "0 0 1rem 0", textTransform: "uppercase"
          }}>
            Continue with your email address
          </h2>
          <p style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "1.2rem", color: "#4a4845", margin: "0 0 2rem 0",
            lineHeight: 1.5
          }}>
            Sign in with your email and password or create a profile if you are new.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
            <input type="email" placeholder="Email*" required style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password*" required style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
            
            <button type="submit" style={{
              width: "100%", padding: "1.2rem",
              background: "#1a1a18", color: "#f7f5f2",
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.7rem",
              letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
              border: "1px solid #1a1a18", cursor: "pointer",
              transition: "opacity 0.3s ease",
              marginTop: "0.5rem"
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Continue
            </button>
          </form>
        </div>

        {/* Benefits Section */}
        <div style={{ marginTop: "6rem", width: "100%", maxWidth: "900px", textAlign: "center" }}>
          <h3 style={{
            fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 500,
            fontSize: "1rem", letterSpacing: "0.15em",
            color: "#1a1a18", margin: "0 0 3rem 0", textTransform: "uppercase"
          }}>
            Join My Tezhhomayaa
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
            <div>
              <h4 style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 500,
                fontSize: "0.65rem", letterSpacing: "0.15em", color: "#1a1a18",
                margin: "0 0 1rem 0", textTransform: "uppercase"
              }}>
                Track Your Orders
              </h4>
              <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#4a4845", margin: 0, lineHeight: 1.5 }}>
                Follow your orders every step of the way.
              </p>
            </div>
            <div>
              <h4 style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 500,
                fontSize: "0.65rem", letterSpacing: "0.15em", color: "#1a1a18",
                margin: "0 0 1rem 0", textTransform: "uppercase"
              }}>
                Streamline Checkout
              </h4>
              <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#4a4845", margin: 0, lineHeight: 1.5 }}>
                Check out faster with saved addresses and payment methods.
              </p>
            </div>
            <div>
              <h4 style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 500,
                fontSize: "0.65rem", letterSpacing: "0.15em", color: "#1a1a18",
                margin: "0 0 1rem 0", textTransform: "uppercase"
              }}>
                Book An Appointment
              </h4>
              <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#4a4845", margin: 0, lineHeight: 1.5 }}>
                Enjoy priority access to the boutique of your choice at the time and date that suits you.
              </p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}

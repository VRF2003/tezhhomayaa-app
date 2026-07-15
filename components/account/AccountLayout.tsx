"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "./AccountSidebar";
import { useAuth } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountLayout({ children, title, headerAction }: { children: React.ReactNode, title?: string, headerAction?: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isProtectedRoute = pathname?.includes("/profile") || pathname?.includes("/addresses");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && isProtectedRoute && !isLoggedIn) {
      router.push("/account/login");
    }
  }, [mounted, loading, isLoggedIn, router, isProtectedRoute]);

  // Prevent flash of protected content or flash while checking auth
  if (!mounted || loading || (isProtectedRoute && !isLoggedIn)) {
    return (
      <main style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Subtle loading spinner or just whitespace */}
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ height: "80px" }} />
      
      <div style={{
        flex: 1,
        padding: "clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 6rem)",
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "clamp(3rem, 8vw, 8rem)",
        alignItems: "start",
      }} className="account-layout-grid">
        
        <style>{`
          @media (max-width: 1024px) {
            .account-layout-grid {
              grid-template-columns: 1fr !important;
              gap: 4rem !important;
            }
          }
        `}</style>

        <div>
          <AccountSidebar />
        </div>
        
        <section style={{ width: "100%" }}>
          {title && (
            <div style={{
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              paddingBottom: "1.5rem", borderBottom: "1px solid #ddd9d4",
            }}>
              <h1 style={{
                fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.02em",
                color: "#1a1a18", margin: 0,
              }}>
                {title}
              </h1>
              {headerAction && (
                <div>{headerAction}</div>
              )}
            </div>
          )}
          {children}
        </section>
      </div>

      <Footer />
    </main>
  );
}

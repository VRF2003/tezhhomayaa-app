"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlist, useCart } from "@/lib/store";
import { getProductPrice } from "@/lib/currency";
import { useCurrency } from "@/components/CurrencyProvider";
import type { Product } from "@/lib/collections";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#1a1a18" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function WishlistCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const wishlisted = isWishlisted(product.slug);

  return (
    <article style={{ position: "relative" }}>
      {/* Remove from wishlist */}
      <button
        onClick={() => toggleWishlist(product)}
        aria-label={`Remove ${product.name} from wishlist`}
        style={{
          position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 10,
          background: "rgba(247,245,242,0.85)", backdropFilter: "blur(4px)",
          border: "none", cursor: "pointer", borderRadius: "50%",
          width: "32px", height: "32px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#1a1a18", transition: "opacity 0.3s",
        }}
      >
        <HeartIcon filled={wishlisted} />
      </button>

      <Link href={product.href} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ position: "relative", width: "100%", paddingBottom: "133%", background: "#edeae5", overflow: "hidden", marginBottom: "1rem" }}>
          <Image
            src={product.image} alt={product.name}
            fill sizes="(max-width: 640px) 50vw, 25vw"
            style={{ objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </div>
        <h3 style={{
          fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
          fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "#1a1a18",
          margin: "0 0 0.3rem", letterSpacing: "0.01em",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {product.name}
        </h3>
        <p style={{
          fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
          letterSpacing: "0.14em", color: "#9a9690", margin: "0 0 1rem",
        }}>
          {formatPrice(getProductPrice(product))}
        </p>
      </Link>

      <button
        onClick={() => { addToCart(product, 1, null); }}
        style={{
          width: "100%", padding: "0.75rem",
          background: "transparent", border: "1px solid #ccc9c4", cursor: "pointer",
          fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.46rem",
          letterSpacing: "0.16em", textTransform: "uppercase", color: "#3a3835",
          transition: "background 0.3s, color 0.3s, border-color 0.3s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1a18"; (e.currentTarget as HTMLButtonElement).style.color = "#f7f5f2"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1a18"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#3a3835"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#ccc9c4"; }}
      >
        Add To Bag
      </button>
    </article>
  );
}

export default function WishlistPage() {
  const { wishlistProducts, wishlist } = useWishlist();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <main style={{ minHeight: "100vh", background: "#faf9f7" }}>
      <Navbar />
      <div style={{ height: "80px" }} />

      <div style={{ padding: "clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 6rem)" }}>
        {/* Header */}
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
            Wishlist
          </h1>
          {wishlist.length > 0 && (
            <span style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
              letterSpacing: "0.14em", color: "#9a9690", textTransform: "uppercase",
            }}>
              {wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"} saved
            </span>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "6rem", paddingBottom: "6rem" }}>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
              fontStyle: "italic", fontSize: "1.4rem", color: "#9a9690",
              letterSpacing: "0.04em", marginBottom: "2rem",
            }}>
              Your wishlist is empty.
            </p>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
              fontSize: "1rem", color: "#9a9690", marginBottom: "2.5rem",
              letterSpacing: "0.03em",
            }}>
              Visit a product page and tap the heart to save pieces you love.
            </p>
            <Link href="/women" style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.52rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1a18",
              textDecoration: "none", padding: "1rem 2.5rem",
              border: "1px solid #1a1a18", display: "inline-block",
              transition: "background 0.3s, color 0.3s",
            }}>
              Explore the Collection
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 3rem)",
          }}>
            {wishlistProducts.map((product) => (
              <WishlistCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

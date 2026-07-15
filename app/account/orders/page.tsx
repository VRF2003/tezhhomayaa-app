"use client";

import AccountLayout from "@/components/account/AccountLayout";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/store";

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();

  // Mock data for orders using existing Unsplash images from the project
  const orders = isLoggedIn ? [
    {
      id: "ORD-293847",
      date: "Oct 12, 2026",
      status: "Delivered",
      total: "$1,850.00",
      items: [
        { name: "The Sculptural Obsidian Coat", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800" }
      ]
    },
    {
      id: "ORD-184759",
      date: "Sep 04, 2026",
      status: "Processing",
      total: "$940.00",
      items: [
        { name: "Silk Draped Blouse", image: "https://images.unsplash.com/photo-1550614000-4b95d4ebf5e9?auto=format&fit=crop&q=80&w=800" },
        { name: "Minimalist Leather Belt", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800" }
      ]
    }
  ] : [];

  return (
    <AccountLayout title="Order History">
      {orders.length === 0 ? (
        <div style={{ paddingTop: "2rem" }}>
          <p style={{
            fontFamily: "var(--font-cormorant, serif)", fontWeight: 300,
            fontSize: "1.4rem", color: "#9a9690", fontStyle: "italic"
          }}>
            You have no recent orders.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {orders.map(order => (
            <div key={order.id} style={{
              borderBottom: "1px solid #e8e6e1",
              paddingBottom: "3rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.75rem",
                    letterSpacing: "0.15em", color: "#1a1a18", margin: "0 0 0.5rem 0",
                    textTransform: "uppercase"
                  }}>
                    {order.id}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
                    color: "#9a9690", margin: 0
                  }}>
                    {order.date}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
                    letterSpacing: "0.1em", color: order.status === "Delivered" ? "#4a4845" : "#1a1a18",
                    margin: "0 0 0.5rem 0", textTransform: "uppercase"
                  }}>
                    {order.status}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
                    color: "#1a1a18", margin: 0
                  }}>
                    {order.total}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: "60px", height: "80px", position: "relative", background: "#edeae5" }}>
                        <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: "cover" }} />
                      </div>
                      {/* Only show name if there's just one item, otherwise just images to save space */}
                      {order.items.length === 1 && (
                        <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845", maxWidth: "200px" }}>
                          {item.name}
                        </p>
                      )}
                    </div>
                  ))}
                  {order.items.length > 1 && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845" }}>
                        {order.items.length} items
                      </p>
                    </div>
                  )}
                </div>

                <Link href={`/account/orders/${order.id}`} style={{
                  fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
                  letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18",
                  textDecoration: "none", borderBottom: "1px solid #1a1a18", paddingBottom: "0.2rem",
                  transition: "opacity 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.6"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}

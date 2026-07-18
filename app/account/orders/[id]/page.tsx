"use client";

import AccountLayout from "@/components/account/AccountLayout";
import Link from "next/link";
import Image from "next/image";
import { useDateFormatter } from "@/lib/global-experience/formatters";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const dateFormatter = useDateFormatter();
  // Mock data for order details
  const order = {
    id: params.id || "ORD-293847",
    date: "Oct 12, 2026",
    status: "Delivered",
    shippingAddress: {
      name: "Sarang Sharma",
      street: "123 Quiet Luxury Lane",
      city: "New York",
      state: "NY",
      zip: "10012",
      country: "United States"
    },
    billingAddress: {
      name: "Sarang Sharma",
      street: "123 Quiet Luxury Lane",
      city: "New York",
      state: "NY",
      zip: "10012",
      country: "United States"
    },
    payment: {
      method: "Visa ending in 4242",
      subtotal: "$1,800.00",
      shipping: "$50.00",
      tax: "$0.00",
      total: "$1,850.00"
    },
    items: [
      {
        name: "The Sculptural Obsidian Coat",
        size: "Medium",
        quantity: 1,
        price: "$1,800.00",
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800"
      }
    ]
  };

  return (
    <AccountLayout title={`Order ${order.id}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        
        {/* Timeline / Status */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
            letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
            textTransform: "uppercase"
          }}>
            Status
          </h3>
          <p style={{
            fontFamily: "var(--font-cormorant, serif)", fontSize: "1.4rem",
            color: "#1a1a18", margin: 0
          }}>
            {order.status} on {dateFormatter.formatDate(order.date)}
          </p>
        </div>

        {/* Addresses */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Shipping Address
            </h3>
            <address style={{
              fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
              color: "#4a4845", fontStyle: "normal", lineHeight: 1.6
            }}>
              {order.shippingAddress.name}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </address>
          </div>
          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Billing Address
            </h3>
            <address style={{
              fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
              color: "#4a4845", fontStyle: "normal", lineHeight: 1.6
            }}>
              {order.billingAddress.name}<br />
              {order.billingAddress.street}<br />
              {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}<br />
              {order.billingAddress.country}
            </address>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
            letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1.5rem 0",
            textTransform: "uppercase"
          }}>
            Items
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #e8e6e1", paddingBottom: "2rem" }}>
                <div style={{ width: "90px", height: "120px", position: "relative", background: "#edeae5" }}>
                  <Image src={item.image} alt={item.name} fill sizes="90px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{
                      fontFamily: "var(--font-cormorant, serif)", fontSize: "1.3rem",
                      color: "#1a1a18", margin: "0 0 0.5rem 0", fontWeight: 400
                    }}>
                      {item.name}
                    </h4>
                    <p style={{
                      fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.6rem",
                      letterSpacing: "0.1em", color: "#9a9690", margin: 0, textTransform: "uppercase"
                    }}>
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.7rem",
                    letterSpacing: "0.1em", color: "#1a1a18", margin: 0
                  }}>
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Payment Method
            </h3>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
              color: "#4a4845", margin: 0
            }}>
              {order.payment.method}
            </p>
            
            {/* Future Architecture: Invoice Download */}
            <Link href="#" style={{
              display: "inline-block", marginTop: "1.5rem",
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18",
              textDecoration: "none", borderBottom: "1px solid #1a1a18", paddingBottom: "0.2rem",
              transition: "opacity 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.6"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
              Download Invoice
            </Link>
          </div>

          <div>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#9a9690", margin: "0 0 1rem 0",
              textTransform: "uppercase"
            }}>
              Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%", maxWidth: "300px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845" }}>Subtotal</span>
                <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem", color: "#1a1a18", letterSpacing: "0.1em" }}>{order.payment.subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845" }}>Shipping</span>
                <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem", color: "#1a1a18", letterSpacing: "0.1em" }}>{order.payment.shipping}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.1rem", color: "#4a4845" }}>Tax</span>
                <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem", color: "#1a1a18", letterSpacing: "0.1em" }}>{order.payment.tax}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e8e6e1", paddingTop: "0.8rem", marginTop: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#1a1a18", fontWeight: 500 }}>Total</span>
                <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.75rem", color: "#1a1a18", letterSpacing: "0.1em", fontWeight: 500 }}>{order.payment.total}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AccountLayout>
  );
}

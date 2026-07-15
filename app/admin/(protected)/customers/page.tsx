"use client";

import { useState, useMemo } from "react";

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: "CUST-19283",
      name: "Sarang Sharma",
      email: "sarang@example.com",
      phone: "+1 (555) 000-0000",
      totalOrders: 2,
      lifetimeValue: "$2,790.00",
      joinDate: "Aug 01, 2026"
    },
    {
      id: "CUST-84759",
      name: "Emma Rossi",
      email: "emma.rossi@example.com",
      phone: "+1 (555) 111-2222",
      totalOrders: 5,
      lifetimeValue: "$12,450.00",
      joinDate: "Jan 14, 2026"
    },
    {
      id: "CUST-29384",
      name: "David Chen",
      email: "david.c@example.com",
      phone: "+1 (555) 333-4444",
      totalOrders: 0,
      lifetimeValue: "$0.00",
      joinDate: "Oct 10, 2026"
    }
  ]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [customers, searchQuery]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete customer ${name} (${id})?`)) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleResetPassword = (email: string) => {
    alert(`Password reset link sent to ${email} (Mock)`);
  };

  return (
    <div style={{ paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Customers
          </h1>
          <div style={{ fontSize: "0.85rem", color: "#7a7874", fontFamily: "var(--font-dm-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Showing <strong style={{ color: "#1a1a18", fontWeight: 500 }}>{filteredCustomers.length}</strong> of {customers.length} customers
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <input 
            type="text" 
            placeholder="Search by Customer ID, Name, or Email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", border: "1px solid #ccc9c4", borderRadius: "2px", background: "#fafaf8", outline: "none" }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "900px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Customer ID</th>
              <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Name & Contact</th>
              <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Join Date</th>
              <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Total Orders</th>
              <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Lifetime Value</th>
              <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem" }}>
                  No customers match your search.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500, fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {customer.id}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#1a1a18" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <span style={{ fontWeight: 500 }}>{customer.name}</span>
                      <span style={{ fontSize: "0.7rem", color: "#9a9690", fontWeight: 400 }}>{customer.email}</span>
                      <span style={{ fontSize: "0.7rem", color: "#9a9690", fontWeight: 400 }}>{customer.phone}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b6865" }}>
                    {customer.joinDate}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b6865" }}>
                    {customer.totalOrders}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>
                    {customer.lifetimeValue}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", alignItems: "center" }}>
                      <button onClick={() => handleResetPassword(customer.email)} style={{ background: "none", border: "none", color: "#6b6865", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0 }} className="hover-underline">
                        Reset Pass
                      </button>
                      <button onClick={() => handleDelete(customer.id, customer.name)} style={{ background: "none", border: "none", color: "#a55", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0 }} className="hover-underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-underline:hover { text-decoration: underline !important; }
      `}} />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [orders, setOrders] = useState([
    {
      id: "ORD-293847",
      date: "Oct 12, 2026",
      customer: "Sarang Sharma",
      email: "sarang@example.com",
      status: "Delivered",
      total: "$1,850.00",
      itemsCount: 1
    },
    {
      id: "ORD-184759",
      date: "Sep 04, 2026",
      customer: "Sarang Sharma",
      email: "sarang@example.com",
      status: "Processing",
      total: "$940.00",
      itemsCount: 2
    },
    {
      id: "ORD-928374",
      date: "Aug 15, 2026",
      customer: "Emma Rossi",
      email: "emma.rossi@example.com",
      status: "Shipped",
      total: "$2,400.00",
      itemsCount: 3
    }
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete order ${id}? This cannot be undone.`)) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>

      {/* Control Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name, or Email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", border: "1px solid #ccc9c4", borderRadius: "2px", background: "#fafaf8" }}
          />
        </div>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "0.5rem", display: "block" }}>Filter by Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
              <option value="all">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Order ID</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Date</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Customer</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Items</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Total</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem" }}>
                  No orders match your filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1.2rem 1.5rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500, fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {order.id}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", fontSize: "0.85rem", color: "#6b6865" }}>
                    {order.date}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", fontSize: "0.85rem", color: "#1a1a18" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <span>{order.customer}</span>
                      <span style={{ fontSize: "0.7rem", color: "#9a9690", fontWeight: 400 }}>{order.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "1rem",
                        border: "1px solid transparent",
                        fontSize: "0.65rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        background: order.status === "Delivered" ? "#e8f0e8" : (order.status === "Cancelled" ? "#fdf0f0" : "#f0ede8"),
                        color: order.status === "Delivered" ? "#2a4a2a" : (order.status === "Cancelled" ? "#c5221f" : "#6b6865"),
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", fontSize: "0.85rem", color: "#6b6865" }}>
                    {order.itemsCount}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>
                    {order.total}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", alignItems: "center" }}>
                      <button onClick={() => handleDelete(order.id)} style={{ background: "none", border: "none", color: "#9a9690", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#c5221f"} onMouseLeave={e => e.currentTarget.style.color = "#9a9690"}>
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

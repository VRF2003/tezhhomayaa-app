"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/lib/collections";
import { useRouter } from "next/navigation";

export default function BulkEditProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Keep track of which fields on which products have been modified
  const [edits, setEdits] = useState<Record<string, Partial<Product>>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data as Product[]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.barcode || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(p => {
        const s = String(p.status || "active").toLowerCase();
        if (statusFilter === "active") return s === "active" || s === "true";
        if (statusFilter === "draft") return s === "draft" || s === "false";
        if (statusFilter === "archived") return s === "archived";
        return true;
      });
    }

    return result;
  }, [products, searchQuery, statusFilter]);

  const handleEdit = (id: string, field: keyof Product, value: any) => {
    setEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const getDisplayValue = (product: Product, field: keyof Product) => {
    if (edits[product.id] && edits[product.id][field] !== undefined) {
      return edits[product.id][field];
    }
    return product[field] || "";
  };

  const hasChanges = Object.keys(edits).length > 0;

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    
    // Prepare payload
    const updates = Object.keys(edits).map(id => ({
      id,
      ...edits[id]
    }));

    try {
      const res = await fetch("/api/products/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      
      if (data.success) {
        // Update local state with edits so we don't have to refetch immediately,
        // although refetching ensures consistency.
        setProducts(prevProducts => prevProducts.map(p => {
          if (edits[p.id]) {
            return { ...p, ...edits[p.id] };
          }
          return p;
        }));
        setEdits({});
        alert(`Successfully updated ${data.updatedCount} products.`);
      } else {
        alert("Error saving updates: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingBottom: "4rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <Link href="/admin/products" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#9a9690", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }} className="hover-underline">
            ← Back to Products
          </Link>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Bulk Edit Products
          </h1>
          <div style={{ fontSize: "0.85rem", color: "#7a7874", fontFamily: "var(--font-dm-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Mass update attributes across your catalog
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          {hasChanges && (
            <button 
              onClick={() => setEdits({})}
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                color: "#6b6865",
                border: "1px solid #e8e4df",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: saving ? "not-allowed" : "pointer",
                borderRadius: "2px",
              }}
            >
              Discard Changes
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={!hasChanges || saving}
            style={{
              padding: "0.75rem 1.5rem",
              background: !hasChanges ? "#e8e4df" : "#1a1a18",
              color: !hasChanges ? "#9a9690" : "#f7f5f2",
              border: "none",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: (!hasChanges || saving) ? "not-allowed" : "pointer",
              borderRadius: "2px",
              transition: "all 0.2s ease"
            }}
          >
            {saving ? "Saving..." : `Save Changes ${hasChanges ? `(${Object.keys(edits).length})` : ""}`}
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem" }}>
        <input 
          type="text" 
          placeholder="Filter by Name, SKU, Barcode..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: "1rem", fontSize: "0.95rem", border: "1px solid #ccc9c4", borderRadius: "2px", background: "#fafaf8" }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "200px", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Data Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ color: "#9a9690", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading...</p>
        </div>
      ) : (
        <div style={{
          background: "#ffffff",
          border: "1px solid #e8e4df",
          borderRadius: "2px",
          overflowX: "auto",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, width: "30%" }}>Product Name</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, width: "15%" }}>SKU</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, width: "15%" }}>Barcode</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, width: "15%" }}>Price (USD)</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, width: "15%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem" }}>
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isEdited = edits[p.id] !== undefined;

                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #e8e4df", background: isEdited ? "#fbfbfa" : "transparent" }}>
                      {/* Name */}
                      <td style={{ padding: "0", borderRight: "1px solid #f2f0ec" }}>
                        <input
                          type="text"
                          value={getDisplayValue(p, "name") as string}
                          onChange={(e) => handleEdit(p.id, "name", e.target.value)}
                          style={{
                            width: "100%", padding: "1rem", border: "none", background: "transparent", 
                            fontSize: "0.85rem", color: "#1a1a18", outline: "none",
                            boxShadow: "inset 0 0 0 1px transparent", transition: "box-shadow 0.2s"
                          }}
                          onFocus={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px #ccc9c4"}
                          onBlur={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px transparent"}
                        />
                      </td>

                      {/* SKU */}
                      <td style={{ padding: "0", borderRight: "1px solid #f2f0ec" }}>
                        <input
                          type="text"
                          value={getDisplayValue(p, "sku") as string}
                          onChange={(e) => handleEdit(p.id, "sku", e.target.value)}
                          style={{
                            width: "100%", padding: "1rem", border: "none", background: "transparent", 
                            fontSize: "0.85rem", color: "#1a1a18", outline: "none", fontFamily: "var(--font-dm-mono, monospace)",
                            boxShadow: "inset 0 0 0 1px transparent", transition: "box-shadow 0.2s"
                          }}
                          onFocus={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px #ccc9c4"}
                          onBlur={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px transparent"}
                        />
                      </td>

                      {/* Barcode */}
                      <td style={{ padding: "0", borderRight: "1px solid #f2f0ec" }}>
                        <input
                          type="text"
                          value={getDisplayValue(p, "barcode") as string}
                          onChange={(e) => handleEdit(p.id, "barcode", e.target.value)}
                          style={{
                            width: "100%", padding: "1rem", border: "none", background: "transparent", 
                            fontSize: "0.85rem", color: "#1a1a18", outline: "none", fontFamily: "var(--font-dm-mono, monospace)",
                            boxShadow: "inset 0 0 0 1px transparent", transition: "box-shadow 0.2s"
                          }}
                          onFocus={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px #ccc9c4"}
                          onBlur={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px transparent"}
                        />
                      </td>

                      {/* Price */}
                      <td style={{ padding: "0", borderRight: "1px solid #f2f0ec" }}>
                        <div style={{ display: "flex", alignItems: "center", paddingLeft: "1rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "#9a9690", marginRight: "0.25rem" }}>$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={String(getDisplayValue(p, "price")).replace(/[^0-9.]/g, '')}
                            onChange={(e) => handleEdit(p.id, "price", `$${e.target.value}`)}
                            style={{
                              width: "100%", padding: "1rem 1rem 1rem 0", border: "none", background: "transparent", 
                              fontSize: "0.85rem", color: "#1a1a18", outline: "none",
                              boxShadow: "inset 0 0 0 1px transparent", transition: "box-shadow 0.2s"
                            }}
                            onFocus={e => e.currentTarget.style.boxShadow = "inset 0 -1px 0 0 #ccc9c4"}
                            onBlur={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px transparent"}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "0" }}>
                        <select
                          value={getDisplayValue(p, "status") as string}
                          onChange={(e) => handleEdit(p.id, "status", e.target.value)}
                          style={{
                            width: "100%", padding: "1rem", border: "none", background: "transparent", 
                            fontSize: "0.75rem", color: "#1a1a18", outline: "none", textTransform: "uppercase", letterSpacing: "0.05em",
                            cursor: "pointer", appearance: "none"
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-underline:hover { text-decoration: underline !important; }
        
        /* Remove number input spin buttons */
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}} />
    </div>
  );
}

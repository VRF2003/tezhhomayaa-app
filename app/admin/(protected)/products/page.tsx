"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/collections";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialStatusFilter = searchParams.get("status") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Fetch initial data
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

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name || "").toLowerCase().includes(q) ||
        (p.slug || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.barcode || "").toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter(p => {
        const s = String(p.status || "active").toLowerCase();
        if (statusFilter === "active") return s === "active" || s === "true";
        if (statusFilter === "draft") return s === "draft" || s === "false";
        if (statusFilter === "archived") return s === "archived";
        return true;
      });
    }

    // Parse category path
    const getParts = (cat: string) => {
      const parts = (cat || "").split("/");
      return {
        dep: parts[0] || "",
        cat: parts[1] || "",
        sub: parts[2] || ""
      };
    };

    // Department
    if (departmentFilter !== "all") {
      result = result.filter(p => getParts(p.category).dep === departmentFilter);
    }

    // Category
    if (categoryFilter !== "all") {
      result = result.filter(p => getParts(p.category).cat === categoryFilter);
    }

    // Subcategory
    if (subcategoryFilter !== "all") {
      result = result.filter(p => getParts(p.category).sub === subcategoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "a-z") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortOrder === "z-a") {
        return (b.name || "").localeCompare(a.name || "");
      } else {
        // Timestamp extraction from prod_1234567890123_xyz
        const tsA = a.id && a.id.startsWith("prod_") ? parseInt(a.id.split("_")[1] || "0") : 0;
        const tsB = b.id && b.id.startsWith("prod_") ? parseInt(b.id.split("_")[1] || "0") : 0;
        if (sortOrder === "newest") return tsB - tsA;
        if (sortOrder === "oldest") return tsA - tsB;
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, statusFilter, departmentFilter, categoryFilter, subcategoryFilter, sortOrder]);

  // Derived unique lists for dropdowns based on current data
  const uniqueDepartments = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { const parts = (p.category || "").split("/"); if(parts[0]) s.add(parts[0]); });
    return Array.from(s).sort();
  }, [products]);

  const uniqueCategories = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { 
      const parts = (p.category || "").split("/"); 
      if(parts[0] === departmentFilter || departmentFilter === "all") {
        if(parts[1]) s.add(parts[1]); 
      }
    });
    return Array.from(s).sort();
  }, [products, departmentFilter]);

  const uniqueSubcategories = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { 
      const parts = (p.category || "").split("/"); 
      if((parts[0] === departmentFilter || departmentFilter === "all") && 
         (parts[1] === categoryFilter || categoryFilter === "all")) {
        if(parts[2]) s.add(parts[2]); 
      }
    });
    return Array.from(s).sort();
  }, [products, departmentFilter, categoryFilter]);

  // Actions
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(p => p.filter(prod => prod.id !== id));
      } else {
        alert("Error deleting product: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      const copy = { ...product };
      copy.name = `${copy.name} (Copy)`;
      copy.slug = `${copy.slug}-copy-${Math.floor(Math.random()*1000)}`;
      copy.handle = copy.slug;
      // Remove specific IDs so server generates new ones
      delete (copy as any).id;
      
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copy)
      });
      const data = await res.json();
      if (data.success) {
        setProducts([...products, data.data]);
      } else {
        alert("Error duplicating: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div style={{ paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Products
          </h1>
          <div style={{ fontSize: "0.85rem", color: "#7a7874", fontFamily: "var(--font-dm-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Showing <strong style={{ color: "#1a1a18", fontWeight: 500 }}>{filteredProducts.length}</strong> of {products.length} products
          </div>
        </div>
        <Link href="/admin/products/new" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "0.75rem 1.5rem",
            background: "#1a1a18",
            color: "#f7f5f2",
            border: "none",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: "2px",
          }}>
            Add Product
          </button>
        </Link>
      </div>

      {/* Control Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Search */}
        <div>
          <input 
            type="text" 
            placeholder="Search by Name, SKU, Barcode, or Slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", border: "1px solid #ccc9c4", borderRadius: "2px", background: "#fafaf8" }}
          />
        </div>
        
        {/* Filters & Sorting */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "0.5rem", display: "block" }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "0.5rem", display: "block" }}>Department</label>
            <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCategoryFilter("all"); setSubcategoryFilter("all"); }} style={{ width: "100%", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
              <option value="all">All Departments</option>
              {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "0.5rem", display: "block" }}>Category</label>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setSubcategoryFilter("all"); }} style={{ width: "100%", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
              <option value="all">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "0.5rem", display: "block" }}>Subcategory</label>
            <select value={subcategoryFilter} onChange={(e) => setSubcategoryFilter(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
              <option value="all">All Subcategories</option>
              {uniqueSubcategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865", marginBottom: "0.5rem", display: "block" }}>Sort By</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #e8e4df", background: "transparent", fontSize: "0.85rem" }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">Alphabetical (A-Z)</option>
              <option value="z-a">Alphabetical (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ color: "#9a9690", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading...</p>
        </div>
      ) : (
        <div style={{
          background: "#ffffff",
          border: "1px solid #e8e4df",
          borderRadius: "2px",
          overflowX: "auto"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Image</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Product</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Category</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Price</th>
                <th style={{ padding: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem" }}>
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "1rem" }}>
                      <img src={p.image || "/images/placeholder.jpg"} alt={p.name} style={{ width: "40px", height: "50px", objectFit: "cover", borderRadius: "2px" }} />
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span>{p.name}</span>
                        <span style={{ fontSize: "0.7rem", color: "#9a9690", fontWeight: 400 }}>{p.slug}</span>
                        {(p.sku || p.barcode) && (
                          <span style={{ fontSize: "0.65rem", color: "#a8a5a0", fontFamily: "var(--font-dm-mono, monospace)" }}>
                            {p.sku ? `SKU: ${p.sku}` : ''} {p.sku && p.barcode ? '|' : ''} {p.barcode ? `BAR: ${p.barcode}` : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "1rem",
                        fontSize: "0.65rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        background: p.status === "active" ? "#e8f0e8" : p.status === "draft" ? "#f0ede8" : "#fdf0f0",
                        color: p.status === "active" ? "#2a4a2a" : p.status === "draft" ? "#6b6865" : "#6b3a3a",
                      }}>
                        {p.status || "active"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b6865" }}>
                      {p.categoryLabel}
                      <div style={{ fontSize: "0.65rem", color: "#9a9690", marginTop: "0.2rem" }}>{p.category}</div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#1a1a18" }}>
                      {p.price}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", alignItems: "center" }}>
                        <a href={p.href || `/products/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }} className="hover-underline">
                          Preview
                        </a>
                        <Link href={`/admin/products/${p.id}`} style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }} className="hover-underline">
                          Edit
                        </Link>
                        <button onClick={() => handleDuplicate(p)} style={{ background: "none", border: "none", color: "#6b6865", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0 }} className="hover-underline">
                          Duplicate
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} style={{ background: "none", border: "none", color: "#a55", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0 }} className="hover-underline">
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
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-underline:hover { text-decoration: underline !important; }
      `}} />
    </div>
  );
}

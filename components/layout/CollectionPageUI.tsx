"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollectionBanner from "@/components/sections/CollectionBanner";
import ProductGrid from "@/components/sections/ProductGrid";
import FilterSortOverlay, { FilterState, FilterGroup } from "@/components/ecommerce/FilterSortOverlay";
import { getProductPrice } from "@/lib/currency";
import Link from "next/link";
import menuData from "@/lib/menus.json";

type CollectionPageUIProps = {
  categoryKey: string;
  meta: any;
  bannerData: any;
  finalProducts: any[];
  totalRaw: number;
  totalActive: number;
  totalDraft: number;
  smartCollection?: any;
};

export default function CollectionPageUI({ 
  categoryKey, 
  meta, 
  bannerData, 
  finalProducts, 
  totalRaw, 
  totalActive, 
  totalDraft, 
  smartCollection 
}: CollectionPageUIProps) {
  // Dynamically generate fallback meta if none exists but we have products
  const pageMeta = meta || smartCollection || (finalProducts.length > 0 ? {
    title: categoryKey.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    subtitle: categoryKey.split('/')[0]?.toUpperCase(),
    bannerImage: "",
    description: ""
  } : null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const [sortMethod, setSortMethod] = useState("recommended");

  // Helper to normalize sizes and distinguish them from colors incorrectly labeled as sizes
  const normalizeSize = (raw: string): string | null => {
    if (!raw) return null;
    const s = raw.trim().toUpperCase();
    if (["XXS", "XS", "S", "M", "L", "XL"].includes(s)) return s;
    if (s === "XXL" || s === "2XL") return "XXL";
    if (s === "XXXL" || s === "3XL") return "3XL";
    if (s === "XXXXL" || s === "4XL") return "4XL";
    if (/^\d{2}$/.test(s) || /^W\d{2}$/.test(s)) return s;
    if (s === "ONE SIZE" || s === "OS" || s === "FREE SIZE") return "One Size";
    if (/^\d{1,2}(\.5)?$/.test(s)) return s;
    return null;
  };

  const formatColorName = (raw: string): string => {
    return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  // Extract available filters dynamically from products
  const filterGroups = useMemo<FilterGroup[]>(() => {
    const categories = new Set<string>();
    const colors = new Set<string>();
    const materials = new Set<string>();
    const sizes = new Set<string>();

    finalProducts.forEach(p => {
      if (p.categoryLabel) categories.add(p.categoryLabel);
      if (p.color) colors.add(formatColorName(p.color));
      if (p.material) materials.add(p.material);
      if (p.variants) {
        p.variants.forEach((v: any) => {
          if (v.optionName?.toLowerCase() === "size" || v.optionName?.toLowerCase() === "color") {
            const normSize = normalizeSize(v.option);
            if (normSize) {
              sizes.add(normSize);
            } else {
              // If it doesn't match a size format, it's very likely a color incorrectly entered as a size.
              colors.add(formatColorName(v.option));
            }
          }
        });
      }
    });

    return [
      { id: "category", label: "Categories", options: Array.from(categories).sort() },
      { id: "color", label: "Colours", options: Array.from(colors).sort() },
      { id: "material", label: "Materials", options: Array.from(materials).sort() },
      { id: "size", label: "Sizes", options: Array.from(sizes).sort() }
    ];
  }, [finalProducts]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...finalProducts];

    // Filter
    if (Object.keys(selectedFilters).some(k => selectedFilters[k].length > 0)) {
      result = result.filter(p => {
        let matches = true;
        if (selectedFilters.category?.length > 0) {
          matches = matches && selectedFilters.category.includes(p.categoryLabel);
        }
        if (selectedFilters.color?.length > 0) {
          const productColors = [
            p.color ? formatColorName(p.color) : null,
            ...(p.variants?.map((v: any) => {
              const normSize = normalizeSize(v.option);
              return normSize ? null : formatColorName(v.option);
            }) || [])
          ].filter(Boolean) as string[];
          matches = matches && selectedFilters.color.some((c: string) => productColors.includes(c));
        }
        if (selectedFilters.material?.length > 0) {
          matches = matches && selectedFilters.material.includes(p.material);
        }
        if (selectedFilters.size?.length > 0) {
          const productSizes = p.variants?.map((v: any) => normalizeSize(v.option)).filter(Boolean) || [];
          matches = matches && selectedFilters.size.some((s: string) => productSizes.includes(s));
        }
        return matches;
      });
    }

    // Sort
    if (sortMethod === "price-low") {
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sortMethod === "price-high") {
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    } else if (sortMethod === "newest") {
      // Assuming original array is roughly chronological or we don't have a created_at field yet.
      // We can reverse it as a proxy for newest.
      result.reverse();
    }

    return result;
  }, [finalProducts, selectedFilters, sortMethod]);

  const handleFilterChange = (groupId: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[groupId] || [];
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [groupId]: updated };
    });
  };

  const handleClearAll = () => setSelectedFilters({});

  // Find sub-categories based on categoryKey (e.g. "men/ready-to-wear/shirts")
  const subCategoryLinks = useMemo(() => {
    const keyPath = "/" + categoryKey;
    let foundItems: { label: string, href: string }[] = [];
    let parentLabel: string | null = null;
    let parentHref: string | null = null;

    for (const topLevel of menuData) {
      if (topLevel.categories) {
        for (const cat of topLevel.categories) {
          if (cat.href === keyPath) {
             foundItems = cat.items || [];
             parentLabel = cat.label;
             parentHref = cat.href;
             break;
          }
          if (cat.items && cat.items.some((item: any) => item.href === keyPath)) {
             foundItems = cat.items;
             parentLabel = cat.label;
             parentHref = cat.href;
             break;
          }
        }
      }
    }

    if (foundItems.length > 0 && parentHref && parentLabel) {
       return [
         { label: `View All ${parentLabel}`, href: parentHref },
         ...foundItems
       ];
    }
    
    return [];
  }, [categoryKey]);

  const hasCustomBanner = bannerData?.media?.desktop?.url || (bannerData?.content?.heading && bannerData.content.heading !== "New Banner" && bannerData.content.heading !== "Collection");

  if (!pageMeta && !hasCustomBanner && finalProducts.length === 0) {
    return (
      <main>
        <Navbar />
        <div style={{ paddingTop: "120px", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.5rem", color: "var(--stone)", fontWeight: 300 }}>
            Collection coming soon.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <div style={{ background: "#F7F5F2", minHeight: "100vh" }}>
      <main>
        <Navbar />

        {/* Spacer removed so banner underlaps header */}

        {/* Editorial Banner */}
        <CollectionBanner
          categoryKey={categoryKey}
          data={bannerData}
          presentation={smartCollection?.presentation}
        />

        {/* Sub-Category Navigation Bar */}
        {subCategoryLinks.length > 0 && (
          <div style={{ borderTop: "1px solid #e8e4df", borderBottom: "1px solid #e8e4df", padding: "1rem clamp(1rem, 5vw, 4rem)", background: "#ffffff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "0.25rem", msOverflowStyle: "none", scrollbarWidth: "none" }} className="hide-scrollbar">
              {subCategoryLinks.map((link) => {
                const isActive = "/" + categoryKey === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      textDecoration: "none",
                      fontFamily: "var(--font-jost, sans-serif)", fontSize: "0.75rem",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#1a1a18" : "#6b6865",
                      padding: "0 0 0.2rem 0",
                      borderBottom: isActive ? "2px solid #1a1a18" : "2px solid transparent",
                      transition: "all 0.2s"
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}} />

        {/* Filter Bar */}
        <div style={{ 
          padding: "1rem clamp(1rem, 5vw, 4rem)", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
          borderBottom: "1px solid #e8e4df"
        }}>
          <div style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "0.75rem", color: "#1a1a18", letterSpacing: "0.025em", fontWeight: 300 }}>
            {filteredAndSortedProducts.length} items sorted by <strong 
              onClick={() => setIsFilterOpen(true)}
              style={{ fontWeight: 300, textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "2px", cursor: "pointer" }}
            >
              {sortMethod === "recommended" ? "Recommended" : sortMethod === "price-low" ? "Price Low to High" : sortMethod === "price-high" ? "Price High to Low" : "Newest"}
            </strong>
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{
              background: "none", border: "1px solid #ccc9c4", borderRadius: "2px",
              padding: "0.5rem 1rem", cursor: "pointer",
              fontFamily: "var(--font-jost, sans-serif)", fontSize: "0.75rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "0.5rem"
            }}
          >
            Filter and Sort
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
        </div>

        <FilterSortOverlay
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filterGroups={filterGroups}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          sortMethod={sortMethod}
          onSortChange={setSortMethod}
          totalItems={filteredAndSortedProducts.length}
          onClearAll={handleClearAll}
        />

        {/* Product Grid */}
        <ProductGrid 
          products={filteredAndSortedProducts} 
          presentation={smartCollection?.presentation}
        />



        <Footer />
      </main>
    </div>
  );
}

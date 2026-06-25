import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";
import { inferCategory, categoryLabel } from "@/lib/categoryEngine";

// ─── Types ────────────────────────────────────────────────────
type ImportedProduct = {
  id: string;
  slug: string;
  handle: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  gallery: string[];
  category: string;
  categoryLabel: string;
  href: string;
  editorialDescription: string;
  tags: string[];
  variants: { optionName: string; option: string; price: number; sku: string }[];
};

function formatPrice(price: string): number {
  const num = parseFloat(price.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  return num;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}

// ─── CSV Parser ───────────────────────────────────────────────
function parseRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current); current = "";
    } else { current += ch; }
  }
  result.push(current);
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseRow(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseRow(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] || "").trim(); });
    rows.push(row);
  }
  return rows;
}

// ─── Main handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ success: false, error: "No file uploaded." }, { status: 400 });
    if (!file.name.endsWith(".csv")) return NextResponse.json({ success: false, error: "Only CSV files are supported." }, { status: 400 });

    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) return NextResponse.json({ success: false, error: "CSV is empty or malformed." }, { status: 400 });

    // Group rows by Handle
    const productMap = new Map<string, {
      handle: string; title: string; body: string; type: string;
      tags: string; price: string; images: string[]; variants: ImportedProduct["variants"]; status: string;
    }>();

    for (const row of rows) {
      const handle = row["Handle"];
      if (!handle) continue;

      if (!productMap.has(handle)) {
        productMap.set(handle, {
          handle,
          title: row["Title"] || "",
          body: row["Body (HTML)"] || "",
          type: row["Product Category"] || row["Type"] || "",
          tags: row["Tags"] || "",
          price: row["Variant Price"] || "0",
          images: [],
          variants: [],
          status: row["Status"] || "active",
        });
      }

      const product = productMap.get(handle)!;
      const imgSrc = row["Image Src"];
      if (imgSrc && !product.images.includes(imgSrc)) product.images.push(imgSrc);

      const opt1 = row["Option1 Value"];
      const variantPrice = row["Variant Price"];
      if (opt1 && variantPrice) {
        product.variants.push({
          optionName: row["Option1 Name"] || "Size",
          option: opt1,
          price: formatPrice(variantPrice),
          sku: row["Variant SKU"] || "",
        });
        const parsed = parseFloat(variantPrice);
        const existing = parseFloat(product.price) || Infinity;
        if (!isNaN(parsed) && parsed < existing) product.price = variantPrice;
      }
    }

    // ── Pass 1: Build a map of base-title → first available image ─────────────
    // Shopify CSVs often omit Image Src for colour-variant rows.
    // We resolve missing images by finding a sibling product (same base title).
    function baseTitle(name: string): string {
      // Strip trailing " - Colour" suffixes  e.g. "Shirt - Red" → "Shirt"
      return name.replace(/\s*[-–—]\s*[^-–—]{1,40}$/, "").trim();
    }

    const imageByBaseTitle: Record<string, string> = {};
    const imageByHandle: Record<string, string> = {};

    for (const [, p] of productMap.entries()) {
      if (p.images.length === 0) continue;
      const img = p.images[0];
      if (!img.startsWith("http")) continue;
      imageByHandle[p.handle] = img;
      const base = baseTitle(p.title);
      if (!imageByBaseTitle[base]) imageByBaseTitle[base] = img;
    }

    // Walk up a handle ("the-dots-shorts-white-2" → "the-dots-shorts-white" → "the-dots-shorts")
    function resolveImageFromHandle(handle: string): string | null {
      let h = handle;
      while (h.includes("-")) {
        h = h.replace(/-[^-]+$/, "");
        if (imageByHandle[h]) return imageByHandle[h];
      }
      return null;
    }

    // ── Pass 2: Convert to Product format ──────────────────────────────────────
    const products: ImportedProduct[] = [];
    let idx = 0;

    for (const [, p] of productMap.entries()) {
      if (p.status && p.status.toLowerCase() === "draft") continue;

      const category = inferCategory(p.type, p.tags, p.title, p.handle);

      // Resolve image: own images → sibling by title → sibling by handle walk-up → no placeholder
      let resolvedImages = p.images.filter((img) => img.startsWith("http"));
      if (resolvedImages.length === 0) {
        const titleImg = imageByBaseTitle[baseTitle(p.title)];
        const handleImg = resolveImageFromHandle(p.handle);
        const fallback = titleImg || handleImg;
        if (fallback) resolvedImages = [fallback];
      }

      // Only use static placeholder if nothing else is available (should be extremely rare)
      const gallery = resolvedImages.length > 0 ? resolvedImages : ["/images/placeholder.jpg"];
      const editorialDescription = stripHtml(p.body) || `${p.title} — Tezhhomayaa Collection.`;

      products.push({
        id: `imported_${idx++}`,
        slug: p.handle,
        handle: p.handle,
        name: p.title,
        price: formatPrice(p.price),
        image: gallery[0],
        hoverImage: gallery[1] || gallery[0],
        gallery,
        category,
        categoryLabel: categoryLabel(category),
        href: `/products/${p.handle}`,
        editorialDescription,
        tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
        variants: p.variants,
      });
    }


    if (products.length === 0) return NextResponse.json({ success: false, error: "No active products found in CSV." }, { status: 400 });

    writeFileSync(join(process.cwd(), "lib", "products.json"), JSON.stringify(products, null, 2), "utf-8");

    // Category breakdown
    const categories: Record<string, number> = {};
    products.forEach((p) => { categories[p.category] = (categories[p.category] || 0) + 1; });

    return NextResponse.json({ success: true, count: products.length, categories });
  } catch (err) {
    console.error("[import-csv] error:", err);
    return NextResponse.json({ success: false, error: "Server error during import." }, { status: 500 });
  }
}

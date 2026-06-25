#!/usr/bin/env node
/**
 * Tezhhomayaa — Shopify CSV → Local JSON Import Script
 *
 * Usage:
 *   node scripts/import-shopify-csv.js <path-to-shopify-export.csv>
 *
 * Output:
 *   lib/products.json  (auto-loaded by lib/collections.ts)
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ─── Shopify CSV Column Names ───────────────────────────────────
// These match a standard Shopify product export.
const COL = {
  HANDLE: "Handle",
  TITLE: "Title",
  BODY: "Body (HTML)",
  VENDOR: "Vendor",
  TYPE: "Product Category",
  TAGS: "Tags",
  PUBLISHED: "Published",
  OPTION1_NAME: "Option1 Name",
  OPTION1_VALUE: "Option1 Value",
  OPTION2_NAME: "Option2 Name",
  OPTION2_VALUE: "Option2 Value",
  VARIANT_PRICE: "Variant Price",
  VARIANT_SKU: "Variant SKU",
  IMAGE_SRC: "Image Src",
  IMAGE_POSITION: "Image Position",
  IMAGE_ALT: "Image Alt Text",
  STATUS: "Status",
};

// ─── Category mapper ────────────────────────────────────────────
// Maps Shopify product type or tags to Tezhhomayaa category keys.
function inferCategory(type = "", tags = "", title = "") {
  const t = (type + " " + tags + " " + title).toLowerCase();

  if (t.includes("fragrance") || t.includes("perfume") || t.includes("scent") || t.includes("eau de"))
    return "fragrances";
  if (t.includes("bag") || t.includes("tote") || t.includes("clutch") || t.includes("wallet") ||
      t.includes("backpack") || t.includes("duffle") || t.includes("purse")) {
    if (t.includes("men") || t.includes("man") || t.includes("male")) return "men/bags";
    return "women/bags";
  }
  if (t.includes("men") || t.includes("man") || t.includes("male")) return "men/ready-to-wear";
  return "women/ready-to-wear";
}

function categoryLabel(key) {
  const map = {
    "women": "Women",
    "women/bags": "Women's Bags",
    "women/ready-to-wear": "Women — Ready To Wear",
    "women/accessories": "Women's Accessories",
    "men": "Men",
    "men/bags": "Men's Bags",
    "men/ready-to-wear": "Men — Ready To Wear",
    "men/accessories": "Men's Accessories",
    "fragrances": "Fragrances",
    "fragrances/women": "Women's Fragrances",
    "fragrances/men": "Men's Fragrances",
    "bags": "Bags",
  };
  return map[key] || key;
}

// ─── Price formatter ────────────────────────────────────────────
function formatPrice(price = "") {
  const num = parseFloat(price);
  if (isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN");
}

// ─── Strip HTML ─────────────────────────────────────────────────
function stripHtml(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Simple CSV parser (handles quoted fields with commas) ───────
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseRow(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseRow(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseRow(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Main import logic ──────────────────────────────────────────
function importCSV(csvPath) {
  console.log(`\n📂 Reading: ${csvPath}`);
  const raw = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(raw);

  if (rows.length === 0) {
    console.error("❌ No rows found in CSV. Is this a Shopify product export?");
    process.exit(1);
  }

  console.log(`✓ Parsed ${rows.length} rows from CSV`);

  // Group rows by handle (each product may have multiple rows for variants/images)
  const productMap = new Map();

  for (const row of rows) {
    const handle = row[COL.HANDLE];
    if (!handle) continue;

    if (!productMap.has(handle)) {
      productMap.set(handle, {
        handle,
        title: row[COL.TITLE] || "",
        body: row[COL.BODY] || "",
        type: row[COL.TYPE] || "",
        tags: row[COL.TAGS] || "",
        price: row[COL.VARIANT_PRICE] || "0",
        images: [],
        variants: [],
        status: row[COL.STATUS] || "active",
      });
    }

    const product = productMap.get(handle);

    // Collect images (multiple rows may add images)
    const imgSrc = row[COL.IMAGE_SRC];
    if (imgSrc && !product.images.includes(imgSrc)) {
      product.images.push(imgSrc);
    }

    // Collect variants
    const opt1 = row[COL.OPTION1_VALUE];
    const opt1Name = row[COL.OPTION1_NAME];
    const variantPrice = row[COL.VARIANT_PRICE];
    const sku = row[COL.VARIANT_SKU];

    if (opt1 && variantPrice) {
      product.variants.push({
        optionName: opt1Name || "Size",
        option: opt1,
        price: variantPrice,
        sku: sku || "",
      });
      // Use lowest variant price as the display price
      const parsedPrice = parseFloat(variantPrice);
      if (!isNaN(parsedPrice)) {
        const existingPrice = parseFloat(product.price) || Infinity;
        if (parsedPrice < existingPrice) {
          product.price = variantPrice;
        }
      }
    }
  }

  console.log(`✓ Found ${productMap.size} unique products`);

  // Convert to Tezhhomayaa Product format
  const products = [];
  let idx = 0;

  for (const [handle, p] of productMap.entries()) {
    if (p.status && p.status.toLowerCase() === "draft") continue;

    const category = inferCategory(p.type, p.tags, p.title);
    const slug = handle;
    const gallery = p.images.length > 0
      ? p.images
      : ["/images/category-women.jpg"]; // fallback

    const editorialDescription = stripHtml(p.body) ||
      `${p.title} — part of the Tezhhomayaa SS 2026 Collection.`;

    products.push({
      id: `imported_${idx++}`,
      slug,
      handle,
      name: p.title,
      price: formatPrice(p.price),
      image: gallery[0],
      hoverImage: gallery[1] || gallery[0],
      gallery,
      category,
      categoryLabel: categoryLabel(category),
      href: `/products/${slug}`,
      editorialDescription,
      tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
      variants: p.variants,
    });
  }

  // Write to lib/products.json
  const outputPath = path.resolve(__dirname, "../lib/products.json");
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), "utf-8");

  console.log(`\n✅ Successfully imported ${products.length} products`);
  console.log(`📄 Output written to: lib/products.json`);
  console.log("\nCategory breakdown:");

  const categoryCount = {};
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} products`);
  });

  console.log("\n🔄 Restart your dev server to see the changes: npm run dev\n");
}

// ─── CLI ─────────────────────────────────────────────────────────
const csvFile = process.argv[2];
if (!csvFile) {
  console.error("Usage: node scripts/import-shopify-csv.js <path-to-csv>");
  process.exit(1);
}
if (!fs.existsSync(csvFile)) {
  console.error(`❌ File not found: ${csvFile}`);
  process.exit(1);
}

importCSV(csvFile);

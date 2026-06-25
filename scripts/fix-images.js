#!/usr/bin/env node
/**
 * fix-images.js — Tezhhomayaa
 *
 * For every product in products.json that has the static fallback image
 * (/images/category-women.jpg), find a sibling product that:
 *   1. Shares the same base product title (same name without the " - Colour" suffix)
 *   2. Has a real Shopify CDN image
 *
 * Assigns the sibling's image so every product shows a relevant image.
 */

const fs   = require("fs");
const path = require("path");

const jsonPath = path.resolve(__dirname, "../lib/products.json");
const FALLBACK = "/images/category-women.jpg";

// ─── Load data ─────────────────────────────────────────────────
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// ─── Build a lookup: base title → first real Shopify image found
// "Base title" = product.name with the " - Colour" suffix removed.
// e.g. 'The "Dots" Training Shorts - Red' → 'The "Dots" Training Shorts'
//      'The "Dots" Training Shorts - Light Blue' → 'The "Dots" Training Shorts'

function baseTitle(name) {
  // Strip trailing " - Anything" patterns
  return name.replace(/\s*[-–—]\s*[^-–—]{1,40}$/, "").trim();
}

// Build map: baseTitle → best real image URL
const bestImageByBase = {};
for (const p of data) {
  if (!p.image || p.image === FALLBACK) continue;           // skip fallbacks
  if (!p.image.startsWith("http")) continue;                 // must be Shopify URL
  const base = baseTitle(p.name);
  if (!bestImageByBase[base]) {
    bestImageByBase[base] = p.image;                         // first real image wins
  }
}

// ─── Also build handle-based lookup for handle-family matching
// e.g. "the-dots-training-shorts-red-1" → try "the-dots-training-shorts-red"
//      "the-dots-training-shorts-red" → try "the-dots-training-shorts"
const imageByHandle = {};
for (const p of data) {
  if (p.image && p.image.startsWith("http")) {
    imageByHandle[p.handle] = p.image;
  }
}

function imageFromHandleFamily(handle) {
  // Walk up the handle by stripping the last hyphen-segment
  let h = handle;
  while (h.includes("-")) {
    h = h.replace(/-[^-]+$/, "");          // strip last segment
    if (imageByHandle[h]) return imageByHandle[h];
  }
  return null;
}

// ─── Patch the data ─────────────────────────────────────────────
let fixed = 0;
let unfixable = 0;

const patched = data.map(p => {
  if (p.image !== FALLBACK) return p;            // already has a real image

  // Strategy 1: same base title
  const base = baseTitle(p.name);
  const imgFromTitle = bestImageByBase[base];
  if (imgFromTitle) {
    fixed++;
    return {
      ...p,
      image: imgFromTitle,
      hoverImage: p.hoverImage === FALLBACK ? imgFromTitle : p.hoverImage,
      gallery: p.gallery[0] === FALLBACK ? [imgFromTitle] : p.gallery,
    };
  }

  // Strategy 2: handle family walk-up
  const imgFromHandle = imageFromHandleFamily(p.handle);
  if (imgFromHandle) {
    fixed++;
    return {
      ...p,
      image: imgFromHandle,
      hoverImage: p.hoverImage === FALLBACK ? imgFromHandle : p.hoverImage,
      gallery: p.gallery[0] === FALLBACK ? [imgFromHandle] : p.gallery,
    };
  }

  // Strategy 3: same category — use first product in same category with a real image
  // (last resort — avoids blank/broken images)
  unfixable++;
  return p;
});

// ─── Write output ─────────────────────────────────────────────
fs.writeFileSync(jsonPath, JSON.stringify(patched, null, 2), "utf-8");

// ─── Verify ────────────────────────────────────────────────────
const remaining = patched.filter(p => p.image === FALLBACK);
const totalShopify = patched.filter(p => p.image && p.image.startsWith("http")).length;
const unique = new Set(patched.map(p => p.image)).size;

console.log("\n╔══════════════════════════════════════════════════════════╗");
console.log("║   TEZHHOMAYAA — IMAGE FIX REPORT                        ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");
console.log("Total products        :", patched.length);
console.log("Fixed (image assigned):", fixed);
console.log("Still using fallback  :", remaining.length);
console.log("Products with Shopify image:", totalShopify);
console.log("Unique image URLs     :", unique);
console.log("");

// ─── Sample report: 20 products with their image URLs ─────────
console.log("═══ SAMPLE REPORT — 20 products (handle | name | image URL) ═══");
patched.slice(0, 20).forEach((p, i) => {
  const imgShort = p.image.length > 70 ? p.image.slice(0, 70) + "…" : p.image;
  const isShopify = p.image.startsWith("http") ? "✅" : "⚠️ FALLBACK";
  console.log(`\n[${String(i+1).padStart(2)}] ${isShopify}`);
  console.log(`     Handle : ${p.handle}`);
  console.log(`     Name   : ${p.name}`);
  console.log(`     Image  : ${imgShort}`);
});

if (remaining.length > 0) {
  console.log("\n═══ STILL UNFIXABLE (no sibling found) ═══");
  remaining.forEach(p => console.log(" -", p.handle, "|", p.name));
}

console.log("\n✅ products.json updated.\n");

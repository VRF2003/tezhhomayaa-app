#!/usr/bin/env node
/**
 * Tezhhomayaa — Re-categorize existing products.json
 * Handles Shopify CSV artefacts: hyphenated handles, HTML rows, ambiguous tags.
 */

const fs = require("fs");
const path = require("path");

const CATEGORY_LABELS = {
  "men": "Men", "men/new-in": "New In — Men", "men/bags": "Men's Bags",
  "men/ready-to-wear": "Men — Ready To Wear",
  "men/ready-to-wear/shirts": "Shirts",
  "men/ready-to-wear/tshirts-polos": "T-Shirts & Polos",
  "men/ready-to-wear/trousers-shorts": "Trousers & Shorts",
  "men/ready-to-wear/tracksuits": "Tracksuits & Sweatshirts",
  "men/ready-to-wear/coats-jackets": "Coats & Jackets",
  "men/accessories": "Men's Accessories",
  "women": "Women", "women/new-in": "New In — Women", "women/bags": "Women's Bags",
  "women/ready-to-wear": "Women — Ready To Wear",
  "women/ready-to-wear/tops-shirts": "Tops & Shirts",
  "women/ready-to-wear/dresses": "Dresses & Jumpsuits",
  "women/ready-to-wear/pants-shorts": "Pants & Shorts",
  "women/ready-to-wear/skirts": "Skirts",
  "women/ready-to-wear/sweatshirts": "Sweatshirts",
  "women/accessories": "Women's Accessories",
  "bags": "Bags", "fragrances": "Fragrances",
  "fragrances/men": "Men's Fragrances", "fragrances/women": "Women's Fragrances",
};

// Leaf keys (normalized)
const LEAF = {
  FRAGRANCE: "FRAGRANCE",
  BAG:       "BAG",
  SHIRTS:    "SHIRTS",    // woven shirts / tops / blouses
  TOPS:      "TOPS",      // generic tops (women)
  TSHIRTS:   "TSHIRTS",   // t-shirts, tees, polos
  TROUSERS:  "TROUSERS",  // formal trousers
  PANTS:     "PANTS",     // casual pants, joggers, leggings
  SHORTS:    "SHORTS",    // shorts
  TRACKS:    "TRACKS",    // tracksuits, sweatshirts, hoodies
  COATS:     "COATS",     // jackets, coats, blazers
  SKIRTS:    "SKIRTS",
  DRESSES:   "DRESSES",   // dresses + jumpsuits
};

// tag suffix → leaf
const TAG_TO_LEAF = {
  "fragrance":"FRAGRANCE","perfume":"FRAGRANCE","eau_de":"FRAGRANCE",
  "bag":"BAG","bags":"BAG","tote":"BAG","clutch":"BAG","backpack":"BAG","wallet":"BAG",
  "shirts":"SHIRTS","shirt":"SHIRTS",
  "top":"TOPS","top_shirts":"TOPS","training_tops":"TOPS",
  "t_shirt":"TSHIRTS","t_shirt_dress":"TSHIRTS","training_tshirt":"TSHIRTS","training_polos":"TSHIRTS",
  "trousers":"TROUSERS","trousers_pants":"TROUSERS","lounge_trousers":"TROUSERS","wide_pants":"TROUSERS",
  "pants":"PANTS","training_bottoms":"PANTS",
  "shorts":"SHORTS","training_shorts":"SHORTS",
  "sweatshirts":"TRACKS","hoodies":"TRACKS","street":"TRACKS","active":"TRACKS",
  "jackets":"COATS","coats":"COATS",
  "skirt":"SKIRTS","skirts":"SKIRTS",
  "dresses":"DRESSES","jumpsuits":"DRESSES",
};

// token set → leaf; priority ordered (bags first, then specific items)
// tokens come from splitting handle on hyphens and lowercasing
const TOKEN_RULES = [
  // Fragrances
  { tokens: ["fragrance","perfume","attar","scent"], leaf: "FRAGRANCE" },
  // Bags
  { tokens: ["bag","bags","tote","clutch","backpack","wallet","pouch","handbag"], leaf: "BAG" },
  // Skirts (before shirts to avoid "skirt" containing "shirt")
  { tokens: ["skirt","skirts"], leaf: "SKIRTS" },
  // Dresses / Jumpsuits
  { tokens: ["dress","dresses","jumpsuit","gown","kaftan"], leaf: "DRESSES" },
  // Coats & Jackets
  { tokens: ["jacket","coat","blazer","parka","outerwear"], leaf: "COATS" },
  // Tracksuits / Sweatshirts
  { tokens: ["tracksuit","sweatshirt","hoodie","sweatpant","fleece","pullover"], leaf: "TRACKS" },
  // T-shirts / Polos
  { tokens: ["polo","tshirt","tee"], leaf: "TSHIRTS" },
  { tokens: ["t-shirt"], leaf: "TSHIRTS" },  // hyphenated handle token
  // Shorts (before pants/trousers)
  { tokens: ["short","shorts"], leaf: "SHORTS" },
  // Trousers / formal pants
  { tokens: ["trouser","trousers","slack","chino","jogger"], leaf: "TROUSERS" },
  // Pants (casual)
  { tokens: ["pant","pants","legging","leggings"], leaf: "PANTS" },
  // Shirts / blouses (woven tops)
  { tokens: ["shirt","blouse","tunic"], leaf: "SHIRTS" },
  // Generic tops / crop tops
  { tokens: ["top","tops","crop","tank","cami","frill","kaftan"], leaf: "TOPS" },
];

function tokenize(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9-]/g, " ").split(/[\s-]+/).filter(Boolean);
}

function leafFromTokens(tokens) {
  const tokenSet = new Set(tokens);
  for (const rule of TOKEN_RULES) {
    if (rule.tokens.some(t => tokenSet.has(t))) return rule.leaf;
  }
  return null;
}

function resolveCategory(leaf, isMen, isWomen) {
  if (leaf === "FRAGRANCE") {
    if (isMen && !isWomen) return "fragrances/men";
    if (isWomen && !isMen) return "fragrances/women";
    return "fragrances";
  }
  if (leaf === "BAG") {
    if (isMen && !isWomen) return "men/bags";
    if (isWomen && !isMen) return "women/bags";
    return "bags";
  }
  if (isMen && !isWomen) {
    if (leaf === "SHIRTS" || leaf === "TOPS")           return "men/ready-to-wear/shirts";
    if (leaf === "TSHIRTS")                             return "men/ready-to-wear/tshirts-polos";
    if (leaf === "TROUSERS" || leaf === "PANTS" || leaf === "SHORTS") return "men/ready-to-wear/trousers-shorts";
    if (leaf === "TRACKS")                              return "men/ready-to-wear/tracksuits";
    if (leaf === "COATS")                               return "men/ready-to-wear/coats-jackets";
    if (leaf === "DRESSES" || leaf === "SKIRTS")        return "men/ready-to-wear";
    return "men/ready-to-wear";
  }
  if (isWomen && !isMen) {
    if (leaf === "TOPS" || leaf === "SHIRTS" || leaf === "TSHIRTS") return "women/ready-to-wear/tops-shirts";
    if (leaf === "DRESSES")                             return "women/ready-to-wear/dresses";
    if (leaf === "SKIRTS")                              return "women/ready-to-wear/skirts";
    if (leaf === "PANTS" || leaf === "TROUSERS" || leaf === "SHORTS") return "women/ready-to-wear/pants-shorts";
    if (leaf === "TRACKS")                              return "women/ready-to-wear/sweatshirts";
    if (leaf === "COATS")                               return "women/ready-to-wear";
    return "women/ready-to-wear";
  }
  // Unisex: use name/handle context
  if (leaf === "DRESSES" || leaf === "SKIRTS") return "women/ready-to-wear/dresses";
  return "women/ready-to-wear";
}

function inferGenderFromHandle(tokens) {
  // Explicit gender tokens in handle
  if (tokens.includes("men") || tokens.includes("man") || tokens.includes("male") ||
      tokens.includes("mens") || tokens.includes("gents")) return { isMen: true, isWomen: false };
  if (tokens.includes("women") || tokens.includes("woman") || tokens.includes("female") ||
      tokens.includes("womens") || tokens.includes("ladies")) return { isMen: false, isWomen: true };
  // Product types that are almost always women's by default for this brand
  return { isMen: false, isWomen: true }; // default to women when untagged
}

function inferCategory(rawTags, name, handle) {
  if (!handle || handle.startsWith("<") || handle.startsWith("-->") || handle.startsWith("td {")) return null;

  const tagList = (rawTags || "").split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
  let isMen   = tagList.includes("gender_men");
  let isWomen = tagList.includes("gender_women");

  // ── Step 1: structured category_ tags ──
  const catTags = tagList
    .filter(t => t.startsWith("category_"))
    .map(t => t.replace("category_", ""));

  catTags.sort((a, b) => {
    const p = { bag:0, bags:0, fragrance:0, skirt:1, skirts:1, dresses:1, jumpsuits:1 };
    return (p[a] ?? 5) - (p[b] ?? 5);
  });

  let leaf = null;
  for (const ct of catTags) {
    const mapped = TAG_TO_LEAF[ct];
    if (mapped) { leaf = mapped; break; }
  }

  // ── Step 2: tokenize handle + name ──
  const handleTokens = tokenize(handle);
  const nameTokens   = tokenize(name || "");

  if (!leaf) {
    leaf = leafFromTokens([...handleTokens, ...nameTokens]);
  }

  // ── Step 3: infer gender from handle if no gender tag ──
  if (!isMen && !isWomen) {
    const g = inferGenderFromHandle(handleTokens);
    isMen   = g.isMen;
    isWomen = g.isWomen;
  }

  // ── Step 4: gender-only fallback ──
  if (!leaf) {
    if (isMen && !isWomen) return "men/ready-to-wear";
    return "women/ready-to-wear";
  }

  return resolveCategory(leaf, isMen, isWomen);
}


// ─── Main ─────────────────────────────────────────────────────
const jsonPath = path.resolve(__dirname, "../lib/products.json");
if (!fs.existsSync(jsonPath)) {
  console.error("❌ lib/products.json not found. Run the CSV import first.");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
const unassigned = [];
const categoryCounts = {};

const recategorized = products
  .map((p, i) => {
    const rawTags = (p.tags || []).join(", ");
    const newCat = inferCategory(rawTags, p.name, p.handle);

    if (!newCat) {
      // Truly unresolvable — skip these (they're corrupted CSV rows)
      return null;
    }

    categoryCounts[newCat] = (categoryCounts[newCat] || 0) + 1;

    return {
      ...p,
      category: newCat,
      categoryLabel: CATEGORY_LABELS[newCat] || newCat,
    };
  })
  .filter(Boolean);

// Track unassigned after filtering
const origLen = products.length;
recategorized.forEach(p => {
  if (p.category === "women/ready-to-wear" || p.category === "men/ready-to-wear") {
    if (!(p.tags||[]).some(t => t.toLowerCase().startsWith("category_"))) {
      unassigned.push(p.handle);
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(recategorized, null, 2), "utf-8");

// ─── Validation Report ────────────────────────────────────────
console.log("\n╔═══════════════════════════════════════════════════════════╗");
console.log("║   TEZHHOMAYAA — CATEGORY VALIDATION REPORT               ║");
console.log("╚═══════════════════════════════════════════════════════════╝\n");
console.log(`Original rows  : ${origLen}`);
console.log(`Valid products : ${recategorized.length}`);
console.log(`Removed (corrupt CSV rows): ${origLen - recategorized.length}\n`);

console.log("Category                              Count   Bar");
console.log("─────────────────────────────────────────────────────────────");
Object.entries(categoryCounts)
  .sort((a,b) => a[0].localeCompare(b[0]))
  .forEach(([cat, count]) => {
    const label = (CATEGORY_LABELS[cat] || cat).padEnd(35, " ");
    const bar = "█".repeat(Math.min(Math.round(count / 3), 30));
    console.log(`  ${label} ${String(count).padStart(4)}   ${bar}`);
  });

const total = Object.values(categoryCounts).reduce((a,b)=>a+b,0);
console.log(`\n  TOTAL: ${total} products across ${Object.keys(categoryCounts).length} categories`);

if (unassigned.length > 0) {
  console.log(`\n  Products using generic RTW fallback: ${unassigned.length}`);
  console.log("  (keyword matching did not resolve a specific subcategory)");
}

console.log("\n✅ products.json updated. Restart dev server to see changes.\n");

/**
 * Tezhhomayaa Category Engine
 * ─────────────────────────────────────────────────────────────
 * Shared between the CLI importer and the API route.
 * Maps Shopify product data → Tezhhomayaa category keys.
 *
 * CATEGORY KEYS (used as route segments and JSON category fields)
 *
 *  men                              → /men
 *  men/new-in                       → /men/new-in
 *  men/bags                         → /men/bags
 *  men/ready-to-wear                → /men/ready-to-wear
 *  men/ready-to-wear/shirts         → /men/ready-to-wear/shirts
 *  men/ready-to-wear/tshirts-polos  → /men/ready-to-wear/tshirts-polos
 *  men/ready-to-wear/trousers-shorts→ /men/ready-to-wear/trousers-shorts
 *  men/ready-to-wear/tracksuits     → /men/ready-to-wear/tracksuits
 *  men/ready-to-wear/coats-jackets  → /men/ready-to-wear/coats-jackets
 *  men/accessories                  → /men/accessories
 *
 *  women                            → /women
 *  women/new-in                     → /women/new-in
 *  women/bags                       → /women/bags
 *  women/ready-to-wear              → /women/ready-to-wear
 *  women/ready-to-wear/tops-shirts  → /women/ready-to-wear/tops-shirts
 *  women/ready-to-wear/dresses      → /women/ready-to-wear/dresses
 *  women/ready-to-wear/pants-shorts → /women/ready-to-wear/pants-shorts
 *  women/ready-to-wear/skirts       → /women/ready-to-wear/skirts
 *  women/ready-to-wear/sweatshirts  → /women/ready-to-wear/sweatshirts
 *  women/accessories                → /women/accessories
 *
 *  fragrances                       → /fragrances
 *  fragrances/men                   → /fragrances/men
 *  fragrances/women                 → /fragrances/women
 */

// ─── Label map ────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<string, string> = {
  "men":                               "Men",
  "men/new-in":                        "New In — Men",
  "men/bags":                          "Men's Bags",
  "men/ready-to-wear":                 "Men — Ready To Wear",
  "men/ready-to-wear/shirts":          "Shirts",
  "men/ready-to-wear/tshirts-polos":   "T-Shirts & Polos",
  "men/ready-to-wear/trousers-shorts": "Trousers & Shorts",
  "men/ready-to-wear/tracksuits":      "Tracksuits & Sweatshirts",
  "men/ready-to-wear/coats-jackets":   "Coats & Jackets",
  "men/accessories":                   "Men's Accessories",

  "women":                              "Women",
  "women/new-in":                       "New In — Women",
  "women/bags":                         "Women's Bags",
  "women/ready-to-wear":                "Women — Ready To Wear",
  "women/ready-to-wear/tops-shirts":    "Tops & Shirts",
  "women/ready-to-wear/dresses":        "Dresses & Jumpsuits",
  "women/ready-to-wear/pants-shorts":   "Pants & Shorts",
  "women/ready-to-wear/skirts":         "Skirts",
  "women/ready-to-wear/sweatshirts":    "Sweatshirts",
  "women/accessories":                  "Women's Accessories",

  "bags":             "Bags",
  "fragrances":       "Fragrances",
  "fragrances/men":   "Men's Fragrances",
  "fragrances/women": "Women's Fragrances",
};

// ─── Tag → leaf category (gender-agnostic leaf) ────────────────
// Keys = Shopify category_ tag values (after stripping "category_")
const TAG_LEAF: Record<string, string> = {
  // Fragrances
  "fragrance":        "fragrance",
  "perfume":          "fragrance",
  "eau_de":           "fragrance",

  // Bags
  "bag":              "bag",
  "bags":             "bag",
  "tote":             "bag",
  "clutch":           "bag",
  "backpack":         "bag",
  "wallet":           "bag",
  "pouch":            "bag",
  "crossbody":        "bag",
  "handbag":          "bag",

  // Men RTW sub-categories
  "shirts":           "shirts",
  "shirt":            "shirts",
  "t_shirt":          "tshirts-polos",
  "t_shirt_dress":    "tshirts-polos", // exclude later via gender
  "training_tshirt":  "tshirts-polos",
  "training_polos":   "tshirts-polos",
  "training_tops":    "tops-shirts",   // women-leaning, resolved by gender
  "training_tops_m":  "tshirts-polos",

  "trousers_pants":   "trousers-shorts",
  "trousers":         "trousers-shorts",
  "lounge_trousers":  "trousers-shorts",
  "pants":            "pants-shorts",   // women-leaning, resolved by gender
  "wide_pants":       "pants-shorts",
  "shorts":           "trousers-shorts",
  "training_shorts":  "trousers-shorts",
  "training_bottoms": "trousers-shorts",

  "sweatshirts":      "tracksuits",
  "hoodies":          "tracksuits",
  "street":           "tracksuits",
  "active":           "tracksuits",

  "jackets":          "coats-jackets",
  "coats":            "coats-jackets",

  "skirt":            "skirts",
  "skirts":           "skirts",

  "dresses":          "dresses",
  "jumpsuits":        "dresses",

  "top":              "tops-shirts",
  "top_shirts":       "tops-shirts",
};

// ─── Title/handle keyword → leaf (fallback when no structured tag) ──
// Checked in order — first match wins.
const KEYWORD_LEAF: Array<[RegExp, string]> = [
  // Fragrances
  [/fragrance|perfume|eau\s*de|scent|attar/i, "fragrance"],

  // Bags
  [/\btote\b|\bclutch\b|\bduffle\b|\bbackpack\b|\bwallet\b|\bpouch\b|\bcrossbody\b|\bhandbag\b|\bbag\b/i, "bag"],

  // Skirts (check before shorts to avoid false matches)
  [/\bskirt\b/i, "skirts"],

  // Dresses/Jumpsuits
  [/\bdress\b|\bjumpsuit\b|\bmaxi\b|\bmini\b|\bmidi\b/i, "dresses"],

  // Coats/Jackets (check before shirts)
  [/\bjacket\b|\bcoat\b|\bblazer\b|\bparka\b/i, "coats-jackets"],

  // Tracksuits/Sweatshirts
  [/\btracksuit\b|\bsweatshirt\b|\bhoodie\b|\bsweatpant\b|\bfleece\b/i, "tracksuits"],

  // T-shirts / Polos
  [/\bt[\s-]?shirt\b|\btee\b|\bpolo\b/i, "tshirts-polos"],

  // Shirts / Tops / Blouses (order matters: after t-shirt)
  [/\bshirt\b|\bblouse\b|\bcrop\b|\btank\b|\bcami\b/i, "shirts-tops"],

  // Tops (generic)
  [/\btop\b/i, "tops-shirts"],

  // Trousers / Shorts
  [/\btrouser\b|\btrousers\b|\bslack\b|\bchino\b|\bjogger\b/i, "trousers-shorts"],
  [/\bpant\b|\bpants\b|\bshort\b|\bshorts\b|\blegging\b/i, "pants-trousers"],
];

// ─── Resolve leaf + gender → full category key ─────────────────
function resolveCategory(leaf: string, isMen: boolean, isWomen: boolean): string {
  // Fragrances
  if (leaf === "fragrance") {
    if (isMen && !isWomen) return "fragrances/men";
    if (isWomen && !isMen) return "fragrances/women";
    return "fragrances";
  }

  // Bags
  if (leaf === "bag") {
    if (isMen && !isWomen) return "men/bags";
    if (isWomen && !isMen) return "women/bags";
    return "bags"; // unisex / unknown gender
  }

  // Men-specific RTW
  if (isMen && !isWomen) {
    switch (leaf) {
      case "shirts":          return "men/ready-to-wear/shirts";
      case "shirts-tops":     return "men/ready-to-wear/shirts";
      case "tshirts-polos":   return "men/ready-to-wear/tshirts-polos";
      case "trousers-shorts":
      case "pants-trousers":  return "men/ready-to-wear/trousers-shorts";
      case "tracksuits":      return "men/ready-to-wear/tracksuits";
      case "coats-jackets":   return "men/ready-to-wear/coats-jackets";
      case "tops-shirts":     return "men/ready-to-wear/shirts";
      case "dresses":         return "men/ready-to-wear"; // edge case
      case "skirts":          return "men/ready-to-wear"; // edge case
    }
    return "men/ready-to-wear";
  }

  // Women-specific RTW
  if (isWomen && !isMen) {
    switch (leaf) {
      case "tops-shirts":
      case "shirts-tops":
      case "shirts":          return "women/ready-to-wear/tops-shirts";
      case "tshirts-polos":   return "women/ready-to-wear/tops-shirts";
      case "dresses":         return "women/ready-to-wear/dresses";
      case "skirts":          return "women/ready-to-wear/skirts";
      case "pants-trousers":
      case "trousers-shorts": return "women/ready-to-wear/pants-shorts";
      case "tracksuits":      return "women/ready-to-wear/sweatshirts";
      case "coats-jackets":   return "women/ready-to-wear";
    }
    return "women/ready-to-wear";
  }

  // Unisex fallback
  return "women/ready-to-wear";
}

// ─── Main export ───────────────────────────────────────────────
export function inferCategory(
  rawType: string,
  rawTags: string,
  title: string,
  handle: string
): string {
  const tagList = rawTags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const isMen    = tagList.includes("gender_men");
  const isWomen  = tagList.includes("gender_women");
  const combined = (rawType + " " + title + " " + handle).toLowerCase();

  // 1. Try structured category_ tags first (most reliable)
  const catTags = tagList
    .filter((t) => t.startsWith("category_"))
    .map((t) => t.replace("category_", ""));

  let leaf: string | null = null;

  for (const ct of catTags) {
    const mapped = TAG_LEAF[ct];
    if (mapped) { leaf = mapped; break; }
  }

  // 2. Fallback: keyword scan on handle + title
  if (!leaf) {
    for (const [regex, kw] of KEYWORD_LEAF) {
      if (regex.test(combined)) { leaf = kw; break; }
    }
  }

  // 3. Still no match → generic RTW based on gender
  if (!leaf) {
    if (isMen && !isWomen) return "men/ready-to-wear";
    if (isWomen && !isMen) return "women/ready-to-wear";
    return "women/ready-to-wear";
  }

  return resolveCategory(leaf, isMen, isWomen);
}

export function categoryLabel(key: string): string {
  return CATEGORY_LABELS[key] || key;
}

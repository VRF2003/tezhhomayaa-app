import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { getAllProducts, Product } from "./collections";

export type Condition = {
  id: string;
  field: "Tag" | "Gender" | "Category" | "Season" | "Color" | "Material" | "Fit" | "Collection" | "Status";
  operator: "Equals" | "Not Equals" | "Contains" | "Does Not Contain";
  value: string;
};

export type CollectionPresentation = {
  productGap: number;
  desktopColumns: number;
  mobileColumns: number;
  density: string;
  imageRatio: string;
  cardStyle: string;
  showPrice: boolean;
  showProductName: boolean;
  showCategory: boolean;
  hoverEffect: string;
  bannerHeight: string;
};

export type SmartCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerImage: string;
  matchType: "ALL" | "ANY";
  conditions: Condition[];
  productIds: string[]; // Computed caching
  presentation?: CollectionPresentation;
};

const collectionsPath = join(process.cwd(), "lib", "smart-collections.json");
const settingsPath = join(process.cwd(), "lib", "smart-collections-settings.json");

export type SmartCollectionSettings = {
  enableSmartRouting: boolean;
};

function ensureFile() {
  if (!existsSync(collectionsPath)) {
    writeFileSync(collectionsPath, JSON.stringify([], null, 2));
  }
  if (!existsSync(settingsPath)) {
    writeFileSync(settingsPath, JSON.stringify({ enableSmartRouting: false }, null, 2));
  }
}

export function getSmartCollectionSettings(): SmartCollectionSettings {
  ensureFile();
  try {
    const raw = readFileSync(settingsPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { enableSmartRouting: false };
  }
}

export function saveSmartCollectionSettings(settings: SmartCollectionSettings) {
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

export function getSmartCollections(): SmartCollection[] {
  ensureFile();
  try {
    const raw = readFileSync(collectionsPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveSmartCollections(collections: SmartCollection[]) {
  writeFileSync(collectionsPath, JSON.stringify(collections, null, 2));
}

// ─── Engine ───────────────────────────────────────────────────────

function evaluateCondition(product: Product, condition: Condition): boolean {
  const cVal = condition.value.toLowerCase();
  
  let pVal: string | string[] = "";
  
  switch (condition.field) {
    case "Tag": pVal = product.tags || []; break;
    case "Gender": pVal = product.gender || ""; break;
    case "Category": pVal = product.category || ""; break;
    case "Status": pVal = product.status || ""; break;
    // New attributes
    case "Season": pVal = (product as any).season || ""; break;
    case "Color": pVal = (product as any).color || ""; break;
    case "Material": pVal = (product as any).material || ""; break;
    case "Fit": pVal = (product as any).fit || ""; break;
    case "Collection": pVal = (product as any).collectionName || ""; break;
  }
  
  if (Array.isArray(pVal)) {
    const pValsLower = pVal.map(v => v.toLowerCase());
    switch (condition.operator) {
      case "Equals": return pValsLower.includes(cVal);
      case "Not Equals": return !pValsLower.includes(cVal);
      case "Contains": return pValsLower.some(v => v.includes(cVal));
      case "Does Not Contain": return !pValsLower.some(v => v.includes(cVal));
    }
  } else {
    const pValLower = pVal.toLowerCase();
    switch (condition.operator) {
      case "Equals": return pValLower === cVal;
      case "Not Equals": return pValLower !== cVal;
      case "Contains": return pValLower.includes(cVal);
      case "Does Not Contain": return !pValLower.includes(cVal);
    }
  }
  
  return false;
}

export function computeSmartCollections() {
  const collections = getSmartCollections();
  const products = getAllProducts();
  
  const updated = collections.map(col => {
    const matchedProducts = products.filter(product => {
      if (col.conditions.length === 0) return false;
      
      if (col.matchType === "ALL") {
        return col.conditions.every(c => evaluateCondition(product, c));
      } else {
        return col.conditions.some(c => evaluateCondition(product, c));
      }
    });
    
    col.productIds = matchedProducts.map(p => p.id);
    return col;
  });
  
  saveSmartCollections(updated);
}

import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
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

export interface SmartCollectionSettings {
  enableSmartRouting: boolean;
}

export async function getSmartCollectionSettings(): Promise<SmartCollectionSettings> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("smart_collections_settings");
    if (!data) return { enableSmartRouting: false };
    return data as SmartCollectionSettings;
  } catch (err) {
    return { enableSmartRouting: false };
  }
}

export async function saveSmartCollectionSettings(settings: SmartCollectionSettings): Promise<void> {
  const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
  await docRepo.saveDocument("smart_collections_settings", settings);
}

export async function getSmartCollections(): Promise<SmartCollection[]> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("smart_collections");
    return (data as SmartCollection[]) || [];
  } catch (err) {
    return [];
  }
}

export async function saveSmartCollections(collections: SmartCollection[]): Promise<void> {
  const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
  await docRepo.saveDocument("smart_collections", collections);
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

export async function computeSmartCollections(): Promise<void> {
  const collections = await getSmartCollections();
  const products = await getAllProducts();
  
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
  
  await saveSmartCollections(updated);
}

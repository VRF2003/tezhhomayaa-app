// ─── Tezhhomayaa Collection Data ──────────────────────────────

export type Product = {
  id: string;
  slug: string;
  handle?: string;
  name: string;
  price: string | number;
  compareAtPrice?: string | number;
  image: string;
  hoverImage?: string;
  gallery: string[];
  category: string;
  categoryLabel: string;
  href: string;
  editorialDescription: string;
  badge?: string;
  tags?: string[];
  variants?: { id?: string; optionName: string; option: string; price: string | number; sku: string; quantity?: number }[];
  status?: "active" | "draft" | "archived" | string;
  sku?: string;
  barcode?: string;
  quantity?: number;
  gender?: "men" | "women" | "unisex" | string;
  designStory?: string;
  inspirationStory?: string;
  fabricDetails?: string;
  craftsmanshipDetails?: string;
  
  // Structured Attributes
  season?: string;
  color?: string;
  material?: string;
  fit?: string;
  collectionName?: string;
  
  // Luxury Integration Fields
  productStory?: string;
  sizeGuide?: string;
  fabricCare?: string;
  shippingReturns?: string;
  
  // Custom features
  enableStickyCheckout?: boolean;
  relatedProductIds?: string[];
  
  // Merchandising
  merchandising?: {
    gridThumbnail?: number;
    desktopGalleryOrder?: number[];
    tabletGalleryOrder?: number[];
    mobileGalleryOrder?: number[];
  };
};

export type CategoryMeta = {
  title: string;
  subtitle?: string;
  bannerImage: string;
  description?: string;
};

// ─── Category Metadata ────────────────────────────────────────
export const categoryMeta: Record<string, CategoryMeta> = {
  // ── Women ─────────────────────────────────────────────────
  women: { title: "Women", subtitle: "SS 2026", bannerImage: "/images/category-women.jpg", description: "Quiet refinement. Each silhouette drawn from the tension between restraint and movement." },
  "women/new-in": { title: "New In", subtitle: "Women", bannerImage: "/images/category-women.jpg", description: "The newest arrivals. Considered additions to the Tezhhomayaa wardrobe." },
  "women/bags": { title: "Women's Bags", subtitle: "Crafted Forms", bannerImage: "/images/category-bags.jpg", description: "Architecturally precise. Every bag is a study in proportion." },
  "women/ready-to-wear": { title: "Ready To Wear", subtitle: "Women", bannerImage: "/images/collection-banner.jpg", description: "Garments that inhabit the body like a second skin. Considered, unhurried." },
  "women/ready-to-wear/tops-shirts": { title: "Tops & Shirts", subtitle: "Women", bannerImage: "/images/collection-banner.jpg", description: "From the precise collar to the open hem — tops designed to be worn, not just seen." },
  "women/ready-to-wear/dresses-jumpsuits": { title: "Dresses & Jumpsuits", subtitle: "Women", bannerImage: "/images/category-women.jpg", description: "A single garment that holds everything. Form and movement in complete resolution." },
  "women/ready-to-wear/pants-shorts": { title: "Pants & Shorts", subtitle: "Women", bannerImage: "/images/collection-banner.jpg", description: "Cut for ease and precision. Every silhouette rests correctly on the body." },
  "women/ready-to-wear/skirts": { title: "Skirts", subtitle: "Women", bannerImage: "/images/category-women.jpg", description: "Volume and restraint. Each skirt is a study in the geometry of movement." },
  "women/ready-to-wear/sweatshirts": { title: "Sweatshirts", subtitle: "Women", bannerImage: "/images/collection-02.jpg", description: "Ease made precise. Comfort elevated into something worth keeping." },
  "women/accessories": { title: "Accessories", subtitle: "Women", bannerImage: "/images/campaign-story.jpg", description: "Considered detail. Accessories that complete without overwhelming." },
  // ── Men ───────────────────────────────────────────────────
  men: { title: "Men", subtitle: "SS 2026", bannerImage: "/images/category-men.jpg", description: "Structured ease. A wardrobe built for those who understand that less is the most demanding discipline." },
  "men/new-in": { title: "New In", subtitle: "Men", bannerImage: "/images/category-men.jpg", description: "The newest arrivals. Considered additions to the Tezhhomayaa wardrobe." },
  "men/bags": { title: "Men's Bags", subtitle: "Functional Sculpture", bannerImage: "/images/category-bags.jpg", description: "Objects built for transit — resolved forms that carry with authority." },
  "men/ready-to-wear": { title: "Ready To Wear", subtitle: "Men", bannerImage: "/images/collection-02.jpg", description: "Unhurried garments for those who dress with intention." },
  "men/ready-to-wear/shirts": { title: "Shirts", subtitle: "Men", bannerImage: "/images/collection-02.jpg", description: "Woven with the same precision as the house's architecture. Shirts that hold form." },
  "men/ready-to-wear/t-shirts-polos": { title: "T-Shirts & Polos", subtitle: "Men", bannerImage: "/images/category-men.jpg", description: "The essentials, reconsidered. Foundational garments stripped of excess." },
  "men/ready-to-wear/trousers-shorts": { title: "Trousers & Shorts", subtitle: "Men", bannerImage: "/images/collection-02.jpg", description: "Cut for the correct break and the correct weight. Proportion as intention." },
  "men/ready-to-wear/tracksuits-sweatshirts": { title: "Tracksuits & Sweatshirts", subtitle: "Men", bannerImage: "/images/hero-slide-3.jpg", description: "Rest as uniform. Active ease elevated into considered form." },
  "men/ready-to-wear/coats-jackets": { title: "Coats & Jackets", subtitle: "Men", bannerImage: "/images/hero-slide-3.jpg", description: "Outerwear as statement. The garment that precedes all others." },
  "men/accessories": { title: "Accessories", subtitle: "Men", bannerImage: "/images/hero-slide-3.jpg", description: "Considered additions. Accessories that complete without competing." },
  // ── Fragrances ────────────────────────────────────────────
  fragrances: { title: "Fragrances", subtitle: "The House Scent", bannerImage: "/images/category-fragrance.jpg", description: "Scent as architecture. Our fragrances are built like spaces — quiet, layered, enduring." },
  "fragrances/women": { title: "Women's Fragrances", subtitle: "The Feminine Form", bannerImage: "/images/category-fragrance.jpg", description: "Scent that opens with clarity and deepens over hours." },
  "fragrances/men": { title: "Men's Fragrances", subtitle: "The Masculine Form", bannerImage: "/images/category-fragrance.jpg", description: "Structured and enduring. The masculine form expressed through scent." },
  // ── Bags (top-level) ──────────────────────────────────────
  bags: { title: "Bags", subtitle: "The Signature Collection", bannerImage: "/images/category-bags.jpg", description: "Architecturally precise. Every bag is a study in proportion and restraint." },
};

import { shopifyFetch, getProductsQuery, getProductByHandleQuery, getCollectionByHandleQuery } from '@/lib/shopify';
import { adaptShopifyProducts, adaptShopifyProduct } from '@/lib/shopifyAdapter';
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

async function buildMerged(): Promise<Product[]> {
  try {
    let allEdges: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const data = await shopifyFetch({
        query: getProductsQuery,
        variables: { first: 250, cursor }
      });

      if (data?.products?.edges) {
        allEdges = allEdges.concat(data.products.edges);
        hasNextPage = data.products.pageInfo?.hasNextPage || false;
        cursor = data.products.pageInfo?.endCursor || null;
      } else {
        hasNextPage = false;
      }
    }

    if (allEdges.length > 0) {
      return adaptShopifyProducts(allEdges);
    }
  } catch (err) {
    console.error("Error fetching from Shopify", err);
  }
  return [];
}

export async function getRawProducts(): Promise<Product[]> {
  return await buildMerged();
}

export async function getAllProducts(): Promise<Product[]> {
  const merged = await buildMerged();
  return merged.filter(p => p.status !== "draft" && p.status !== "archived");
}

import { UniversalSectionData, normalizeSectionData } from "@/lib/types/homepage";
import { getSmartCollections } from "@/lib/smartCollections";
import { Observability } from "@/lib/infrastructure/observability";

export async function getCollectionBanner(categoryKey: string): Promise<UniversalSectionData> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data: any = await docRepo.getDocument("collection_banners");
    if (data && data[categoryKey]) {
      return normalizeSectionData(data[categoryKey]);
    }
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error loading collection banner:", err);
  }

  // Fallback to legacy static meta or Smart Collection basic data
  const meta = categoryMeta[categoryKey];
  const smartCols = await getSmartCollections();
  const smartCol = smartCols.find(c => c.slug === categoryKey);
  
  const titleFallback = categoryKey.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Collection";
  const subtitleFallback = categoryKey.split('/')[0]?.toUpperCase() || "";
  
  return normalizeSectionData({
    content: {
      heading: meta?.title || smartCol?.title || titleFallback,
      subheading: meta?.subtitle || subtitleFallback,
      description: meta?.description || smartCol?.description || "",
      primaryButton: { enabled: false, label: "Explore", url: "#", style: "luxury" },
      secondaryButton: { enabled: false, label: "Learn More", url: "#", style: "outline" }
    },
    media: {
      type: "image",
      desktop: { url: meta?.bannerImage || smartCol?.bannerImage || "" },
      mobile: { url: meta?.bannerImage || smartCol?.bannerImage || "" },
      videoSettings: { autoplay: true, loop: true, muted: true, controls: false, lazyLoad: true, playOnHover: false }
    }
  });
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const merged = await buildMerged();
  return merged.find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const merged = await buildMerged();
  const allProducts = merged.filter((p) => p.slug !== product.slug && p.status !== "draft");
  
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const overridden = allProducts.filter(p => product.relatedProductIds!.includes(p.id));
    if (overridden.length > 0) {
      return overridden.slice(0, count);
    }
  }

  const parts = (product.category || "").split("/");
  const department = parts[0] || "";
  const category = parts[1] || "";

  // 1. Same Subcategory (Exact match)
  let related = allProducts.filter(p => p.category === product.category);

  // 2. Same Category (department/category/...)
  if (related.length < count) {
    const sameCat = allProducts.filter(p => {
      const pParts = (p.category || "").split("/");
      return pParts[0] === department && pParts[1] === category && !related.find(r => r.id === p.id);
    });
    related = [...related, ...sameCat];
  }

  // 3. Fallback: Same Department
  if (related.length < count) {
    const sameDept = allProducts.filter(p => {
      const pParts = (p.category || "").split("/");
      return pParts[0] === department && !related.find(r => r.id === p.id);
    });
    related = [...related, ...sameDept];
  }

  return related.slice(0, count);
}


function getShopifyCollectionHandle(categoryKey: string): string | null {
  const parts = categoryKey.split('/');
  const lastPart = parts[parts.length - 1];
  
  if (lastPart === 'dresses-jumpsuits') return 'dresses-and-jumpsuits';
  if (lastPart === 'pants-shorts') return 'pants-and-shorts';
  if (lastPart === 'tops-shirts') return 'tops-and-shirts';
  if (lastPart === 'trousers-shorts') return 'trousers-and-shorts';
  if (lastPart === 'skirts') return 'skirts';
  if (lastPart === 'shirts') return 'shirts';
  if (lastPart === 't-shirts-polos') return 't-shirts-and-polos';
  if (lastPart === 'coats-jackets') return 'coats-and-jackets';
  
  if (lastPart === 'sweatshirts' && categoryKey.includes('women')) return 't-shirts-and-sweatshirts';
  if (lastPart === 'tracksuits-sweatshirts' && categoryKey.includes('men')) return 'tracksuit-and-sweatshirts';
  
  if (lastPart === 'bags') return 'bags';
  
  return null;
}

export async function getProductsByCategory(categoryKey: string): Promise<Product[]> {
  const merged = await getAllProducts();
  
  // Normalize by removing all spaces, hyphens, and special characters (keeping slashes)
  const normalize = (str: string) => (str || "").toLowerCase().replace(/[^a-z0-9\/]+/g, '');
  const normKey = normalize(categoryKey);

  let filtered = merged.filter((p) => {
    const pCat = normalize(p.category);
    
    // 1. Exact match
    if (pCat === normKey) return true;
    
    // 2. Prefix match (e.g. 'men/ready-to-wear' loads 'men/ready-to-wear/shirts')
    if (pCat.startsWith(normKey + '/')) return true;
    
    // 3. Special substring match to allow /dresses to match women/ready-to-wear/dresses
    if (pCat.endsWith('/' + normKey)) return true;
    
    // Special top-level fallback
    if (categoryKey === "bags" && pCat.includes("bags")) return true;
    if (categoryKey === "fragrances" && pCat.startsWith("fragrances")) return true;
    
    return false;
  });

  // Attempt to fetch exact native order from Shopify Collection
  const shopifyHandle = getShopifyCollectionHandle(categoryKey);
  if (shopifyHandle) {
    try {
      const query = `query { collection(handle: "${shopifyHandle}") { products(first: 250) { edges { node { handle } } } } }`;
      const data = await shopifyFetch({ query });
      if (data?.collection?.products?.edges) {
        const order = data.collection.products.edges.map((e: any) => e.node.handle);
        
        // Map the exact products from the collection, in exact order, bypassing tag filters
        const collectionProducts = order
          .map((slug: string) => merged.find(p => p.slug === slug))
          .filter(Boolean) as Product[];
          
        if (collectionProducts.length > 0) {
          return collectionProducts;
        }
      }
    } catch (err) {
      console.error("Error fetching collection exact products", err);
    }
  }
  return filtered;
}

export async function productsByCategory(categoryKey: string): Promise<Product[]> {
  return await getProductsByCategory(categoryKey);
}


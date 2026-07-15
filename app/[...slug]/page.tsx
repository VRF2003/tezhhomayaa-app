import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/collections";
import ProductDetailPage from "@/components/layout/ProductDetailPage";
import CollectionPage from "@/components/layout/CollectionPage";
import { getSmartCollectionSettings, getSmartCollections } from "@/lib/smartCollections";

export const dynamic = "force-dynamic";

export async function generateMetadata(context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const fullPath = slug.join("/");
  const lastSegment = slug[slug.length - 1];

  // 1. Is it a Custom Page?
  const registryPath = path.join(process.cwd(), "lib", "pages.json");
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      const pageMeta = registry.find((p: any) => p.slug === fullPath || p.slug === lastSegment);
      if (pageMeta) {
        return {
          title: `${pageMeta.title} — TEZHHOMAYAA`,
          description: `Tezhhomayaa ${pageMeta.title}`,
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Is it a Product?
  const product = getProductBySlug(lastSegment);
  if (product) {
    return {
      title: `${product.name} — TEZHHOMAYAA`,
      description: product.editorialDescription,
      openGraph: {
        title: `${product.name} — TEZHHOMAYAA`,
        description: product.editorialDescription,
        images: [{ url: product.image, width: 1200, height: 900 }],
      },
    };
  }

  // 3. Smart Collection Override
  const settings = getSmartCollectionSettings();
  if (settings.enableSmartRouting) {
    const smartCols = getSmartCollections();
    const col = smartCols.find(c => c.slug === fullPath || c.slug === lastSegment);
    if (col) {
      return {
        title: `${col.title} — TEZHHOMAYAA`,
        description: col.description || `${col.title} collection.`,
      };
    }
  }

  // 4. Fallback to Category
  const titleStr = lastSegment.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `${titleStr} — TEZHHOMAYAA`,
    description: `${titleStr} collection.`,
  };
}

export default async function UniversalDynamicPage(props: { params: Promise<{ slug: string[] }>, searchParams: Promise<{ preview?: string }> }) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = searchParams.preview === "true";
  
  const fullPath = slug.join("/");
  const lastSegment = slug[slug.length - 1];

  // 1. Is it a Custom Page?
  const registryPath = path.join(process.cwd(), "lib", "pages.json");
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      const pageMeta = registry.find((p: any) => p.slug === fullPath || p.slug === lastSegment);
      
      if (pageMeta && (pageMeta.status === "Published" || isPreview)) {
        const targetSlug = pageMeta.mode === "motion" ? `${pageMeta.slug}-motion` : pageMeta.slug;
        const filePath = path.join(process.cwd(), "lib", "pages", `${targetSlug}.json`);
        if (fs.existsSync(filePath)) {
          const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          const sections = Array.isArray(rawData) ? rawData : (rawData.sections || []);
          return (
            <main className="min-h-screen bg-white" id="main-content">
              <Navbar />
              <HomepageClientWrapper initialSections={sections} />
              <Footer />
            </main>
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Is it a Product?
  const product = getProductBySlug(lastSegment);
  if (product) {
    const related = getRelatedProducts(product, 10);
    return <ProductDetailPage product={product} related={related} />;
  }

  // 3. Is it a Smart Collection?
  const settings = getSmartCollectionSettings();
  
  console.log("=== STOREFRONT ROUTING DEBUG ===");
  console.log("Current route fullPath:", fullPath);
  console.log("Smart Routing Enabled:", settings.enableSmartRouting);

  if (settings.enableSmartRouting) {
    const smartCols = getSmartCollections();
    const col = smartCols.find(c => c.slug === fullPath || c.slug === lastSegment);
    
    console.log("Collection found:", col ? "Yes" : "No");
    if (col) {
      console.log("Collection slug:", col.slug);
      console.log("Collection matching product IDs count:", col.productIds.length);
      
      // Create a mocked CollectionPage experience using the cached productIds
      const allProducts = getAllProducts(); // NOTE: getAllProducts filters OUT draft/archived products
      const matchedProducts = allProducts.filter(p => col.productIds.includes(p.id));
      
      console.log("Products returned to page (active only):", matchedProducts.length);
      console.log("================================");
      
      // Pass dynamic products instead of categoryKey if CollectionPage supported it.
      // But CollectionPage currently uses categoryKey to fetch.
      // So we can pass a special flag or we can just pass the smart collection data.
      return <CollectionPage categoryKey={fullPath} smartCollection={{ title: col.title, description: col.description, bannerImage: col.bannerImage, products: matchedProducts }} />;
    }
  }

  console.log("Falling back to legacy Category Engine");
  console.log("================================");

  // 4. Fallback to Category
  return <CollectionPage categoryKey={fullPath} />;
}

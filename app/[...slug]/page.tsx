import path from "path";
import { notFound } from "next/navigation";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/collections";
import ProductDetailPage from "@/components/layout/ProductDetailPage";
import CollectionPage from "@/components/layout/CollectionPage";
import { getSmartCollectionSettings, getSmartCollections } from "@/lib/smartCollections";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function generateMetadata(context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const fullPath = slug.join("/");
  const lastSegment = slug[slug.length - 1];

  // 1. Is it a Custom Page?
  try {
    const docRepo = RepositoryResolver.resolve("IDocumentRepository") as IDocumentRepository;
    const registry = await docRepo.getDocument<any[]>("pages_registry");
    if (registry) {
      const pageMeta = registry.find((p: any) => p.slug === fullPath || p.slug === lastSegment);
      if (pageMeta) {
        return {
          title: `${pageMeta.title} — TEZHHOMAYAA`,
          description: `Tezhhomayaa ${pageMeta.title}`,
        };
      }
    }
  } catch (e) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(e);
  }

  // 2. Is it a Product?
  const product = await getProductBySlug(lastSegment);
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
  const settings = await getSmartCollectionSettings();
  if (settings.enableSmartRouting) {
    const smartCols = await getSmartCollections();
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
  try {
    const docRepo = RepositoryResolver.resolve("IDocumentRepository") as IDocumentRepository;
    const registry = await docRepo.getDocument<any[]>("pages_registry");
    if (registry) {
      const pageMeta = registry.find((p: any) => p.slug === fullPath || p.slug === lastSegment);
      
      if (pageMeta && (pageMeta.status === "Published" || isPreview)) {
        const pageData: any = await docRepo.getDocument(`page_${pageMeta.id}`);
        if (pageData) {
          const sections = pageData.sections || [];
          return (
            <main className="min-h-screen bg-white" id="main-content">
              <Navbar />
              <HomepageClientWrapper initialSections={sections} />
              <Footer />
            </main>
          );
        }
      }
    }
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error checking custom pages:", err);
  }

  // 2. Is it a Product?
  const product = await getProductBySlug(lastSegment);
  if (product) {
    const related = await getRelatedProducts(product, 10);
    return <ProductDetailPage product={product} related={related} />;
  }

  // 3. Is it a Smart Collection?
  const settings = await getSmartCollectionSettings();
  
  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("=== STOREFRONT ROUTING DEBUG ===");
  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Current route fullPath:", fullPath);
  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Smart Routing Enabled:", settings.enableSmartRouting);

  if (settings.enableSmartRouting) {
    const smartCols = await getSmartCollections();
    const col = smartCols.find(c => c.slug === fullPath || c.slug === lastSegment);
    
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Collection found:", col ? "Yes" : "No");
    if (col) {
      Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Collection slug:", col.slug);
      Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Collection matching product IDs count:", col.productIds.length);
      
      // Create a mocked CollectionPage experience using the cached productIds
      const allProducts = await getAllProducts(); // NOTE: getAllProducts filters OUT draft/archived products
      const matchedProducts = allProducts.filter(p => col.productIds.includes(p.id));
      
      Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Products returned to page (active only):", matchedProducts.length);
      Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("================================");
      
      // Pass dynamic products instead of categoryKey if CollectionPage supported it.
      // But CollectionPage currently uses categoryKey to fetch.
      // So we can pass a special flag or we can just pass the smart collection data.
      return <CollectionPage categoryKey={fullPath} smartCollection={{ title: col.title, description: col.description, bannerImage: col.bannerImage, products: matchedProducts }} />;
    }
  }

  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Falling back to legacy Category Engine");
  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("================================");

  // 4. Fallback to Category
  return <CollectionPage categoryKey={fullPath} />;
}

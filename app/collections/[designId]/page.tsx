import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/collections";
import CollectionPageUI from "@/components/layout/CollectionPageUI";

export async function generateMetadata({ params }: { params: Promise<{ designId: string }> }) {
  const { designId } = await params;
  const designName = designId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${designName} Collection | Tezhhomayaa`,
    description: `Explore the ${designName} design collection.`,
  };
}

export default async function DesignCollectionPage({ params }: { params: Promise<{ designId: string }> }) {
  const { designId } = await params;
  
  // Format the ID to a readable string (e.g. "rough-notes" -> "Rough Notes")
  const designName = designId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Get all active products
  const allProducts = await getAllProducts();

  // Filter products by checking if the design name exists in their tags or editorialDescription
  const filteredProducts = allProducts.filter(p => {
    const searchTarget = `${p.tags?.join(' ')} ${p.editorialDescription} ${p.collectionName || ''}`.toLowerCase();
    const query = designName.toLowerCase();
    
    // Exact match in tags or fuzzy match in description
    return searchTarget.includes(query);
  });

  if (filteredProducts.length === 0) {
    // We don't want to 404 immediately, we'll let CollectionPageUI render the empty state
  }

  // Create a fake smart collection object to satisfy CollectionPageUI
  const smartCollection = {
    slug: `collections/${designId}`,
    title: designName,
    subtitle: "Design Collection",
    description: `Explore all pieces from the ${designName} collection.`,
    bannerImage: "/images/collection-banner.jpg", // Fallback banner
    presentation: {
      desktopColumns: 4,
      mobileColumns: 2,
      desktopGap: 1,
      mobileGap: 1,
      imageRatio: "3:4",
      showCategory: true,
      showProductName: true,
      showPrice: true,
    }
  };

  return (
    <CollectionPageUI
      categoryKey={`collections/${designId}`}
      meta={null}
      bannerData={null}
      finalProducts={filteredProducts}
      totalRaw={filteredProducts.length}
      totalActive={filteredProducts.length}
      totalDraft={0}
      smartCollection={smartCollection}
    />
  );
}

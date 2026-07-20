import { categoryMeta, getProductsByCategory, getRawProducts, getCollectionBanner } from "@/lib/collections";
import CollectionPageUI from "@/components/layout/CollectionPageUI";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = 'force-dynamic';

type CollectionPageProps = {
  categoryKey: string;
  smartCollection?: {
    title: string;
    description: string;
    bannerImage: string;
    products: any[];
    presentation?: any;
  };
};

export default function CollectionPage({ categoryKey, smartCollection }: CollectionPageProps) {
  const meta = categoryMeta[categoryKey];
  const products = getProductsByCategory(categoryKey);
  const rawProducts = getRawProducts();
  const bannerData = getCollectionBanner(categoryKey);
  
  let finalProducts = smartCollection ? smartCollection.products : products;

  // Manual inclusions
  if (bannerData?.includeProducts && bannerData.includeProducts.length > 0) {
     const included = rawProducts.filter(p => bannerData.includeProducts!.includes(p.id) && !finalProducts.some((f: any) => f.id === p.id));
     finalProducts = [...finalProducts, ...included];
  }

  // Manual exclusions
  if (bannerData?.excludeProducts && bannerData.excludeProducts.length > 0) {
     finalProducts = finalProducts.filter((p: any) => !bannerData.excludeProducts!.includes(p.id));
  }

  const totalRaw = rawProducts.length;
  const totalActive = rawProducts.filter(p => p.status !== "draft" && p.status !== "archived").length;
  const totalDraft = rawProducts.filter(p => p.status === "draft").length;

  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Current Page CategoryKey:", categoryKey);
  Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Total Loaded on Page:", products.length);

  if (bannerData?.productSequence && bannerData.productSequence.length > 0) {
    finalProducts = [...finalProducts].sort((a: any, b: any) => {
      const idxA = bannerData.productSequence!.indexOf(a.id);
      const idxB = bannerData.productSequence!.indexOf(b.id);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }

  return (
    <CollectionPageUI
      categoryKey={categoryKey}
      meta={meta}
      bannerData={bannerData}
      finalProducts={finalProducts}
      totalRaw={totalRaw}
      totalActive={totalActive}
      totalDraft={totalDraft}
      smartCollection={smartCollection}
    />
  );
}

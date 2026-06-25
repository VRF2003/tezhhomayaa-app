import { categoryMeta, getProductsByCategory, getRawProducts, getCollectionBanner } from "@/lib/collections";
import CollectionPageUI from "@/components/layout/CollectionPageUI";

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
  const totalRaw = rawProducts.length;
  const totalActive = rawProducts.filter(p => p.status !== "draft" && p.status !== "archived").length;
  const totalDraft = rawProducts.filter(p => p.status === "draft").length;

  console.log("Current Page CategoryKey:", categoryKey);
  console.log("Total Loaded on Page:", products.length);

  const finalProducts = smartCollection ? smartCollection.products : products;

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

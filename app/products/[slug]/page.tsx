import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/collections";
import ProductDetailPage from "@/components/layout/ProductDetailPage";


// ─── Per-page SEO metadata ────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Not Found — TEZHHOMAYAA" };
  }

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

// ─── Page component ───────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 10);

  return <ProductDetailPage product={product} related={related} />;
}

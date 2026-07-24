"use server";

import { getRelatedProducts, Product, getProductBySlug } from "@/lib/collections";

export async function fetchRelatedProductsAction(product: Product): Promise<Product[]> {
  try {
    return await getRelatedProducts(product, 3);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

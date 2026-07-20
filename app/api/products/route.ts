import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/lib/collections";
import { categoryLabel } from "@/lib/categoryEngine";
import { computeSmartCollections } from "@/lib/smartCollections";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("products");
    return (data as Product[]) || [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, data: await getProducts() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = await getProducts();
    
    // Generate defaults
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newProduct: Product = {
      ...body,
      id: body.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      slug,
      handle: slug,
      href: body.href || `/products/${slug}`,
      categoryLabel: body.categoryLabel || categoryLabel(body.category || "women"),
    };
    
    products.push(newProduct);
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("products", products);
    
    // Update smart collections cache
    await computeSmartCollections();
    
    return NextResponse.json({ success: true, data: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

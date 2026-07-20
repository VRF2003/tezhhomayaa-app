import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/lib/collections";
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

export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();
    
    if (!Array.isArray(updates)) {
      return NextResponse.json({ success: false, error: "Expected an array of updates" }, { status: 400 });
    }

    const products = await getProducts();
    let updatedCount = 0;

    for (const update of updates) {
      if (!update.id) continue;
      
      const index = products.findIndex(p => p.id === update.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...update };
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
      await docRepo.saveDocument("products", products);
      
      // Update smart collections cache
      await computeSmartCollections();
    }
    
    return NextResponse.json({ success: true, updatedCount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

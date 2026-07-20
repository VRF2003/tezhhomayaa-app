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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const products = await getProducts();
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    products[index] = { ...products[index], ...body };
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("products", products);
    
    // Update smart collections cache
    await computeSmartCollections();
    
    return NextResponse.json({ success: true, data: products[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = await getProducts();
    
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("products", filtered);
    
    // Update smart collections cache
    await computeSmartCollections();
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

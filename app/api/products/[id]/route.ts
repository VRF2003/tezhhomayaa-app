import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Product } from "@/lib/collections";
import { computeSmartCollections } from "@/lib/smartCollections";

export const dynamic = 'force-dynamic';

const filePath = join(process.cwd(), "lib", "products.json");

function getProducts(): Product[] {
  if (!existsSync(filePath)) return [];
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const products = getProducts();
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    products[index] = { ...products[index], ...body };
    writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
    
    // Update smart collections cache
    computeSmartCollections();
    
    return NextResponse.json({ success: true, data: products[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = getProducts();
    
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    
    // Update smart collections cache
    computeSmartCollections();
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

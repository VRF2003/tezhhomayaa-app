import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Product } from "@/lib/collections";
import { categoryLabel } from "@/lib/categoryEngine";
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

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, data: getProducts() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = getProducts();
    
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
    writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
    
    // Update smart collections cache
    computeSmartCollections();
    
    return NextResponse.json({ success: true, data: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

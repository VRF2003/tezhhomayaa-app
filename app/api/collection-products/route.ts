import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategory } from "@/lib/collections";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    
    if (!category) {
      return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }

    const products = getProductsByCategory(category);
    
    return NextResponse.json({ success: true, data: products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

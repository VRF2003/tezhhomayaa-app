import { NextResponse } from "next/server";
import { getTags, addTag } from "@/lib/tags";
import { getAllProducts } from "@/lib/collections";

export async function GET() {
  try {
    const tags = getTags();
    const products = getAllProducts();
    
    // Calculate product counts
    const tagsWithCounts = tags.map(tag => {
      const count = products.filter(p => p.tags && p.tags.includes(tag.name)).length;
      return { ...tag, productCount: count };
    });
    
    return NextResponse.json({ success: true, data: tagsWithCounts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ success: false, error: "Name required" }, { status: 400 });
    
    const tag = addTag(body.name);
    return NextResponse.json({ success: true, data: tag });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

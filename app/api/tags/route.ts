import { NextResponse } from "next/server";
import { getTags, addTag } from "@/lib/tags";
import { getAllProducts } from "@/lib/collections";

export async function GET() {
  try {
    const tags = await getTags();
    const products = await getAllProducts();
    
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
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Invalid tag name" }, { status: 400 });
    }
    
    const newTag = await addTag(name);
    return NextResponse.json({ success: true, tag: newTag });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSmartCollections, saveSmartCollections, computeSmartCollections, SmartCollection } from "@/lib/smartCollections";

export async function GET() {
  try {
    const collections = await getSmartCollections();
    return NextResponse.json({ success: true, data: collections });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collections = await getSmartCollections();
    
    const newCol: SmartCollection = {
      id: `sc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: body.title || "New Collection",
      slug: body.slug || "new-collection",
      description: body.description || "",
      bannerImage: body.bannerImage || "",
      matchType: body.matchType || "ALL",
      conditions: body.conditions || [],
      productIds: [],
      presentation: body.presentation || {
        productGap: 40,
        desktopColumns: 4,
        mobileColumns: 2,
        density: "Spacious",
        imageRatio: "3:4",
        cardStyle: "minimal",
        showPrice: true,
        showProductName: true,
        showCategory: false,
        hoverEffect: "zoom",
        bannerHeight: "large",
      }
    };
    
    collections.push(newCol);
    await saveSmartCollections(collections);
    await computeSmartCollections();
    
    // Fetch updated collection with productIds
    const updatedCols = await getSmartCollections();
    const updatedNewCol = updatedCols.find(c => c.id === newCol.id);
    
    return NextResponse.json({ success: true, data: updatedNewCol });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

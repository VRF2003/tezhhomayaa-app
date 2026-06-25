import { NextResponse } from "next/server";
import { getSmartCollections, saveSmartCollections, computeSmartCollections } from "@/lib/smartCollections";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const collections = getSmartCollections();
    
    const index = collections.findIndex(c => c.id === id);
    if (index === -1) return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    
    collections[index] = { ...collections[index], ...body };
    saveSmartCollections(collections);
    computeSmartCollections();
    
    const updatedCols = getSmartCollections();
    return NextResponse.json({ success: true, data: updatedCols.find(c => c.id === id) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const collections = getSmartCollections();
    
    const filtered = collections.filter(c => c.id !== id);
    saveSmartCollections(filtered);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

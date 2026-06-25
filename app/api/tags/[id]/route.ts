import { NextResponse } from "next/server";
import { renameTag, deleteTag, mergeTags } from "@/lib/tags";
import { computeSmartCollections } from "@/lib/smartCollections";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    if (body.action === "merge") {
      if (!body.targetId) return NextResponse.json({ success: false, error: "Target ID required" }, { status: 400 });
      mergeTags(id, body.targetId);
    } else if (body.name) {
      renameTag(id, body.name);
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
    
    // Triggers recomputation of smart collections
    computeSmartCollections();
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    deleteTag(id);
    
    // Triggers recomputation of smart collections
    computeSmartCollections();
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

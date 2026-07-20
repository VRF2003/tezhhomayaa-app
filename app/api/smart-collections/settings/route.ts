import { NextResponse } from "next/server";
import { getSmartCollectionSettings, saveSmartCollectionSettings } from "@/lib/smartCollections";

export async function GET() {
  try {
    const settings = getSmartCollectionSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const settings = await getSmartCollectionSettings();
    
    settings.enableSmartRouting = body.enableSmartRouting ?? settings.enableSmartRouting;
    await saveSmartCollectionSettings(settings);
    
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

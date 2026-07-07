import { NextResponse } from "next/server";
import { getJournalTheme, saveJournalTheme } from "@/lib/journal-theme";

export async function GET() {
  try {
    const config = getJournalTheme();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    saveJournalTheme(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

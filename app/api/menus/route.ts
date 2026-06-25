import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { defaultMainNav } from "@/lib/types/menus";

export const dynamic = "force-dynamic";

const MENUS_PATH = path.join(process.cwd(), "lib", "menus.json");

export async function GET() {
  try {
    if (!fs.existsSync(MENUS_PATH)) {
      return NextResponse.json({ success: true, data: defaultMainNav });
    }
    const data = JSON.parse(fs.readFileSync(MENUS_PATH, "utf-8"));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Failed to load menus data", err);
    return NextResponse.json({ success: false, error: "Failed to load menus data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(MENUS_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    console.error("Failed to save menus data", err);
    return NextResponse.json({ success: false, error: "Failed to save menus data" }, { status: 500 });
  }
}

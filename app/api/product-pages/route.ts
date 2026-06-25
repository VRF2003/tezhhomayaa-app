import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const PP_PATH = path.join(process.cwd(), "lib", "product-pages.json");

export async function GET() {
  try {
    if (!fs.existsSync(PP_PATH)) {
      return NextResponse.json({ success: true, data: { sections: [] } });
    }
    const data = JSON.parse(fs.readFileSync(PP_PATH, "utf-8"));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Failed to load product pages data", err);
    return NextResponse.json({ success: false, error: "Failed to load product pages data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(PP_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    console.error("Failed to save product pages data", err);
    return NextResponse.json({ success: false, error: "Failed to save product pages data" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = 'force-dynamic';

const filePath = join(process.cwd(), "lib", "size-guide.json");

function getSizeGuide() {
  if (!existsSync(filePath)) return { women: "", men: "", unisex: "" };
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return { women: "", men: "", unisex: "" };
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, data: getSizeGuide() });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

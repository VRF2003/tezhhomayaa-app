import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "lib", "homepage.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!existsSync(filePath)) {
      console.log("Loaded CMS Data (Empty)");
      return NextResponse.json({ success: true, data: {} });
    }
    const raw = readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    console.log("Loaded CMS Data", data);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log("Saving CMS Data", body);
    writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
    console.log("Saved Successfully");
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

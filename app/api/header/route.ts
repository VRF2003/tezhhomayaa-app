import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const HEADER_PATH = path.join(process.cwd(), "lib", "header.json");

const defaultHeaderSettings = {
  logoImage: "/branding/tezhhomayaa-logo-v3.png",
  desktopLogoWidth: 420,
  mobileLogoWidth: 280,
  logoLinkUrl: "/",
  stickyHeader: true,
  transparentHeader: true
};

export async function GET() {
  try {
    if (!fs.existsSync(HEADER_PATH)) {
      return NextResponse.json({ success: true, data: defaultHeaderSettings });
    }
    const data = JSON.parse(fs.readFileSync(HEADER_PATH, "utf-8"));
    return NextResponse.json({ success: true, data: { ...defaultHeaderSettings, ...data } });
  } catch (err) {
    console.error("Failed to load header data", err);
    return NextResponse.json({ success: false, error: "Failed to load header data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(HEADER_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    console.error("Failed to save header data", err);
    return NextResponse.json({ success: false, error: "Failed to save header data" }, { status: 500 });
  }
}

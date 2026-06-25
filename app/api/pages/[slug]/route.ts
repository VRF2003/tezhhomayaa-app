import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  
  if (!slug) {
    return NextResponse.json({ success: false, error: "Slug required" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "lib", "pages", `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Failed to load page data", err);
    return NextResponse.json({ success: false, error: "Failed to load" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  
  if (!slug) {
    return NextResponse.json({ success: false, error: "Slug required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), "lib", "pages", `${slug}.json`);
    
    const pagesDir = path.dirname(filePath);
    if (!fs.existsSync(pagesDir)) {
      fs.mkdirSync(pagesDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");

    // Update lastUpdated in registry
    const registryPath = path.join(process.cwd(), "lib", "pages.json");
    if (fs.existsSync(registryPath)) {
      const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      const pageIndex = registry.findIndex((p: any) => p.slug === slug);
      if (pageIndex !== -1) {
        registry[pageIndex].lastUpdated = new Date().toISOString();
        fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
      }
    }

    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    console.error("Failed to save page data", err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}

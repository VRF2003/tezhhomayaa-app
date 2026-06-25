import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const REGISTRY_PATH = path.join(process.cwd(), "lib", "pages.json");
const PAGES_DIR = path.join(process.cwd(), "lib", "pages");

function getRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const pages = getRegistry();
  return NextResponse.json({ success: true, data: pages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, template } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    const pages = getRegistry();
    if (pages.some((p: any) => p.slug === slug)) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }

    const newPage = {
      id: slug,
      title,
      slug,
      template: template || "Custom Page",
      status: "Draft",
      lastUpdated: new Date().toISOString(),
    };

    pages.push(newPage);
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(pages, null, 2));

    if (!fs.existsSync(PAGES_DIR)) {
      fs.mkdirSync(PAGES_DIR, { recursive: true });
    }
    
    // Create an empty JSON object for the new page builder content
    const pageDataPath = path.join(PAGES_DIR, `${slug}.json`);
    if (!fs.existsSync(pageDataPath)) {
      fs.writeFileSync(pageDataPath, JSON.stringify({ sections: [] }));
    }

    return NextResponse.json({ success: true, data: newPage });
  } catch (err) {
    console.error("Error creating page:", err);
    return NextResponse.json({ success: false, error: "Failed to create page" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, status, mode } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const pages = getRegistry();
    const pageIndex = pages.findIndex((p: any) => p.slug === slug);
    
    if (pageIndex === -1) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    if (status !== undefined) pages[pageIndex].status = status;
    if (mode !== undefined) pages[pageIndex].mode = mode;
    
    pages[pageIndex].lastUpdated = new Date().toISOString();
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(pages, null, 2));

    return NextResponse.json({ success: true, data: pages[pageIndex] });
  } catch (err) {
    console.error("Error updating page status:", err);
    return NextResponse.json({ success: false, error: "Failed to update page status" }, { status: 500 });
  }
}

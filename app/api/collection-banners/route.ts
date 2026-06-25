import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "lib", "collection-banners.json");

import { categoryMeta } from "@/lib/collections";
import { normalizeSectionData } from "@/lib/types/homepage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let savedData: any = {};
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, "utf-8");
      savedData = JSON.parse(raw);
    }
    
    // Merge saved data with fallbacks for ALL categories
    const mergedData: any = {};
    for (const key of Object.keys(categoryMeta)) {
      if (savedData[key]) {
        mergedData[key] = savedData[key];
      } else {
        const meta = categoryMeta[key];
        mergedData[key] = normalizeSectionData({
          content: {
            heading: meta.title || "Collection",
            subheading: meta.subtitle || "",
            description: meta.description || "",
            primaryButton: { enabled: false, label: "Explore", url: "#", style: "luxury" },
            secondaryButton: { enabled: false, label: "Learn More", url: "#", style: "outline" }
          },
          media: {
            type: "image",
            desktop: { url: meta.bannerImage || "" },
            mobile: { url: meta.bannerImage || "" },
            videoSettings: { autoplay: true, loop: true, muted: true, controls: false, lazyLoad: true, playOnHover: false }
          }
        });
      }
    }
    
    console.log("Loaded CMS Data (Collection Banners)", mergedData);
    return NextResponse.json({ success: true, data: mergedData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log("Saving CMS Data (Collection Banners)", body);
    writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
    console.log("Saved Successfully (Collection Banners)");
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

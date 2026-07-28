import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

import { categoryMeta } from "@/lib/collections";
import { normalizeSectionData } from "@/lib/types/homepage";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let savedData: any = {};
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("collection_banners");
    if (data) {
      savedData = data;
    }
    
    // Keep all saved data
    const mergedData: any = { ...savedData };
    
    // Merge fallbacks for legacy static categories ONLY if they don't exist in saved data
    for (const key of Object.keys(categoryMeta)) {
      if (!mergedData[key]) {
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
    
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Loaded CMS Data (Collection Banners)", mergedData);
    return NextResponse.json({ success: true, data: mergedData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Saving CMS Data (Collection Banners)", body);
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("collection_banners", body);
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Saved Successfully (Collection Banners)");
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

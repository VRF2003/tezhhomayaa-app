import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

export const dynamic = "force-dynamic";

const DEFAULT_APPEARANCE = {
  mobile: {
    heroHeight: 75,
    logoSize: 1.05,
    iconSize: 22,
    sectionSpacing: 4,
    productGap: 1,
    headingScale: 85,
    buttonHeight: 46,
    collectionGap: 2
  },
  typography: {
    desktop: {
      heroTitleSize: 6,
      h1Size: 4,
      h2Size: 3,
      h3Size: 2,
      bodySize: 1,
      captionSize: 0.75,
      buttonSize: 0.875
    },
    tablet: {
      heroTitleSize: 4,
      h1Size: 3,
      h2Size: 2.25,
      h3Size: 1.5,
      bodySize: 1,
      captionSize: 0.75,
      buttonSize: 0.875
    },
    mobile: {
      heroTitleSize: 2.5,
      h1Size: 2.5,
      h2Size: 1.75,
      h3Size: 1.25,
      bodySize: 1,
      captionSize: 0.75,
      buttonSize: 0.75
    },
    letterSpacing: 0.05,
    headingLineHeight: 1.1,
    fontWeight: 400,
    contentWidth: 100,
    headingMaxWidth: 100
  }
};

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data: any = await docRepo.getDocument("appearance");
    if (!data) {
      return NextResponse.json({ success: true, data: DEFAULT_APPEARANCE });
    }
    
    // Ensure mobile and typography objects exist
    if (!data.mobile) data.mobile = DEFAULT_APPEARANCE.mobile;
    if (!data.typography) data.typography = DEFAULT_APPEARANCE.typography;
    
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    
    // Merge with existing data so we don't overwrite unrelated keys
    let existing = DEFAULT_APPEARANCE;
    try {
      const persisted = await docRepo.getDocument("appearance");
      if (persisted) {
        existing = persisted as any;
      }
    } catch(e) {}
    
    const merged = { ...existing, ...body };
    await docRepo.saveDocument("appearance", merged);
    return NextResponse.json({ success: true, data: merged });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

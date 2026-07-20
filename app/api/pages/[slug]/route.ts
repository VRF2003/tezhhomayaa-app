import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  
  if (!slug) {
    return NextResponse.json({ success: false, error: "Slug required" }, { status: 400 });
  }

  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument(`page_${slug}`);
    if (!data) {
      return NextResponse.json({ success: true, data: [] });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to load page data", err);
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
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument(`page_${slug}`, body);

    // Update lastUpdated in registry
    const registry: any = await docRepo.getDocument("pages_registry");
    if (registry) {
      const pageIndex = registry.findIndex((p: any) => p.slug === slug);
      if (pageIndex !== -1) {
        registry[pageIndex].lastUpdated = new Date().toISOString();
        await docRepo.saveDocument("pages_registry", registry);
      }
    }

    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to save page data", err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}

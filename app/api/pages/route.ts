import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

async function getRegistry() {
  const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
  const registry = await docRepo.getDocument("pages_registry");
  return registry || [];
}

export async function GET() {
  const pages = await getRegistry();
  return NextResponse.json({ success: true, data: pages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, template } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    const pages: any = await getRegistry();
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
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("pages_registry", pages);
    
    // Create an empty JSON object for the new page builder content
    const pageKey = `page_${slug}`;
    await docRepo.saveDocument(pageKey, { sections: [] });

    return NextResponse.json({ success: true, data: newPage });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error creating page:", err);
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

    const pages: any = await getRegistry();
    const pageIndex = pages.findIndex((p: any) => p.slug === slug);
    
    if (pageIndex === -1) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    if (status !== undefined) pages[pageIndex].status = status;
    if (mode !== undefined) pages[pageIndex].mode = mode;
    
    pages[pageIndex].lastUpdated = new Date().toISOString();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("pages_registry", pages);

    return NextResponse.json({ success: true, data: pages[pageIndex] });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error updating page status:", err);
    return NextResponse.json({ success: false, error: "Failed to update page status" }, { status: 500 });
  }
}

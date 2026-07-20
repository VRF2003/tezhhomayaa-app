import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("product_pages");
    if (!data) {
      return NextResponse.json({ success: true, data: { sections: [] } });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to load product pages data", err);
    return NextResponse.json({ success: false, error: "Failed to load product pages data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("product_pages", body);
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to save product pages data", err);
    return NextResponse.json({ success: false, error: "Failed to save product pages data" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { defaultMainNav } from "@/lib/types/menus";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("menus");
    if (!data) {
      return NextResponse.json({ success: true, data: defaultMainNav });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to load menus data", err);
    return NextResponse.json({ success: false, error: "Failed to load menus data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("menus", body);
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to save menus data", err);
    return NextResponse.json({ success: false, error: "Failed to save menus data" }, { status: 500 });
  }
}

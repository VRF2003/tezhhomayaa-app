import { NextResponse } from "next/server";
import { defaultFooterData } from "@/lib/types/footer";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("footer");
    if (!data) {
      Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Loaded Footer Data (Default)");
      return NextResponse.json({ success: true, data: defaultFooterData });
    }
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Loaded Footer Data from EPP");
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Saving Footer Data", body);
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("footer", body);
    Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("Saved Footer Successfully");
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

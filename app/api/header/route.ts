import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export const dynamic = "force-dynamic";

const defaultHeaderSettings = {
  logoImage: "/branding/tezhhomayaa-logo-v3.png",
  desktopLogoWidth: 420,
  mobileLogoWidth: 280,
  logoLinkUrl: "/",
  stickyHeader: true,
  transparentHeader: true
};

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("header");
    if (!data) {
      return NextResponse.json({ success: true, data: defaultHeaderSettings });
    }
    return NextResponse.json({ success: true, data: { ...defaultHeaderSettings, ...(data as any) } });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to load header data", err);
    return NextResponse.json({ success: false, error: "Failed to load header data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("header", body);
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Failed to save header data", err);
    return NextResponse.json({ success: false, error: "Failed to save header data" }, { status: 500 });
  }
}

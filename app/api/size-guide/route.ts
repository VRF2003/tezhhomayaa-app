import { NextRequest, NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

export const dynamic = 'force-dynamic';

async function getSizeGuide() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("size_guide");
    return data || { women: "", men: "", unisex: "" };
  } catch {
    return { women: "", men: "", unisex: "" };
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, data: await getSizeGuide() });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("size_guide", body);
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { defaultCommerceData } from "@/lib/types/commerce";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("commerce");
    if (!data) {
      return NextResponse.json({ success: true, data: defaultCommerceData });
    }
    // Deep merge with defaults so any new keys added later always have values
    const merged = deepMerge(defaultCommerceData, data);
    return NextResponse.json({ success: true, data: merged });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("commerce", body);
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Recursively merge defaults into saved data so new fields always have values
function deepMerge(defaults: any, saved: any): any {
  if (typeof defaults !== "object" || defaults === null) return saved ?? defaults;
  const result: any = { ...defaults };
  if (saved && typeof saved === "object") {
    for (const key of Object.keys(saved)) {
      if (key in result && typeof result[key] === "object" && !Array.isArray(result[key])) {
        result[key] = deepMerge(result[key], saved[key]);
      } else {
        result[key] = saved[key];
      }
    }
  }
  return result;
}

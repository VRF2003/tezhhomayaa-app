import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { defaultCommerceData } from "@/lib/types/commerce";

export const dynamic = "force-dynamic";

const filePath = join(process.cwd(), "lib", "commerce.json");

export async function GET() {
  try {
    if (!existsSync(filePath)) {
      return NextResponse.json({ success: true, data: defaultCommerceData });
    }
    const raw = readFileSync(filePath, "utf-8");
    // Deep merge with defaults so any new keys added later always have values
    const saved = JSON.parse(raw);
    const merged = deepMerge(defaultCommerceData, saved);
    return NextResponse.json({ success: true, data: merged });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
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

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MENUS_PATH = path.join(process.cwd(), "lib", "menus.json");

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    let menus = [];
    if (fs.existsSync(MENUS_PATH)) {
      menus = JSON.parse(fs.readFileSync(MENUS_PATH, "utf-8"));
    } else {
      // Fallback if no menus exist yet
      menus = require("@/lib/types/menus").defaultMainNav || [];
    }

    const departments: { label: string; value: string }[] = [];
    const categories: { label: string; value: string }[] = [];
    const subcategories: Record<string, { label: string; value: string }[]> = {};

    const categorySet = new Set<string>();

    menus.forEach((m: any) => {
      departments.push({ label: m.label, value: slugify(m.label) });
      
      if (m.categories && Array.isArray(m.categories)) {
        m.categories.forEach((c: any) => {
          const catVal = slugify(c.label);
          if (!categorySet.has(catVal)) {
            categories.push({ label: c.label, value: catVal });
            categorySet.add(catVal);
          }

          if (c.items && Array.isArray(c.items)) {
            if (!subcategories[catVal]) subcategories[catVal] = [];
            
            c.items.forEach((sub: any) => {
              // Ensure we don't add duplicate subcategories to the same category
              if (!subcategories[catVal].some(s => s.value === slugify(sub.label))) {
                subcategories[catVal].push({ label: sub.label, value: slugify(sub.label) });
              }
            });
          }
        });
      }
    });

    const data = { departments, categories, subcategories };
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Failed to load categories data from menus", err);
    return NextResponse.json({ success: false, error: "Failed to parse categories" }, { status: 500 });
  }
}

// Keep PUT just in case something tries to write to it, but tell it to ignore
export async function PUT() {
  return NextResponse.json({ success: true, warning: "Categories are now managed via Menus. This endpoint ignores writes." });
}

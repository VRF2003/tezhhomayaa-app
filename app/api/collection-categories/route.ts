import { NextResponse } from "next/server";
import { categoryMeta } from "@/lib/collections";
import { getSmartCollections } from "@/lib/smartCollections";
import menuData from "@/lib/menus.json";

export async function GET() {
  const staticCategories = Object.keys(categoryMeta).map(key => ({
    key,
    title: categoryMeta[key].title,
    subtitle: categoryMeta[key].subtitle
  }));
  
  const smartCols = await getSmartCollections();
  const smartCategories = smartCols.map(c => ({
    key: c.slug,
    title: `${c.title} (Smart Collection)`,
    subtitle: "Dynamic"
  }));
  
  // Extract categories from menus.json
  const menuCategories: any[] = [];
  for (const topLevel of menuData) {
    if (topLevel.categories) {
      for (const cat of topLevel.categories) {
        if (cat.href && cat.href !== "/") {
          menuCategories.push({
            key: cat.href.replace(/^\//, ""),
            title: cat.label,
            subtitle: topLevel.label
          });
        }
        if (cat.items) {
          for (const item of cat.items) {
            if (item.href && item.href !== "/") {
              menuCategories.push({
                key: item.href.replace(/^\//, ""),
                title: item.label,
                subtitle: cat.label
              });
            }
          }
        }
      }
    }
  }

  // Combine, giving priority to Smart Collections if slugs match (to show the dynamic label)
  const combinedKeys = new Set<string>();
  const allCategories: any[] = [];
  
  for (const sc of smartCategories) {
    allCategories.push(sc);
    combinedKeys.add(sc.key);
  }
  
  for (const st of staticCategories) {
    if (!combinedKeys.has(st.key)) {
      allCategories.push(st);
      combinedKeys.add(st.key);
    }
  }

  for (const mc of menuCategories) {
    if (!combinedKeys.has(mc.key)) {
      allCategories.push(mc);
      combinedKeys.add(mc.key);
    }
  }

  return NextResponse.json({ success: true, data: allCategories });
}

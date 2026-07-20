import { NextResponse } from "next/server";
import { categoryMeta } from "@/lib/collections";
import { getSmartCollections } from "@/lib/smartCollections";

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

  return NextResponse.json({ success: true, data: allCategories });
}

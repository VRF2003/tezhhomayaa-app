import { NextResponse } from "next/server";
import { getJournalArticles, saveJournalArticles } from "@/lib/journal";

export async function PUT(req: Request) {
  try {
    const { orderedIds } = await req.json(); // Array of article IDs in new order
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    const articles = getJournalArticles();
    
    // Map of ID to article for quick lookup
    const articleMap = new Map(articles.map(a => [a.id, a]));
    
    const reordered = [];
    
    // First push the items in the requested order
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      const article = articleMap.get(id);
      if (article) {
        article.order = i;
        reordered.push(article);
        articleMap.delete(id);
      }
    }
    
    // Append any remaining items that were not in orderedIds (safety fallback)
    for (const [id, article] of articleMap.entries()) {
      article.order = reordered.length;
      reordered.push(article);
    }
    
    saveJournalArticles(reordered);
    return NextResponse.json({ success: true, articles: reordered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

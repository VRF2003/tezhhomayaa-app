import { NextResponse } from "next/server";
import { getJournalArticles, saveJournalArticles } from "@/lib/journal";
import { JournalArticle } from "@/lib/types/journal";

export async function GET() {
  const articles = getJournalArticles();
  // Sort by order ascending
  articles.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  return NextResponse.json({ success: true, articles });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const articles = getJournalArticles();
    
    const newArticle: JournalArticle = {
      id: `article_${Date.now()}`,
      title: data.title || "New Article",
      subtitle: data.subtitle || "",
      slug: data.slug || `new-article-${Date.now()}`,
      category: data.category || "Editorial",
      author: data.author || "",
      readingTime: data.readingTime || "3 min read",
      publishDate: data.publishDate || new Date().toISOString(),
      status: data.status || "Draft",
      heroImage: data.heroImage || { url: "", alt: "" },
      seo: data.seo || { title: "", description: "", openGraphImage: "" },
      featured: data.featured || false,
      relatedProducts: data.relatedProducts || [],
      relatedArticles: data.relatedArticles || [],
      sections: data.sections || [],
      order: articles.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleType: data.articleType || "editorial",
      useGlobalTheme: data.useGlobalTheme ?? true,
    };

    articles.push(newArticle);
    saveJournalArticles(articles);

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

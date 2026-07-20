import { NextResponse } from "next/server";
import { getJournalArticles, saveJournalArticles } from "@/lib/journal";

export const maxDuration = 60; // Allow more time for large JSON payloads

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const articles = await getJournalArticles();
  const article = articles.find(a => a.id === id);
  if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, article });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const data = await req.json();
    const articles = await getJournalArticles();
    const index = articles.findIndex(a => a.id === id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    articles[index] = { ...articles[index], ...data, updatedAt: new Date().toISOString() };
    await saveJournalArticles(articles);

    return NextResponse.json({ success: true, article: articles[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const articles = await getJournalArticles();
  const filtered = articles.filter(a => a.id !== id);
  if (filtered.length === articles.length) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  await saveJournalArticles(filtered);
  return NextResponse.json({ success: true });
}

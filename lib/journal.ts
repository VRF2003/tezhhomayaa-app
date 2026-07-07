import fs from "fs";
import path from "path";
import { JournalArticle } from "./types/journal";

const journalPath = path.join(process.cwd(), "lib", "journal.json");

export function getJournalArticles(): JournalArticle[] {
  try {
    if (!fs.existsSync(journalPath)) {
      return [];
    }
    const data = fs.readFileSync(journalPath, "utf-8");
    return JSON.parse(data) as JournalArticle[];
  } catch (error) {
    console.error("Error reading journal.json", error);
    return [];
  }
}

export function saveJournalArticles(articles: JournalArticle[]) {
  try {
    fs.writeFileSync(journalPath, JSON.stringify(articles, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing journal.json", error);
  }
}

export function getJournalArticleById(id: string): JournalArticle | undefined {
  return getJournalArticles().find((a) => a.id === id);
}

export function getJournalArticleBySlug(slug: string): JournalArticle | undefined {
  return getJournalArticles().find((a) => a.slug === slug);
}

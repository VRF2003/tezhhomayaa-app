import { JournalArticle } from "./types/journal";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export async function getJournalArticles(): Promise<JournalArticle[]> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("journal");
    if (!data) return [];
    return data as JournalArticle[];
  } catch (error) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error reading journal from persistence", error);
    return [];
  }
}

export async function saveJournalArticles(articles: JournalArticle[]): Promise<void> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("journal", articles);
  } catch (error) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error writing journal to persistence", error);
  }
}

export async function getJournalArticleById(id: string): Promise<JournalArticle | undefined> {
  const articles = await getJournalArticles();
  return articles.find((a) => a.id === id);
}

export async function getJournalArticleBySlug(slug: string): Promise<JournalArticle | undefined> {
  const articles = await getJournalArticles();
  return articles.find((a) => a.slug === slug);
}

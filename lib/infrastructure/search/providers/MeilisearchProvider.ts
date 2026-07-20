import { ISearchProvider } from "../core/ISearchProvider";
import { SearchDocument, SearchQuery, SearchResult, IndexSettings } from "../types";

export class MeilisearchProvider implements ISearchProvider {
  readonly name = "meilisearch";

  async connect(): Promise<void> {
    throw new Error("Not implemented");
  }

  async disconnect(): Promise<void> {
    throw new Error("Not implemented");
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }

  async createIndex(settings: IndexSettings): Promise<void> {
    throw new Error("Not implemented");
  }

  async deleteIndex(indexName: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async indexExists(indexName: string): Promise<boolean> {
    throw new Error("Not implemented");
  }

  async indexDocument(indexName: string, document: SearchDocument): Promise<void> {
    throw new Error("Not implemented");
  }

  async indexDocuments(indexName: string, documents: SearchDocument[]): Promise<void> {
    throw new Error("Not implemented");
  }

  async deleteDocument(indexName: string, documentId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async search<T = SearchDocument>(indexName: string, query: SearchQuery): Promise<SearchResult<T>> {
    throw new Error("Not implemented");
  }
}

import { ISearchProvider } from "./ISearchProvider";
import { SearchQuery, SearchResult, SearchDocument } from "../types";
import { SearchAnalyticsService } from "../analytics/SearchAnalyticsService";

export class SearchService {
  private static provider: ISearchProvider;

  static initialize(provider: ISearchProvider) {
    this.provider = provider;
  }

  static getProvider(): ISearchProvider {
    if (!this.provider) {
      throw new Error("SearchService not initialized with a provider.");
    }
    return this.provider;
  }

  static async search<T = SearchDocument>(indexName: string, query: SearchQuery): Promise<SearchResult<T>> {
    const provider = this.getProvider();
    
    const startTime = Date.now();
    try {
      const result = await provider.search<T>(indexName, query);
      
      // Track analytics asynchronously
      SearchAnalyticsService.trackSearch({
        indexName,
        query,
        resultCount: result.total,
        latency: Date.now() - startTime
      }).catch(console.error);

      return result;
    } catch (error) {
      SearchAnalyticsService.trackError(indexName, query, error as Error).catch(console.error);
      throw error;
    }
  }

  static async indexDocument(indexName: string, document: SearchDocument): Promise<void> {
    return this.getProvider().indexDocument(indexName, document);
  }

  static async deleteDocument(indexName: string, documentId: string): Promise<void> {
    return this.getProvider().deleteDocument(indexName, documentId);
  }
}

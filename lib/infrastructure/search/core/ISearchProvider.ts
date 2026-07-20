import { SearchDocument, SearchQuery, SearchResult, IndexSettings } from "../types";

export interface ISearchProvider {
  /** Provider identifier, e.g. "elasticsearch", "memory" */
  readonly name: string;
  
  /** Initialize the provider connection */
  connect(): Promise<void>;
  
  /** Close the provider connection */
  disconnect(): Promise<void>;
  
  /** Check if the provider is healthy */
  healthCheck(): Promise<boolean>;

  // --- Index Management ---
  createIndex(settings: IndexSettings): Promise<void>;
  deleteIndex(indexName: string): Promise<void>;
  indexExists(indexName: string): Promise<boolean>;

  // --- Document Management ---
  indexDocument(indexName: string, document: SearchDocument): Promise<void>;
  indexDocuments(indexName: string, documents: SearchDocument[]): Promise<void>;
  deleteDocument(indexName: string, documentId: string): Promise<void>;
  
  // --- Search ---
  search<T = SearchDocument>(indexName: string, query: SearchQuery): Promise<SearchResult<T>>;
}

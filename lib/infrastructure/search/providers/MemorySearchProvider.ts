import { ISearchProvider } from "../core/ISearchProvider";
import { SearchDocument, SearchQuery, SearchResult, IndexSettings } from "../types";

export class MemorySearchProvider implements ISearchProvider {
  readonly name = "memory";
  
  // Storage format: Record<indexName, Record<documentId, SearchDocument>>
  private storage: Record<string, Record<string, SearchDocument>> = {};

  async connect(): Promise<void> {
    // In-memory doesn't need external connection
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async createIndex(settings: IndexSettings): Promise<void> {
    if (!this.storage[settings.name]) {
      this.storage[settings.name] = {};
    }
  }

  async deleteIndex(indexName: string): Promise<void> {
    delete this.storage[indexName];
  }

  async indexExists(indexName: string): Promise<boolean> {
    return !!this.storage[indexName];
  }

  async indexDocument(indexName: string, document: SearchDocument): Promise<void> {
    if (!this.storage[indexName]) {
      this.storage[indexName] = {};
    }
    this.storage[indexName][document.id] = document;
  }

  async indexDocuments(indexName: string, documents: SearchDocument[]): Promise<void> {
    if (!this.storage[indexName]) {
      this.storage[indexName] = {};
    }
    for (const doc of documents) {
      this.storage[indexName][doc.id] = doc;
    }
  }

  async deleteDocument(indexName: string, documentId: string): Promise<void> {
    if (this.storage[indexName]) {
      delete this.storage[indexName][documentId];
    }
  }

  async search<T = SearchDocument>(indexName: string, query: SearchQuery): Promise<SearchResult<T>> {
    const index = this.storage[indexName] || {};
    let results = Object.values(index);

    // Filter by term
    if (query.term) {
      const lowerTerm = query.term.toLowerCase();
      results = results.filter(doc => {
        // Very rudimentary full-text search across all payload strings
        const payloadStr = JSON.stringify(doc.payload).toLowerCase();
        return payloadStr.includes(lowerTerm) || doc.keywords?.some(k => k.toLowerCase().includes(lowerTerm));
      });
    }

    // Apply generic filters
    if (query.filters) {
      for (const filter of query.filters) {
        results = results.filter(doc => {
          const val = doc.payload[filter.field];
          switch (filter.operator) {
            case "eq": return val === filter.value;
            case "neq": return val !== filter.value;
            case "gt": return val > filter.value;
            case "lt": return val < filter.value;
            case "gte": return val >= filter.value;
            case "lte": return val <= filter.value;
            case "in": return Array.isArray(filter.value) && filter.value.includes(val);
            case "contains": return Array.isArray(val) && val.includes(filter.value);
            default: return true;
          }
        });
      }
    }

    // Sort
    if (query.sort) {
      const { field, direction } = query.sort;
      results.sort((a, b) => {
        const valA = a.payload[field];
        const valB = b.payload[field];
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    const total = results.length;

    // Pagination
    let page = 1;
    let limit = 20;
    if (query.pagination) {
      page = query.pagination.page;
      limit = query.pagination.limit;
      const start = (page - 1) * limit;
      results = results.slice(start, start + limit);
    }

    return {
      hits: results as unknown as T[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
      took: 1 // simulated ms
    };
  }
}

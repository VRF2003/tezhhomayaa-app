import { SearchQuery, SearchResult } from "../types";
import { SearchService } from "../core/SearchService";

export class FacetService {
  static async getFacets(indexName: string, facetFields: string[], baseQuery?: SearchQuery): Promise<Record<string, Array<{value: string, count: number}>>> {
    const query: SearchQuery = {
      ...(baseQuery || {}),
      facets: facetFields,
      pagination: { page: 1, limit: 0 } // Don't fetch hits, just facets
    };
    
    const result = await SearchService.search(indexName, query);
    return result.facets || {};
  }
}

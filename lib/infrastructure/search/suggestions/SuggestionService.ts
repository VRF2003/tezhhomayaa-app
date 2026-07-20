import { SearchService } from "../core/SearchService";
import { SearchQuery } from "../types";

export class SuggestionService {
  static async autocomplete(indexName: string, prefix: string, limit: number = 5): Promise<string[]> {
    // In a real provider, this uses Edge N-Grams or Completion Suggesters.
    // Abstracting query logic:
    const query: SearchQuery = {
      term: prefix,
      pagination: { page: 1, limit }
    };
    
    const result = await SearchService.search(indexName, query);
    
    // Extract unique keywords that match prefix
    const suggestions = new Set<string>();
    for (const doc of result.hits) {
      if (doc.keywords) {
        for (const kw of doc.keywords) {
          if (kw.toLowerCase().startsWith(prefix.toLowerCase())) {
            suggestions.add(kw);
          }
        }
      }
    }
    
    return Array.from(suggestions).slice(0, limit);
  }
}

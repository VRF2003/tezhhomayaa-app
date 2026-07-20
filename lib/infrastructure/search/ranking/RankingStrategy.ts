import { SearchQuery, SearchSort } from "../types";

export type RankingType = "RELEVANCE" | "POPULARITY" | "NEWEST" | "ALPHABETICAL" | "MANUAL_BOOST" | "AI";

export class RankingStrategy {
  static apply(query: SearchQuery, strategy: RankingType, boostConfig?: any): SearchQuery {
    const updatedQuery = { ...query };
    
    switch (strategy) {
      case "NEWEST":
        updatedQuery.sort = { field: "createdAt", direction: "desc" };
        break;
      case "ALPHABETICAL":
        updatedQuery.sort = { field: "name", direction: "asc" };
        break;
      case "POPULARITY":
        updatedQuery.sort = { field: "views", direction: "desc" };
        break;
      case "RELEVANCE":
      case "MANUAL_BOOST":
      case "AI":
      default:
        // For relevance and complex rankings, provider-specific implementations 
        // handle this natively via their own scoring mechanisms, often omitted from sort.
        delete updatedQuery.sort;
        break;
    }
    
    return updatedQuery;
  }
}

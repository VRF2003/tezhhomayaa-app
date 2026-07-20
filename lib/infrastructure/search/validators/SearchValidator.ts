import { SearchQuery } from "../types";
import { SearchError } from "../errors/SearchError";

export class SearchValidator {
  static validateQuery(query: SearchQuery): void {
    if (query.pagination) {
      if (query.pagination.page < 1) {
        throw new SearchError("Pagination page must be >= 1");
      }
      if (query.pagination.limit < 0) {
        throw new SearchError("Pagination limit must be >= 0");
      }
    }

    if (query.sort && !query.sort.field) {
      throw new SearchError("Sort field must be provided");
    }

    // Additional validations for filters can be added here
  }
}

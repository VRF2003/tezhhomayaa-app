export type SearchDocumentId = string;
export type IndexName = string;

export interface SearchDocument {
  id: SearchDocumentId;
  type: string;
  payload: Record<string, any>;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchQuery {
  term?: string;
  filters?: SearchFilter[];
  facets?: string[];
  sort?: SearchSort;
  pagination?: SearchPagination;
}

export interface SearchFilter {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains";
  value: any;
}

export interface SearchSort {
  field: string;
  direction: "asc" | "desc";
}

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface SearchResult<T = SearchDocument> {
  hits: T[];
  total: number;
  facets?: Record<string, Array<{ value: string; count: number }>>;
  page: number;
  totalPages: number;
  took: number; // milliseconds
}

export interface IndexSettings {
  name: IndexName;
  mappings: Record<string, string>;
  version: number;
}

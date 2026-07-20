export class SearchError extends Error {
  constructor(message: string, public readonly code: string = "SEARCH_ERROR") {
    super(message);
    this.name = "SearchError";
  }
}

export class IndexNotFoundError extends SearchError {
  constructor(indexName: string) {
    super(`Index '${indexName}' not found`, "INDEX_NOT_FOUND");
    this.name = "IndexNotFoundError";
  }
}

export class ProviderConnectionError extends SearchError {
  constructor(providerName: string, message: string) {
    super(`Provider '${providerName}' connection failed: ${message}`, "PROVIDER_CONNECTION_FAILED");
    this.name = "ProviderConnectionError";
  }
}

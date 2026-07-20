export * from "./types";
export * from "./errors/SearchError";
export * from "./core/ISearchProvider";
export * from "./core/SearchService";

// Providers
export * from "./providers/MemorySearchProvider";
export * from "./providers/ElasticsearchProvider";
export * from "./providers/AlgoliaProvider";
export * from "./providers/MeilisearchProvider";
export * from "./providers/OpenSearchProvider";

// Managers
export * from "./indexes/IndexManager";
export * from "./reindex/ReindexManager";
export * from "./pipelines/IndexPipeline";
export * from "./pipelines/SearchDocumentBuilder";

// Features
export * from "./ranking/RankingStrategy";
export * from "./filters/FilterBuilder";
export * from "./facets/FacetService";
export * from "./synonyms/SynonymService";
export * from "./suggestions/SuggestionService";

// Analytics & Health
export * from "./analytics/SearchAnalyticsService";
export * from "./metrics/SearchMetrics";
export * from "./health/SearchHealthCheck";
export * from "./validators/SearchValidator";
export * from "./events/SearchEventSubscriber";

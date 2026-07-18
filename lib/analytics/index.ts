import { GlobalEventBus } from "./events/EventBus";
import { InMemoryAnalyticsRepository } from "./repositories/InMemoryAnalyticsRepository";
import { InMemoryAggregationRepository } from "./repositories/InMemoryAggregationRepository";
import { AnalyticsService } from "./services/AnalyticsService";

// Instantiate singletons
export const rawAnalyticsRepo = new InMemoryAnalyticsRepository();
export const aggAnalyticsRepo = new InMemoryAggregationRepository();

export const GlobalAnalyticsService = new AnalyticsService(
  GlobalEventBus,
  rawAnalyticsRepo,
  aggAnalyticsRepo
);

// Auto-initialize subscriber
GlobalAnalyticsService.initialize();

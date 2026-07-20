import { GlobalEventBus } from "./events/EventBus";
import { RepositoryResolver } from "../infrastructure/persistence/resolver/RepositoryResolver";
import { IAnalyticsRepository } from "./repositories/IAnalyticsRepository";
import { IAggregationRepository } from "./repositories/IAggregationRepository";
import { AnalyticsService } from "./services/AnalyticsService";

// Instantiate singletons
export const rawAnalyticsRepo = RepositoryResolver.resolve<IAnalyticsRepository>("IAnalyticsRepository");
export const aggAnalyticsRepo = RepositoryResolver.resolve<IAggregationRepository>("IAggregationRepository");

export const GlobalAnalyticsService = new AnalyticsService(
  GlobalEventBus,
  rawAnalyticsRepo,
  aggAnalyticsRepo
);

// Auto-initialize subscriber
GlobalAnalyticsService.initialize();

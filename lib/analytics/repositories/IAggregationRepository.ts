import { AnalyticsEvent, AnalyticsDashboardReport, AggregationFilter } from "../core/types";

export interface IAggregationRepository {
  /**
   * Increment running aggregates based on an incoming event.
   */
  incrementAggregates(event: AnalyticsEvent): Promise<void>;

  /**
   * Retrieve the aggregated dashboard report, optionally filtering the data.
   * In a real application, filters would query the pre-aggregated materialized views.
   */
  getDashboardReport(filters?: AggregationFilter): Promise<AnalyticsDashboardReport>;
}

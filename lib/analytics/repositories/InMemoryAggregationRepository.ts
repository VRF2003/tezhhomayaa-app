import { AnalyticsEvent, AnalyticsDashboardReport, AggregationFilter } from "../core/types";
import { IAggregationRepository } from "./IAggregationRepository";

export class InMemoryAggregationRepository implements IAggregationRepository {
  private report: AnalyticsDashboardReport = {
    totalViews: 0,
    viewsByMarket: {},
    viewsByLanguage: {},
    viewsByCampaign: {},
    viewsBySection: {},
    viewsByDevice: {},
    previewActivity: 0,
  };

  async incrementAggregates(event: AnalyticsEvent): Promise<void> {
    // Note: In an InMemory mock, applying filters to pre-aggregated data is tricky 
    // without retaining raw data. We'll simply aggregate globally for demonstration.
    // In a real system (BigQuery, etc), this might be a materialized view.

    if (event.eventType === "PREVIEW_VIEW") {
      this.report.previewActivity++;
      // We often don't count preview activity in total production views.
      return;
    }

    this.report.totalViews++;

    if (event.marketId) {
      this.report.viewsByMarket[event.marketId] = (this.report.viewsByMarket[event.marketId] || 0) + 1;
    }
    
    if (event.languageCode) {
      this.report.viewsByLanguage[event.languageCode] = (this.report.viewsByLanguage[event.languageCode] || 0) + 1;
    }
    
    if (event.campaignId) {
      this.report.viewsByCampaign[event.campaignId] = (this.report.viewsByCampaign[event.campaignId] || 0) + 1;
    }
    
    if (event.sectionId) {
      this.report.viewsBySection[event.sectionId] = (this.report.viewsBySection[event.sectionId] || 0) + 1;
    }
    
    if (event.deviceType) {
      this.report.viewsByDevice[event.deviceType] = (this.report.viewsByDevice[event.deviceType] || 0) + 1;
    }
  }

  async getDashboardReport(filters?: AggregationFilter): Promise<AnalyticsDashboardReport> {
    // Return a clone of the report
    return JSON.parse(JSON.stringify(this.report));
  }
}

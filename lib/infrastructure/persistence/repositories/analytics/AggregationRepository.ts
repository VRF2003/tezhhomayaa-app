import { IAggregationRepository } from "@/lib/analytics/repositories/IAggregationRepository";
import { AnalyticsEvent, AnalyticsDashboardReport, AggregationFilter } from "@/lib/analytics/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class AggregationRepository implements IAggregationRepository {
  private collection = "analytics_aggregates";
  private static readonly REPORT_ID = "main_dashboard_report";

  constructor(private driver: IDatabaseDriver) {}

  async incrementAggregates(event: AnalyticsEvent): Promise<void> {
    // In a real database we would use a transaction and atomic increments.
    // Here we read, mutate, and write for simplicity.
    let report = await this.driver.read(this.collection, AggregationRepository.REPORT_ID) as AnalyticsDashboardReport;
    if (!report) {
      report = {
        totalViews: 0,
        viewsByMarket: {},
        viewsByLanguage: {},
        viewsByCampaign: {},
        viewsBySection: {},
        viewsByDevice: {},
        previewActivity: 0,
      };
    }

    if (event.eventType === "PAGE_VIEW") {
      report.totalViews++;
    } else if (event.eventType === "PREVIEW_VIEW") {
      report.previewActivity++;
    }

    if (event.marketId) {
      report.viewsByMarket[event.marketId] = (report.viewsByMarket[event.marketId] || 0) + 1;
    }
    if (event.languageCode) {
      report.viewsByLanguage[event.languageCode] = (report.viewsByLanguage[event.languageCode] || 0) + 1;
    }
    if (event.campaignId) {
      report.viewsByCampaign[event.campaignId] = (report.viewsByCampaign[event.campaignId] || 0) + 1;
    }
    if (event.sectionId) {
      report.viewsBySection[event.sectionId] = (report.viewsBySection[event.sectionId] || 0) + 1;
    }
    if (event.deviceType) {
      report.viewsByDevice[event.deviceType] = (report.viewsByDevice[event.deviceType] || 0) + 1;
    }

    await this.driver.write(this.collection, AggregationRepository.REPORT_ID, report);
  }

  async getDashboardReport(filters?: AggregationFilter): Promise<AnalyticsDashboardReport> {
    const report = await this.driver.read(this.collection, AggregationRepository.REPORT_ID) as AnalyticsDashboardReport;
    return report || {
      totalViews: 0,
      viewsByMarket: {},
      viewsByLanguage: {},
      viewsByCampaign: {},
      viewsBySection: {},
      viewsByDevice: {},
      previewActivity: 0,
    };
  }
}

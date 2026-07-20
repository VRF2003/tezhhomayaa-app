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
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        topCampaigns: [],
        topPaths: [],
      };
    }

    if (event.type === "page_view") {
      report.totalViews++;
    } else if (event.type === "click") {
      report.totalClicks++;
    } else if (event.type === "conversion") {
      report.totalConversions++;
    }

    if (report.totalViews > 0) {
      report.conversionRate = (report.totalConversions / report.totalViews) * 100;
    }

    await this.driver.write(this.collection, AggregationRepository.REPORT_ID, report);
  }

  async getDashboardReport(filters?: AggregationFilter): Promise<AnalyticsDashboardReport> {
    const report = await this.driver.read(this.collection, AggregationRepository.REPORT_ID) as AnalyticsDashboardReport;
    return report || {
      totalViews: 0,
      totalClicks: 0,
      totalConversions: 0,
      conversionRate: 0,
      topCampaigns: [],
      topPaths: [],
    };
  }
}

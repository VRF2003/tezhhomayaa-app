import { IExporter } from "../exporters/IExporter";

export class MetricsService {
  private exporters: IExporter[];

  constructor(exporters: IExporter[]) {
    this.exporters = exporters;
  }

  public recordCounter(name: string, value: number, tags?: Record<string, string>) {
    this.exportMetric("COUNTER", name, value, tags);
  }

  public recordGauge(name: string, value: number, tags?: Record<string, string>) {
    this.exportMetric("GAUGE", name, value, tags);
  }

  public recordHistogram(name: string, value: number, tags?: Record<string, string>) {
    this.exportMetric("HISTOGRAM", name, value, tags);
  }

  public recordTimer(name: string, durationMs: number, tags?: Record<string, string>) {
    this.exportMetric("TIMER", name, durationMs, tags);
  }

  private exportMetric(type: any, name: string, value: number, tags?: Record<string, string>) {
    const metric = {
      name,
      type,
      value,
      tags,
      timestamp: new Date().toISOString()
    };
    for (const exporter of this.exporters) {
      exporter.exportMetric(metric);
    }
  }
}

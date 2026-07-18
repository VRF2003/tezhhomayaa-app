import { ExperienceUtilities } from "../utilities";

export class NumberFormatter {
  private formatters: Map<string, Intl.NumberFormat> = new Map();

  constructor(private readonly utilities: ExperienceUtilities) {}

  private getFormatter(optionsKey: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
    const locale = this.utilities.locale.getLocale();
    const cacheKey = `${locale}-${optionsKey}`;

    if (!this.formatters.has(cacheKey)) {
      this.formatters.set(cacheKey, new Intl.NumberFormat(locale, {
        ...options,
        numberingSystem: "latn",
      }));
    }
    return this.formatters.get(cacheKey)!;
  }

  formatNumber(value: number): string {
    return this.getFormatter('default', {
      style: 'decimal'
    }).format(value);
  }

  formatCompact(value: number): string {
    return this.getFormatter('compact', {
      style: 'decimal',
      notation: 'compact'
    }).format(value);
  }

  formatPercent(value: number): string {
    return this.getFormatter('percent', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }
}

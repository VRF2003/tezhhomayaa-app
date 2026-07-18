import { ExperienceUtilities } from "../utilities";

export class DateFormatter {
  private formatters: Map<string, Intl.DateTimeFormat> = new Map();

  constructor(private readonly utilities: ExperienceUtilities) {}

  private getFormatter(optionsKey: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    const locale = this.utilities.locale.getLocale();
    const timezone = this.utilities.timezone.getTimezone();
    const cacheKey = `${locale}-${timezone}-${optionsKey}`;

    if (!this.formatters.has(cacheKey)) {
      this.formatters.set(
        cacheKey,
        new Intl.DateTimeFormat(locale, {
          ...options,
          timeZone: timezone
        })
      );
    }
    return this.formatters.get(cacheKey)!;
  }

  formatDate(date: Date | string | number): string {
    return this.getFormatter('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatShortDate(date: Date | string | number): string {
    return this.getFormatter('short', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatLongDate(date: Date | string | number): string {
    return this.getFormatter('long', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
}

import { ExperienceUtilities } from "../utilities";

export class TimeFormatter {
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

  formatTime(date: Date | string | number): string {
    return this.getFormatter('time', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  }

  formatDateTime(date: Date | string | number): string {
    return this.getFormatter('datetime', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  }
}
